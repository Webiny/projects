/**
 * Shows Weby dialog (Weby name, tags)
 * @constructor
 */

function WebyTitleDialog(parent) {

    App.addEventListener(this);

    var _dialogOpener = $('[data-role="weby-title"]');
    var _webyDialog = $('#weby-dialog');
    var _titleInput = $('#weby-title-field');
    var _tagsWrapper = $('#weby-tags-wrapper');
    var _tagsInput = $('#weby-tag-input');
    var _tagsData = $('.weby-tags');
    var _descriptionInput = $('#weby-description-field');
    var _descriptionLength = $('#weby-description-length');
    var _tagsDropdown = $('#weby-tags-dropdown');
    var _tagsList = $('#tags-list');
    var _tagsSearchValue = $('#tag-search-value');
    var _tagsLog = {};
    var _editing = false;
    var _timer = false;

    var _btnSave = $('[data-role="weby-dialog-save"]');

    // Tooltips
    var _tooltips = _webyDialog.kendoTooltip({
        showOn: false,
        position: "top",
        filter: ".has-tooltip",
        content: function (e) {
            var target = e.target; // the element for which the tooltip is shown
            return target.attr('data-tooltip'); // set the element text as content of the tooltip
        },
        animation: {
            open: {
                effects: "fade:in",
                duration: 100
            }
        }
    }).data("kendoTooltip");

    var init = function () {
        _bindDialogGeneralActions();
        _bindTagsFocus();
        _bindTagSearching();
        _bindRemoveTag();
        _descriptionLength.text(_calculateDescriptionLength());
    }

    // Calculates number of characters in description input field
    var _calculateDescriptionLength = function () {
        return (160 - _descriptionInput.val().length);
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
                    _editing = false;
                }
            });
            _titleInput.focus();
        });

        // Closing dialog
        $('[data-role="weby-dialog-close"]').click(function () {
            $.fancybox.close();
        });

        // Save button
        _btnSave.click(function () {
            if (_titleInput.val() != '') {
                _editing = false;
                App.getWeby().setTitle(_titleInput.val());
                App.getWeby().setMetaFollow(1);
                App.getWeby().setTags(generateTagsJson());
                App.getWeby().setDescription(_descriptionInput.val());

				parent.viewportResize();
                App.getWeby().save(false, {tagLog: _tagsLog});
                App.getDashboard().refreshDataSource();
                $.fancybox.close();
                _clearTagsInput();
            } else {
                _tooltips.show($('#weby-title-field'));
            }
        });

    }

    /**
     * Bind tag searching
     * @private
     */
    var _bindTagSearching = function () {
        _tagsInput.on('input', function () {
            _tagsSearchValue.val(_tagsInput.text());
            var search = _tagsSearchValue.val();
            _tagsWrapper.find('.load-icon').hide();
            _togglePlaceholder();
            if (search.length > 25) {
                _tooltips.show(_tagsInput);
                var restricted = search.substr(0, 25);
                $(this).text(restricted);
                setEndOfContenteditable(document.getElementById('weby-tag-input'));
            } else {
                _tooltips.hide(_tagsInput);
            }
            if (_timer) {
                clearTimeout(_timer);
            }

            _timer = setTimeout(function () {
                _requestTags(search)
            }, 300)
        });
    }

    // Checks if there is content (tags) - if no tags, show placeholder
    var _togglePlaceholder = function () {
        var search = _tagsInput.text();
        if (search.length == 0 && _tagsData.find('span').length == 0) {
            _tagsWrapper.find('.tags-placeholder').show();
        } else {
            _tagsWrapper.find('.tags-placeholder').hide();
        }
    }

    /**
     * Sets cursor to the end of content editable (holy shit)
     * @param contentEditableElement
     */
    var setEndOfContenteditable = function (contentEditableElement) {
        var range, selection;
        if (document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
        {
            range = document.createRange();//Create a range (a range is a like the selection but invisible)
            range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
            range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
            selection = window.getSelection();//get the selection object (allows you to change selection)
            selection.removeAllRanges();//remove any selections already made
            selection.addRange(range);//make the range you have just created the visible selection
        }
        else if (document.selection)//IE 8 and lower
        {
            range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
            range.moveToElementText(contentEditableElement);//Select the entire contents of the element with the range
            range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
            range.select();//Select the range (make it the visible selection
        }
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
                _tagsWrapper.find('.load-icon').show();
                $.ajax({
                    url: WebyTitleDialog.TAG_FINDER + '?tag='+$.trim(search)+'&t='+  new Date().getTime(),
                    success: function (response) {
                        _tagsWrapper.find('.load-icon').hide();
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
                                    _tagsList.append('<li class="suggested-tag" data-tag="' + response[i].tag + '" data-id="' + response[i].id + '">' + response[i].tag + '</li>')
                                    totalTags++;
                                }
                                if (totalTags == maxTags) {
                                    break;
                                }
                            }
                            if (totalTags > 0) {
                                _tagsDropdown.css('top', _tagsWrapper.height() + 20);
                                _tagsDropdown.show();
                            } else {
                                _tagsList.empty();
                                _tagsDropdown.hide();
                            }
                        } else {
                            _tagsDropdown.hide();
                        }
                        _timer = false;
                    }
                });
            } else {
                _tooltips.show($('#weby-tags-wrapper'));
            }
        } else {
            if (search.length == 0) {
                _clearTagsInput();
            } else {
                _tagsList.empty();
                _tagsDropdown.hide();
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
            _clearTagsInput();
            var tag = $(this).closest('span.weby-tag');
            _decrementTag(tag.attr('data-tag'));
            tag.remove();
            if (_tagsData.find('span.weby-tag').length == 0) {
                $('.tags-placeholder').show();
            }

        })

        _tagsData.on('click', '.weby-tag', function () {
            _decrementTag($(this).attr('data-tag'));
            $(this).remove();
            _clearTagsInput();
            if (_tagsData.find('span.weby-tag').length == 0) {
                $('.tags-placeholder').show();
            }

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

    /**
     * Checks if given tag exists in _tagsLog property (if status is zero, then delete it)
     * @param tag
     * @private
     */
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
     * Cancel all changes (revert title, description and tags)
     * @private
     */
    var _cancelAllChanges = function () {
        if (App.getWeby().getMetaFollow() == 1) {
            _titleInput.val(App.getWeby().getTitle());
        } else {
            _titleInput.val('');

        }
        _descriptionInput.val(App.getWeby().getDescription());
        _refreshTagData(App.getWeby().getTags());
        _togglePlaceholder();
        _tagsLog = {};
    }

    _titleInput.on('input', function () {
        if (_titleInput.val().length == 150) {
            _titleInput.attr('data-tooltip', 'Maximum 50 characters allowed.');
            _tooltips.refresh();
            _tooltips.show(_titleInput);
        }
        if (_titleInput.val().length < 150) {
            _tooltips.hide(_titleInput);
            _titleInput.attr('data-tooltip', 'Please enter your title.');
            setTimeout(function() {
                _tooltips.refresh();
            }, 200);
        }
    });

    /**
     * When user presses "Enter" on tags input, insert new tag into added list
     */
    _tagsInput.keydown(function (e) {
        var event = e || window.event;
        var charCode = event.which || event.keyCode;
        switch (charCode) {
            case 13: // Enter key
                if (_timer == false && _tagsList.find('li').length > 0) {
                    if (_tagsList.find('li.tag-selected').length == 0) {
                        addToList(_tagsList.find('li:first').data('id'), _tagsList.find('li:first').data('tag'));
                    } else {
                        addToList(_tagsList.find('li.tag-selected').data('id'), _tagsList.find('li.tag-selected').data('tag'));
                    }
                    _clearTagsInput();
                } else {
                    e.preventDefault();
                }
                break;
            case 40: // Arrow key (down)
                if (_tagsList.find('li').length > 0) {
                    e.preventDefault();
                    var suggestedTags = _tagsList.find('li');
                    var currentPosition = -1;
                    suggestedTags.each(function (i, e) {
                        if ($(this).hasClass('tag-selected')) {
                            currentPosition = i;
                            return false;
                        }
                    });
                    if ((currentPosition + 1) < suggestedTags.length) {
                        $(suggestedTags[currentPosition]).removeClass('tag-selected');
                        $(suggestedTags[currentPosition + 1]).addClass('tag-selected');
                    }
                }
                break;
            case 38: // Arrow key (up)
                if (_tagsList.find('li').length > 0) {
                    e.preventDefault();
                    var suggestedTags = _tagsList.find('li');
                    var currentPosition = -1;
                    suggestedTags.each(function (i, e) {
                        if ($(this).hasClass('tag-selected')) {
                            currentPosition = i;
                            return false;
                        }
                    });
                    if (currentPosition > 0) {
                        $(suggestedTags[currentPosition]).removeClass('tag-selected');
                        $(suggestedTags[currentPosition - 1]).addClass('tag-selected');
                    }
                }
                break;
            case 8: // Backspace key (deleting tag)
                if (_tagsInput.text() == '' && _tagsData.find('span.weby-tag').length > 0) {
                    _decrementTag(_tagsData.find('span.weby-tag:last').attr('data-tag'));
                    _tagsData.find('span.weby-tag:last').remove();
                    if (_tagsData.find('span.weby-tag').length == 0) {
                        _tagsWrapper.find('.tags-placeholder').show();
                    }
                }
                break;
            case 27: // Esc key
                $.fancybox.close();
                break;
        }
    });

    _webyDialog.find('input, textarea').keydown(function (e) {
        var event = e || window.event;
        var charCode = event.which || event.keyCode;
        switch (charCode) {
            case 27: // Esc key
                $.fancybox.close();
                break;
        }
    });

    _webyDialog.find('input').keydown(function (e) {
        var event = e || window.event;
        var charCode = event.which || event.keyCode;
        switch (charCode) {
            case 13: // Enter key
                _btnSave.click();
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

    /**
     * When user hovers over an item in list, add appropriate class
     */
    _tagsList.on('mouseover', 'li.suggested-tag', function () {
        _tagsList.find('li').removeClass('tag-selected');
        $(this).addClass('tag-selected');
    });

    /**
     * When user clicks on tag in a dropdown list, add selected tag to added list
     */
    _descriptionInput.on('input', function (e) {
        if (_calculateDescriptionLength == 0) {
            e.preventDefault();
        }
        _descriptionLength.text(_calculateDescriptionLength());

    });

    this.webyLoaded = function () {
        init();

        if (_tagsData.find('span').length == 0) {
            _tagsWrapper.find('.tags-placeholder').show();
        } else {
            _tagsWrapper.find('.tags-placeholder').hide();
        }
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
        App.getWeby().getWebyTitle().setEmbedCode();
        _refreshTagData(data.tags);
        _editing = false;
        _tagsLog = {};
    }
}