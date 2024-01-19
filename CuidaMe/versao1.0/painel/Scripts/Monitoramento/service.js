(function () {
    const app = angular.module("servicesApp");

    app.service("$monitoramentos", function ($baseService, $request) {
        return $baseService({
            api: "/api/Monitoramentos", 
            listCharts: function (filtros, success) {
                $request.get(`/api/Monitoramentos/chats`, filtros, function (r) {                   
                    success(r.Result);
                });
            }   
        });
    });
})();