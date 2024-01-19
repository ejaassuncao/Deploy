(function () {
    const app = angular.module("app");

    app.service("$graficos", function () {

        var _carregarGraficoAll = function (elementId, data, titulo) {
            var monitoramentosDados = data.monitoramentos;

            var dom = document.getElementById(elementId);
            var chart = echarts.init(dom, null, {
                renderer: 'canvas',
                useDirtyRect: false
            });

            chart.setOption(
                (option = {
                    animationDuration: 1000,
                    tooltip: {
                        trigger: 'axis'
                    },
                    title:
                    {
                        left: 'left',
                        text: titulo
                    },                 
                    legend: {
                        data: ['FrequenciaCardiaca', 'Sistolica', 'Diastolica', 'Saturacao']
                    },
                    grid: {
                        left: '80px',
                        right: '5%',
                        bottom: '60px'
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        axisLabel: { interval: 0, rotate: 50 },
                        data: monitoramentosDados.map(function (item) {
                            return item['Data'].toLocaleString('pt-BR').replace(', ', '\n');
                        })
                    },
                    yAxis: {
                        max: GetMaxValueAll(data)
                    },
                    toolbox: {
                        right: 10,
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    //dataZoom: [
                    //    {
                    //        start: 0,
                    //        end: 100
                    //    },
                    //    {
                    //        type: 'inside'
                    //    }
                    //],
                    series: [
                        {
                            name: 'FrequenciaCardiaca',
                            type: 'line',
                            color: '#BA55D3',
                            showSymbol: true,
                            smooth: true,
                            data: monitoramentosDados.map(function (item) {
                                return item['FrequenciaCardiaca'];
                            }),
                        },
                        {
                            name: 'Sistolica',
                            type: 'line',
                            color: '#DAA520',
                            showSymbol: true,
                            smooth: true,
                            data: monitoramentosDados.map(function (item) {
                                return item['Sistolica'];
                            }),
                        },
                        {
                            name: 'Diastolica',
                            type: 'line',
                            color: '#FF1493',
                            showSymbol: true,
                            smooth: true,
                            data: monitoramentosDados.map(function (item) {
                                return item['Diastolica'];
                            })
                        },
                        {
                            name: 'Saturacao',
                            type: 'line',
                            color: '#00CED1',
                            showSymbol: true,
                            smooth: true,
                            data: monitoramentosDados.map(function (item) {
                                return item['Saturacao'];
                            })
                        }
                    ],
                })
            );

            window.addEventListener('resize', chart.resize);
        }

        var _carregarGrafico = function (elementId, data, valorGrafico, cor, titulo) {
            var monitoramentosDados = data.monitoramentos;
            var configuracoesDados = data.configuracoes;

            var dom = document.getElementById(elementId);
            var chart = echarts.init(dom, null, {
                renderer: 'canvas',
                useDirtyRect: false
            });

            chart.setOption(
                (option = {
                    animationDuration: 1000,
                    tooltip: {
                        trigger: 'axis'
                    },
                    title:
                    {
                        x: 'left',
                        y: 'top',
                        text: titulo,
                        textStyle: {
                            color: cor
                        }
                    },   
                    legend: {
                        data: valorGrafico
                    },
                    grid: {
                        left: '80px',
                        right: '5%',
                        bottom: '60px'
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        axisLabel: { interval: 0, rotate: 50 },
                        data: monitoramentosDados.map(function (item) {
                            return item['Data'].toLocaleString('pt-BR').replace(', ', '\n');
                        })
                    },
                    yAxis: {
                        max: GetMaxValue(data, valorGrafico)
                    },
                    toolbox: {
                        right: 10,
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    //dataZoom: [
                    //    {
                    //        start: 0,
                    //        end: 100
                    //    },
                    //    {
                    //        type: 'inside'
                    //    }
                    //],
                    series: [
                        {
                            name: valorGrafico,
                            type: 'line',
                            color: cor,
                            showSymbol: true,
                            smooth: true,
                            data: monitoramentosDados.map(function (item) {
                                return item[valorGrafico];
                            }),
                            markLine: {
                                silent: true,
                                lineStyle: {
                                    color: '#333'
                                },
                                data: [
                                    {
                                        yAxis: configuracoesDados[`${valorGrafico}Maxima`]
                                    },
                                    {
                                        yAxis: configuracoesDados[`${valorGrafico}Minima`]
                                    }
                                ]
                            }
                        }                     
                    ]
                })
            );

            window.addEventListener('resize', chart.resize);
        }

        function GetMaxValueAll(data) {
            var arrayMaxValues = [];

            arrayMaxValues.push(data.monitoramentos.reduce((a, b) => Math.max(a, b['FrequenciaCardiaca']), -Infinity));
            arrayMaxValues.push(data.monitoramentos.reduce((a, b) => Math.max(a, b['Sistolica']), -Infinity));
            arrayMaxValues.push(data.monitoramentos.reduce((a, b) => Math.max(a, b['Diastolica']), -Infinity));
            arrayMaxValues.push(data.monitoramentos.reduce((a, b) => Math.max(a, b['Saturacao']), -Infinity));
            arrayMaxValues.push(data.configuracoes.FrequenciaCardiacaMaxima);
            arrayMaxValues.push(data.configuracoes.DiastolicaMaxima);
            arrayMaxValues.push(data.configuracoes.SaturacaoMaxima);
            arrayMaxValues.push(data.configuracoes.SistolicaMaxima);

            var maxValue = arrayMaxValues.reduce((a, b) => Math.max(a, b), -Infinity);

            return maxValue + 10;
        }

        function GetMaxValue(data, valorGrafico) {
            
            var arrayMaxValues = [];

            arrayMaxValues.push(data.monitoramentos.reduce((a, b) => Math.max(a, b[valorGrafico]), -Infinity));  
            arrayMaxValues.push(data.configuracoes[`${valorGrafico}Maxima`]);
            
            var maxValue = arrayMaxValues.reduce((a, b) => Math.max(a, b), -Infinity);

            return maxValue + 10;
        }

        return {
            carregarGraficoAll: _carregarGraficoAll,
            carregarGrafico: _carregarGrafico,
        }
    });
})();