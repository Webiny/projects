{extends file="templates/stats/layout/stats.tpl"}
{block name="title"}Live{/block}
{block name="head"}
    {minify type="css"}
        backend/live.css
    {/minify}
    {minify type="js"}
        backend/live.js
    {/minify}
{/block}

{block name="content"}
    <div data-role="counter" class="centered-counter"></div>
{/block}
