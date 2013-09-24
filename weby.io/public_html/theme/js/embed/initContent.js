function WebyInit() {
	// Log embedded Weby hit
	$.ajax({
		url: WEB + 'tools/embedded-hit/'+weby.id+'/',
		method: 'POST',
		async: true
	});

	// Load content
	$('#workspace').show();
	App = new AppClass();
	App.noHeader(true).init();
}