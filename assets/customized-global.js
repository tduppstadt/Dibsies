$(document).ready(function(){







	// ______________________________________________________________
    //                                                      showModal
    window.showModal = function(template) {
        $("#generalModal").html(template).modal();       
    };

    // ______________________________________________________________
    //                                                assignListeners
    var assignListeners = function() {

        // DIBSIES On The DOUBLE info
        $("body").on("click", ".js-d-on-d-info", function(){
            var template = $("#modal-dibsies-on-double").html();
            window.showModal(template);            
        });
        
        // preview
        $("body").on("click", ".js-personalize-btn", function(){
            var template = $("#modal-product-preview").html();
            window.showModal(template);  

            // from product-pz-snippet.liquid
            window.LiquidJsProduct();

            $('.modal-product-preview .gallery').on('initzoomorlightbox', function(){
            
              //Zoom
              if($(this).hasClass('mode-zoom')) {
                var opts = {};
                $.extend(opts, thumbZoomOptions);
                opts.blockClicks = true;
                $(this).find('.main a').jqzoom(opts);
              }
              //LB
              $(this).find('.main a').slimbox();
            }).trigger('initzoomorlightbox');

        });

    };
    assignListeners();
});