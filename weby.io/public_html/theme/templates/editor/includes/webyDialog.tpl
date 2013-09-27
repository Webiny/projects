<div class="dialog" id="weby-dialog" style="display:none;">
    <a href="" class="close-dialog"></a>

    <h1>My Weby</h1>
        <input maxlength="50" type="text" id="weby-title-field" class="has-tooltip" data-tooltip="Please enter your title."
               placeholder="Weby title" value="{if $weby.metaFollow}{$weby.title}{/if}">
    {*
        When Weby is created, by default, meta_follow is false. Also, by default every Weby has
        title "Untitled", but that is just a default value so Weby links can work (user/slug/13-char-id).
        When Weby meta_follow property is false, this means user hasn't saved Weby from this dialog
        (title, tags and description), and then we set the title to empty string, so we force user to write his title.
    *}

        <span id="weby-tags-wrapper" class="has-tooltip" data-tooltip="Maximum 10 tags allowed.">
            <span class="weby-tags">
                {foreach from=$weby.tags item=tag}
                    <span data-tag="{$tag.tag}" data-id="{$tag.id}" class="weby-tag">{$tag.tag}<span class="remove-tag"></span></span>
                {/foreach}
            </span>
            <span style="display: none;" class="load-icon tags-loading"></span>
            <div id="weby-tag-input" class="tags-editable has-tooltip" data-tooltip="Your tag is too long (maximum 25 characters)" contenteditable="true"></div>
            <span class="tags-placeholder">Enter tags</span>
            <input type="hidden" id="tag-search-value">
            <div id="weby-tags-dropdown">
                <ul id="tags-list"></ul>
            </div>
        </span>
        <div id="weby-description-length"></div>
        <textarea maxlength="160" class="description" id="weby-description-field"
                  placeholder="Enter short description">{$weby.description}</textarea>

        <p class="buttons">
            <span class="button" data-role="weby-dialog-close">Cancel</span>
            <span class="button main" data-role="weby-dialog-save">Save Changes</span>
        </p>
</div>