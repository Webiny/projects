/** This is an Editor bootstrap process */

var weby = null;
var data = null;

$(function () {
	// Load config data
	weby = JSON.parse($('[data-role="weby"]').html());
	data = JSON.parse($('[data-role="json-data"]').html());
	$('.bootstrap').remove();

	var html = new kendo.template($('#weby-details-tpl').html());
	$('body').append(html(data));
	$('#weby-details-tpl').remove();
	new WebyDetails();

	$('[data-role="facebook-share"] .social-counter').text(data.shareCount.facebook);
	$('[data-role="twitter-share"] .social-counter').text(data.shareCount.twitter);
	$('[data-role="gplus-share"] .social-counter').text(data.shareCount.google);
	$('.username').text(data.currentUser.name);
	$('.user-photo').css({background: 'url('+data.currentUser.avatar+') top left', backgroundSize: 'cover'});

	$(function () {
		App = new AppClass();
		App.init();
	});
});
