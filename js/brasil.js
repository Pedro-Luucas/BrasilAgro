$(document).ready(function() {
    const apiUrl = "https://servicodados.ibge.gov.br/api/v1/localidades/estados/11%7C12%7C13%7C14%7C15%7C16%7C17%7C21%7C22%7C23%7C24%7C25%7C26%7C27%7C28%7C29%7C31%7C32%7C33%7C35%7C41%7C42%7C43%7C50%7C51%7C52%7C53";

    let estados = [];

    $.ajax({
        url: apiUrl,
        method: "GET",
        success: function(data) {
            // Ordena os objetos pela propriedade "nome" em ordem alfabética
            estados = data.sort((a, b) => a.nome.localeCompare(b.nome));
            populateUFList(estados); // Popula a lista com os dados ordenados
        },
        error: function() {
            $('#uf-list').append('<li class="list-group-item">Erro ao carregar as Unidades Federativas</li>');
        }
    });

    function populateUFList(ufs) {
        const ufList = $('#uf-list');
        ufList.empty();
        ufs.forEach(uf => {
            const listItem = $(`<li class="list-group-item"><a href="estadoDetalhes.html?estado=${uf.id}">${uf.nome}</a></li>`);
            ufList.append(listItem);
        });
    }

    // Filtra e exibe os estados de acordo com a barra de pesquisa
    $('#search-input').on('input', function() {
        const query = $(this).val().toLowerCase();
        const filteredUfs = estados.filter(uf => uf.nome.toLowerCase().includes(query));
        populateUFList(filteredUfs); // Atualiza a lista com os estados filtrados
    });
});