(function () {
    const app = angular.module("servicesApp");

    app.service("$clientes", function ($baseService) {
        return $baseService({
            api: "/api/Clientes",
            controller:"Cliente"
        });
    });
})();