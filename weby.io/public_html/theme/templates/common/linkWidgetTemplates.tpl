{* Templates for various link types (eg. .gif, .jpg or files like .pdf, .ppt, .doc etc.) *}

{* Basic input field for pasting links which our widget will know how to handle *}
{literal}
<script type="weby/linkWidgetTemplate" id="link-widget-field-tpl">
    <div style="width: 400px" class="link-input">
        <input class="link-widget-field" id="link-widget-{id}" type="text" value="{value}"
               placeholder="Paste a link to a file or a website"/>
        <span class="dropbox-button"></span>
        <span class="gdrive-button"></span>
    </div>
    <span class="message"></span>
</script>
{/literal}
{* Link template - used for web links that includes image, title and short content of site *}
{literal}
<script type="weby/linkWidgetTemplate" id="link-widget-link-tpl">
    <div id="link-{id}" class="link">
        <a href="{url}" class="link-img" target="_blank" style="background-image: url({imageUrl})"></a>
        <div class="website">
            <a href="{url}" target="_blank" class="title">{title}</a>
            <span class="description">{description}</span>
        </div>
    </div>
</script>
{/literal}
{* File template - used for types of files which displays basic information such as name, size etc. *}
{literal}
<script type="weby/linkWidgetTemplate" id="link-widget-file-tpl">
    <div class="file">
        <a href="{url}" class="file-icon icon-{extension}" target="_blank"></a>
        <span class="link-widget-details">
            <table class="link-widget-file-details">
                <tr>
                    <td>Name:</td>
                    <td>{baseName}</td>
                </tr>
                <tr>
                    <td>Type:</td>
                    <td>{type}</td>
                </tr>
                <tr>
                    <td>Size:</td>
                    <td>{size}</td>
                </tr>
                <tr>
                    <td>Hosted on:</td>
                    <td>{host}</td>
                </tr>
            </table>
        </span>
    </div>
</script>
{/literal}
{* Image template - used for displaying images, this template doesn't include any file data *}
{literal}
<script type="weby/linkWidgetTemplate" id="link-widget-image-tpl">
    <img id="{image_id}" class="link-widget-image" src="{url}"></img>
</script>
{/literal}
{* Dropbox template - used for displaying files from dropbox service *}
{literal}
<script type="weby/linkWidgetTemplate" id="link-widget-dropbox-file-tpl">
    <div class="file">
        <a href="{url}" class="file-icon {type}" target="_blank"></a>
        <span class="link-widget-details">
            <table class="link-widget-file-details">
                <tr>
                    <td>Name:</td>
                    <td>{baseName}</td>
                </tr>
                <tr>
                    <td>Type:</td>
                    <td>Drop</td>
                </tr>
                <tr>
                    <td>Size:</td>
                    <td>{size}</td>
                </tr>
                <tr>
                    <td>Hosted on:</td>
                    <td>{host}</td>
                </tr>
            </table>
        </span>
    </div>
</script>
{/literal}
{* Error template - used for displaying error messages *}
{literal}
<script type="weby/linkWidgetTemplate" id="link-widget-error-tpl">
    <span class="link-widget-error">{message}</span>
</script>
{/literal}