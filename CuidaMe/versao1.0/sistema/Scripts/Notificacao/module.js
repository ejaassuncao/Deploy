(function () {
    const app = angular.module("app");

    app.controller("HistoricoController", function ($scope, $notificacoes) {

        $scope.iniciar = function (idosoId, tipoDeNotificacao) {
            $scope.filtros = {
                IdosoId: idosoId,
                TipoDeNotificacao: tipoDeNotificacao,
                Predicate: "Data",
                Reverse: true
            };

            $notificacoes.getIdoso($scope.filtros, function (r) {
                $scope.idoso = r;
                $scope.listarHistorico();
            });
        };

        $scope.listarHistorico = function () {
            $notificacoes.listarHistorico($scope.filtros, notificacao => $scope.notificacoes = notificacao);
        }

        $scope.cancelar = function () {
            $notificacoes.redirect();
        };
    });

    app.controller("ListNotificacaoController", function ($scope, $notificacoes) {
        $scope.filtros = {
            Predicate: "Data",
            Reverse: true,
            ItemsPerPage: 12
        };

        $scope.consultar = function () {          
            $("#nav-todos-tab").click();
        }

        $scope.listar = function (grupo, page) {
            $scope.filtros.GrupoNotificacao = grupo;
            $scope.filtros.currentPage = (page > 0) ? page : $scope.filtros.currentPage;
            $scope.filtros.itemsPerPage = 12;

            $notificacoes.list($scope.filtros, function (r) {
                $scope.notificacao = r;
            });
        };

        $scope.historico = function (idosoId, tipoDeNotificacao) {
            var obj = { 'idosoId': idosoId, 'tipoDeNotificacao': tipoDeNotificacao };
            $notificacoes.redirect("Historico", obj);
        };
    });
})();