(function () {
    const app = angular.module("app");

    app.controller("ListServerLogController", function ($scope, $messages, $serverlogs) {

        $scope.listar = function () {
            $serverlogs.list($scope.filtros, function (r) {
                $scope.serverlogs = r;
            });
        };

    });
})();