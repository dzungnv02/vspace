'use strict';

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

var viewMode = 'grid';
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

var objConnector = null;

var mode = '';

var hasCopy = 0;

if (jQuery)
	(function($) {
		var getUrlParameter = function getUrlParameter(sParam) {
			var sPageURL = decodeURIComponent($(location).get(0).search.substring(1)),
				sURLVariables = sPageURL.split('&'),
				sParameterName, i;

			for (i = 0; i < sURLVariables.length; i++) {
				sParameterName = sURLVariables[i].split('=');

				if (sParameterName[0] === sParam) {
					return sParameterName[1] === undefined ? true : sParameterName[1];
				}
			}
		}

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
			mode = getUrlParameter('mode');
			
			var scriptFiles = [
				'controller.js',
				'layout.js',
				'mimetype.js',
				'vlightbox.js',
				'tree.js', 
				'grid.js', 
				'upload.js', 
				'ultis.js', 
				'connection.js', 
				'model.js', 
				'user.js', 
				'alertify.js/alertify.js',
			];

			if (mode == 'plugin') {
				scriptFiles.push('../postmessage.js');
				scriptFiles.push('connector.js');
			}

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

				if (mode == 'plugin') {
					if (objConnector == null) objConnector = $().vsConnector();
				}
			});

			loadCSS("space/video-js.css");
			loadCSS("space/alertify.css");
			loadCSS("space/contextmenu.css");
		};

		var loadCSS = function(href) {
			var cssLink = $("<link rel='stylesheet' type='text/css' href='" + server + '/assets/css/' + href + "'>");
			$("head").append(cssLink);
		};

		// $(document).ready(function() {
		// 	initApp(); 
		// });
		initApp();
	})(jQuery);