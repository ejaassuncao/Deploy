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

    app.controller("ListPulseiraController", function ($scope, $enums, $messages, $pulseiras, $comando, $timeout) {

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

        //***Novos comandos***
        $scope.comando = { cmd: '', };

        $scope.abrirDialogEnviarComando = function (pulseira) {
            $scope.filtrosComandos = { Predicate: "Nome", Reverse: false, currentPage: 1, itemsPerPage: 100 };
            $comando.list($scope.filtrosComandos, function (r) {
                $scope.comandos = r;
            });

            $scope.pulseiraSelecionada = pulseira;
            $scope.abertaNew = true;
        };

        $scope.comandoSelecionado = function () {
            if ($scope.comando.cmd == null) return;
            $scope.montaComando = $scope.comando.cmd.replace("{IMEI}", $scope.pulseiraSelecionada.Imei);
            var variaveis = $scope.montaComando.split('{');
            $scope.campos = [];
            if (variaveis.length > 1) {
                for (var index in variaveis) {
                    if (index > 0)
                        $scope.campos.push(variaveis[index].substr(0, variaveis[index].indexOf('}')))
                }
            }

            $scope.divMsgRetorno = true;
        }

        $scope.EnviarComando = function () {
            $scope.msgRetorno = '';
            $scope.msgValidacao = false;
            if ($scope.comando.cmd.length == 0) {
                $scope.msgValidacao = true;
                return
            }

            var elementos = $("input[name='campo']");
            for (index = 0; index < elementos.length; index++) {
                var el = elementos[index];
                var lbl = $(el).prop('placeholder');
                var value = $(el).val();
                $scope.montaComando = $scope.montaComando.replace("{" + lbl + "}", value);
            }
            $scope.enviar = true;
            $scope.divMsgRetorno = true

            var dados = {
                Pulseira: $scope.pulseiraSelecionada,
                Comando: $scope.montaComando
            };

            $comando.enviarComando(dados, function (r) {                
                $scope.enviar = true;
                $scope.msgRetorno = `- ${r.Message}<br/>`;
                if (r.Status == "Sucesso")
                    checkLog(r);
            });
        }

        $scope.fecharModal = function () {
            $scope.comandos = {};
            $scope.campos = [];
            $scope.montaComando = "";
            $scope.pulseiraSelecionada = {};
            $scope.abertaNew = false;
            $scope.enviar = false;
            $scope.divMsgRetorno = false;
            $scope.msgRetorno = '';
            $scope.listar();
        }

        function checkLog(param) {          
            $comando.getLog(param, function (r) {
                if (r.Status != 'FimLog') {
                    $scope.msgRetorno = r.Message;
                    $timeout(function () {
                        checkLog(r);
                    }, 3000)
                } else {
                    //fim
                    $scope.enviar = false;
                }
            });
        }
    });

    app.controller("PulseiraDetailsController", function ($scope, $pulseiras, $monitoramentos, $localizacoes, $localizacoesLbs) {

        $scope.carregar = function (id) {

            $scope.idPulseira = id;

            $scope.filtrosDeLocalizacao = {
                Predicate: "Data",
                Reverse: true,
            }

            $scope.filtrosDeLocalizacaoLbs = {
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
            $scope.listarLocalizacaoLbs();
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

        $scope.listarLocalizacaoLbs = function () {
            $scope.filtrosDeLocalizacaoLbs.IdPulseira = $scope.idPulseira;

            $localizacoesLbs.list($scope.filtrosDeLocalizacaoLbs, function (r) {
                $scope.localizacoesLbs = r;
            });
        };

        $scope.historico = function (id) {
            $pulseiras.redirect("Details", id);
        }
    });

    app.controller("PulseiraDetailsChartsController", function ($scope, $pulseiras, $monitoramentos, $localizacoes, $localizacoesLbs) {

        $scope.carregar = function (id) {

            $scope.idPulseira = id;

            $scope.filtrosDeMonitoramento =
            {
                DataInicial: null,
                DataFinal: null
            };

            $pulseiras.get(id, function (pulseira) {
                $scope.pulseira = pulseira;
                $scope.listarMonitoramentoCharts();
            });
        };

        $scope.listarMonitoramentoCharts = function () {

            $scope.filtrosDeMonitoramento.IdPulseira = $scope.idPulseira;
            $scope.filtrosDeMonitoramento.IdIdoso = $scope.pulseira.IdIdoso;

            $monitoramentos.listCharts($scope.filtrosDeMonitoramento, function (r) {
                carregarChartsAll(r);
            });
        };

        $scope.historico = function (id) {
            $pulseiras.redirect("Details", id);
        }

        var carregarChartsAll = function (data) {
            var monitoramentosDados = data.monitoramentos;
            var configuracoesDados = data.configuracoes;

            var domAll = document.getElementById('graficoAll');
            var chartAll = echarts.init(domAll, null, {
                renderer: 'canvas',
                useDirtyRect: false
            });

            chartAll.setOption(
                (option = {
                    animationDuration: 3000,
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['FrequenciaCardiaca', 'Sistolica', 'Diastolica', 'Saturacao']
                    },
                    grid: {
                        left: '5%',
                        right: '5%',
                        bottom: '10%'
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: monitoramentosDados.map(function (item) {
                            return item['Data'].toLocaleString('pt-BR');
                        })
                    },
                    yAxis: {
                        max: GetMaxValue(data)
                    },
                    toolbox: {
                        right: 10,
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    dataZoom: [
                        {
                            start: 0,
                            end: 100
                        },
                        {
                            type: 'inside'
                        }
                    ],
                    series: [
                        {
                            name: 'FrequenciaCardiaca',
                            type: 'line',
                            color: '#BA55D3',
                            showSymbol: false,
                            smooth: true,
                            data: monitoramentosDados.map(function (item) {
                                return item['FrequenciaCardiaca'];
                            }),
                            markLine: {
                                silent: true,
                                lineStyle: {
                                    color: '#333'
                                },
                                data: [
                                    {
                                        yAxis: configuracoesDados.FrequenciaCardiacaMinima
                                    },
                                    {
                                        yAxis: configuracoesDados.FrequenciaCardiacaMaxima
                                    }
                                ]
                            }
                        },
                        {
                            name: 'Sistolica',
                            type: 'line',
                            color: '#DAA520',
                            showSymbol: false,
                            smooth: true,
                            data: monitoramentosDados.map(function (item) {
                                return item['Sistolica'];
                            }),
                            markLine: {
                                silent: false,
                                lineStyle: {
                                    color: '#DAA520'
                                },
                                data: [
                                    {
                                        yAxis: configuracoesDados.SistolicaMinima
                                    },
                                    {
                                        yAxis: configuracoesDados.SistolicaMaxima
                                    }
                                ]
                            }
                        },
                        {
                            name: 'Diastolica',
                            type: 'line',
                            color: '#FF1493',
                            showSymbol: false,
                            smooth: true,
                            data: monitoramentosDados.map(function (item) {
                                return item['Diastolica'];
                            }),
                            markLine: {
                                silent: true,
                                lineStyle: {
                                    color: '#333'
                                },
                                data: [
                                    {
                                        yAxis: configuracoesDados.DiastolicaMinima
                                    },
                                    {
                                        yAxis: configuracoesDados.DiastolicaMaxima
                                    }
                                ]
                            }

                        },
                        {
                            name: 'Saturacao',
                            type: 'line',
                            color: '#00CED1',
                            showSymbol: false,
                            smooth: true,
                            data: monitoramentosDados.map(function (item) {
                                return item['Saturacao'];
                            }),
                            markLine: {
                                silent: true,
                                lineStyle: {
                                    color: '#333'
                                },
                                data: [
                                    {
                                        yAxis: configuracoesDados.SaturacaoMinima
                                    },
                                    {
                                        yAxis: configuracoesDados.SaturacaoMaxima
                                    }
                                ]
                            }
                        },
                    ],
                })
            );

            window.addEventListener('resize', chartAll.resize);
        }   

        function GetMaxValue(data) {
            var arrayMaxValues = [];

            arrayMaxValues.push(data.monitoramentos.reduce((a, b) => Math.max(a, b['FrequenciaCardiaca']), -Infinity));
            arrayMaxValues.push(data.monitoramentos.reduce((a, b) => Math.max(a, b['Sistolica']), -Infinity));
            arrayMaxValues.push(data.monitoramentos.reduce((a, b) => Math.max(a, b['Diastolica']), -Infinity)); 
            arrayMaxValues.push( data.monitoramentos.reduce((a, b) => Math.max(a, b['Saturacao']), -Infinity));
            arrayMaxValues.push(data.configuracoes.FrequenciaCardiacaMaxima);        
            arrayMaxValues.push(data.configuracoes.DiastolicaMaxima);           
            arrayMaxValues.push( data.configuracoes.SaturacaoMaxima);         
            arrayMaxValues.push(data.configuracoes.SistolicaMaxima);

            var maxValue = arrayMaxValues.reduce((a, b) => Math.max(a, b), -Infinity);

            return maxValue+10;
        }
    });
})();