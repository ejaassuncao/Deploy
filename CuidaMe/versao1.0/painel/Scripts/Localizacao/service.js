(function () {
    const app = angular.module("servicesApp");

    app.service("$localizacoes", function ($baseService) {
        return $baseService({
            api: "/api/Localizacoes",            
        });
    });

    app.service("$localizacoesLbs", function ($baseService) {
        return $baseService({
            api: "/api/LocalizacoesLbs",
        });
    });
})();