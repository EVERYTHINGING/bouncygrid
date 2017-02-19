(function($) {
	$(function(){

		//todo
		//1. fix fast clicking bugs
		//2. see if translate3d works better for grid transforms than top, left

		var $window = $(window);
		var $body = $('body');
		
		var boxMultipleWidth = $window.width()/$('.box').first().outerWidth();
		var boxMultipleHeight = $window.height()/$('.box').first().outerHeight();
		var openScale = 0.95;
		var scale = openScale*boxMultipleWidth;

		$('.box').each(function(index, value){
			var $box = $(this);
			var rgb = [255, Math.floor(Math.random()*255), Math.floor(Math.random()*255)];
			rgb.sort(function() { return 0.5 - Math.random() });

			$box.css({'background-color': 'rgb('+rgb[0]+', '+rgb[1]+', '+rgb[2]+')'});
			$box.attr('id', 'box-'+index);
		});

		$('.box').click(function(e){
			e.stopPropagation();
			openBox($(this));
		});

		function openBox($box){
			var $grid = $box.parent('.grid');

			if($grid.data('selected-box'))
			{
				var $selectedBox = $('#'+$grid.data('selected-box'));

				if($selectedBox.is($box)){ closeBox($box); return; }
				closeBox($selectedBox);
				openBox($box);
			}else{
				var $viewport = $grid.parents('.box').eq(0);
				var viewportOffsetTop = 0;
				var viewportOffsetLeft = 0;

				if($viewport.length == 0){ 
					$viewport = $window;
				}else{
					viewportOffsetTop = $viewport.offset().top;
					viewportOffsetLeft = $viewport.offset().left;
				}

				console.log(viewportOffsetTop, viewportOffsetLeft);

				$grid.data('scale', scale);
				$grid.stop(true, true).animate({
					top: (((-1*($box.offset().top))*scale)+$viewport.scrollTop()) + (($viewport.height()-($box.outerHeight()*scale))/2) + viewportOffsetTop,
					left: (((-1*($box.offset().left))*scale)+(($viewport.width() - ($box.outerWidth()*scale))/2)) + viewportOffsetLeft,
					width: $grid.width()*scale,
					height: $grid.height()*scale
				}, 600, 'easeOutElastic');


				$grid.data('selected-box', $box.attr('id'));
				$box.addClass('open');
				$body.css({ overflow: 'hidden' });	

				if($box.find('.grid').length){
					$grid.removeClass('active');
					$box.find('.grid').addClass('active');
				}
			}
		}

		function closeBox($box){
			var $grid = $box.parent('.grid');
			
			$grid.animate({
				top: 0,
				left: 0,
				width: $grid.width()/$grid.data('scale'),
				height: $grid.height()/$grid.data('scale')
			}, 800, 'easeOutElastic', function(){
				$grid.css({ width: "100%", height: "auto" });
			});

			$grid.data('selected-box', null);
			$box.removeClass('open');
			$grid.removeClass('active');

			if($grid.parents('.grid').length == 0){
				$body.css({ overflow: 'auto' });
				$grid.addClass('active');
			}
		}

		$('.project__close-btn').click(function(e){
			e.stopPropagation();
			closeBox($(this).parents('.box').eq(0));
		});

		
		function onResize(){
			scale = boxMultipleWidth*openScale;
			
			if($window.width() > $window.height()){
				scale = boxMultipleHeight*openScale;
			}
		}

		$window.resize(function(){
			onResize();
		});

		onResize();
		
		
	});
})(jQuery);