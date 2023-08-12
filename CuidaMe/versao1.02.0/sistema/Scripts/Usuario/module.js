(function () {
    const app = angular.module("app");
        
    app.controller("UsuarioController", function ($scope, $messages, $usuarios) {

        $scope.iniciar = function (id) {
            debugger
            if (id == null || id === 0) {
                $scope.usuario = {};
            } else {
                $usuarios.get(id, usuario => $scope.usuario = usuario);
            }
        };

        $scope.salvar = function () {
            if (!$scope.usuario.Id && (!$scope.usuario.Senha || $scope.usuario.Senha === "")) {
                $messages.error("É necessário completar a senha do usuário");
                return;
            }

            $usuarios.save($scope.usuario, $scope.cancelar);
        };

        $scope.cancelar = function () {           
            $usuarios.redirect();
        };

        $scope.verificarDisponibilidadeDoEmail = function () {
            if (!$scope.usuario) return;

            $usuarios.emailEstaDisponivel({email: $scope.usuario.Email, id: $scope.usuario.Id}, function (estaDisponivel) {
                $scope.estaDisponivel = estaDisponivel;
            });
        };

        const unwatch = $scope.$watch("[usuario.Id]", function () {
            if (!$scope.usuario || !$scope.usuario.Id) return;

            $scope.verificarDisponibilidadeDoEmail();

            unwatch();
        });
    });

    app.controller("ListUsuarioController", function ($scope, $messages, $usuarios) {

        $scope.listar = function () {
            $usuarios.list($scope.filtros, function (r) {
                $scope.usuarios = r;
            });
        };

        $scope.editar = function (usuario) {
            $usuarios.redirect("Create", usuario.Id);
        };

        $scope.excluir = function (usuario) {
            $messages.confirm(`Você tem certeza que deseja excluir o usuário <strong>${usuario.Nome}</strong>?`, function () {
                $usuarios.remove(usuario.Id, $scope.listar);
            });
        };
    });
})();