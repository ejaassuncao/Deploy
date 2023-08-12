(function () {
    const app = angular.module("servicesApp");

    app.service("$empresas", function ($baseService) {
        return $baseService({
            api: "/api/Empresas",
            controller:"Empresa"
        });
    });
})();