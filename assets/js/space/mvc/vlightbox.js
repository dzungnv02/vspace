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
				initVideoPlayer();
				initImageViewer();
				videojs.options.flash.swf = server + includeDir + 'video.js/video-js.swf';
			};

			var initVideoPlayer = function() {
				if (videoPlayer == null || videoPlayer == undefined) {
					videoPlayer = $('<video></video>', {
						'id': 'vLightBoxVideo',
						'controls': true,
						'width': '100%',
						'height': '100%',
						'class': 'video-js vjs-default-skin'
					}).append($('<source></source>', {
						'src': dummyvideo,
						'type': 'video/mp4'
					}));
				}
				videoPlayer.hide();
				$(container).find('DIV.modal-body').append(videoPlayer);
				videojsObj = videojs('vLightBoxVideo', {
					'controls': true,
					'autoplay': true,
					'preload': 'auto'
				});
			}

			var initImageViewer = function() {
				imageViewer = $('<img />', {
					'id': 'vLightBoxImage',
					'width': '100%',
					'height': '100%',
				});
				imageViewer.hide();
				$(container).find('DIV.modal-body').append(imageViewer);
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

			var renderVideoPlayer = function() {
				/*$(videoPlayer).empty();
				$(videoPlayer).append($('<source></source>', {
					'src': o.src,
					'type': mimeType
				}));

				videoPlayer.show();

				videojs('vLightBoxVideo', {
					'controls': true,
					'autoplay': true,
					'preload': 'auto'
				});*/
			};

			var renderImageViewer = function() {
				imageViewer[0].src = o.src;
				$(imageViewer).ready(function(e) {
					if (objWidth < dlgWidth) {
						$(imageViewer).attr('width', objWidth + 'px');
						$(imageViewer).attr('height', objHeight + 'px');
					} else {
						$(imageViewer).attr('width', '100%');
						$(imageViewer).attr('height', '100%');
					}
				});
				imageViewer.show();
			};

			var resetVideoplayer = function() {
				/*if (videojs.getPlayers()['vLightBoxVideo']) {
					videojs.getPlayers()['vLightBoxVideo'].dispose();
					$(container).find('DIV.modal-body').find('DIV#vLightBoxVideo').remove();
				}
				$(container).find('DIV.modal-body').empty();
				delete videoPlayer;
				initVideoPlayer();*/
			};

			var resetImageViewer = function() {
				/*$(container).find('DIV.modal-body').empty();
				delete imageViewer;
				initImageViewer();*/
			};

			var render = function(callback) {
				getDimension();
				if (mediaType == 'image') {
					renderImageViewer();
				} else if (mediaType == 'video') {
					renderVideoPlayer();
				} else {

				}

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
						//resetVideoplayer();
						//resetImageViewer();
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