$.extend(
	$.fn, {
		vsTinyMCE: function(o) {
			if (o == null) o = {};
			var self = this;

			/**************************
			 * EVENT HANDLING - BEGIN *
			 *************************/

			/**************************
			 * EVENT HANDLING - END *
			 *************************/

			var init = function() {

			};

			var renderImageBox = function() {

			};

			var renderVideoBox = function() {

			};

			var renderMusicBox = function() {

			};

			var renderFileBox = function() {

			};

			var detectMineType = function(item) {
				var aryImages = ['jpg', 'jpeg', 'png', 'gif', 'tiff', 'dvg', 'bmp'];
				var aryHTML5Video = ['mp4', 'm4v', 'webm', 'ogg'];
				var aryFlashVideos = ['flv', 'avi', 'mpg'];
				var aryAudios = ['mp3', 'ogg', 'wav'];

				var objType = {
					type: null,
					apptype: null
				}

				if (item.minetype == undefined) return {
					type: 'dir',
					apptype: 'vspace/dir'
				};
				if ($.inArray(item.minetype, aryImages) > -1) return {
					type: 'img',
					apptype: 'application/' + item.minetype
				};
				if ($.inArray(item.minetype, aryHTML5Video) > -1) {
					return {
						type: 'html5video',
						apptype: $.inArray(item.minetype, ['mp4', 'm4v']) > -1 ? 'video/mp4' : (item.minetype == 'ogg' ? 'video/ogg' : 'video/webm')
					}
				}
				if ($.inArray(item.minetype, aryFlashVideos) > -1) {
					return {
						type: 'flashvideo',
						apptype: 'application/' + item.minetype
					};
				}
				if ($.inArray(item.minetype, aryAudios) > -1) {
					return {
						type: 'html5audio',
						apptype: item.minetype == 'mp3' ? 'audio/mpeg' : (item.minetype == 'ogg' ? 'audio/ogg' : 'audio/wav')
					};
				}

				return {
					type: 'file',
					apptype: 'application/' + item.minetype
				};
			}

			this.tinymcePreview = function(item) {
				
				mimeType = MimeType.lookup(item.file);
				var aryMimeType = mimeType.split('/');
				mediaType = aryMimeType[0];

				console.debug(mediaType);
				
				var width = 320;
				var height = 240;

				/*var item = o.data.FILES[searchItemByID(item.id, 'file')];
				var type = addonDetectMineType(item);
				var width = 320;
				var height = 240;
				var dlgHtml = '';
				if (type.type == 'img') {
					var theImage = new Image();
					theImage.src = item.fileurl;
					height = theImage.height;
					width = theImage.width;
				}*/

				/*else if (type.type == 'html5video') {
					$(addonPreviewElement).get(0).pause();
				} else if (type.type == 'html5audio') {
					$(addonPreviewElement).get(0).pause();
					width = '200';
					height = '20';
				}*/

				var html = '<form id="addonDialog" class="form-horizontal" role="form">' +
					'<div class="col-sm-12">'

				+' <div class="form-group">' +
				'     <label for="" class="col-sm-2 control-label no-padding-right">URL</label>' +
				'     <div class="col-sm-10">' +
				'         <input type="text" id="addonFileUrl" name="" class="form-control" value="' + item.src + '">' +
					'     </div>' +
					' </div>'

				+
				' <div class="form-group">' +
				'     <label for="" class="col-sm-2 control-label no-padding-right">Mô tả</label>' +
				'     <div class="col-sm-10">' +
				'         <input type="text" id="addonFileDescription" name="" class="form-control">' +
				'     </div>' +
				' </div>'

				+
				' <div class="space-4"></div>';

				if (mediaType != 'html5audio' && mediaType != 'file') {
					html += ' <div class="form-group">' +
						'     <label for="" class="col-sm-2 control-label no-padding-right">Kích thước</label>' +
						'     <div class="col-sm-10">' +
						'         <div class="row">' +
						'             <div class=" col-sm-5">' +
						'                 <input type="text" id="addonFileWidth" name="" class="form-control" value="' + width + '" onchange="changeWidth(this)">' +
						'             </div>' +
						'             <div class="col-sm-1" style="padding-top: 8px">X</div>' +
						'             <div class=" col-sm-6">' +
						'                 <input type="text" id="addonFileHeight" name="" class="form-control" value="' + height + '" onchange="changeHeight(this)">' +
						'             </div>' +
						'         </div>' +
						'     </div>' +
						' </div>' +
						' <div class="form-group">' +
						'     <label for="" class="col-sm-2 control-label no-padding-right">Căn lề</label>' +
						'         <div class="col-sm-10 btn-group" data-toggle="buttons">' +
						'             <label class="btn"><input id="addonAlignLeft" name="addonAlign" type="radio" value="left" checked><i class="icon-only ace-icon fa fa-align-left"></i></label>' +
						'             <label class="btn"><input id="addonAlignCenter" name="addonAlign" type="radio" value="center"><i class="icon-only ace-icon fa fa-align-center"></i></label>' +
						'             <label class="btn"><input id="addonAlignRight" name="addonAlign" type="radio" value="right"><i class="icon-only ace-icon fa fa-align-right"></i></label>' +
						'         </div>' +
						' </div>';
				}

				html += '</div>' +
					'</form>' +
					'<div class="clearfix"></div>' +
					'<script>' +
					'   var originWidth = ' + width + ';' +
					'   var originHeight = ' + height + ';' +
					'   var changeWidth = function (el) {' +
					'        var hEl = $("#addonFileHeight");' +
					'        if ($(el).val() > 0) {' +
					'            tp = (parseInt($(el).val()) / parseInt(originWidth)) * originHeight;' +
					'            $(hEl).val(tp.toFixed(0));' +
					'        }' +
					'    };' +
					'    var changeHeight = function (el) {' +
					'        var wEl = $("#addonFileWidth");' +
					'        if ($(el).val() > 0) {' +
					'            tp = (parseInt($(el).val()) / parseInt(originHeight)) * originWidth;' +
					'            $(wEl).val(tp.toFixed(0));' +
					'        }' +
					'    };' +
					'</script>';

				var dlg = bootbox.dialog({
						title: 'Chèn ảnh/video/file vào văn bản',
						message: html,
						show: false,
						buttons: {
							'Chèn': {
								label: "Chèn",
								callback: function() {
									self.addonInsertToEditor({
										tag: 'img',
										src: item.src,
										width: $("#addonFileWidth").length ? $('#addonFileWidth').val() : width,
										height: $("#addonFileHeight").length ? $('#addonFileHeight').val() : height,
										description: $('#addonFileDescription').val(),
										align: $("input:radio[name=addonAlign]").length ? $("input:radio[name=addonAlign]:checked").val() : 'left',
										type: mediaType/*,
										apptype: type.apptype*/
									});
								}
							},
							cancel: {
								label: "Hủy bỏ"
							}
						}
					})
					.on('shown.bs.modal', function(e) {})
					.on('hide.bs.modal', function(e) {})
					.modal('show');
			};

			this.addonInsertToEditor = function(content) {
				var messageSrc = document.referrer;
				var objMsg = {
					command: 'mceInsertContent',
					data: content
				};
				var msg = JSON.stringify(objMsg);
				XD.postMessage(msg, document.referrer);
			};

			this.initialize = function() {
				init();
				return this;
			};

			return this.initialize();
		}
	});