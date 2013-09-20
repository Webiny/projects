<div class="dialog" id="weby-dialog" style="display:none;">
    <a href="" class="close-dialog"></a>

    <h1>My Weby</h1>
        <input maxlength="50" type="text" id="weby-title-field" class="has-tooltip" title="Please enter your title."
               placeholder="Weby title" value="{$weby.title}">

        <span id="weby-tags-wrapper" class="has-tooltip" title="Maximum 10 tags allowed.">
            <span class="weby-tags">
                {foreach from=$weby.tags item=tag}
                    <span data-tag="{$tag.tag}" data-id="{$tag.id}" class="weby-tag">{$tag.tag}
                        <span class="remove-tag"></span>
                    </span>
                {/foreach}
            </span>
            <div id="weby-tag-input" class="tags-editable has-tooltip"
                 title="Your tag is too long (maximum 25 characters)" contenteditable="true"></div><span class="tags-placeholder">Enter tags</span>
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