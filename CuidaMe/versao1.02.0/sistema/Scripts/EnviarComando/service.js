(function () {
    const app = angular.module("servicesApp");

    app.service("$enviarcomando", function ($baseService) {
        return $baseService({
            api: "/api/Configuracoes",
        });
    });
})();