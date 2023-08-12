(function () {
    const app = angular.module("servicesApp");

    app.service("$serverlogs", function ($baseService) {
        return $baseService({
            api: "/api/ServerLogs",
            controller: "ServerLog"
        });
    });
})();