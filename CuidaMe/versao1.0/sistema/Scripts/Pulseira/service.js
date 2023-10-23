(function () {
    const app = angular.module("servicesApp");

    app.service("$pulseiras", function ($baseService, $request) {
        return $baseService({
            api: "/api/Pulseiras",
            controller: "Pulseira",
            resetar: function (data, success) {
                $request.post(`/api/Pulseiras/Resetar`, data, success);
            },
            salvarConfiguracao: function (data, success) {
                $request.post(`/api/Pulseiras/SalvarConfiguracao`, data, success);
            },
            listarDisponiveis: function (filtros, success) {
                $request.get(`/api/Pulseiras/ListarDisponiveis`, filtros, function (r) {
                    filtros.totalItems = r.Total;
                    success(r.Result);
                });
            }            
        });
    });
})();