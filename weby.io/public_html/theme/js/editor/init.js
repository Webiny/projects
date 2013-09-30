/** This is an Editor bootstrap process */

var weby = null;
var contentValidator = null;
var tagFinder = null;
var onboardingComplete = null;
var disabledTools = null;

function instantiateGooglePicker(){
	google.load('picker', '1');
}

$(function () {

	function _loadApp(){
		// Load config data
		contentValidator = $('[data-role="content-validator"]').text();
		tagFinder = $('[data-role="tag-finder"]').text();
		onboardingComplete = $('[data-role="onboarding-complete"]').text();
		weby = JSON.parse($('[data-role="weby"]').html());
		disabledTools = JSON.parse($('[data-role="disabled-tools"]').html());
		$('.bootstrap').remove();

		// Initialize app
		App = new AppClass();
		App.setContentValidator(contentValidator);
		WebyTitleDialog.TAG_FINDER = tagFinder;
		if (!onboardingComplete) {
			App.addEventListener(new Intro());
		}
		App.init();
	}

	if(checkBrowser("weby_browser_editor", function(){
		_loadApp();
	})){
		_loadApp();
	}
});
