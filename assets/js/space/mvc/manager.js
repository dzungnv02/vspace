var server = $(location).get(0).protocol + '//' + $(location).get(0).hostname;
var includeDir = '/assets/js/space/mvc/';
var appName = 'space';
var rootDirId = -1;
var rootDirName = 'My Space';
var treeContainer = 'treeview-container';
var currDir = -1;

var objController = null;
var objConnection = null;
var objSpaceModel = null;
var objUltis = null;
var objTree = null;
var objGrid = null;
var objLayout = null;
var objUser = null;
var modelExisted = false;

if (jQuery)
	(function($) {
		var includingScript = function(scriptFiles) {
			var _arr = $.map(scriptFiles, function(scr) {
				return $.getScript((includeDir || "") + scr);
			});

			_arr.push($.Deferred(function(deferred) {
				$(deferred.resolve);
			}));

			return $.when.apply($, _arr);
		}

		var initApp = function() {
			var scriptFiles = [
				'ultis.js', 'connection.js', 'model.js', 'user.js', 'layout.js', 'tree.js', 'grid.js', 'controller.js'
			];

			includingScript(scriptFiles).done(function() {
				if (objUltis == null) objUltis = $().vsUltis();
				if (objConnection == null) objConnection = $().vsConnection();
				if (objSpaceModel == null) objSpaceModel = $().vsSpaceModel();
				if (objUser == null) objUser = $().vsUser();
				if (objTree == null) objTree = $().vsViewTree();
				if (objGrid == null) objGrid = $().vsViewGrid();
				if (objLayout == null) objLayout = $().vsViewLayout();
				if (objController == null) objController = $().vsController();
			});
		};

		$(document).ready(function() {
			initApp();
		});

	})(jQuery);