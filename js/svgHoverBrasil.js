$(document).ready(function() {
    const svgObject = $("#mapa-svg");
  
    svgObject.on("load", function() {
        const svgDoc = svgObject[0].contentDocument;
        const $paths = $(svgDoc).find("path");  // Seleciona todos os caminhos (estados)
        
        // Cria a div tooltip dentro da div do SVG
        const tooltip = $("<div id='tooltip'></div>").css({
            position: "absolute",
            display: "none",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            color: "#fff",
            padding: "5px",
            borderRadius: "5px",
            fontSize: "14px",
            zIndex: 1000
        });
  
        svgObject.closest(".col-md-8").append(tooltip);  // Adiciona o tooltip dentro da div que contém o SVG
  
        // Eventos de hover para paths (todos os estados)
        $paths.on("mouseenter", function() {
            $(this).attr("fill", "#e6e6cf");  // Muda a cor do estado ao passar o mouse
            const stateName = $(this).attr("name");  // Pega o nome do estado (atributo 'name')
            tooltip.text(stateName);  // Atualiza o texto do tooltip com o nome do estado
            tooltip.show();  // Exibe o tooltip
        });
  
        $paths.on("mouseleave", function() {
            $(this).attr("fill", "#ccccb8");  // Restaura a cor original
            tooltip.hide();  // Esconde o tooltip
        });
  
        // Atualiza a posição do tooltip ao mover o mouse
        $(svgDoc).on("mousemove", function(e) {
            tooltip.css({
                top: e.pageY -50,  
                left: e.pageX-50 
            });
        });
  
        // Evento de clique em um estado
        $paths.on("click", function() {
            const stateName = $(this).attr("name");  // Pega o nome do estado
            $("#search-input").val(stateName);  // Preenche a barra de pesquisa com o nome do estado
            $('#search-input').trigger('input');  // Dispara o evento de input manualmente
        });
    });
  });