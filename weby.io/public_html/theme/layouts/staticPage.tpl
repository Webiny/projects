<!DOCTYPE html>
<html>
<head>
    <title>{block name="title"}{/block}</title>
    <script type="text/javascript">
        var THEME = '{$viewObject.themeWebPath}';
        var WEB = '{$viewObject.webPath}';
    </script>
    {minify type="css"}
        font.css,
        main.css,
        headerMiddle.css,
        staticPage.css,
        jquery.fancybox.css,
        dialog/dialog.css,
        dialog/dashboardDialog.css,
        dialog/favoritesDialog.css,
        dialog/feedbackDialog.css,
        dialog/keyboardShortcutsDialog.css
    {/minify}
    {minify type="js"}
        jquery-2.0.3.min.js,
        jquery-ui-1.9.2.webyio.js,
        jQueryFix.js,
        jquery.fancybox.pack.js,
        time.js,
        timePassed.js,
        weby/feedback.js,
        weby/webyDashboard.js,
        weby/webyFavorites.js,
        frontend/staticPage.js
    {/minify}
    <script src="{$viewObject.themeWebPath}js/kendo.web.min.js" charset="utf-8"></script>

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
<div class="footer">
    <ul>
        <li>
            <a href="#">Help</a>
        </li>
        <li>
            <a href="#">About</a>
        </li>
        <li>
            <a href="#">Terms of Service</a>
        </li>
        <li >
            <a class="footer-keyboard-shortcuts" href="javascript:void(0);" data-role="keyboard-shortcuts-open">Keyboard Shortcuts</a>
        </li>
        <li class="feedback">
            <a class="footer-feedback" href="javascript:void(0);" data-role="feedback-open">Feedback</a>
        </li>
    </ul>
    <span><a href="http://www.webiny.com" target="_blank"></a></span>
    {include file="templates/common/feedback.tpl"}
    {include file="templates/common/keyboardShortcuts.tpl"}
    {include file="templates/common/dashboard.tpl"}
    {include file="templates/common/favorites.tpl"}
    {block name="outerTemplates"}{/block}
</div>
{include file="templates/common/ga.tpl"}
</body>
</html>


</body>
</html>