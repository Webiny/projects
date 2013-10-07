{extends file="templates/stats/layout/stats.tpl"}
{block name="title"}Statistics{/block}
{block name="content"}
    <div id="stat_wrapper">
        <div id="stat_menu">
            {include file="templates/stats/includes/menuItems.tpl"}
        </div>
        <div id="stat_data">
            <div class="head-bar">
                <span class="chart-title"></span>
                <select data-role="period-selector">
                    <option value="week">Week</option>
                    <option value="month">Month</option>
                    <option value="year">Year</option>
                </select>
            </div>
            <div id="grid"></div>
            <div id="chart">
                <div id="google-chart"></div>
            </div>
        </div>
    </div>
{/block}
