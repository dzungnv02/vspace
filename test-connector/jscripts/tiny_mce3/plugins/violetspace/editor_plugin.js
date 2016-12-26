(function() {
	"use strict";

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

	tinymce.create('tinymce.plugins.VioletSpacePlugin', {
		init : function(ed, url) {
			includeCSS(url + '/lib/bootstrap.min.css');
			includeCSS(url + '/lib/bootstrap-theme.min.css');
			includeScript(url + '/common.js');
			
			ed.addButton('violetspace', {
	            title : 'Violet Space',
	            cmd : 'mceVioletSpace',
	            image : url + '/images/icon.gif'
	    	});

			ed.addCommand('mceVioletSpace', function() {
	            editorId = ed.id;
				openWindow();
				return true;
	        });

	        ed.onNodeChange.add(function(ed, cm, n) {
	            cm.setActive('violetspace', n.nodeName == 'IMG');
	        });
		},
		createControl : function(n, cm) {
            return null;
        },
		getInfo: function() {
			return {
				longname: 'Violet Space',
				author: 'Bach Kim Violet',
				authorurl: 'http://violet.vn',
				infourl: 'http://violet.vn',
				version: tinyMCE.majorVersion + "." + tinyMCE.minorVersion
			};
		},
		// cleanup: function(type, content, inst) {
		// 	var nl, img, i, ne, d, s, ci;
		// 	switch (type) {
		// 		case "insert_to_editor":
		// 			break;
		// 	}
		// 	return content;
		// }
	});

	tinymce.PluginManager.add('violetspace', tinymce.plugins.VioletSpacePlugin);

})();

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