(function () {
    const app = angular.module("servicesApp");

    app.service("$configuracoes", function ($baseService) {
        return $baseService({
            api: "/api/Configuracoes",
        });
    });
})();