$(document).ready(function() {
    const svgObject = $("#mapa-svg");
  
    svgObject.on("load", function() {
        const svgDoc = svgObject[0].contentDocument;
        const $paths = $(svgDoc).find("path");  // Seleciona todos os caminhos (cidades/municípios)
        
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
  
        // Eventos de hover para paths (cidades)
        $paths.on("mouseenter", function() {
            const name = $(this).attr("id");
            const cidadeName = name.replaceAll("_", " ");  // Substitui "_" por espaço para o nome da cidade
            
            $(this).attr("fill", "#e6e6cf");  // Muda a cor do município ao passar o mouse
            tooltip.text(cidadeName);  // Atualiza o texto do tooltip com o nome da cidade
            tooltip.show()
        });
  
        $paths.on("mouseleave", function() {
            $(this).attr("fill", "#ccccb8");  // Restaura a cor original
            tooltip.hide();  // Esconde o tooltip
        });
  
        // Atualiza a posição do tooltip ao mover o mouse dentro do SVG
        $(svgDoc).on("mousemove", function(e) {
            tooltip.css({
                top: e.pageY - 10, 
                left: e.pageX 
            });
        });
  
        // Evento de clique em um município
        $paths.on("click", function() {
            const cidadeName = $(this).attr("id").replaceAll("_", " ");
            $("#search-input").val(cidadeName);  // Preenche a barra de pesquisa com o nome da cidade
            $('#search-input').trigger('input');  // Dispara o evento de input manualmente
        });
    });
  });
  