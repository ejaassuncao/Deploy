(function () {
    const app = angular.module("servicesApp");

    app.service("$monitoramentos", function ($baseService) {
        return $baseService({
            api: "/api/Monitoramentos",            
        });
    });
})();