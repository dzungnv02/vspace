$.extend(
	$.fn, {
		vsUpload: function(o) {
			if (o == null) o = {};
			var self = this;
			var uploadDlg = null;
			var dropZoneId = 'drop-zone';
			var maxfile = 5;
			var maxsize = 200 * 1024 * 1024;
			var init = function() {};

			var initUploadZone = function() {
				var dropZone = $('<div></div>', {
					id: dropZoneId,
					text: 'Kéo & thả file từ máy tính của bạn vào đây!'
				});
				return dropZone;
			};

			var onloadDlg = function(dropZone) {
				$(dropZone).on('dragenter', function(e) {
						e.stopPropagation();
						e.preventDefault();
					})
					.on('dragover', function(e) {
						e.stopPropagation();
						e.preventDefault();
					})
					.on('drop', function(e) {
						e.preventDefault();
						handlerDropFile(e);
					});
			};

			var handlerDropFile = function(e) {
				var files = e.originalEvent.dataTransfer.files;
				var limit = files.length < maxfile ? files.length : maxfile;
				var dropZone = $('#' + dropZoneId);
				var fd = new FormData();

				if ($(dropZone).find('DIV.fileuploading').length == 0) {
					$(dropZone).css('line-height', 'normal');
					$(dropZone).text('');
				}

				for (var i = 0; i < limit; i++) {
					var spName = $('<span></span>', {
						'class': 'filename'
					}).text(files[i].name);
					var spSize = $('<span></span>', {
						'class': 'filesize'
					}).text(objUltis.formatFileSize(files[i].size, 2));
					var divFile = $('<div></div>', {
							'class': 'fileuploading'
						})
						.append(spName).append(spSize);
					
					if (files[i].size > maxsize) {
						$(spSize).addClass('error');
					}
					else {
						fd.append('file', files[i]);
					}

					$(dropZone).append(divFile);
				}

				objSpaceModel.upload(fd, function () {
					console.log('Uploaded!');
				});
			};

			this.showUploadDlg = function() {
				var dropZone = initUploadZone();
				uploadDlg = bootbox.dialog({
						title: 'UPLOAD',
						message: $(dropZone),
						show: false
					})
					.on('shown.bs.modal', function() {
						objSpaceModel.getUploadHandler(function (a) {console.log(a)});
						onloadDlg(dropZone);
					})
					.modal('show');
			};

			this.initialize = function() {
				init();
				return this;
			};

			return this.initialize();
		}
	});