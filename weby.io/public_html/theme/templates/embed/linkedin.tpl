{extends file="layouts/empty.tpl"}
{block name="content"}
    {if $profileExists}
        <script src="//platform.linkedin.com/in.js" type="text/javascript"></script>
        <script type="IN/MemberProfile" data-id="http://www.linkedin.com/in/{$name}" data-format="inline"
                data-related="false"></script>
        <script type="text/javascript" id="process">

            $(function () {
                try {
                    var interval = setInterval(function () {
                        // First try getting iframe (LinkedIn is loading it with JS so it doesn't exist at this point)
                        var liIframe = $('body').find('iframe');
                        if (liIframe.length === 0) {
                            return;
                        }
                        // Once we have the iframe - clear the interval and bind iframe load event
                        clearInterval(interval);
                        liIframe.on("load", function () {
                            var counter = 200;
                            // The final iframe height is set from within the iframe
                            var interval = setInterval(function () {
                                if (counter == 0) {
                                    clearInterval(interval);
                                    $('#process').remove();
                                    return;
                                }
                                // Height is set with CSS so we need to wait till the end of content loading
                                // (binding to "load" is not good enough because it fires too early)
                                if (liIframe.css("height") == "1px") {
                                    return;
                                }
                                // When iframe height is != 1px we finally have the "style" property set on the linked in iframe
                                clearInterval(interval);
                                // Call my custom event handler and give it the new size
                                var widget = window.top['App'].getWidget({$id});
                                if (widget) {
                                    widget.onIframeLoaded(liIframe.css("width"), liIframe.css("height"));
                                }
                            }, 50);
                        });

                    }, 50);
                } catch (ex) {
                    // Nothing...
                } finally {
                    $('#process').remove();
                }

            });
        </script>
    {else}
        <script type="text/javascript">
            var widget = window.top['App'].getWidget({$id});
            if (widget) {
                widget.profileNotFound();
            }
        </script>
    {/if}
{/block}