(function () {
    const app = angular.module("app");

    app.controller("EnviarComandoController", function ($scope, $messages, $enviarcomando) {
        $scope.salvar = function () {
            $enviarcomando.save($scope.enviarcomando, function () {
            });
        };
    });
})();