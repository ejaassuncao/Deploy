(function () {
    const app = angular.module("app");

    app.controller("MudancaSenhaController", function ($scope, $request) {

        $scope.salvar = function () {
            $request.post("api/Contas/ChangePassword", $scope.dados, function () {
                setTimeout($scope.cancelar, 500);
            });
        };

        $scope.cancelar = function () {
            location.href = "/Home/Index";
        };
    });
})();