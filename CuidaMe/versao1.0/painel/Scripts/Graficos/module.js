(function () {
    const app = angular.module("app");
    app.controller("PulseiraDetailsChartsController", function ($scope, $pulseiras, $monitoramentos, $graficos) {

        $scope.carregar = function (id) {

            $scope.idPulseira = id;
                        
            var agora = new Date();
            $scope.filtrosDeMonitoramento =
            {
                DataInicial: agora.AddDay(-10), //pega os 10 utimos dias
                DataFinal: agora
            };

            $pulseiras.get(id, function (pulseira) {
                $scope.pulseira = pulseira;
                $scope.listarMonitoramentoCharts();
            });
        };

        $scope.listarMonitoramentoCharts = function () {

            $scope.filtrosDeMonitoramento.IdPulseira = $scope.idPulseira;
            $scope.filtrosDeMonitoramento.IdIdoso = $scope.pulseira.IdIdoso;

            $monitoramentos.listCharts($scope.filtrosDeMonitoramento, function (dados) {
                $graficos.carregarGraficoAll('graficoAll', dados, 'Monitoramentos');
                            
                $graficos.carregarGrafico('graficoFrequenciaCardiaca', dados, 'FrequenciaCardiaca', '#BA55D3','Frequência Cardíaca');
                $graficos.carregarGrafico('graficoSistolica', dados, 'Sistolica', '#DAA520', 'Sistólica');
                $graficos.carregarGrafico('graficoDiastolica', dados, 'Diastolica', '#FF1493', 'Diastólica');
                $graficos.carregarGrafico('graficoSaturacao', dados, 'Saturacao', '#00CED1', 'Saturação');
            });
        };

        $scope.historico = function (id) {
            $pulseiras.redirect("Details", id);
        }
    });
})();