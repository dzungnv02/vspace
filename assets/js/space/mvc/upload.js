$.extend(
	$.fn, {
		vsUpload: function(o) {
			if (o == null) o = {};
			var self = this;
			var uploadDlg = null;
			var dropZoneId = 'drop-zone';
			var maxfile = 20;
			var maxsize = 200 * 1024 * 1024;
			var isUploaded = false;
			var init = function() {};
			var inputFile = $('<input />',{type:'file',id:'uploadFiles', 'multiple':'multiple'});

			var initUploadZone = function() {
				var dropZone = $('<div></div>', {
					id: dropZoneId,
					text: 'Kéo & thả file từ máy tính của bạn (hoặc click) vào đây để tải file !',
					style:'cursor: pointer; cursor: hand;'
				});

				dropZone.unbind('click').bind('click', function (){
					inputFile.trigger('click');
				});
				return dropZone;
			};

			var fileInputSelected = function (e) {
				var files = e.target.files;
				handlerDropFile(files);
			};

			var onloadDlg = function(dropZone) {
				inputFile.unbind('change').bind('change', function (e) {
					fileInputSelected(e);
				});	

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
						var files = e.originalEvent.dataTransfer.files;
						handlerDropFile(files);
					});
			};

			var handlerDropFile = function(files) {
				var limit = files.length < maxfile ? files.length : maxfile;
				var dropZone = $('#' + dropZoneId);
				var fileValid = [];

				if ($(dropZone).find('DIV.fileuploading').length == 0) {
					$(dropZone).css('line-height', 'normal');
					$(dropZone).text('');
				}

				for (var i = 0; i < limit; i++) {
					var formData = new FormData();

					var spName = $('<span></span>', {
						'class': 'filename'
					}).text(files[i].name);
					var spSize = $('<span></span>', {
						'class': 'filesize'
					}).text(objUltis.formatFileSize(files[i].size, 2));

					var spProgress = $('<span></span>', {
							'id': files[i].name,
							'class': 'progress progress-mini uploadprogess'
						})
						.append($('<div></div>', {
							'class': 'progress-bar progress-danger',
							'style': 'width:0%'
						}));

					var divFile = $('<div></div>', {
							'class': 'fileuploading'
						})
						.append(spName).append(spSize);

					if (files[i].size > maxsize) {
						$(spSize).addClass('error');
					} else {
						$(divFile).append(spProgress);
						fileValid[fileValid.length] = files[i];
					}

					$(dropZone).append(divFile);
				}

				if (fileValid.length > 0) {
					for (var i = 0; i < fileValid.length; i++) {
						var formData = new FormData();
						var progressBar = $('SPAN.progress[id="' + fileValid[i].name + '"]');
						formData.append('file', fileValid[i]);
						formData.append('sid', appprofile.session);
						formData.append('dir', objTree.getSelectedNode());

						if (fileValid[i].type == 'application/zip') formData.append('unpack', 'true');

						objSpaceModel.upload(formData, progressBar, function(xmldata) {
							isUploaded = true;
							var files = [];
							var dirs = [];

							$(xmldata).find('list').find('folder').each(function(idx) {
								dirs[idx] = {
									id: $(this).attr('id'),
									name: $(this).attr('name'),
									parentID: objTree.getSelectedNode(),
									type: $(this).attr('type'),
									size: $(this).attr('size'),
									date: $(this).attr('date'),
									subdirs: $(this).attr('subdirs')
								};
							});

							$(xmldata).find('list').find('file').each(function(idx) {
								files[idx] = {
									id: $(this).attr('id'),
									name: $(this).attr('name'),
									parentID: objTree.getSelectedNode(),
									type: $(this).attr('type'),
									size: $(this).attr('size'),
									date: $(this).attr('date'),
									thumbnail: $(this).attr('thumbnail')
								};
							});

							var items = {
								folder: dirs,
								file: files
							};
							objGrid.renderGrid(items, true);
						});
					}
				}
			};

			this.showUploadDlg = function() {
				var dropZone = initUploadZone();
				uploadDlg = bootbox.dialog({
					title: 'Tải ',
					message: dropZone,
					show: false
				})
					.on('shown.bs.modal', function(e) {
						isUploaded = false;
						onloadDlg(dropZone);
					}).
				on('hide.bs.modal', function(e) {
					if (isUploaded == true) objController.refresh();
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