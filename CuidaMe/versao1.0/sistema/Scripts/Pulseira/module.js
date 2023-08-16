(function () {
    const app = angular.module("app");

    app.controller("PulseiraController", function ($scope, $pulseiras) {

        $scope.carregar = function (id) {
            if (id == null || id === 0) {
                $scope.pulseira = {
                    Telefones: []
                };
            } else {
                $pulseiras.get(id, function (pulseira) {
                    $scope.pulseira = pulseira;
                });
            }
        };

        $scope.salvar = function () {
            $pulseiras.save($scope.pulseira, $scope.cancelar);
        };

        $scope.adicionar = function () {
            $scope.pulseira.Telefones.push({});
        };

        $scope.remover = function (telefone) {
            $scope.pulseira.Telefones.remove(telefone);
        };

        $scope.cancelar = function () {            
            $pulseiras.redirect();
        };
    });

    app.controller("ListPulseiraController", function ($scope, $enums, $messages, $pulseiras) {

        $enums.modosDeTrabalho(r => $scope.modosDeTrabalho = r);

        $scope.listar = function () {
            $pulseiras.list($scope.filtros, function (r) {
                $scope.pulseiras = r;
            });
        };

        $scope.editar = function (pulseira) {       
            $pulseiras.redirect("Create", pulseira.Id);
        };

        $scope.visualizar = function (id) {                  
            $pulseiras.redirect("Details", id);
        };

        $scope.visualizarCharts = function (id) {
            $pulseiras.redirect("DetailsCharts", id);
        }

        $scope.abrirDialog = function (pulseira) {
            $scope.pulseiraSelecionada = pulseira;
            $scope.aberta = true;
        };

        $scope.fecharDialog = function () {
            $scope.pulseiraSelecionada = {};
            $scope.aberta = false;
        };

        $scope.salvarConfiguracao = function () {
            $pulseiras.salvarConfiguracao($scope.pulseiraSelecionada, function () {
                $scope.fecharDialog();
                $scope.listar();
            });
        };

        $scope.resetar = function (pulseira) {
            $messages.confirm(`Você tem certeza que deseja resetar a pulseira <strong>${pulseira.Imei}</strong>?`, function () {
                $pulseiras.resetar(pulseira, $scope.listar);
            });
        };

        $scope.excluir = function (pulseira) {
            $messages.confirm(`Você tem certeza que deseja excluir a pulseira <strong>${pulseira.Imei}</strong>?`, function () {
                $pulseiras.remove(pulseira.Id, $scope.listar);
            });
        };
    });

    app.controller("PulseiraDetailsController", function ($scope, $pulseiras, $monitoramentos, $localizacoes) {

        $scope.carregar = function (id) {
            
            $scope.idPulseira = id;

            $scope.filtrosDeLocalizacao = {
                Predicate: "Data",
                Reverse: true,
            }

            $scope.filtrosDeMonitoramento = {
                Predicate: "Data",
                Reverse: true
            }

            $pulseiras.get(id, function (pulseira) {
                $scope.pulseira = pulseira;
            });

            
            $scope.listarMonitoramento();
            $scope.listarLocalizacao();
        };

        $scope.listarMonitoramento = function () {
            $scope.filtrosDeMonitoramento.IdPulseira = $scope.idPulseira;
            
            $monitoramentos.list($scope.filtrosDeMonitoramento, function (r) {
                $scope.monitoramentos = r;
            });
        };

        $scope.listarLocalizacao = function () {
            $scope.filtrosDeLocalizacao.IdPulseira = $scope.idPulseira;

            $localizacoes.list($scope.filtrosDeLocalizacao, function (r) {
                $scope.localizacoes = r;
            });
        };

        $scope.historico = function (id) {           
            $pulseiras.redirect("Details", id);
        }

    });
})();