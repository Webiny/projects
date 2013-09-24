/**
 * Used for making an introduction to newly registered users
 * @constructor
 */
function Intro() {

    var content = $('body.editor');
    var _introductionDialog = $('#introduction-dialog');

    content.append('<div id="weby-content" style="position:absolute; left: 50%; top: 50%"></div>');

    // Steps, add as many as you like, the order is applied as elements are inserted into steps array
    var steps = [
        {element: $('#weby-content'), text: '<h1>Canvas</h1>This is blank canvas on which you can place different widgets, style them, rotate, move or do whatever you like. Click on the “Canvas” button to change background image, put pattern, color or even YouTube video. ', position: 'right'},
        {element: $('#toolbar'), text: '<h1>Widgets</h1>These are different widgets you can use - just pick one and drag it to your canvas! After dragging, input the content (usually paste the link) you want to place on your “Weby”. Use last icon (arrow) to see more widgets. It’s that easy!', position: 'right'},
        {element: $('#weby-toolbar-wrapper'), text: '<h1>Layers & Weby Settings</h1>Once you insert your widget, you can manipulate them using these buttons. Use “Canvas” and “Document” to change background color, size etc. All with just few clicks...', position: 'left'},
        {element: $('div.header-middle'), text: '<h1>Your Weby Name</h1>This is your Weby name and URL which you can use to share it with your friends and the rest of the world...', position: 'bottom'},
        {element: $('#social-sharing'), text: '<h1>One-click sharing</h1>...or you can do it with a single click using social networks (you have to be logged in to Facebook or Twitter of course)', position: 'bottom'},
        {element: $('li.my-webies'), text: '<h1>My Webies</h1>Click on "My Webies" to quickly access your previously created “webies” or to create new ones. You can create as many as you like!', position: 'right'},
    ];

    // It gets all steps and attaches neccessary data tags to each one
    var init = function () {
        for (var i in steps) {
            steps[i].element.attr('data-step', i).attr('data-intro', steps[i].text).attr('data-position', steps[i].position);
        }

        // Open fancybox with welcome message!
        $.fancybox(_introductionDialog, {
            modal: true,
            type: 'inline',
            autoSize: false,
            width: 500,
            height: 'auto'
        });

        // If user clicks on "Start introduction" then fire it
        $('[data-role="start-introduction"]').click(function () {
            $.fancybox.close();
            _startIntro();
        });

        // If user clicks on "Skip" then just show editor
        $('[data-role="skip-introduction"]').click(function () {
            _introductionDialog.find('.overlay').show();
            _introductionDialog.find('.confirmation-message').show();
        });

        // If user clicks on "Skip" then just show editor
        $('[data-role="skip-confirm-yes"]').click(function () {
            $.ajax({
                url: WEB + 'user/intro-done'
            })
            $.fancybox.close();
        });

        // If user clicks on "Skip" then just show editor
        $('[data-role="skip-confirm-no"]').click(function () {
            _introductionDialog.find('.overlay').hide();
            _introductionDialog.find('.confirmation-message').hide();
        });

    };

    /**
     * Start intro tour
     * @private
     */
    var _startIntro = function () {
        // Start intro.js introduction

        introJs().start().setOptions({exitOnEsc: false, exitOnOverlayClick: false})
            .oncomplete(function () {
                $.ajax({
                    url: WEB + 'user/intro-done'
                })
            }).onchange(function (e) {
                $('span.username').css('border-top', '1px solid #fff');
                var step = parseInt($(e).attr('data-step'));
                switch (step) {
                    case 0:
                        $('.introjs-helperLayer').removeClass('highlighted');
                        break;
                    case 1:
                        $('.introjs-helperLayer').addClass('highlighted');
                        break;
                    case steps.length - 2: // Last item
                        setTimeout(function () {
                            $('.introjs-skipbutton').hide();
                            $('.introjs-nextbutton').show();
                            $('#introjs-examples').remove();

                            $('.introjs-prevbutton').show();
                            $('#introjs-restart').remove();

                        }, 300);
                        break;
                    case steps.length - 1: // Last item
                        setTimeout(function () {
                            $('.introjs-skipbutton').show().text('Create your first Weby');
                            $('.introjs-nextbutton').hide();
                            $('.introjs-skipbutton').before('<span class="introjs-button" id="introjs-restart">Start over</span>');

                            $('.introjs-prevbutton').hide();
                            $('.introjs-skipbutton').before('<a href="' + WEB + 'examples"><span class="introjs-button" id="introjs-examples">See examples</span></a>');
                        }, 300);
                        break;
                }
            });
    }

    // Callback function, intro will execute after Weby has been completely loaded
    this.webyLoaded = function (data) {
        init();
    }
}