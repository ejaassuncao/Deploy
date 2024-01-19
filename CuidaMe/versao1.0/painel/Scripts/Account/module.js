(function () {
    const app = angular.module("app");

    app.directive("formularioLogin", function ($http, $login, $timeout, $rootScope) {

        function validarRecapcha(captcha, value) {
            if (!value) return false;
            const result = captcha.valid(value);
            if (result == true) return result;  
            captcha.refresh();
            return result;
        }

        function initRecapcha() {
            return new Captcha($('#canvas'), {
                length: 4,
                caseSensitive: false
            });
        }

        return {
            restrict: "E",
            scope: {
                email: "@?",
                returnUrl: "@?",
                forgotPassword: "@?",
                recapcha: "@?",
                pendingRequest: "&?",
                onLogon: "&?"
            },
            link: function (scope) {
                
                var captcha = initRecapcha();

                function limparMensagem() {
                    scope.sucesso = null;
                    scope.mensagem = null;
                }

                function proceder(redirectUrl) {
                    $timeout(function () {
                        if (scope.onLogon)
                            scope.onLogon();

                        if (scope.pendingRequest)
                            scope.pendingRequest();
                        else
                            location.href = redirectUrl;
                    }, 1000);
                }

                $login.limpar = function () {
                    limparMensagem();
                    scope.senha = null;
                    scope.entrando =  false;
                };

                scope.entrar = function () {
                    $rootScope.scopeLogin = scope;
                    scope.entrando = true;
                    limparMensagem();
                  
                    if (validarRecapcha(captcha, scope.recapcha) == false) {
                        scope.mensagemErro("Recapcha inválido");
                        scope.entrando = false;
                        return;
                    }

                    const dados = {
                        email: scope.email,
                        lembrar: scope.lembrar,
                        senha: scope.senha,
                        returnUrl: scope.returnUrl
                    };

                    $http.post("/Api/Contas/Login", dados).then(function (result) {
                        result = result.data;

                        if (!result.Status) {
                            scope.mensagemErro(result.Message);
                            scope.entrando = false;
                            return;
                        }

                        proceder(result.Data.RedirectUrl);
                    });
                };

                scope.mensagemErro = function (mensagem) {
                    scope.sucesso = false;
                    scope.mensagem = mensagem;
                };

                scope.mensagemSucesso = function (mensagem) {
                    scope.sucesso = true;
                    scope.mensagem = mensagem;
                };

                scope.$watch("email", function (n) {
                    if (n === "") {
                        $login.limpar();
                    }
                });
            },
            templateUrl: "/Templates/Account/formulario-login.html"
        };
    });
    app.directive("loginDialog", function ($login, $timeout) {
        return {
            restrict: "E",
            scope: {
                email: "@"
            },
            link: function (scope) {

                scope.isOpen = false;

                $login.dialog = function (pendingRequest) {
                    $login.limpar();
                    scope.pendingRequest = pendingRequest;
                    scope.isOpen = true;

                    $timeout(function () {
                        scope.$apply();
                    });
                };
            },
            template:
                "<dialog is-open='isOpen' static class='login-container'>\
	                <formulario-login email='{{email}}'\
                                      pending-request='pendingRequest()'\
                                      on-logon='isOpen = false'>\
                    </formulario-login>\
	            </dialog>"
        };
    });

    app.controller("FormularioSenhaController", function ($scope, $http, $messages, $timeout) {
        var ops = ["+", "-", "x"];

        function calcular(a, b, op) {
            switch (op) {
                case 0:
                    return a + b;
                case 1:
                    return a - b;
                case 2:
                    return a * b;
            }
            return 0;
        }

        $scope.gerar = function () {
            const a = getRandomInt(1, 9);
            const b = getRandomInt(1, 9);
            const op = getRandomInt(0, 2);

            $scope.operacao = "{0} {1} {2}".format(a, ops[op], b);
            $scope.resposta = calcular(a, b, op);
        };

        $scope.recuperar = function () {
            const dados = {
                email: $scope.email
            };

            $http.post("/api/Contas/ForgotPassword", dados).then(function (r) {
                r = r.data;

                if (r.Status) {
                    $scope.novaSenha = r.Data;
                } else {
                    $messages.error(r.Message);
                    $scope.respostaUsuario = null;
                    $scope.gerar();                    
                }
            });
        };

        $scope.gerar();
    });

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
})();