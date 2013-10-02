{* Empty layout is used for rendering content which does not require the design of the main website (embed iframes) *}
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <script src="{$viewObject->themeWebPath}js/third_party/jquery-2.0.3.min.js"></script>
    <style type="text/css">
        html, body{
            min-width: 100%;
            min-height: 100%;
            width: 100%;
            height: 100%;
        }
        body{
            margin:0;
            padding:0;
            overflow:hidden;
        }
    </style>
    {block name="head"}{/block}
</head>
<body>
{block name="content"}{/block}
</body>
</html>
