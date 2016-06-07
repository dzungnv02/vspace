$.extend(
	$.fn, {
		vLightbox: function(o) {
			if (o == null) o = {};

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
			var videojsObj = null;

			var objWidth = '320';
			var objHeight = '240';

			var defaultDlgWidth = '320';
			var defaultDHeight = '240';

			var dlgWidth = defaultDlgWidth;
			var dlgHeight = defaultDHeight;

			var supportedType = ['image', 'video', 'audio', 'text'];
			var supportedPlayer = [];

			var init = function() {
				initModal();
				videojs.options.flash.swf = server + includeDir + 'video.js/video-js.swf';
			};

			var initVideoPlayer = function() {
				videoPlayer = $('<video></video>', {
					'id': 'vLightBoxVideo',
					'controls': true,
					'width': '100%',
					'height': '100%',
					'class': 'video-js vjs-default-skin'
				})
			}

			var initAudioPlayer = function() {
				audioPlayer = $('<audio></audio>', {
					'id': 'vLightBoxAudio',
					'controls': 'controls',
					'class': 'video-js vjs-default-skin'
				});
			};

			var initTextViewer = function() {
				textViewer = $('<iframe />', {
					'id': 'vLightBoxText'
				});
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

				/*var dlgHeader = $('<div></div>', {
						class: 'modal-header',
						style: 'padding:5px;background: rgba(0, 0, 0, 0.4);margin:0px;'
					})
					.append($('<span></span>', {
						id: 'previewTitle',
						class: 'modal-title',
						style: 'font-size:10px;min-height:10px;color:#aaa;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;'
					}));*/

				var dlgBody = $('<div></div>', {
					class: 'modal-body',
					style: 'padding:0px;border:none;margin:0px;background: rgba(0, 0, 0, 0.4)'
				});

				var dlgFooter = $('<div></div>', {
					class: 'modal-footer'
				});
				container.append(modalDlg.append(dlgContent.append( /*dlgHeader, */ dlgBody)));
				$('BODY').append(container);
			};

			var getDimension = function() {
				var mimeType = MimeType.lookup(o.file);
				var aryMimeType = mimeType.split('/');
				mediaType = aryMimeType[0];

				if (mediaType == 'image') {
					objWidth = o.preload.naturalWidth;
					objHeight = o.preload.naturalHeight;
				} else if (mediaType == 'video') {

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

			this.setup = function(opts) {
				o = opts;
			};

			this.show = function() {
				$(container).on('show.bs.modal', function() {
					self.render(function() {
						resizeDlg();
					});
				})
					.on('shown.bs.modal', function() {

					})
					.on('hidden.bs.modal', function() {
						dlgWidth = defaultDlgWidth;
						dlgHeight = defaultDHeight;
					});

				$(container).modal('show');
			};

			this.render = function(callback) {
				container.find('DIV.modal-body').empty();
				if (mediaType == 'image') {
					container.find('DIV.modal-body').append(o.preload);
					$(o.preload).ready(function(e) {
						getDimension();
						if (objWidth < dlgWidth) {
							$(o.preload).attr('width', objWidth + 'px');
							$(o.preload).attr('height', objHeight + 'px');
						} else {
							$(o.preload).attr('width', '100%');
							$(o.preload).attr('height', '100%');
						}
						//container.find('DIV.modal-header span').html('File: <strong>' + o.file + '</strong>');
					});

				} else if (mediaType == 'video') {

				} else {

				}

				if (callback !== undefined) {
					callback();
				}

			};

			this.calculate = function() {

				maxWidth = Math.ceil($(document).width() / 100 * 85);
				maxHeight = Math.ceil($(document).height() / 100 * 85);
				var ratio = (objWidth / objHeight);

				if (objWidth > dlgWidth || objHeight > dlgHeight) {
					dlgWidth = objWidth > maxWidth ? maxWidth : objWidth;
					dlgHeight = parseInt(objHeight) <= maxHeight ? parseInt(objHeight) : Math.ceil((dlgWidth * objHeight) / objWidth);
					//dlgHeight += parseInt(Math.abs(container.find('DIV.modal-header').height()));
				} else {
					dlgWidth = objWidth;
					dlgHeight = objHeight;
				}

				if (dlgHeight > maxHeight) {
					dlgHeight = maxHeight;
					dlgWidth = Math.ceil(dlgHeight * ratio);
					//dlgWidth = Math.ceil((dlgHeight - Math.abs(container.find('DIV.modal-header').height())) * ratio);
				}
			};

			this.initialize = function() {
				init();
				return this;
			};

			return this.initialize();
		}
	});