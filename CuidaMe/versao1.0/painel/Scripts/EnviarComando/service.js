(function () {
    const app = angular.module("servicesApp");

    app.service("$comando", function ($baseService, $request) {
        return $baseService({
            api: "/api/Comandos",
            controller: "Comando",
            enviarComando: function (data, success) {
                $request.post(`/api/Comandos/EnviarComando`, data, success);
            },
            getLog: function (data,  success) {
                $request.post(`/api/Comandos/GetLog`, data, 'notLoader', success);
            }
        });
    });
})();