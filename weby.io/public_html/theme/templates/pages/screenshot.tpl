{extends file="layouts/screenshot.tpl"}

{block name="title"}{$weby.title}{/block}
{block name="head"}
    {include file="templates/pages/includes/screenshotIncludes.tpl"}
    {include file="templates/pages/includes/appRemoteIncludes.tpl"}
    {include file="templates/common/linkWidgetTemplates.tpl"}
    <script type="text/javascript" id="initScript">
        var weby = {$weby->toJson()};
        $(function(){
            App = new AppClass(0);
            WebyBackground.ANIMATE = false;
            App.noHeader(true).init();
            $('#initScript').remove();
        });
    </script>
{/block}
{block name="content"}
    {include file="templates/common/webyContent.tpl"}
{/block}
