(function () {
    const app = angular.module("app");

    app.controller("ConfiguracaoController", function ($scope, $messages, $configuracoes) {

        $scope.iniciar = function () {
            $configuracoes.get(0, configuracao => $scope.configuracao = configuracao);
        };

        $scope.salvar = function () {
            $configuracoes.save($scope.configuracao, function () {
            });
        };
    });


})();