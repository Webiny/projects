{extends file="layouts/master.tpl"}

{block name="title"}{$weby.title}{/block}
{block name="head"}
    <meta property="og:site_name" content="Weby.io"/>
    <meta property="og:title" content="{$weby.title}"/>
    <!-- TODO: when images are done, insert their paths here -->
    <meta property="og:image" content="{$weby->getImage('original-screenshot')}"/>
    <meta property="og:description" content="Created with Weby.io"/>
    <link data-page-subject="true" href="{$weby->getImage('original-screenshot')}" rel="image_src"/>
    {include file="templates/pages/includes/appIncludes.tpl"}
    {include file="templates/pages/includes/appRemoteIncludes.tpl"}
    {include file="templates/common/linkWidgetTemplates.tpl"}
    {include file="templates/common/favorites.tpl"}
    <script type="text/javascript" id="initScript">
        var weby = {$weby->toJson()};
        $(function () {
            App = new AppClass();
            App.init();
            $('#initScript').remove();
        });
    </script>
{/block}
{block name="headerMiddle"}
    {include file="templates/pages/includes/title.tpl"}
{/block}
{block name="content"}
    {include file="templates/pages/includes/webyDetails.tpl"}

    <div id="workspace">
        <div id="weby-background-video">
            <div id="player"></div>
        </div>
        <div id="wrapper">
            <div id="content">
                <div id="weby-background-image"></div>
                <div id="weby-background-color"></div>
            </div>
        </div>
    </div>

    {include file="templates/common/loading.tpl"}
    {include file="templates/common/dashboard.tpl"}
{/block}
{block name="headerRightTools"}
    {include file="templates/common/socialShare.tpl"}
    {if $viewObject.user}
        {include file="templates/common/userOptions.tpl"}
    {/if}
{/block}