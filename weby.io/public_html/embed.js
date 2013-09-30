(function (d) {
	var webies = document.getElementsByClassName("weby-embed");
	
	if (!webies) {
		return;
	}

	for (var i = 0; i < webies.length; i++) {
		var wi = i;
		if (webies[wi].nodeName == "DIV" && 'data-weby' in webies[wi].attributes && webies[wi].innerHTML.trim() == '') {
			// Get weby parameters
			var webyAttributes = webies[wi].attributes;
			var attrs = {
				src: webyAttributes["data-weby"].nodeValue,
				width: webyAttributes["data-width"] ? webyAttributes["data-width"].nodeValue : 700,
				height: webyAttributes["data-height"] ? webyAttributes["data-height"].nodeValue : 400,
				branding: webyAttributes["data-branding"] ? webyAttributes["data-branding"].nodeValue : true,
				callback: webyAttributes["data-callback"] ? webyAttributes["data-callback"].nodeValue : false,
				callbackParams: webyAttributes["data-callback-params"] ? webyAttributes["data-callback-params"].nodeValue : false
			};

			if(!attrs.callbackParams){
				attrs.callbackParams = [attrs.src];
			} else {
				attrs.callbackParams = attrs.callbackParams.split(',');
			}

			if(attrs.branding !== true){
				if(isNaN(parseInt(attrs.branding))){
					attrs.branding = attrs.branding === "true" ? true : false;
				} else {
					attrs.branding = !!parseInt(attrs.branding);
				}
			}
			
			// Create Weby container element
			var weby = d.createElement("div");
			weby.className = "weby-embed";
			weby.style.float = "left";

			// Create embed iframe
			var iframe = d.createElement("iframe");
			iframe.src = attrs.src + "/embed/";
			iframe.width = attrs.width;
			iframe.height = attrs.height;
			iframe.frameBorder = 0;
			iframe.style.float = "left";
			iframe.style.border = "1px solid #000";
			if(attrs.callback){
				if (iframe.attachEvent){
					iframe.attachEvent("onload", window[attrs.callback]);
				} else {
					iframe.onload = function(){
						var context = window;
						//var args = Array.prototype.slice.call(args).splice(2);
						var namespaces = attrs.callback.split(".");
						var func = namespaces.pop();
						for(var i = 0; i < namespaces.length; i++) {
							context = context[namespaces[i]];
						}
						return context[func].apply(this, attrs.callbackParams);
					};
				}
			}
			weby.appendChild(iframe);

			// Create brand line
			/*if(attrs.branding){*/
				var brand = document.createElement("span");
				brand.innerHTML = 'Powered by <a href="http://weby.io">Weby.io</a>';
				brand.style.float = "right";
				brand.style.clear = "both";
				weby.appendChild(brand);
			/*}*/

			// Insert Weby in DOM
			webies[wi].parentNode.replaceChild(weby, webies[wi]);
		}
	}
})(document);