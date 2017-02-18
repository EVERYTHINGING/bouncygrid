(function($) {
	$(function(){

		var $window = $(window);
		var $body = $('body');
		var $grid = $('.grid');
		
		var boxMultipleWidth = $window.width()/$('.box').first().outerWidth();
		var boxMultipleHeight = $window.height()/$('.box').first().outerHeight();
		var openScale = 0.95;
		var scale = openScale*boxMultipleWidth;

		var $selectedBox = null;

		$('.box').each(function(index, value){
			var rgb = [255, Math.floor(Math.random()*255), Math.floor(Math.random()*255)];
			rgb.sort(function() { return 0.5 - Math.random() });

			$(this).css({'background-color': 'rgb('+rgb[0]+', '+rgb[1]+', '+rgb[2]+')'});
		});

		$('.box').click(function(){
			openBox($(this));
		});

		function openBox($box){
			if($selectedBox)
			{
				if($selectedBox.is($box)){ closeBox($box); }
				closeBox($selectedBox);
				openBox($box);
			}else{
				$grid.data('scale', scale);
				$grid.stop(true, true).animate({
					top: (((-1*($box.offset().top))*scale)+$window.scrollTop()) + (($window.height()-($box.outerHeight()*scale))/2),
					left: ((-1*($box.offset().left))*scale)+(($window.width() - ($box.outerWidth()*scale))/2),
					width: $grid.width()*scale,
					height: $grid.height()*scale
				}, 600, 'easeOutElastic');


				$selectedBox = $box;
				$box.addClass('open');
				$body.css({ overflow: 'hidden' });	
			}
		}

		function closeBox($box){
			$grid.animate({
				top: 0,
				left: 0,
				width: $grid.width()/$grid.data('scale'),
				height: $grid.height()/$grid.data('scale')
			}, 800, 'easeOutElastic', function(){
				$grid.css({ width: "100%", height: "auto" });
			});

			$selectedBox = null;
			$box.removeClass('open');

			$body.css({ overflow: 'auto' });	
		}

		$('.project__close-btn').click(function(e){
			e.stopPropagation();
			closeBox($(this).parents('.box'));
		});

		
		function onResize(){
			scale = boxMultipleWidth*openScale;
			
			if($window.width() > $window.height()){
				scale = boxMultipleHeight*openScale;
			}

			if($selectedBox){ openBox($selectedBox); }
		}

		$window.resize(function(){
			onResize();
		});

		onResize();
		
		
	});
})(jQuery);