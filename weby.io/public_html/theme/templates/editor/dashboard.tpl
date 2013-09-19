{extends file="layouts/master.tpl"}

{block name="title"}Dashboard{/block}
{block name="head"}
    {include file="templates/editor/includes/editorIncludes.tpl"}
    <script type="text/javascript" id="initScript">
        {literal}
        /*var observer = setInterval(function () {
         if (!$('.fancybox-overlay').length || $('.fancybox-overlay').css('display') == 'none' || $('.fancybox-overlay').css('visibility') == 'hidden') {
         clearInterval(observer);
         $.fancybox('<img src="https://fbcdn-sphotos-e-a.akamaihd.net/hphotos-ak-ash4/1012478_464233380275557_1554344333_n.jpg">', {modal: true, autoSize: true});
         setTimeout(function () {
         window.location.reload();
         }, 3000);

         }
         }, 500);*/

        $(function () {
            dashboard = new WebyDashboard();
            dashboard.open(true);

            // After closing feedback, return to dashboard
            Feedback.onClose(function () {
                setTimeout(function() {
                dashboard.open(true);
                }, 50);
            });
            $('#initScript').remove();
        });
        {/literal}
    </script>
{/block}

{block name="headerRightTools"}
    {if $viewObject.user}
        <div style="float:right">
            {include file="templates/common/userOptions.tpl"}
        </div>
    {/if}
{/block}

{block name="content"}
    <div id="content"
         style="width:100%; height:100%; background: url('{$viewObject.themeWebPath}images/patterns/purty_wood.png') repeat"></div>
    {include file="templates/common/dashboard.tpl"}
    {include file="templates/common/favorites.tpl"}
{/block}
