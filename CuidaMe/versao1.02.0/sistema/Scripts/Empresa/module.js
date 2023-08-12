(function () {
    const app = angular.module("app");

    app.controller("EmpresaController", function ($scope, $messages, $usuarios, $empresas) {

        $scope.iniciar = function (id) {
            if (id == null || id === 0) {
                $scope.empresa = {
                    Clientes: []
                };
            } else {
                $empresas.get(id, empresa => $scope.empresa = empresa);                
            }            
        };

        $scope.salvar = function () {
            if (!$scope.empresa.Id && (!$scope.empresa.Senha || $scope.empresa.Senha === "")) {
                $messages.error("É necessário completar a senha da empresa");
                return;
            }

            $scope.empresa.Clientes.map(function (cliente) {                
                return cliente;
            });

            $empresas.save($scope.empresa, $scope.cancelar);
        };

        $scope.cancelar = function () {          
            $empresas.redirect();
        };

        $scope.verificarDisponibilidadeDoEmail = function () {
            if (!$scope.empresa) return;

            $usuarios.emailEstaDisponivel({
                email: $scope.empresa.Email,
                id: $scope.empresa.Id
            }, function (estaDisponivel) {
                $scope.estaDisponivel = estaDisponivel;
            });
        };

        $scope.verificarDisponibilidadeDoEmailCliente = function () {
            if (!$scope.empresa) return;

            $usuarios.emailEstaDisponivel({
                email: $scope.cliente.Email,
                id: $scope.cliente.Id
            }, function (estaDisponivel) {
                $scope.cliente.estaDisponivel = estaDisponivel;
            });
        };

        $scope.abrirDialogDeCliente = function () {
            $scope.cliente = {};           
            $scope.aberta = true;
        };

        $scope.fecharDialogDeCliente = function () {
            if ($scope.clienteEmEdicao) {
                $scope.empresa.Clientes.push($scope.clienteEmEdicao);
                $scope.clienteEmEdicao = null;
            }
            $scope.aberta = false;
        };

        $scope.adicionarCliente = function () {
            $scope.empresa.Clientes.push($scope.cliente);
            $scope.aberta = false;
            $scope.clienteEmEdicao = null;
        };

        $scope.editarCliente = function (item) {
            $scope.clienteEmEdicao = item;
            $scope.empresa.Clientes.remove(item);
            $scope.cliente = angular.copy(item, {});
            $scope.aberta = true;
        };

        $scope.removerCliente = function (item) {
            $scope.empresa.Clientes.remove(item);
        };

        const unwatch = $scope.$watch("[empresa.Id]", function () {
            if (!$scope.empresa || !$scope.empresa.Id) return;

            $scope.verificarDisponibilidadeDoEmail();

            unwatch();
        });
    });

    app.controller("ListEmpresaController", function ($scope, $messages, $empresas) {

        $scope.listar = function () {
            $empresas.list($scope.filtros, function (r) {
                $scope.empresas = r;
            });
        };

        $scope.editar = function (empresa) {
            $empresas.redirect("Create", empresa.Id);
        };

        $scope.excluir = function (empresa) {
            $messages.confirm(`Você tem certeza que deseja excluir a empresa <strong>${empresa.Nome}</strong>?`, function () {
                $empresas.remove(empresa.Id, $scope.listar);
            });
        };
    });
})();