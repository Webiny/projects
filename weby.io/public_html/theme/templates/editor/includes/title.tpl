<div class="header-middle header-middle-wrap">
        <div class="edit-title" data-role="weby-title">
            <h2>{$weby.title}</h2>
            <a href="javascript:void(0)">Edit title</a>
        </div>
        <p class="weby-url" data-role="weby-url"><a title="View my Weby" target="_blank"
                                                    href="{$weby.publicUrl}">{$weby.publicUrl}</a></p>
    <div class="share-drop" data-role="weby-title-share">
        <span class="share-url"></span>

        <form>
            <fieldset>
                <p>
                    <label>Full URL</label>
                    <input readonly type="text" data-role="weby-full-url" value="{$weby.publicUrl}">
                </p>

                <p>
                    <label>Embed Code</label>
                    <textarea readonly class="embed-code" data-role="weby-embed-code"></textarea>
                </p>
                <a href="javascript:void(0)" class="close-form"></a>
            </fieldset>
        </form>
    </div>
</div>

{include file="templates/editor/includes/webyDialog.tpl"}