(function () {
    const app = angular.module("app");

    app.controller("CadastrarComandoController", function ($scope, $comando, $messages) {

        $scope.iniciar = function (id) {         
            if (id == null || id === 0) {
                $scope.comando = {};
            } else {
                $comando.get(id, comando => $scope.comando = comando);
            }
        };

        $scope.salvar = function () {
            $comando.save($scope.comando, $scope.cancelar);
        };

        $scope.cancelar = function () {
            $comando.redirect();
        };

    });

    app.controller("ListComandoController", function ($scope, $comando, $messages) {

        $scope.listar = function () {
            $comando.list($scope.filtros, function (r) {
                $scope.comandos = r;
            });
        };

        $scope.editar = function (comando) {
            $comando.redirect("Create", comando.Id);
        };

        $scope.excluir = function (comando) {
            $messages.confirm(`Você tem certeza que deseja excluir a empresa <strong>${comando.Nome}</strong>?`, function () {
                $comando.remove(comando.Id, $scope.listar);
            });
        };
    });

})();