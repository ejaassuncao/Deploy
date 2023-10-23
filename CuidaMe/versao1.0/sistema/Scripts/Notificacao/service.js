(function () {
    const app = angular.module("servicesApp");

    app.service("$notificacoes", function ($baseService, $request) {
        return $baseService({
            api: "/api/Notificacoes",
            controller: "Notificacao",
            listarHistorico: function (filtros, success) {
                $request.get("/api/Notificacoes/ListarHistorico", filtros, function (r) {
                    filtros.totalItems = r.Total;
                    success(r.Result);
                });
            },
            getIdoso: function (filtros, success) {
                $request.get(`/api/Notificacoes/Idoso`, filtros, function (r) {
                    filtros.totalItems = r.Total;
                    success(r.Result);
                });
            },           
        });
    });
})();