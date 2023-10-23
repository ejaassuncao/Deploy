(function () {
    const app = angular.module("app");

    app.controller("PulseiraController", function ($scope, $pulseiras) {

        $scope.carregar = function (id) {
            if (id == null || id === 0) {
                $scope.pulseira = {
                    Telefones: []
                };
            } else {
                $pulseiras.get(id, function (pulseira) {
                    $scope.pulseira = pulseira;
                });
            }
        };

        $scope.salvar = function () {
            $pulseiras.save($scope.pulseira, $scope.cancelar);
        };

        $scope.adicionar = function () {
            $scope.pulseira.Telefones.push({});
        };

        $scope.remover = function (telefone) {
            $scope.pulseira.Telefones.remove(telefone);
        };

        $scope.cancelar = function () {
            $pulseiras.redirect();
        };
    });

    app.controller("ListPulseiraController", function ($scope, $enums, $messages, $pulseiras, $comando, $timeout) {

        $enums.modosDeTrabalho(r => $scope.modosDeTrabalho = r);

        $scope.listar = function () {
            $pulseiras.list($scope.filtros, function (r) {
                $scope.pulseiras = r;
            });
        };

        $scope.editar = function (pulseira) {
            $pulseiras.redirect("Create", pulseira.Id);
        };

        $scope.visualizar = function (id) {
            $pulseiras.redirect("Details", id);
        };

        $scope.visualizarCharts = function (id) {
            $pulseiras.redirect("DetailsCharts", id);
        }

        $scope.abrirDialog = function (pulseira) {
            $scope.pulseiraSelecionada = pulseira;
            $scope.aberta = true;
        };

        $scope.fecharDialog = function () {
            $scope.pulseiraSelecionada = {};
            $scope.aberta = false;
        };

        $scope.salvarConfiguracao = function () {
            $pulseiras.salvarConfiguracao($scope.pulseiraSelecionada, function () {
                $scope.fecharDialog();
                $scope.listar();
            });
        };

        $scope.resetar = function (pulseira) {
            $messages.confirm(`Você tem certeza que deseja resetar a pulseira <strong>${pulseira.Imei}</strong>?`, function () {
                $pulseiras.resetar(pulseira, $scope.listar);
            });
        };

        $scope.excluir = function (pulseira) {
            $messages.confirm(`Você tem certeza que deseja excluir a pulseira <strong>${pulseira.Imei}</strong>?`, function () {
                $pulseiras.remove(pulseira.Id, $scope.listar);
            });
        };

        //***Novos comandos***
        $scope.comando = { cmd: '', };      

        $scope.abrirDialogEnviarComando = function (pulseira) {
            $scope.filtrosComandos = { Predicate: "Nome", Reverse: false, currentPage: 1, itemsPerPage: 100 };
            $comando.list($scope.filtrosComandos, function (r) {
                $scope.comandos = r;
            });

            $scope.pulseiraSelecionada = pulseira;
            $scope.abertaNew = true;
        };

        $scope.comandoSelecionado = function () {
            if ($scope.comando.cmd == null) return;
            $scope.montaComando = $scope.comando.cmd.replace("{IMEI}", $scope.pulseiraSelecionada.Imei);
            var variaveis = $scope.montaComando.split('{');
            $scope.campos = [];
            if (variaveis.length > 1) {
                for (var index in variaveis) {
                    if (index > 0)
                        $scope.campos.push(variaveis[index].substr(0, variaveis[index].indexOf('}')))
                }
            }

            $scope.divMsgRetorno = true;
        }

        $scope.EnviarComando = function () {
            $scope.msgRetorno = '';
            $scope.msgValidacao = false;
            if ($scope.comando.cmd.length == 0) {
                $scope.msgValidacao = true;
                return
            }

            var elementos = $("input[name='campo']");
            for (index = 0; index < elementos.length; index++) {
                var el = elementos[index];
                var lbl = $(el).prop('placeholder');
                var value = $(el).val();
                $scope.montaComando = $scope.montaComando.replace("{" + lbl + "}", value);
            }
            $scope.enviar = true;
            $scope.divMsgRetorno = true

            var dados = {
                Pulseira: $scope.pulseiraSelecionada,
                Comando: $scope.montaComando
            };

            $comando.enviarComando(dados, function (r) {
                $scope.enviar = false;
                $scope.msgRetorno = `- ${r.Message}<br/>`;
                if (r.Status == "Sucesso")
                    checkLog(r);
            });
        }

        $scope.fecharModal = function () {
            $scope.comandos = {};
            $scope.campos = [];
            $scope.montaComando = "";
            $scope.pulseiraSelecionada = {};
            $scope.abertaNew = false;
            $scope.enviar = false;
            $scope.divMsgRetorno = false;
            $scope.msgRetorno = '';
            $scope.listar();
        }

        function checkLog(param) {
            $comando.getLog(param, function (r) {
                if (r.Status != 'FimLog') {
                    console.log(r.Message);
                    $scope.msgRetorno = r.Message;
                    $timeout(function () {
                        checkLog(r);
                    }, 3000)
                }
            });
        }
    });

    app.controller("PulseiraDetailsController", function ($scope, $pulseiras, $monitoramentos, $localizacoes, $localizacoesLbs) {

        $scope.carregar = function (id) {

            $scope.idPulseira = id;

            $scope.filtrosDeLocalizacao = {
                Predicate: "Data",
                Reverse: true,
            }

            $scope.filtrosDeLocalizacaoLbs = {
                Predicate: "Data",
                Reverse: true,
            }

            $scope.filtrosDeMonitoramento = {
                Predicate: "Data",
                Reverse: true
            }

            $pulseiras.get(id, function (pulseira) {
                $scope.pulseira = pulseira;
            });


            $scope.listarMonitoramento();
            $scope.listarLocalizacao();
            $scope.listarLocalizacaoLbs();
        };

        $scope.listarMonitoramento = function () {
            $scope.filtrosDeMonitoramento.IdPulseira = $scope.idPulseira;

            $monitoramentos.list($scope.filtrosDeMonitoramento, function (r) {
                $scope.monitoramentos = r;
            });
        };

        $scope.listarLocalizacao = function () {
            $scope.filtrosDeLocalizacao.IdPulseira = $scope.idPulseira;

            $localizacoes.list($scope.filtrosDeLocalizacao, function (r) {
                $scope.localizacoes = r;
            });
        };

        $scope.listarLocalizacaoLbs = function () {
            $scope.filtrosDeLocalizacaoLbs.IdPulseira = $scope.idPulseira;

            $localizacoesLbs.list($scope.filtrosDeLocalizacaoLbs, function (r) {
                $scope.localizacoesLbs = r;
            });
        };

        $scope.historico = function (id) {
            $pulseiras.redirect("Details", id);
        }
    });
})();