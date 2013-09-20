{extends file="layouts/master.tpl"}

{block name="title"}Weby editor{/block}
{block name="body-class"}editor {/block}
{block name="head"}
    {include file="templates/editor/includes/editorIncludes.tpl"}
    {include file="templates/editor/includes/editorRemoteIncludes.tpl"}
    <!-- The standard Google Loader script. -->
    <script type="text/javascript">
        google.load('picker', '1');
    </script>
    <script type="text/javascript" id="initScript">
        BaseWidget.CONTENT_VALIDATOR = '{$contentValidator}';
        var weby = {$weby->toJson()};
        $(function () {
            App = new AppClass();
            {if !$viewObject.user->completedOnboarding()}
            App.addEventListener(new Intro());
            {/if}
            App.init();
            $('#initScript').remove();
        });
    </script>
{/block}

{block name="headerMiddle"}
    {include file="templates/editor/includes/title.tpl"}
{/block}

{block name="headerRightTools"}
    {assign var="editor" value="true"}
    {if $viewObject.user}
        <li class="my-webies">
            <a href="javascript:void(0)" data-role="dashboard-dialog-open"></a>
        </li>
        {include file="templates/common/socialShare.tpl"}
        {include file="templates/common/userOptions.tpl"}
        </div>
    {/if}
{/block}

{block name="content"}
    <div id="toolbar">
        <ul></ul>
    </div>
    <div id="drag-helper" style="position: absolute; width:0; height: 0;"></div>
    {include file="templates/editor/includes/loading.tpl"}
    {include file="templates/common/webyContent.tpl"}
    {include file="templates/common/linkWidgetTemplates.tpl"}
    {include file="templates/editor/includes/webyToolbar.tpl"}
    {include file="templates/common/dashboard.tpl"}
    <div id="outer-widgets" style="display:none">
        <p>There are some widgets located outside of your new canvas.<br/> Would you like to move them inside your new
            canvas?</p>
        <button id="button-move-widgets">Yes, sure!</button>
        <button id="button-dont-move-widgets">No, leave them.</button>
    </div>
    {include file="templates/common/favorites.tpl"}
{/block}