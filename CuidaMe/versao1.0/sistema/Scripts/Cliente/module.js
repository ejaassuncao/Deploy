(function () {
    const app = angular.module("app");

    app.controller("ClienteController", function ($scope, $messages, $usuarios, $clientes) {

        $scope.iniciar = function (id) {
            if (id == null || id === 0) {
                $scope.cliente = {
                    Idosos: []
                };
            } else {
                $clientes.get(id, cliente => $scope.cliente = cliente);
            }
        };

        $scope.salvar = function () {
            if (!$scope.cliente.Id && (!$scope.cliente.Senha || $scope.cliente.Senha === "")) {
                $messages.error("É necessário completar a senha do cliente");
                return;
            }

            $scope.cliente.Idosos.map(function (idoso) {
                debugger;
                if (idoso.Pulseira) {
                    idoso.IdPulseira = idoso.Pulseira.Id;
                } else {
                    idoso.IdPulseira = null;
                }

                return idoso;
            });

            $clientes.save($scope.cliente, $scope.cancelar);
        };

        $scope.cancelar = function () {          
            $clientes.redirect();
        };

        $scope.verificarDisponibilidadeDoEmail = function () {
            if (!$scope.cliente) return;

            $usuarios.emailEstaDisponivel({
                email: $scope.cliente.Email,
                id: $scope.cliente.Id
            }, function (estaDisponivel) {
                $scope.estaDisponivel = estaDisponivel;
            });
        };

        $scope.abrirDialogDeIdoso = function () {
            $scope.idoso = {};
            $scope.aberta = true;
        };

        $scope.fecharDialogDeIdoso = function () {
            if ($scope.idosoEmEdicao) {
                $scope.cliente.Idosos.push($scope.idosoEmEdicao);
                $scope.idosoEmEdicao = null;
            }
            $scope.aberta = false;
        };

        $scope.adicionarIdoso = function (imei) {
            if (imei == undefined || imei == "") {
                $scope.idoso.Pulseira = null;
            }            
            $scope.cliente.Idosos.push($scope.idoso);
            $scope.aberta = false;
            $scope.idosoEmEdicao = null;
        };

        $scope.editarIdoso = function (item) {
            $scope.idosoEmEdicao = item;
            $scope.cliente.Idosos.remove(item);
            $scope.idoso = angular.copy(item, {});
            $scope.aberta = true;
        };

        $scope.removerIdoso = function (item) {
            $scope.cliente.Idosos.remove(item);
        };

        const unwatch = $scope.$watch("[cliente.Id]", function () {
            if (!$scope.cliente || !$scope.cliente.Id) return;

            $scope.verificarDisponibilidadeDoEmail();

            unwatch();
        });
    });

    app.controller("ListClienteController", function ($scope, $messages, $clientes) {

        $scope.listar = function () {
            $clientes.list($scope.filtros, function (r) {
                $scope.clientes = r;
            });
        };

        $scope.editar = function (cliente) {
            $clientes.redirect("Create", cliente.Id);
        };

        $scope.excluir = function (cliente) {
            $messages.confirm(`Você tem certeza que deseja excluir o cliente <strong>${cliente.Nome}</strong>?`, function () {
                $clientes.remove(cliente.Id, $scope.listar);
            });
        };

        $scope.copiarChave = function (textoCopiado) {
            navigator.clipboard.writeText(textoCopiado).then(
                () => {
                    console.log("sucesso", textoCopiado)
                },
                () => {
                    console.log("erro", textoCopiado)
                },
            );
        }
    });
})();