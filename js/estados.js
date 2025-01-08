$(document).ready(function() {
  
  const urlParams = new URLSearchParams(window.location.search);
  const estadoId = urlParams.get('estado');
  if (estadoId) {
  const apiUrl = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoId}/municipios`
  const nameUrl = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoId}`
  
  let municipios = [];

  
  // Modificar o atributo data do objeto para carregar o SVG específico
  const svgPath = `./assets/estados/${estadoId}.svg`; // Caminho para o SVG do estado
  $('#mapa-svg').attr('data', svgPath); // Atualiza o caminho do SVG

// REQUISIÇÕES AJAX
  // Pega o nome do estado
  $.ajax({
    url: nameUrl,
    method: "GET",
    success: function(data) {
      $('#estadoNome').text(data.nome); 
    },
    error: function() {
      $('#estadoNome').text("Erro ao carregar o nome do estado"); 
    }
  });

  // Pega todos os municipios e popula a lista
  $.ajax({
      url: apiUrl,
      method: "GET",
      success: function(data) {
          // Ordena os objetos pela propriedade "nome" em ordem alfabética
          municipios = data.sort((a, b) => a.nome.localeCompare(b.nome));
          populateMunicipioList(municipios); // Popula a lista com os dados ordenados
      },
      error: function() {
          $('#municipio-list').append('<li class="list-group-item">Erro ao carregar os municípios</li>');
      }
  });

  // Funcao pra popular a lista
  function populateMunicipioList(municipios) {
      const municipioList = $('#municipio-list');
      municipioList.empty();
      municipios.forEach(cidade => {
          const listItem = $(`<li class="list-group-item"><a href="municipioDetalhes.html?municipio=${cidade.id}">${cidade.nome}</a></li>`);
          municipioList.append(listItem);
      });
  }

  // Filtra e exibe os municipios de acordo com a barra de pesquisa
  $('#search-input').on('input', function() {
      const query = $(this).val().toLowerCase();
      const filteredMunicipios = municipios.filter(cidade => cidade.nome.toLowerCase().includes(query));
      populateMunicipioList(filteredMunicipios); // Atualiza a lista com os municipios filtrados
  });
} else {
  console.log('Erro! estados.js')
}});