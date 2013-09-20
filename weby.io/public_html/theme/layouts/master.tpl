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
    <title>{block name="title"}{/block} | Weby.io</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta charset="utf-8">
    {minify type="css"}
        font.css,
        main.css,
        socialShare.css,
        headerMiddle.css,
        weby.css,
        dialog/dialog.css,
        dialog/dashboardDialog.css,
        dialog/favoritesDialog.css,
        dialog/feedbackDialog.css
    {/minify}

    {minify type="js"}
        jquery-2.0.3.min.js,
        jquery-ui-1.9.2.webyio.js,
        jQueryFix.js,
        jquery.fancybox.pack.js,
        time.js,
        timePassed.js,
        weby/feedback.js
    {/minify}

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
<div class="footer" >
    <ul>
        <li>
            <a href="">Help</a>
        </li>
        <li>
            <a href="">About</a>
        </li>
        <li>
            <a href="">Terms of Service</a>
        </li>
        <li>
            <a href="">Keyboard Shortcuts</a>
        </li>
        <li>
            <a href="javascript:void(0);" data-role="feedback-open">Feedback</a>
        </li>
    </ul>
    <span><a href="http://www.webiny.com" target="_blank"></a></span>
    {include file="templates/common/feedback.tpl"}
</div>
</body>
</html>