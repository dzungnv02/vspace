"use strict";
tinyMCE.importPluginLanguagePack('violetspace');
// Plucin static class
var TinyMCE_VioletSpacePlugin = {
	getInfo: function() {
		return {
			longname: 'Violet Space',
			author: 'Bach Kim Violet',
			authorurl: 'http://violet.vn',
			infourl: 'http://violet.vn',
			version: tinyMCE.majorVersion + "." + tinyMCE.minorVersion
		};
	},
	getControlHTML: function(cn) {
		switch (cn) {
			case "violetspace":
				includeCSS(this.baseURL + '/lib/bootstrap.min.css');
				includeCSS(this.baseURL + '/lib/bootstrap-theme.min.css');
				includeScript(this.baseURL + '/common.js');				
				return tinyMCE.getButtonHTML(cn, 'lang_violetspace_desc', '{$pluginurl}/images/icon.gif', 'mceVioletSpace');
				break;
		}
		return "";
	},

	execCommand: function(editor_id, element, command, user_interface, value) {
		switch (command) {
			case "mceVioletSpace":
				editorId = editor_id;
				openWindow();
				return true;
				break;
		}
		// Pass to next handler in chain
		//return true;
	},
	cleanup: function(type, content, inst) {
		var nl, img, i, ne, d, s, ci;
		switch (type) {
			case "insert_to_editor":
				break;
		}
		return content;
	}
};

function includeScript(url) {
	var h = document.getElementsByTagName('head').item(0);
	var s = document.createElement("script");
	s.type = 'text/javascript';
	s.src = url;
	h.appendChild(s);
}

function includeCSS(url) {
	var h = document.getElementsByTagName('head').item(0);
	var s = document.createElement("link");
	s.rel = 'stylesheet';
	s.href = url;
	h.appendChild(s);
}


(function () {
    function loadScript(url, callback) {
        var script = document.createElement("script")
        script.type = "text/javascript";

        if (script.readyState) { //IE
            script.onreadystatechange = function () {
                if (script.readyState == "loaded" || script.readyState == "complete") {
                    script.onreadystatechange = null;
                    console.log(callback);
                    callback();
                }
            };
        } else { //Others
            script.onload = function () {
                callback();
            };
        }

        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    };

    loadScript("https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js", function () {
	    loadScript("https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js", function () {
			loadScript('https://cdnjs.cloudflare.com/ajax/libs/bootbox.js/4.4.0/bootbox.min.js', function(){});
		});
    });

    // Register plugin
tinyMCE.addPlugin('violetspace', TinyMCE_VioletSpacePlugin);
})();

