{* Description: Weby.io Master Layout

 Available blocks:
    - title
    - head
    - content
    - headerRightTools
*}
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="X-UA-Compatible" content="IE=10"/>
    <title>{block name="title"}{/block} | Weby.io</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta charset="utf-8">
    {minify type="css"}
        font.css,
        main.css,
        socialShare.css,
        headerMiddle.css,
        weby.css,
        jquery.fancybox.css,
        dialog/dialog.css,
        dialog/dashboardDialog.css,
        dialog/favoritesDialog.css,
        dialog/followersDialog.css,
        dialog/feedbackDialog.css,
        dialog/keyboardShortcutsDialog.css
    {/minify}

    {minify type="js"}
        jquery-2.0.3.min.js,
        jquery-ui-1.9.2.webyio.js,
        jQueryFix.js,
        jquery.fancybox.pack.js,
        browserDetect.js,
        time.js,
        timePassed.js,
        weby/footer.js,
        third_party/jquery.cookies.min.js,
        weby/webyDashboard.js,
        weby/webyFavorites.js,
        weby/webyFollowers.js,
        weby/webySearch.js
    {/minify}
    <script src="{$viewObject.themeWebPath}js/kendo.web.min.js" charset="utf-8"></script>
    <script type="text/javascript">
        var THEME = '{$viewObject.themeWebPath}';
        var WEB = '{$viewObject.webPath}';
    </script>
    {block name="head"}{/block}

</head>
<body class="{block name="body-class"}{/block}">
<div id="fb-root"></div>
<div id="sharePost"></div>

<div class="header">
    <div data-role="weby-save" class="saving">
        <p>Saving...</p>
    </div>
    <div class="logo">
        <a href="/"><img src="{$viewObject.themeWebPath}images/weby-logo.png"></a>
    </div>
    {block name="headerMiddle"}{/block}
    <div class="header-right">
        <ul>
            {block name="headerRightTools"}{/block}
        </ul>
    </div>
</div>
{block name="content"}{/block}
{block name="footer"}
    {include file="layouts/includes/frontendFooter.tpl"}
{/block}
</body>
</html>