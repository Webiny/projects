function WebyInit() {
	// Log embedded Weby hit
	$.ajax({
		url: WEB + 'tools/embedded-hit/'+weby.id+'/',
		method: 'POST',
		async: true
	});

	// Build floating details
	var html = new kendo.template($('#weby-details-tpl').html());
	var data = JSON.parse($('[data-role="json-data"]').html());
	$('body').append(html(data));
	$('#weby-details-tpl').remove();
	new WebyDetails();

	// Load content
	$('#workspace').show();
	App = new AppClass();
	App.noHeader(true).init();
	$('.bootstrap').remove();
	$('.embed-background').remove();
}