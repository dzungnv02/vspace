var server = $(location).get(0).protocol + '//' + $(location).get(0).hostname;
var appprofile = null;
var includeDir = '/assets/js/space/mvc/';
var appName = 'space';
var rootDirId = -1;
var rootDirName = 'My Space';
var treeContainer = 'treeview-container';
var currDir = -1;
var preloadedObj = null;
var modelExisted = false;
var htmlvideos = ['mp4', 'ogg', 'webm'];
var aryImg = ['jpg', 'jpeg', 'gif', 'png', 'bmp'];
var aryVideo = ['mp4', 'flv', 'webm'];
var flashvideos = ['flv'];

var totalSizeUsed = 0;
var spaceQuota = 0;
var expireDate = '';
var noopTimer = null;
var noopInterval = 120000; //2 minutes

var objController = null;
var objConnection = null;
var objSpaceModel = null;
var objUltis = null;
var objTree = null;
var objGrid = null;
var objLayout = null;
var objUser = null;
var objUpload = null;
var objLightBox = null;

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
				'vlightbox.js', 'tree.js', 'grid.js', 'upload.js', 'encryption.js', 'ultis.js', 'connection.js', 'model.js', 'user.js', 'layout.js', 'controller.js'
			];

			includingScript(scriptFiles).done(function() {
				if (objLightBox == null) objLightBox = $().vLightbox();
				if (objUltis == null) objUltis = $().vsUltis();
				if (objUpload == null) objUpload = $().vsUpload();
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