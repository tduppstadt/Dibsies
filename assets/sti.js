(function ( $ ) {
	"use strict";
	
	$.fn.sti = function( options ) {
	
		var opts = $.extend({
			selector: 'img',
			dontshow: '.dontshow',
			title: '',
			summary: '',
			minWidth: 200,
			minHeight: 200,
			fb_app: '',
			scroll: true,
			align: { x: 'left', y: 'top' },
			offset: { x: 0, y: 0 },
			orientation: 'vertical',
			style: 'box',
			sharer: 'http://proplugin.net/api/sharer.php',
			is_mobile: false,
			primary_menu: [ "facebook", "twitter", "google", "linkedin", "pinterest" ],	
        }, options );
		
		var methods = {
		
			setStyle: function(e) {
				var output = "",
					value,
					cssStyles = [ 'margin-top', 'margin-bottom', 'margin-left', 'margin-right', 'position', 'top', 'bottom', 'left', 'right', 'float', 'max-width', 'width', 'height' ];
							  
				for ( var i=0;i<cssStyles.length;i++ ) {		
					var style = cssStyles[i];
					
					if ( style === "position" && e.css( style ) === "static" ){ 
						value = "relative";
					}
					else if ( style === "display" && e.css( style ) === "inline" ) {
						value = "inline-block";
					}
					else if ( style === "display" && e.css( style ) === "none" ) {
						return;
					}
					else if ( style === "width" ) {
						value = '' + e.outerWidth() + 'px';
					}
					else if ( style === "height" ) {
						value = '' + e.outerHeight() + 'px';
					}
					else { 
						value = e.css( style );
					}
					
					output += style + ':' + value + ';';
				}
			
				return output;
			},
			
			setBoxStyle: function(e) {
				var output = "",
					value,
					value_plus,
					box_style,
					cssStyles = [ 'padding-' + opts.align.y, 'padding-' + opts.align.x ];
					
				for ( var i=0;i<cssStyles.length;i++ ) {	
					var style = cssStyles[i];					
					
					if ( style === 'padding-' + opts.align.y ) {
						value_plus = opts.offset.y;
						box_style = opts.align.y;
					} else {
						value_plus = opts.offset.x;
						box_style = opts.align.x;
					}
					
					value = parseInt( e.css( style )) + value_plus;

					output += box_style + ':'+ value + 'px;';
				}
				
				return output;
			},
			
			createImgHash: function( str ) {				
				var character,
					hash,
					i;
							
				if( !str ) { return ""; }
						
				hash = 0;
						
				if ( str.length === 0 ) { return hash; }
						
				for( i=0;i<str.length;i++ ) {
					character = str[i];
					hash = methods.hashChar( str,character,hash );
				}
						
				hash = Math.abs( hash ) + "";
						
				return hash.substring(0,5);
						
			},
		
			hashChar: function( str,character,hash ) {				
				hash = ( hash<<5 ) - hash + str.charCodeAt( character );					
				return hash&hash;					
			},
			
			scrollToImage: function(el) {			
				
				if (!opts.scroll) { return; }
				if (location.hash === "") { return; }
					
				var hash = location.hash.substring(1);
				
				return el.each(function() {
					var media = $(this).data('media') ? $(this).data('media') : $(this).attr('src');	
				    if (hash === methods.createImgHash(media)) {				
						$('html, body').animate({
						    scrollTop: $(this).offset().top
						}, 1000);
						return false;
				    }
				});
				
			},
			
			shareButtons: function() {
			
				var buttonsList = '';
			
				for ( var i=0;i<opts.primary_menu.length;i++ ) {
					var network = opts.primary_menu[i];
					buttonsList += '<span class="sti-btn sti-' + network +'-btn" data-network="' + network + '" rel="nofollow">Share</span>';
				}
				
				return buttonsList;
				
			},
			
			showMobile: function(el) {
			
				var e = $(el);
				
				if ( opts.dontshow !== '' && e.is( opts.dontshow ) ) return false;
				if ( e.width() < opts.minWidth || e.height() < opts.minHeight ) return false;
				if ( e.closest('.sti').length > 0 ) return false;
				
				e.addClass('sti_reset');
				e.wrap('<div class="sti ' + opts.orientation + ' style-' + opts.style + ' sti-mobile" style="' + methods.setStyle(e) + '"></div>');
				e.after('<span class="sti-mobile-btn" style="' + methods.setBoxStyle(e) + '"></span>');
				e.after('<span class="sti-share-box" style="' + methods.setBoxStyle(e) + '">' + methods.shareButtons() + '</span>');
			
			},
			
			showShare: function(el) {
			
				var e = $(el);
				
				if ( opts.dontshow !== '' && e.is( opts.dontshow ) ) return false;
				if ( e.width() < opts.minWidth || e.height() < opts.minHeight ) return false;
				if ( e.closest('.sti').length > 0 ) return false;
				
				e.addClass('sti_reset');
				e.wrap('<div class="sti ' + opts.orientation + ' style-' + opts.style + '" style="' + methods.setStyle(e) + '"></div>');
				e.after('<span class="sti-share-box" style="' + methods.setBoxStyle(e) + '">' + methods.shareButtons() + '</span>');
					
			},
			
			hideShare: function(el) {
			
				var e = $(el);
	
				e.find('.sti-share-box').remove();
				e.find('.sti_reset').unwrap().removeClass('sti_reset');
				
			},
			
			windowSize: function( network ) {
			
				switch( network ) { 			
					case "facebook" : return "width=670,height=320";
					break;
					
					case "twitter" : return "width=626,height=252";
					break;
					
					case "google" : return "width=520,height=550";
					break;
					
					case "linkedin" : return "width=620,height=450";
					break;
					
					case "delicious" : return "width=800,height=600";
					break;
					
					default: return "width=800,height=350";
					
				}	
				
			},
			
			replaceChars: function(string) {
				return string.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
			},
			
			shareData: function(el, network) {
			
				var data    = {},
					e       =  $(el).closest('.sti').find('.sti_reset');
					
				data.w_size   =  methods.windowSize( network );	
				data.media    =  e.data('media') ? e.data('media') : e[0].src;
				data.hash     =  opts.scroll ? '#' + methods.createImgHash( data.media ) : '';	
				data.title    =  e.data('title') ? e.data('title') : ( e.attr('title') ? e.attr('title') : ( opts.title ? opts.title : document.title ) );
				data.summary  =  e.data('summary') ? e.data('summary') : ( e.attr('alt') ? e.attr('alt') : ( opts.summary ? opts.summary : '' ) );
				data.local    =  location.href.replace(/\?img.*$/, '').replace(/\&img.*$/, '').replace(/#.*$/, '');
				data.schar    =  ( data.local.indexOf("?") != -1 ) ? '&' : '?';
				data.link     =  data.local + data.hash;
				data.page     =  opts.sharer + '?url=' + encodeURIComponent(data.link) + '&img=' + data.media.replace('http://','') + '&title=' + encodeURIComponent(methods.replaceChars(data.title)) + '&desc=' + encodeURIComponent(methods.replaceChars(data.summary)) + data.hash;				
				data.page2    =  opts.sharer + '?url=' + encodeURIComponent(data.link) + '&img=' + data.media.replace('http://','') + '&title=' + methods.replaceChars(data.title) + '&desc=' + methods.replaceChars(data.summary) + data.hash;
				
				methods.share(network, data);	

			},
			
			share: function(network, data) {			
				
				var url = '';
					
				switch( network ) {
				
					case "facebook" :
						if(opts.fb_app) {
						url += 'https://www.facebook.com/dialog/feed?';
						url += 'app_id=' + opts.fb_app;
						url += '&display=popup';
						url += '&link=' + encodeURIComponent(data.link);
						url += '&picture=' + encodeURIComponent(data.media);
						url += '&name=' + encodeURIComponent(data.title);
						url += '&description=' + encodeURIComponent(data.summary);	
						url += '&redirect_uri=' + encodeURIComponent(opts.sharer+'?close=1');						
						} else {
						url += 'http://www.facebook.com/sharer.php?s=100';
						url += '&p[url]=' + encodeURIComponent(data.page);
						}
                    	console.log ("facebook url:", url);
					break;	

					case "google" :
						url += 'https://plus.google.com/share?';
						url += 'url=' + encodeURIComponent(data.page);
					break;
					
					case "linkedin" :
						url += 'http://www.linkedin.com/shareArticle?mini=true';
						url += '&url=' + encodeURIComponent(data.page2);
					break;		
					
					case "vkontakte" :
						url += 'http://vk.com/share.php?';
						url += 'url=' + encodeURIComponent(data.link);
						url += '&title=' + encodeURIComponent(data.title);
						url += '&description=' + encodeURIComponent(data.summary);
						url += '&image=' + encodeURIComponent(data.media);
						url += '&noparse=true';
					break;
					
					case "odnoklassniki" :
						url += 'http://www.odnoklassniki.ru/dk?st.cmd=addShare&st.s=1';
						url += '&st.comments=' + encodeURIComponent(data.title);
						url += '&st._surl=' + encodeURIComponent(data.page);
					break;
					
					case "twitter" :
						url += 'http://twitter.com/share?';
						url += 'text=' + encodeURIComponent(data.title);
						url += '&url=' + encodeURIComponent(data.link);
						url += '&counturl=' + encodeURIComponent(data.link);
					break;

					case "pinterest" :
						url += 'http://pinterest.com/pin/create/button/?';
						url += 'url=' + encodeURIComponent(data.link);
						url += '&media=' + encodeURIComponent(data.media);
						url += '&description=' + encodeURIComponent(data.title);
					break;	
					
					case "tumblr" :
						url += 'http://www.tumblr.com/share/photo?';
						url += 'source=' + encodeURIComponent(data.media);
						url += '&caption=' + encodeURIComponent(data.summary);
						url += '&click_thru=' + encodeURIComponent(data.link);
					break;	
					
					case "reddit" :
						url += 'http://reddit.com/submit?';
						url += 'url=' + encodeURIComponent(data.link);
						url += '&title=' + encodeURIComponent(data.title);
						url += '&text=' + encodeURIComponent(data.summary);
					break;	
					
					case "digg" :
						url += 'http://digg.com/submit?phase=2&';
						url += 'url=' + encodeURIComponent(data.link);
						url += '&title=' + encodeURIComponent(data.title);
						url += '&bodytext=' + encodeURIComponent(data.summary);
					break;
					
					case "delicious" :
						url += 'http://delicious.com/post?';
						url += 'url=' + encodeURIComponent(data.link);
						url += '&title=' + encodeURIComponent(data.title);
					break;
					
				}
				
				methods.openPopup(url, data.w_size);
				
			},
			
			openPopup: function(url, w_size) {		
				window.open( url, 'Share This Image', w_size + ',status=0,toolbar=0,menubar=0,location=1,scrollbars=1' );								
			},
			
		};
		
		if ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
			opts.is_mobile = true;
		}
		
		if ( !opts.is_mobile ) {
			
			$('body').on('mouseenter', opts.selector, function(e) {
				e.preventDefault();
				methods.showShare(this);
			});
				
			$('body').on('mouseleave', '.sti', function(e) {
				e.preventDefault();
				methods.hideShare(this);
			});
		
		} else {
		
			this.each(function() {		
				methods.showMobile(this);
			});
			
			$('.sti-mobile-btn').on('click', function(e) {
				e.preventDefault();
				$(this).closest('.sti').addClass('sti-mobile-show');
			});
			
			$(opts.selector).on('click', function(e) {
				$(this).closest('.sti').removeClass('sti-mobile-show');
			});
		
		}
		
		$('body').on('click', '.sti-btn', function(e) {
			e.preventDefault();
            e.stopPropagation();
			
			var network = $(this).data('network');
			
			methods.shareData(this, network);
				
        });
		
		methods.scrollToImage(this);
	
	};
	 
}( jQuery ));