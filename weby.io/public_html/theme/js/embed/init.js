$(window).resize(function () {
	var viewportWidth = $(window).width();
	var viewportHeight = $(window).height();
	$('.loading-overlay, .embed-background').css({
		height: viewportHeight - 125,
		width: viewportWidth
	});
	$('.loading-title').css({
		top: ($('.loading-overlay').height() / 2 - $('.loading-title').outerHeight(true) / 2) - 10 + 'px',
		left: ($('.loading-overlay').width() / 2 - $('.loading-title').outerWidth(true) / 2) + 'px'
	});
});

$(function () {
	$('#workspace').hide();
	$(window).resize();
	$('#playWeby').click(function () {
		var scripts = $.trim($('#lazyLoad').html()).replace('<!--', '');
		scripts = $.trim(scripts.replace('-->', ''));
		$(this).html("Preparing Weby...");
		$('head').prepend(scripts);
	});
	$('#initScript').remove();
});