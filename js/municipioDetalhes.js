$(document).ready(function() {
    // Obter o ID do município a partir dos parâmetros da URL
    const urlParams = new URLSearchParams(window.location.search);
    const municipioId = urlParams.get('municipio');

    // Função para definir o nome do município no elemento #nome-cidade
    function definirNomeMunicipio() {
        const apiUrl = `https://servicodados.ibge.gov.br/api/v1/localidades/municipios/${municipioId}`;
        
        // Realizar chamada AJAX para obter o nome do município
        $.ajax({
            url: apiUrl,
            method: "GET",
            success: function(data) {
                $('#nomeMunicipio').text(data.nome); // Atualiza o elemento #nome-cidade com o nome do município
            },
            error: function() {
                alert('Erro ao carregar o nome do município');
            }
        });
    }

    // Função para carregar dados e gráficos com base na cultura selecionada
    function carregarDados(culturaId) {
        const apiUrl = `https://servicodados.ibge.gov.br/api/v3/agregados/${culturaId}/periodos/2003%7C2004%7C2005%7C2006%7C2007%7C2008%7C2009%7C2010%7C2011%7C2012%7C2013%7C2014%7C2015%7C2016%7C2017%7C2018%7C2019%7C2020%7C2021%7C2022%7C2023/variaveis/109%7C216%7C214%7C112?localidades=N6[${municipioId}]&classificacao=81[31693]`;

        // Realizar chamada AJAX para obter dados
        $.ajax({
            url: apiUrl,
            method: "GET",
            success: function(data) {
                renderizarGraficos(data); // Renderizar gráficos com os dados recebidos
            },
            error: function() {
                alert('Erro ao carregar dados');
            }
        });
    }

    // Carregar dados iniciais com a cultura padrão selecionada
    carregarDados($('#selecao-cultura').val());

    // Carregar o nome do município ao carregar a página
    definirNomeMunicipio();

    // Atualizar gráficos ao mudar a cultura selecionada
    $('#selecao-cultura').change(function() {
        const culturaId = $(this).val();
        carregarDados(culturaId);
    });

    // Renderiza os gráficos de acordo com os dados recebidos
    function renderizarGraficos(data) {
        const dadosArea = parseDataParaGraficoAgrupado(data, "Área plantada", "Área colhida");
        const dadosQuantidade = parseDataParaGraficoBarra(data, "Quantidade produzida");
        const dadosRendimento = parseDataParaGraficoBarra(data, "Rendimento médio da produção");

        // Limpar gráficos existentes antes de renderizar novos
        $("#grafico-area").empty();
        $("#grafico-quantidade").empty();
        $("#grafico-rendimento").empty();

        // Renderizar gráficos com dados processados
        renderizarGraficoAgrupado("#grafico-area", dadosArea, "Hectares");
        renderizarGraficoBarra("#grafico-quantidade", dadosQuantidade, "Toneladas");
        renderizarGraficoBarra("#grafico-rendimento", dadosRendimento, "Quilogramas por Hectare");
    }

    // Função para processar os dados de diferentes variáveis para o gráfico agrupado
    function parseDataParaGraficoAgrupado(data, ...variaveis) {
        const anos = Array.from({length: 21}, (_, i) => (2003 + i).toString());  // Anos de 2003 a 2023
        return anos.map(ano => {
            const dadosAno = { ano: ano };
            variaveis.forEach(variavel => {
                const dadosVariavel = data.find(d => d.variavel === variavel);
                if (dadosVariavel) {
                    dadosAno[variavel] = parseInt(dadosVariavel.resultados[0].series[0].serie[ano]) || 0;
                }
            });
            return dadosAno;
        });
    }

    // Renderiza gráfico agrupado para "Área plantada" e "Área colhida"
    function renderizarGraficoAgrupado(seletor, dados) {
        const largura = 800, altura = 400, margem = {top: 20, right: 30, bottom: 40, left: 50};

        // Cria elemento SVG para o gráfico
        const svg = d3.select(seletor).append("svg")
            .attr("width", largura)
            .attr("height", altura);

        // Configuração do eixo X (anos) e subeixo para categorias (Área plantada e Área colhida)
        const eixoX = d3.scaleBand().domain(dados.map(d => d.ano)).range([margem.left, largura - margem.right]).padding(0.2);
        const subeixoX = d3.scaleBand().domain(["Área plantada", "Área colhida"]).range([0, eixoX.bandwidth()]).padding(0.05);
        const eixoY = d3.scaleLinear().domain([0, d3.max(dados, d => Math.max(d["Área plantada"], d["Área colhida"]))]).nice().range([altura - margem.bottom, margem.top]);

        // Adicionar barras para cada variável (Área plantada e Área colhida)
        svg.append("g").selectAll("g")
            .data(dados)
            .enter().append("g")
            .attr("transform", d => `translate(${eixoX(d.ano)},0)`)
            .selectAll("rect")
            .data(d => ["Área plantada", "Área colhida"].map(chave => ({chave, valor: d[chave]})))
            .enter().append("rect")
            .attr("x", d => subeixoX(d.chave))
            .attr("y", d => eixoY(d.valor))
            .attr("width", subeixoX.bandwidth())
            .attr("height", d => eixoY(0) - eixoY(d.valor))
            .attr("fill", d => d.chave === "Área plantada" ? "#4CAF50" : "#FF9800");

        // Adicionar eixos ao gráfico
        svg.append("g").attr("transform", `translate(0,${altura - margem.bottom})`).call(d3.axisBottom(eixoX));
        svg.append("g").attr("transform", `translate(${margem.left},0)`).call(d3.axisLeft(eixoY));
    }

    // Renderiza um gráfico de barras simples
    function renderizarGraficoBarra(seletor, dados) {
        const largura = 800, altura = 400, margem = {top: 20, right: 30, bottom: 40, left: 50};
        
        // Limpar gráfico existente antes de renderizar novo
        d3.select(seletor).select("svg").remove();

        // Criar elemento SVG
        const svg = d3.select(seletor)
          .append("svg")
            .attr("width", largura + margem.left + margem.right)
            .attr("height", altura + margem.top + margem.bottom)
          .append("g")
            .attr("transform", `translate(${margem.left},${margem.top})`);

        // Configuração do eixo X e eixo Y
        const eixoX = d3.scaleBand().range([0, largura]).domain(dados.map(d => d.ano)).padding(0.2);
        svg.append("g")
          .attr("transform", `translate(0, ${altura})`)
          .call(d3.axisBottom(eixoX))
        const eixoY = d3.scaleLinear().domain([0, d3.max(dados, d => d.valor)]).range([altura, 0]);
        svg.append("g").call(d3.axisLeft(eixoY));

        // Adicionar barras ao gráfico
        svg.selectAll("mybar")
          .data(dados)
          .join("rect")
            .attr("x", d => eixoX(d.ano))
            .attr("y", d => eixoY(d.valor))
            .attr("width", eixoX.bandwidth())
            .attr("height", d => altura - eixoY(d.valor))
            .attr("fill", "#4CAF50");
    }

    // Função para processar dados para gráfico de barras
    function parseDataParaGraficoBarra(data, variavel) {
        const anos = Object.keys(data[0].resultados[0].series[0].serie);
        return anos.map(ano => ({
            ano: ano,
            valor: parseInt(data.find(d => d.variavel === variavel).resultados[0].series[0].serie[ano]) || 0
        }));
    }
});
