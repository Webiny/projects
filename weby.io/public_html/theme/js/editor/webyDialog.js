/**
 * Shows Weby dialog (Weby name, tags)
 * @constructor
 */

function WebyTitleDialog() {

    App.addEventListener(this);

    var _dialogOpener = $('[data-role="weby-title"]');
    var _webyDialog = $('#weby-dialog');
    var _titleInput = $('#weby-title-field');
    var _tagsWrapper = $('#weby-tags-wrapper');
    var _tagsInput = $('#weby-tag-input');
    var _tagsData = $('.weby-tags');
    var _descriptionInput = $('#weby-description-field');
    var _tagsDropdown = $('#weby-tags-dropdown');
    var _tagsList = $('#tags-list');
    var _tagsLog = {};
    var _editing = false;
    var _timer = false;

    var init = function () {
        _bindDialogGeneralActions();
        _bindTagsFocus();
        _bindTagSearching();
        _bindRemoveTag();
        _checkTitle();
    }

    /**
     * If title is empty, then automatically show dialog to fill this information
     * @private
     */
    var _checkTitle = function () {
        if (App.getWeby().getTitle() == '') {
            _dialogOpener.click();
        }
    }

    /**
     * Binding general actions (save, close, open)
     * @private
     */
    var _bindDialogGeneralActions = function () {
        // Opening dialog
        _dialogOpener.click(function () {
            _editing = true;
            $.fancybox(_webyDialog, {
                modal: false,
                type: 'inline',
                width: 500,
                height: 'auto',
                autoSize: false,
                afterClose: function () {
                    _clearTagsInput();
                    _cancelAllChanges();
                }
            });
        });

        // Closing dialog
        $('[data-role="weby-dialog-close"]').click(function () {
            if (_titleInput.val() != '') {
                $.fancybox.close();
                _editing = false;
                _clearTagsInput();
                _cancelAllChanges();
            }
        });

        // Save button
        $('[data-role="weby-dialog-save"]').click(function () {
            if (_titleInput.val() != '') {
                _editing = false;
                App.getWeby().setTitle(_titleInput.val());
                App.getWeby().setTags(generateTagsJson());
                App.getWeby().setDescription(_descriptionInput.val());

                App.getWeby().save(false, {tagLog: _tagsLog});
                $.fancybox.close();
                _clearTagsInput();
            } else {
                console.log('save first!!')
            }
        });

    }

    /**
     * Bind tag searching
     * @private
     */
    var _bindTagSearching = function () {
        _tagsInput.on('input', function () {
            var search = $(this).text();
            if (_timer) {
                clearTimeout(_timer);
            }

            _timer = setTimeout(function () {
                _requestTags(search)
            }, 600)
        });
    }

    /**
     * Sends request to search tags and shows results (duplicate values won't be shown)
     * @param search
     * @private
     */
    var _requestTags = function (search) {
        if (search.length > 2) {
            if (_tagsData.find('span.weby-tag').length < 10) {
                var duplicateTag, maxTags = 5, totalTags = 0;
                $.ajax({
                    url: WEB + 'tools/tags/?search=' + search,
                    success: function (response) {
                        if (response) {
                            _tagsList.empty();
                            for (var i in response) {
                                duplicateTag = false;
                                var currentTags = _tagsData.find('.weby-tag');
                                if (currentTags.length > 0) {
                                    currentTags.each(function () {
                                        if ($(this).attr('data-tag') == response[i].tag) {
                                            duplicateTag = true;
                                            return false;
                                        }
                                    });
                                }
                                if (!duplicateTag) {
                                    _tagsList.append('<li data-tag="' + response[i].tag + '" data-id="' + response[i].id + '">' + response[i].tag + '</li>')
                                    totalTags++;
                                }
                                if (totalTags == maxTags) {
                                    break;
                                }
                            }
                            if (totalTags > 0) {
                                _tagsDropdown.css('top', _tagsWrapper.height() + 20);
                                _tagsDropdown.show();
                            }
                        } else {
                            _tagsDropdown.hide();
                        }
                        _timer = false;
                    }
                });
            } else {
                console.log('Over 10')
            }
        } else {
            if (search.length == 0) {
                _clearTagsInput();
            }
        }
    }

    /**
     * Focus on input (contentEditable div) when clicking anywhere on field
     * @private
     */
    var _bindTagsFocus = function () {
        _tagsWrapper.click(function () {
            _tagsInput.focus();
        })
    }

    /**
     * Generates JSON out of added span items (tags)
     * @returns {Array}
     */
    var generateTagsJson = function () {
        var json = [];
        _tagsData.find('span').each(function () {
            var current = $(this);
            json.push({id: current.data('id'), tag: current.data('tag')});
        });
        return json;
    }

    /**
     * Refreshes span tags (because of inserting data-id for newly created tags)
     */
    var _refreshTagData = function (data) {
        _tagsData.empty();
        for (var i in data) {
            _tagsData.append('<span data-tag="' + data[i].tag + '" data-id="' + data[i].id + '"class="weby-tag">' + data[i].tag + '<span class="remove-tag"></span>');
        }
    }

    /**
     * Puts tag into added list, hides suggested tags list and clears input
     * @param id
     * @param tag
     */
    var addToList = function (id, tag) {
        _tagsData.append('<span data-tag="' + tag + '" data-id="' + id + '"class="weby-tag">' + tag + '<span class="remove-tag"></span></span>');
        _incrementTag(tag)
    }

    /**
     * Clears input, tag list and hides tags dropdown div
     * @private
     */
    var _clearTagsInput = function () {
        _tagsInput.text('');
        _tagsList.empty();
        _tagsDropdown.hide();
        clearTimeout(_timer);
    }

    var _bindRemoveTag = function () {
        _tagsData.on('click', 'span.remove-tag', function () {
            var tag = $(this).closest('span.weby-tag');
            _decrementTag(tag.attr('data-tag'));
            tag.remove();
        })
    }

    /**
     * Increments count for given tag
     * @param tag
     */
    var _incrementTag = function (tag) {
        _checkTag(tag);
        ++_tagsLog[tag];
        _checkTag(tag);
    }

    /**
     * Decrement count
     * @param tag
     */
    var _decrementTag = function (tag) {
        _checkTag(tag);
        --_tagsLog[tag];
        _checkTag(tag);
    }

    var _checkTag = function (tag) {
        if (typeof _tagsLog[tag] == 'undefined') {
            _tagsLog[tag] = 0;
            return;
        }
        if (_tagsLog[tag] == 0) {
            delete _tagsLog[tag];
        }
    }

    /**
     * When user presses "Enter" on tags input, insert new tag into added list
     */
    _tagsInput.keypress(function (e) {
        var event = e || window.event;
        var charCode = event.which || event.keyCode;
        switch (charCode) {
            case 13:
                if (_timer == false && _tagsList.find('li').length > 0) {
                    addToList(_tagsList.find('li:first').data('id'), _tagsList.find('li:first').data('tag'));
                    _clearTagsInput();
                } else {
                    e.preventDefault();
                }
                break;
        }
    });

    /**
     * When user clicks on tag in a dropdown list, add selected tag to added list
     */
    _tagsList.on('click', 'li', function () {
        addToList($(this).data('id'), $(this).data('tag'));
        _clearTagsInput();
    });

    var _cancelAllChanges = function () {
        _titleInput.val(App.getWeby().getTitle());
        _descriptionInput.val(App.getWeby().getDescription());
        _refreshTagData(App.getWeby().getTags());
        _tagsLog = {};
    }

    this.webyLoaded = function () {
        init();
    }

    /**
     * Callback after Weby has been saved
     * If editing, don't refresh span tags here
     * @param data
     */
    this.webySaved = function (data) {
        if (_editing) {
            return;
        }
        // Refresh interface
        App.getWeby().getWebyTitle().setTitle(data.title);
        App.getWeby().getWebyTitle().setUrl(data.publicUrl);
        App.getWeby().getWebyTitle().setFullUrl(data.publicUrl);
        App.getWeby().getWebyTitle().setEmbedCode(data.publicUrl);
        _refreshTagData(data.tags);
        _editing = false;
        _tagsLog = {};
    }
}