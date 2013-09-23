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
        {element: $('#weby-content'), text: 'This is the area where you can put content. Here you can drop widgets, style them, move, do whatever you like!', position: 'right'},
        {element: $('#toolbar'), text: 'These are the widgets you can use, just pick one and drag it to the workspace! It\'s that easy!', position: 'right'},
        {element: $('#weby-toolbar-wrapper'), text: 'Once you insert a widget, you can manipulate them using these buttons.', position: 'left'},
        {element: $('div.header-middle'), text: 'This is your Weby name and URL which you can share with the rest of the world...', position: 'bottom'},
        {element: $('#social-sharing'), text: '...or you can do it also with a single click using social networks! How cool is that?', position: 'bottom'},
        {element: $('li.my-webies'), text: 'From here you can check your Webies and create new ones! Create as many as you like!', position: 'right'},
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
        $('[data-role="close-introduction"]').click(function () {
            $.fancybox.close();
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
                        }, 300);
                        break;
                    case steps.length - 1: // Last item
                        setTimeout(function () {
                            $('.introjs-skipbutton').show();
                            $('.introjs-nextbutton').hide();
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