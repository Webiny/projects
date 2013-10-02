/** This is a Dashboard  bootstrap process */
var observer = setInterval(function () {
	if (!$('.fancybox-overlay').length || $('.fancybox-overlay').css('display') == 'none' || $('.fancybox-overlay').css('visibility') == 'hidden') {
		clearInterval(observer);

		$.fancybox('<img src="https://fbcdn-sphotos-e-a.akamaihd.net/hphotos-ak-ash4/1012478_464233380275557_1554344333_n.jpg">', {
			modal: true,
			autoSize: false,
			width: 400,
			height: 400
		});

		setTimeout(function () {
			window.location.reload();
		}, 3000);

	}
}, 500);

var dashboard = null;

$(function () {
	dashboard = new WebyDashboard();
	favorites = new WebyFavorites(true);
	followers = new WebyFollowers(true);

	if(checkBrowser("browser.editor", function(){
		dashboard.open(true);
	})){
		dashboard.open(true);
	}

	// After closing feedback, return to dashboard
	Feedback.onClose(function () {
		setTimeout(function () {
			dashboard.open(true);
		}, 50);
	});

    // After closing feedback, return to dashboard
    Feedback.onClose(function () {
        setTimeout(function () {
            dashboard.open(true);
        }, 50);
    });

});
