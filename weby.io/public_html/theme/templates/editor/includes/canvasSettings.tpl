<div id="canvas-settings">
    <ul class="tabs">
        <li>
            <a href="#cnv-color">Color</a>
        </li>
        <li>
            <a href="#cnv-pattern">Pattern</a>
        </li>
        <li>
            <a href="#cnv-image">Image</a>
        </li>
        <li>
            <a href="#cnv-size">Size</a>
        </li>
        <li class="dummy"></li>
    </ul>
    <div id="cnv-color" class="tab">
        <div id="color-picker" style="width: 264px; border: none;"></div>
    </div>
    <div id="cnv-pattern" class="tab">
        <div id="patterns-list" class="patterns-list"></div>
        <div class="k-pager-wrap patterns-pager"></div>
        <span class="credits">
            Powered by <a target="_blank" href="http://subtlepatterns.com">SubtlePatterns.com</a>
        </span>
    </div>
    <div id="cnv-image" class="tab">
        <span class="error-message"></span>

        <div id="file-widget">
            <input name="background-image" id="file" type="file"/>
        </div>
        <a id="background-image-remove" href="javascript:void(0)" style="display: none;"
           class="green-button icon delete">Remove background image</a>

        <div id="canvas-image-mode" class="combo-box">
            <a href="javascript:void(0)" data-role="selected-item">Select background position</a>
            <ul>
                <li>
                    <a id="canvas-settings-aligned" data-mode="aligned" href="javascript:void(0)">Aligned</a>
                </li>
                <li>
                    <a id="canvas-settings-repeat" data-mode="repeat" href="javascript:void(0)">Repeat</a>
                </li>
                <li>
                    <a id="canvas-settings-fixed" data-mode="fixed" href="javascript:void(0)">Fixed</a>
                </li>
                <li>
                    <a id="canvas-settings-fit" data-mode="fit" href="javascript:void(0)">Fit to screen</a>
                </li>
                <li>
                    <a id="canvas-settings-scale" data-mode="scale" href="javascript:void(0)">Scale</a>
                </li>
            </ul>
        </div>

        <div id="canvas-image-align" class="combo-box no-bottom-margin">
            <a href="javascript:void(0)" data-role="selected-item">Select image alignment</a>
            <ul>
                <li>
                    <a href="javascript:void(0)" data-align="left top">Top left</a>
                </li>
                <li>
                    <a href="javascript:void(0)" data-align="center top">Top center</a>
                </li>
                <li>
                    <a href="javascript:void(0)" data-align="right top">Top right</a>
                </li>
                <li>
                    <a href="javascript:void(0)" data-align="left center">Middle left</a>
                </li>
                <li>
                    <a href="javascript:void(0)" data-align="center center">Middle center</a>
                </li>
                <li>
                    <a href="javascript:void(0)" data-align="right center">Middle right</a>
                </li>
                <li>
                    <a href="javascript:void(0)" data-align="left bottom">Bottom left</a>
                </li>
                <li>
                    <a href="javascript:void(0)" data-align="center bottom">Bottom center</a>
                </li>
                <li>
                    <a href="javascript:void(0)" data-align="right bottom">Bottom right</a>
                </li>
            </ul>
        </div>
    </div>
    <div id="cnv-size" class="tab">
        <label>Width:<input type="text" id="canvas-width" placeholder="Width" value="800"/></label>
        <label>Height:<input type="text" id="canvas-height" placeholder="Height" value="750"/></label>
        <span class="label">(Leave blank for auto-size)</span>
    </div>
</div>