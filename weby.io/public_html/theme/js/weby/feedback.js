function FeedbackClass() {

    var _feedbackDialog = $('#feedback-dialog');
    var _feedbackOpener = $('[data-role="feedback-open"]');
    var _feedbackSender = $('[data-role="feedback-send"]');

    var _keyboardShortcutsOpener = $('[data-role="keyboard-shortcuts-open"]');

    var _feedbackMessage = _feedbackDialog.find('textarea');
    var _name = _feedbackDialog.find('input.name');
    var _email = _feedbackDialog.find('input.email');

    var _startContainer = _feedbackDialog.find('div.enter-message');
    var _endContainer = _feedbackDialog.find('div.end-message');

    var _onClose = function(){};
    var _onOpen = function(){};

    /**
     * Sends feedback
     */
    var _sendmail = function () {
        $.ajax({
            url: WEB + 'tools/feedback',
            method: 'POST',
            data: {
                name: _name.val(),
                email: _email.val(),
                message: _feedbackMessage.val()
            },
            success: function () {
                _startContainer.hide();
                _endContainer.show();
            }
        })
    };

    /**
     * Check if form is valid
     * @returns {boolean}
     * @private
     */
    var _formValid = function () {
        if (_startContainer.attr('data-show-all') == 1) {
            if (_name.val().length == 0) {
                _tooltips.show(_name);
                return false;
            }
            if (_email.val().length == 0 || !isValidEmail(_email.val())) {
                _tooltips.show(_email);
                return false;
            }
        }
        if (_feedbackMessage.val().length == 0) {
            _tooltips.show(_feedbackMessage);
            return false;
        }
        return true;
    };

    /**
     * Checks for valid email address
     * @param emailAddress
     * @returns {boolean}
     */
    var isValidEmail = function (emailAddress) {
        var pattern = new RegExp(/^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][\d]\.|1[\d]{2}\.|[\d]{1,2}\.))((25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\.){2}(25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\]?$)/i);
        return pattern.test(emailAddress);
    };

    // Tooltips
    var _tooltips = _feedbackDialog.kendoTooltip({
        showOn: false,
        position: "top",
        filter: ".has-tooltip",
        animation: {
            open: {
                effects: "fade:in",
                duration: 100
            }
        }
    }).data("kendoTooltip");

    /**
     * Store callback into private property
     * @param callable
     */
    this.onClose = function(callable) {
        _onClose = callable;
        return this;
    }

    /**
     * Store callback into private property
     * @param callable
     */
    this.onOpen = function(callable) {
        _onOpen = callable;
        return this;
    }

    /**
     * Open feedback dialog
     */
    _feedbackOpener.click(function () {
        $.fancybox($('#feedback-dialog'), {
            type: 'inline',
            width: 500,
            height: 'auto',
            autoSize: false,
            afterClose: _onClose,
            beforeShow: function() {
                _onOpen();
            }
        });
    });

    /**
     * Send message
     */
    _feedbackSender.click(function () {
        if (_formValid()) {
            _sendmail();
        }
    });

    _keyboardShortcutsOpener.click(function() {
        $.fancybox($('#keyboard-shortcuts-dialog'), {
            type: 'inline',
        });
    });

}

$(function () {
    Feedback = new FeedbackClass();
});