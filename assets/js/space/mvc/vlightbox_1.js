$.extend(
	$.fn, {
		vLightbox: function(o) {
			if (o == null) o = {};

			var self = this;
			var container = null;
			var maxWidth = 0;
			var maxHeight = 0;
			var imageViewer = null;
			var videoPlayer = null;
			var audioPlayer = null;
			var textViewer = null;
			var currentPlayer = null;
			var mediaType = 'image';
			var videojsObj = null;

			var defaultWidth = '320';
			var defaultHeight = '240';

			var supportedType = ['image', 'video', 'audio', 'text'];
			var supportedPlayer = [];

			var init = function() {
				initModal();
				videojs.options.flash.swf = server + includeDir + 'video.js/video-js.swf';
			};

			var initImageViewer = function() {
				imageViewer = $('<img />', {
					'id': 'vLightBoxImage',
					'width': '100%',
					'height': '100%',
				});
			};

			var initVideoPlayer = function() {
				videoPlayer = $('<video></video>', {
					'id': 'vLightBoxVideo',
					'controls': true,
					'width': '100%',
					'height': '100%',
					'class': 'video-js vjs-default-skin'
				})/*.append($('<source></source>', {
					'src': dummyvideo,
					'type': 'video/mp4'
				}));*/
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

				var dlgHeader = $('<div></div>', {
						class: 'modal-header',
						style: 'padding:5px;background: rgba(0, 0, 0, 0.4);margin:0px;'
					})
					.append($('<span></span>', {
						id: 'previewTitle',
						class: 'modal-title',
						style: 'font-size:10px;min-height:10px;color:#aaa;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;'
					}));

				var dlgBody = $('<div></div>', {
					class: 'modal-body',
					style: 'padding:0px;border:none;margin:0px;background: rgba(0, 0, 0, 0.4)'
				});

				var dlgFooter = $('<div></div>', {
					class: 'modal-footer'
				});
				container.append(modalDlg.append(dlgContent.append(dlgHeader, dlgBody)));
				$('BODY').append(container);
			};

			/*var renderImageViewer = function() {
				var preloadedObj = o.preload;
				$(preloadedObj).attr('width', '100%');
				$(preloadedObj).attr('height', '100%');
				defaultWidth = preloadedObj[0].naturalWidth;
				defaultHeight = preloadedObj[0].naturalHeight;
				$(currentPlayer).attr('src', o.src);

				$(supportedPlayer).each(function(index) {
					$(this).hide();
					$(container).find('DIV.modal-body').append(this);
				});

				$(currentPlayer).show();
			};

			var renderVideoPlayer = function() {
				var mimeType = MimeType.lookup(o.file);
				$(supportedPlayer).each(function(index) {
					$(this).hide();
					$(container).find('DIV.modal-body').append(this);
				});

				if (videojs.getPlayers()['vLightBoxVideo'] != undefined) {
					if (videojs.getPlayers()['vLightBoxVideo'].isReady) {
						videojs.getPlayers()['vLightBoxVideo'].destroy();
					} else {
						delete videojs.getPlayers()['vLightBoxVideo'];
					}

					$(container).find('DIV.modal-body').find('DIV#vLightBoxVideo').remove();
					initVideoPlayer();
					supportedPlayer[supportedType.indexOf('video')] = videoPlayer;
					videoPlayer.hide();

					$(container).find('DIV.modal-body').append(videoPlayer);
					currentPlayer = videoPlayer;
				}

				$(currentPlayer).empty();
				$(currentPlayer).append($('<source></source>', {
					'src': o.src,
					'type': mimeType
				}));

				$(currentPlayer).show();
				videojs('vLightBoxVideo', {
					'controls': true,
					'autoplay': true,
					'preload': 'auto'
				});
			};

			var resetViewer = function() {
				$(container).find('DIV.modal-body').empty();
				$(supportedPlayer).each(function(index) {
					$(this).hide();
					if ($(container).find('DIV.modal-body').find(this).length == 0)
						$(container).find('DIV.modal-body').append(this);
				});
			}*/

			this.setup = function(opts) {
				o = opts;
			};

			this.show = function() {
				/*resetViewer();
				self.render();
				
				filename = container.find('DIV.modal-body :first-child').attr('data-name');
				container.find('DIV.modal-header span').html('File: <strong>' + filename + '</strong> - Kích thước: ' + defaultWidth + 'px × ' + defaultHeight + 'px');
				var width = defaultWidth > maxWidth ? maxWidth : defaultWidth;
				var ratio = (defaultWidth / defaultHeight);

				var height = parseInt(defaultHeight) <= maxHeight ? parseInt(defaultHeight) : Math.ceil((width * defaultHeight) / defaultWidth);
				height += parseInt(Math.abs(container.find('DIV.modal-header').height()));

				if (height > maxHeight) {
					height = maxHeight;
					width = Math.ceil((height - Math.abs(container.find('DIV.modal-header').height())) * ratio);
				}

				container.find('DIV.modal-dialog').css('max-width', '100%');
				container.find('DIV.modal-dialog').css('max-height', '100%');
				container.find('DIV.modal-dialog').css('width', width + 'px');
				container.find('DIV.modal-dialog').css('height', height + 'px');
				container.find('DIV.modal-body').css('height', (height - Math.abs(container.find('DIV.modal-header').height())) + 'px');

				$(container).modal('show');*/
			};

			this.render = function() {
				/*var mimeType = MimeType.lookup(o.file);
				var type = 'unsupported';
				var aryMimeType = mimeType.split('/');
				mediaType = aryMimeType[0];
				self.calculate();
				currentPlayer = supportedPlayer[supportedType.indexOf(mediaType)];

				if (mediaType == 'image') renderImageViewer();
				if (mediaType == 'video') renderVideoPlayer();


				$(container).on('shown.bs.modal', function(event) {
					if (mediaType == 'video') {
						
					}
				})
				.on('hidden.bs.modal', function () {
					if (mediaType == 'video') {
						currentPlayer.pause();
						currentPlayer.dispose();
					}
				});*/
			};

			this.calculate = function() {
				maxWidth = Math.ceil($(document).width() / 100 * 85);
				maxHeight = Math.ceil($(document).height() / 100 * 85);
			};

			this.initialize = function() {
				init();
				return this;
			};

			return this.initialize();
		}
	});