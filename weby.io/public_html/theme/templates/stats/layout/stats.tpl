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
        backend/stats.css
    {/minify}
    {minify type="js"}
        third_party/jquery-2.0.3.min.js,
        backend/stats.js
    {/minify}
    <script src="{$viewObject.themeWebPath}js/third_party/kendo.web.min.js" charset="utf-8"></script>
    <script type="text/javascript" src="https://www.google.com/jsapi"></script>
    <script type="text/javascript">
        {literal}google.load("visualization", "1", {packages: ["corechart"]});{/literal}
    </script>

    {block name="head"}{/block}
</head>
<body>
<div id="page-content">
    {block name="content"}{/block}
</div>
</body>
</html>