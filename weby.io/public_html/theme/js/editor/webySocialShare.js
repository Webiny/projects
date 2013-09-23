function SocialShare() {
    // Share buttons
    var facebookBtn = $('[data-role="facebook-share"]');
    var googleBtn = $('[data-role="gplus-share"]');
    var twitterBtn = $('[data-role="twitter-share"]');

    var _noWidgetsDialog = $('script#no-widgets-dialog').html();

    /**
     * Event handler - Facebook share button
     * @private
     */
    var _bindFacebookShare = function () {
        facebookBtn.click(function () {
            if (_webyHasMinRequirements()) {
                window.open(
                    'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(App.getWeby().getPublicUrl() +
                        '?utm_source=share-facebook&utm_medium=social&utm_campaign=' + App.getWeby().getSlug() + '-' + App.getWeby().getId()),
                    'facebook-share-dialog', 'width=626,height=436');
            }
        });
    }

    /**
     * Event handler - Twitter share button
     * @private
     */
    var _bindTwitterShare = function () {
        twitterBtn.click(function () {
            if (_webyHasMinRequirements()) {
                window.open(
                    'http://twitter.com/intent/tweet?source=sharethiscom&text=' +
                        App.getWeby().getTitle() +
                        ' via @WebyIO&url=' + encodeURIComponent(App.getWeby().getPublicUrl() +
                        '?utm_source=share-twitter&utm_medium=social&utm_campaign=' + App.getWeby().getSlug() + '-' + App.getWeby().getId()),
                    'twitter-share-dialog', 'width=626,height=270');
            }
        });
    }

    /**
     * Event handler - Google share button
     * @private
     */
    var _bindGoogleShare = function () {
        googleBtn.click(function () {
            if (_webyHasMinRequirements()) {
                window.open(
                    'https://plus.google.com/share?url=' + encodeURIComponent(App.getWeby().getPublicUrl() +
                        '?utm_source=share-google&utm_medium=social&utm_campaign=' + App.getWeby().getSlug() + '-' + App.getWeby().getId()),
                    'google-share-dialog', 'width=500,height=450');
            }
        });
    }


    /**
     * Check if current Weby is empty
     */
    var _webyIsEmpty = function () {
        var numberOfWidgets = Object.keys(App.getWeby().getWidgets()).length;
        if (numberOfWidgets == 0) {
            return true;
        } else {
            return false;
        }
    }


    /**
     * Checks if Weby has all neccessary data to make it public
     */
    var _webyHasMinRequirements = function () {
        if (_webyIsEmpty()) {
            $.fancybox(_noWidgetsDialog);
            return false;
        }
        if (App.getWeby().getMetaFollow() == 0) {
            $('[data-role="weby-title"]').click();
            $('[data-role="weby-dialog-save"]').click();
            return false;
        }
        return true;
    }


    /**
     * Bind event handlers
     */
    _bindFacebookShare();
    _bindTwitterShare();
    _bindGoogleShare();
}

$(function () {
    new SocialShare();
});
