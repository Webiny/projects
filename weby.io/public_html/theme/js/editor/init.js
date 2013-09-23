/** This is an Editor bootstrap process */

var weby = null;
var contentValidator = null;
var onboardingComplete = null;

function instantiateGooglePicker(){
	google.load('picker', '1');
}

$(function () {
	// Load config data
	contentValidator = $('[data-role="content-validator"]').text();
	onboardingComplete = $('[data-role="onboarding-complete"]').text();
	weby = JSON.parse($('[data-role="weby"]').html());
	//$('.bootstrap').remove();

	// Initialize app
	App = new AppClass();
	App.setContentValidator(contentValidator);
    if (!onboardingComplete) {
        App.addEventListener(new Intro());
    }
	App.init();
});
