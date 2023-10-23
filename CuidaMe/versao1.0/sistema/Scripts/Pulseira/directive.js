(function () {
    const app = angular.module("app");

    app.directive("dialogPulseira", function ($pulseiras) {
        return {
            restrict: "E",
            scope: {
                ngModel: "=",
            },
            link: function (scope) {

                scope.listar = function () {
                    $pulseiras.listarDisponiveis(scope.filtros, r => scope.pulseiras = r);
                }

                scope.selecionar = function (item) {
                    scope.ngModel = item;
                    scope.fecharListagem();
                }

                scope.abrirListagem = () => scope.abertaListagem = true
                scope.fecharListagem = () => scope.abertaListagem = false
            },
            templateUrl: "/Templates/Pulseira/dialog.html"
        };
    });
})();