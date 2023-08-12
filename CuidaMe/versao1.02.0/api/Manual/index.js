PR.registerLangHandler(PR.sourceDecorator({
	keywords: "boolean,break,date,dateTime,decimal,false,function,int,ou,return,string,true,var,while",
	hashComments: true,
	cStyleComments: true
	//'verbatimStrings': true
	//'types': C_TYPES
}), ["paypop"]);

(function () {
	var app = angular.module("app", []);

	app.controller("ManualController", ["$scope", function (scope) {

		scope.irParaTopoDaPagina = function () {
			window.history.pushState("", "/", window.location.pathname);
			window.scrollTo(0, 0);
		};
	}]);

	function criarAncora(diretiva, classe) {
		classe = classe || diretiva;

		app.directive(diretiva, ["$http", function (http) {
			return {
				template: function (element, attrs) {
					var conteudo = element.contents();
					var nome = attrs.nome || (conteudo.is("span") ? conteudo.html() : conteudo.text());

					return $("<a>").addClass("ancora ancora-" + classe).attr("href",  `#${nome}`).html(conteudo);
				}
			};
		}]);
	}

	criarAncora("objeto");
	criarAncora("tipoDeDado", "tipo-de-dado");
	criarAncora("enumerador");

	app.directive("recurso", function () {
		return {
			template: function (element, attrs) {
				var painel = $("<div class='card recurso'>");
				var corpo = $("<div class='card-body'>").appendTo(painel);
				var tabela = $("<table class='table'>");

				var descricao = element.find("descricao");
				var observacao = element.find("observacao");

				if (attrs.nome)
					$("<span class='card-title text-info recurso-nome'>").html(attrs.nome).appendTo(corpo);

				if (descricao.length)
					$("<p class='recurso-descricao text-muted'>").append(descricao.contents()).appendTo(corpo);

				tabela.appendTo(corpo);

				if (observacao.length) {
					$("<hr class='divisor'>").appendTo(corpo);
					$("<span class='recurso-observacao text-muted'>").append(observacao.contents()).appendTo(corpo);
				}

				function adicionarInformacao(titulo, conteudo) {
					var tr = $("<tr>").appendTo(tabela);

					$("<td>").html(titulo).appendTo(tr);
					$("<td>").html(conteudo).appendTo(tr);
				}

				var url = attrs.url || element.find("url").html();
				var cabecalhos = element.find("cabecalho");
				var parametros = element.find("parametro");
				var conteudo = element.find("conteudo");
				var retorno = element.find("retorno");

				if (url)
					adicionarInformacao("Url", "/" + url);

				if (attrs.metodo)
					adicionarInformacao("Método", attrs.metodo.toUpperCase());

				if (cabecalhos.length) {
					var cabecalhosDoRecurso = $("<div class='recurso-cabecalhos'>");

					cabecalhos.each(function () {
						cabecalhosDoRecurso.append($("<strong>").html($(this).attr("nome")));
						cabecalhosDoRecurso.append($("<p>").html($(this).html()));
					});

					adicionarInformacao("Cabeçalhos", cabecalhosDoRecurso);
				}

				if (parametros.length) {
					var parametrosDoRecurso = $("<div class='recurso-parametros'>");

					parametros.each(function () {
						parametrosDoRecurso.append($("<strong>").html($(this).attr("nome")));
						parametrosDoRecurso.append(" - ");
						parametrosDoRecurso.append($("<tipo-de-dado>").html($(this).attr("tipo")));
						parametrosDoRecurso.append($("<p>").html($(this).html()));
					});

					adicionarInformacao("Parâmetros", parametrosDoRecurso);
				}

				if (conteudo.length)
					adicionarInformacao("Conteúdo", conteudo.html());

				if (retorno.length)
					adicionarInformacao("Retorno", retorno.html());

				return painel;
			}
		};
	});

	app.directive("declaracaoDeObjeto", function () {

		function obterTamanhoIndeterminado(tamanho) {
			return /^max$/.test(tamanho) ? "max" : null;
		}
		function obterTamanhoMaximo(tamanho) {
			var maximo = tamanho.match(/^-(\d+)$/);
			if (maximo)
				return "até " + maximo[1] + " caracteres";

			return null;
		}
		function obterTamanhoFixo(tamanho) {
			var opcoes = tamanho.split(",");
			var tamanhos = "";

			for (var i = 0; i < opcoes.length; i++) {
				if (i > 0)
					tamanhos += i < opcoes.length - 1 ? ", " : " ou ";

				tamanhos += opcoes[i];
			}

			return tamanhos + " caracteres";
		}
		function obterAlcance(alcance) {
			var match = alcance.match(/(\d+)-(\d+)/);

			return "de " + match[1] + " a " + match[2];
		}
		function obterEspeficicacao(campo) {
			var especificacoes = [
				{
					atributo: "tamanho",
					metodos: [
						obterTamanhoIndeterminado,
						obterTamanhoMaximo,
						obterTamanhoFixo
					]
				},
				{
					atributo: "alcance",
					metodos: [
						obterAlcance
					]
				}
			];

			for (var i = 0; i < especificacoes.length; i++) {
				var especificacao = especificacoes[i];
				var atributo = campo.attr(especificacao.atributo);

				if (atributo) {
					for (var j = 0; j < especificacao.metodos.length; j++) {
						var valor = especificacao.metodos[j](atributo);

						if (valor)
							return valor;
					}
				}
			}

			return null;
		}

		return {
			template: function (element, attrs) {
				var painel = $("<div class='card declaracao-de-objeto'>");
				var corpo = $("<div class='card-body'>").appendTo(painel);

				$("<span class='card-title declaracao-de-objeto-nome'>").attr("id", attrs.nome).html(attrs.nome).appendTo(corpo);
				element.find("pre[codigo]").appendTo(corpo);

				var campos = element.find("campo");

				if (campos.length) {
					var tabela = $("<table class='table declaracao-de-objetos-campos'>").appendTo(corpo);
					var cabecalho = $("<tr>").appendTo(tabela);
					var possuiCamposObrigatorios = "mostrarObrigatorios" in attrs || campos.filter("[obrigatorio]").length > 0;
					var possuiCamposNulos = "mostrarNulos" in attrs || campos.filter("[nulo]").length > 0;

					$("<td class='text-info'>").html("Campo").appendTo(cabecalho);
					$("<td class='text-info'>").html("Descrição").appendTo(cabecalho);

					if (possuiCamposObrigatorios)
						$("<td class='text-info'>").html("Obrigatório").appendTo(cabecalho);

					if (possuiCamposNulos)
						$("<td class='text-info'>").html("Pode ser nulo").appendTo(cabecalho);

					$("<td class='text-info'>").html("Especificação").appendTo(cabecalho);

					campos.each(function () {
						var linha = $("<tr>").appendTo(tabela);
						var campo = $(this);
						var dado;

						$("<td>").html(campo.attr("nome")).appendTo(linha);
						$("<td class='text-secondary'>").html(campo.html()).appendTo(linha);

						if (possuiCamposObrigatorios) {
							dado = $("<td>").appendTo(linha);
							var obrigatorio = campo.is("[obrigatorio]");

							dado.html(obrigatorio ? "sim" : "-");

							if (obrigatorio)
								dado.addClass("text-danger");
						}

						if (possuiCamposNulos) {
							dado = $("<td>").appendTo(linha);
							var nulo = campo.is("[nulo]");

							dado.html(nulo ? "sim" : "-");

							if (nulo)
								dado.addClass("text-danger");
						}

						$("<td>").html(obterEspeficicacao(campo) || "-").appendTo(linha);
					});
				}

				return painel;
			}
		};
	});

	app.directive("declaracaoDeEnumerador", function () {
		return {
			template: function (element, attrs) {
				var painel = $("<div class='card declaracao-de-objeto declaracao-de-enumerador'>");
				var corpo = $("<div class='card-body'>").appendTo(painel);

				$("<span class='card-title declaracao-de-objeto-nome'>").attr("id", attrs.nome).html(attrs.nome).appendTo(corpo);

				var tabela = $("<table class='table'>").appendTo(corpo);

				element.find("opcao").each(function () {
					var linha = $("<tr>").appendTo(tabela);

					$("<td class='text-info'>").append($(this).attr("valor")).appendTo(linha);
					$("<td>").append($(this).html()).appendTo(linha);
				});

				return painel;
			}
		};
	});

	app.directive("declaracaoDeTipoDeDado", function () {
		return {
			template: function (element, attrs) {
				var painel = $("<div class='card declaracao-de-objeto'>");
				var corpo = $("<div class='card-body'>").appendTo(painel);

				$("<span class='card-title declaracao-de-tipo-de-dado-nome'>").attr("id", attrs.nome).html(attrs.nome).appendTo(corpo);
				element.contents().appendTo(corpo);

				return painel;
			}
		};
	});

	app.directive("codigo", function () {
		function mustAddPadding(line) {
			return /[\{\[]$/.test(line) || /^&lt;[^!\/].+?&gt;.*$/.test(line);
		}
		function mustRemovePadding(line) {
			return /[\}\]][;,]?$/.test(line) && !/\[\][;,]?$/.test(line) || /^.*&lt;\/.+&gt;$/.test(line);
		}

		return {
			restrict: "A",
			compile: function (element, attrs) {
				var showLines = attrs.showLines == "false";
				var code = element.html();
				var padding = 0;
				var isHtml = "html" in attrs;

				code = code.replace(/\$trim\s*((?:.|\s)*?)\s*\$trim/g, "$1");
				code = code.trim().split("\n");

				for (var i = 0; i < code.length; i++) {
					var line = code[i].trim();
					var addPadding = mustAddPadding(line);
					var removePadding = mustRemovePadding(line);

					if (removePadding && !addPadding)
						padding -= 4;

					code[i] = line.padStart(padding + line.length, " ");

					if (addPadding && !removePadding)
						padding += 4;
				}

				code = code.join("\n");

				var language = isHtml ? null : "paypop";
				element.addClass("code-markup");
				element.html(PR.prettyPrintOne(code, language, showLines));
			}
		};
	});
})();