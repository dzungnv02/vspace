/**
 * $Id: editor_plugin_src.js 520 2008-01-07 16:30:32Z spocke $
 *
 * @author Moxiecode
 * @copyright Copyright  2004-2008, Moxiecode Systems AB, All rights reserved.
 */
 
ib = null;
			
(function() {
	tinymce.create('tinymce.plugins.IBrowserPlugin', {
		init : function(ed, url) {
			// load common script
			tinymce.ScriptLoader.add(url + '/js/common.js');
			tinymce.ScriptLoader.loadQueue();
			
			// Register commands
			ed.addCommand('mceIBrowser', function() {
				var e = ed.selection.getNode();
				// Internal image object like a flash placeholder
				if (ed.dom.getAttrib(ed.selection.getNode(), 'class').indexOf('mceItem') != -1) {return}

				ib.isMSIE  = tinymce.isIE;
				ib.isGecko = tinymce.isGecko;
				ib.isWebKit= tinymce.isWebKit;
				ib.oEditor = ed; 
				ib.editor  = ed;
				ib.selectedElement = e;					
				ib.baseURL = url + '/ibrowser.php?idBlog=' + idBlog +'&canChangeImage=' + canChangeImage;	
				iBrowser_open();
			});

			// Register buttons
			ed.addButton('ibrowser', {
				title : 'Upload và chèn ảnh',
				cmd : 	'mceIBrowser',
				image: 	url + '/images/ibrowser.gif'
			});
		},

		getInfo : function() {
			return {
				longname : 	'iBrowser',
				author : 	'net4visions.com',
				authorurl: 	'http://net4visions.com',
				infourl : 	'http://net4visions.com/ibrowser.html',
				version : 	'1.4.5'
			};
		}
	});
	
	// Register plugin
	tinymce.PluginManager.add('ibrowser', tinymce.plugins.IBrowserPlugin);
})();
