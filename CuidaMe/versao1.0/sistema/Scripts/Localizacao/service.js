(function () {
    const app = angular.module("servicesApp");

    app.service("$localizacoes", function ($baseService) {
        return $baseService({
            api: "/api/Localizacoes",            
        });
    });
})();