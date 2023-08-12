(function () {
    const app = angular.module("servicesApp");

    app.service("$usuarios", function ($baseService, $request) {
       return $baseService({
           api: "/api/Usuarios",
           controller:"Usuario",
           emailEstaDisponivel: function (usuario, success) { $request.get(`/api/Usuarios/EmailDisponivel/${usuario.email}/${usuario.id}`, success); }
       });
    });
})();