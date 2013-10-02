{extends file="layouts/staticPage.tpl"}

{block name="title"}Welcome to Weby.io{/block}
{block name="head"}
{/block}
{block name="content"}
    <div class="container">
        <h1>
            Discover the unlimited potential of your creativity and share it with the world!
        </h1>
        <ul class="social">
            <li class="signin-facebook">
                <a class="icon" href="{$viewObject.webPath}security/login-fb/"></a>
                <a href="{$viewObject.webPath}security/login-fb/">Sign in with Facebook</a>
            </li>
            <li class="signin-google">
                <a class="icon" href="{$viewObject.webPath}security/login-gp/"></a>
                <a href="{$viewObject.webPath}security/login-gp/">Sign in with Google</a>
            </li>
        </ul>
        <h2>
            It's completely free! You can create unlimited number of Webies right now or you can watch a short video to see how Weby works.
        </h2>
        <iframe xmlns="" width="700" height="360" src="https://www.youtube.com/embed/7VYzq1CZ61A?wmode=opaque" frameborder="0" allowfullscreen=""></iframe>
        <h2>
            Weby.io works better with your friends - let them know!
        </h2>
        <div class="content-social-widget">
            <iframe allowtransparency="true" frameborder="0" scrolling="no" src="https://platform.twitter.com/widgets/tweet_button.1380141200.html#_=1380523913112&amp;count=horizontal&amp;id=twitter-widget-1&amp;lang=en&amp;original_referer=file%3A%2F%2F%2FC%3A%2FUsers%2FadRIan%2FDesktop%2Fweby-landing-page%2Fweby-landing-page%2Findex.html&amp;size=m&amp;text=Weby.io&amp;url=http%3A%2F%2Fwww.weby.io" class="twitter-share-button twitter-count-horizontal" title="Twitter Tweet Button" data-twttr-rendered="true" style="width: 110px; height: 20px;"></iframe>
            <div id="___plus_1" style="text-indent: 0px; margin: 0px; padding: 0px; background-color: transparent; border-style: none; float: none; line-height: normal; font-size: 1px; vertical-align: baseline; display: inline-block; width: 94px; height: 20px; background-position: initial initial; background-repeat: initial initial;"><iframe frameborder="0" hspace="0" marginheight="0" marginwidth="0" scrolling="no" style="position: static; top: 0px; width: 94px; margin: 0px; border-style: none; left: 0px; visibility: visible; height: 20px;" tabindex="0" vspace="0" width="100%" id="I1_1380523912272" name="I1_1380523912272" src="https://apis.google.com/u/0/_/+1/sharebutton?plusShare=true&amp;bsv=o&amp;action=share&amp;annotation=bubble&amp;hl=en-US&amp;origin=file%3A%2F%2F&amp;url=http%3A%2F%2Fwww.weby.io%2F&amp;gsrc=3p&amp;jsh=m%3B%2F_%2Fscs%2Fapps-static%2F_%2Fjs%2Fk%3Doz.gapi.hr.6xIRKMJOtZk.O%2Fm%3D__features__%2Fam%3DAQ%2Frt%3Dj%2Fd%3D1%2Frs%3DAItRSTNCOwo9PYFFgPxaZGEFqPX_rMtWKw#_methods=onPlusOne%2C_ready%2C_close%2C_open%2C_resizeMe%2C_renderstart%2Concircled%2Cdrefresh%2Cerefresh%2Conauth%2Conload&amp;id=I1_1380523912272&amp;parent=file%3A%2F%2F&amp;pfname=&amp;rpctoken=31135395" allowtransparency="true" data-gapiattached="true" title="+Share"></iframe></div>
            <iframe class="fb-like-button" src="//www.facebook.com/plugins/like.php?href=http%3A%2F%2Fwww.weby.io&amp;width=50&amp;height=21&amp;colorscheme=light&amp;layout=button_count&amp;action=like&amp;show_faces=false&amp;send=false" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:85px; height:21px;" allowtransparency="true"></iframe>
        </div>
    </div>
{/block}