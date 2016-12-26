
veq = null;
			
(function() {
	tinymce.create('tinymce.plugins.EquationPlugin', {
		init : function(ed, url) {
			// load common script
			tinymce.ScriptLoader.add(url + '/js/common.js');
			tinymce.ScriptLoader.loadQueue();
			
			// Register commands
			ed.addCommand('mceEquation', function(editor_id) {
                                var e = ed.selection.getNode();
                                // Internal image object like a flash placeholder
                                if (ed.dom.getAttrib(ed.selection.getNode(), 'class').indexOf('mceItem') != -1) {return}

                                veq.isMSIE  = tinymce.isIE;
                                veq.isGecko = tinymce.isGecko;
                                veq.isWebKit= tinymce.isWebKit;
                                veq.oEditor = ed;
                                veq.editor  = ed;
                                veq.selectedElement = e;
                                veq.baseURL = url + '/editor.php';     
				Equation_open();
			});

			// Register buttons
			ed.addButton('equation', {
				title : 'Thêm và sửa công thức',
				cmd : 	'mceEquation',
				image: 	url + '/images/equation.gif'
			});
			
			// Add a node change handler, selects the button in the UI when a image is selected
			ed.onNodeChange.add(function(ed, cm, n) {
				cm.setActive('equation', n.nodeName == 'IMG' &&
				n.getAttribute('src').match(RegExp('^http://codecogs\.izyba\.com')) != null);
			});
		},

		getInfo : function() {
			return {
    				longname  : 'Violet Equation Editor in TinyMCE',
				author    : 'Nguyen Phu Quang',
				authorurl : 'http://violet.vn',
				infourl   : 'http://violet.vn',
				version   : '0.0.1'
			};
		}
	});
	
	// Register plugin
	tinymce.PluginManager.add('equation', tinymce.plugins.EquationPlugin);
})();
