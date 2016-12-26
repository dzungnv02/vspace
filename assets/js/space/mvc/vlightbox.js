$.extend(
	$.fn, {
		vLightbox: function(o) {
			if (o == null) o = {};

			var instanceCount = 0;

			var self = this;
			var container = null;
			var maxWidth = 300;
			var maxHeight = 300;
			var imageViewer = null;
			var videoPlayer = null;
			var audioPlayer = null;
			var textViewer = null;
			var currentPlayer = null;
			var mediaType = 'image';
			var mimeType = '';
			var videojsObj = null;

			var objWidth = '320';
			var objHeight = '240';

			var defaultDlgWidth = '320';
			var defaultDHeight = '240';

			var dlgWidth = defaultDlgWidth;
			var dlgHeight = defaultDHeight;

			var supportedType = ['image', 'video', 'audio', 'text'];

			var init = function() {
				initModal();
			};

			var initModal = function() {
				container = $('<div></div>', {
					id: 'vLightBoxDlg',
					class: 'modal fade',
					tabindex: '-1',
					role: 'dialog'
				});

				var modalDlg = $('<div></div>', {
					class: 'modal-dialog',
					style: 'padding:0px;background: rgba(0, 0, 0, 0)'
				});

				var dlgContent = $('<div></div>', {
					class: 'modal-content',
					style: 'background: rgba(0, 0, 0, 0.4)'
				});

				var dlgBody = $('<div></div>', {
					class: 'modal-body',
					style: 'padding:0px;border:none;margin:0px;background: rgba(0, 0, 0, 0.4)'
				});

				var dlgFooter = $('<div></div>', {
					class: 'modal-footer'
				});

				container.append(modalDlg.append(dlgContent.append(dlgBody)));
				$('BODY').append(container);
			};

			var getDimension = function() {
				mimeType = MimeType.lookup(o.file);
				var aryMimeType = mimeType.split('/');
				mediaType = aryMimeType[0];

				if (mediaType == 'image') {
					objWidth = o.preload.naturalWidth;
					objHeight = o.preload.naturalHeight;
				} else if (mediaType == 'video') {
					objWidth = 640;
					objHeight = 360;
				} else {

				}
				self.calculate();
			};

			var resizeDlg = function() {
				container.find('DIV.modal-dialog').css('max-width', '100%');
				container.find('DIV.modal-dialog').css('max-height', '100%');
				container.find('DIV.modal-dialog').css('width', dlgWidth + 'px');
				container.find('DIV.modal-dialog').css('height', dlgHeight + 'px');
				container.find('DIV.modal-body').css('height', (dlgHeight - Math.abs(container.find('DIV.modal-header').height())) + 'px');
				container.find('DIV.modal-body').css('text-align', 'center');
			};

			var render = function(callback) {
				getDimension();
				var viewer = null;
				if (mediaType == 'image') {
					var viewer_w = '100%';
					var viewer_h = '100%';
					if (objWidth < dlgWidth) {
						viewer_w = objWidth + 'px';
						viewer_h = objHeight + 'px';
					}
					viewer = $('<img />', {
						'id': 'vLightBoxImage',
						'width': viewer_w,
						'height': viewer_h,
						'src': o.src
					})
				} else if (mediaType == 'video') {
					if (viewer == null || viewer == undefined) {
						viewer = $('<video autobuffer controls></video>').append($('<source></source>', {
							'src': o.src,
							'type': mimeType
						}));
					}
				} else {

				}
				$(container).find('DIV.modal-body').html(viewer);

				if (callback !== undefined) {
					callback();
				}
			};

			this.setup = function(opts) {
				o = opts;
			};

			this.show = function() {
				$(container).on('show.bs.modal', function() {
					render(function() {
						resizeDlg();
					});
				})
					.on('shown.bs.modal', function() {

					})
					.on('hidden.bs.modal', function(e) {
						dlgWidth = defaultDlgWidth;
						dlgHeight = defaultDHeight;
						$(this).unbind();
					});

				$(container).modal('show');
			};

			this.calculate = function() {
				maxWidth = Math.ceil($(document).width() / 100 * 85);
				maxHeight = Math.ceil($(document).height() / 100 * 85);
				var ratio = (objWidth / objHeight);

				if (objWidth > dlgWidth || objHeight > dlgHeight) {
					dlgWidth = objWidth > maxWidth ? maxWidth : objWidth;
					dlgHeight = parseInt(objHeight) <= maxHeight ? parseInt(objHeight) : Math.ceil((dlgWidth * objHeight) / objWidth);
				} else {
					dlgWidth = objWidth;
					dlgHeight = objHeight;
				}

				if (dlgHeight > maxHeight) {
					dlgHeight = maxHeight;
					dlgWidth = Math.ceil(dlgHeight * ratio);
				}
			};

			this.initialize = function() {
				init();
				return this;
			};

			return this.initialize();
		}
	});