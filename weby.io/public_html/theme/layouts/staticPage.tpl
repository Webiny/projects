<!DOCTYPE html>
<html>
<head>
    <title>{block name="title"}{/block} | Weby.io</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta charset="utf-8">
    {block name="meta"}{/block}
    <script type="text/javascript">
        var THEME = '{$viewObject.themeWebPath}';
        var WEB = '{$viewObject.webPath}';
    </script>
    {minify type="css"}
        kendo.common.min.css,
        kendo.default.min.css,
        font.css,
        main.css,
        headerMiddle.css,
        staticPage.css,
        jquery.fancybox.css,
        dialog/dialog.css,
        dialog/dashboardDialog.css,
        dialog/favoritesDialog.css,
        dialog/feedbackDialog.css,
        dialog/followersDialog.css,
        dialog/keyboardShortcutsDialog.css,
        dialog/registerDialog.css
    {/minify}

    {minify type="js"}
        third_party/jquery-2.0.3.min.js,
        third_party/jquery-ui-1.9.2.webyio.js,
        jQueryFix.js,
        third_party/jquery.fancybox.pack.js,
        third_party/jquery.cookies.min.js
    {/minify}

    <script src="{$viewObject.themeWebPath}js/third_party/kendo.web.min.js" charset="utf-8"></script>

    {minify type="js" obfuscate="true"}
        third_party/time.js,
        timePassed.js,
        weby/footer.js,
        weby/webyDashboard.js,
        weby/webyFavorites.js,
        weby/webyFollowers.js,
        frontend/authorization.js,
        frontend/staticPageInit.js,
        weby/webySearch.js
    {/minify}

    {block name="head"}{/block}
</head>
<body>
<div id="fb-root"></div>
<div id="sharePost"></div>

<div class="header">
    <div class="logo">
        <a href="/"><img src="{$viewObject.themeWebPath}images/weby-logo.png"></a>
    </div>
    {block name="headerMiddle"}
    {/block}
    <div class="header-right">
        <ul>
            {if $viewObject.user}
                {include file="templates/common/searchWebies.tpl"}
            {/if}

            {if $viewObject.user}
                {include file="templates/common/userOptions.tpl"}
            {else}
                {include file="templates/pages/includes/authorization.tpl"}
            {/if}
        </ul>
    </div>
</div>
<div class="bootstrap" data-role="user-logged-in">{if $viewObject.user}true{else}false{/if}</div>
<div id="page-content">
    {block name="content"}{/block}
</div>
{block name="footer"}
    {include file="layouts/includes/frontendFooter.tpl"}
{/block}

</body>
</html>