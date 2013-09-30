<!DOCTYPE html>
<html>
<head>
    <title>{block name="title"}{/block}</title>
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
        jquery-2.0.3.min.js,
        jquery-ui-1.9.2.webyio.js,
        jQueryFix.js,
        jquery.fancybox.pack.js
        {/minify}
    <script src="{$viewObject.themeWebPath}js/kendo.web.min.js" charset="utf-8"></script>
    {minify type="js"}
        time.js,
        timePassed.js,
        weby/footer.js,
        weby/webyDashboard.js,
        weby/webyFavorites.js,
        weby/webyFollowers.js,
        frontend/authorization.js,
        frontend/staticPageInit.js,
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
                    <li class="my-webies">
                        <a href="javascript:void(0)" data-role="dashboard-dialog-open"></a>
                    </li>
                {/if}

                {if $viewObject.user}
                    {include file="templates/common/userOptions.tpl"}
                {else}
                    {include file="templates/pages/includes/authorization.tpl"}
                {/if}
        </ul>
    </div>
</div>
<div id="page-content">
    {block name="content"}{/block}
</div>
{block name="footer"}
    {include file="layouts/includes/frontendFooter.tpl"}
{/block}

</body>
</html>