$.extend(
	$.fn, {
		vsSpaceModel: function(o) {
			if (o == null) o = {};

			var uploadHandler = null;
			var session = null;
			var parsedData = null;
			var self = this;

			var init = function() {
				if (!modelExisted) {
					objConnection.ping();
					modelExisted = true;
				}
				return false;
			};

			this.setOptions = function(opts) {
				o = opts;
			};

			this.getOptions = function(opt) {
				if (opt == null) return o;
				else return eval('o.' + opt);
			};

			this.login = function(username, password, dlg, callback) {
				if (callback(username, password)) {
					var opts = {
						script: '/privatecontent/login/1',
						postdata: {
							username: username,
							password: password
						},
						callbackSuccess: function(result, status, xhr) {
							session = Base64.decode(result.USER.session);
							uploadHandler = Base64.decode(result.USER.uhandler);
							objController.refresh();
							dlg.modal('hide');
						},
						callbackFail: function(xhr, status, error) {
							var customErr = {
								el: null,
								err: null
							};

							if (error == 'errUserNotFound') {
								customErr = {
									el: 'username',
									err: 'Username không tồn tại!'
								};
							} else if (error == 'errIncorrectPassword') {
								customErr = {
									el: 'password',
									err: 'Password không đúng!'
								};
							}
							callback(username, password, customErr);
						}
					};

					objConnection.sendCommand(opts);
				}
			};

			this.getListItemsByParentId = function(itemId, callback) {
				if (itemId == undefined) itemId = null;
				objConnection.sendCommand({
					script: '/ajax/privatecontent/getcontent',
					postdata: {
						id: itemId
					},

					callbackSuccess: function(result, status, xhr) {
						parsedData = {
							folder: [],
							file: []
						};

						var idx = 0;
						if (result.folder != undefined) {
							if (!$.isArray(result.folder)) {
								var aryDir = [result.folder];
								result.folder = aryDir;
							}

							for (var i = 0; i < result.folder.length; i++) {
								if (result.folder[i].name === '..') continue;
								parsedData.folder[idx] = result.folder[i];
								parsedData.folder[idx].parentID = itemId;
								idx++;
							}
						}

						if (result.file != undefined) {
							if (!$.isArray(result.file)) {
								var aryFile = [result.file];
								parsedData.file = aryFile;
							} else {
								parsedData.file = result.file;
							}
						}

						callback(parsedData);
					},
					callbackFail: function(xhr, status, error) {
						if (status != 'Login')
							bootbox.alert(error);
						else {
							objUser.showLogin();
						}
					}
				});
			};

			this.createFolder = function(newFolderName, destination, dlg, callback) {
				if (!callback(newFolderName)) {
					return false;
				}

				var opts = {
					script: '/ajax/privatecontent/createdir',
					postdata: {
						destination: destination,
						foldername: newFolderName
					},
					callbackSuccess: function(result, status, xhr) {
						objController.refresh();
						dlg.modal('hide');
					},
					callbackFail: function(xhr, status, error) {
						var customErr = {
							el: status,
							err: error
						};
						callback(newFolderName, customErr);
					}
				};

				objConnection.sendCommand(opts);
			};

			this.delete = function(aryId, callback) {
				if (aryId == undefined || aryId.length == 0) return false;

				var opts = {
					script: '/ajax/privatecontent/delete',
					postdata: {
						id: aryId.join()
					},
					timeout: 0,					
					callbackSuccess: function(result, status, xhr) {
						if (callback == undefined) {
							objController.refresh();
						} else callback();
					},
					callbackFail: function(xhr, status, error) {
						bootbox.alert(error);
					}
				};

				objConnection.sendCommand(opts);
			}


			this.upload = function(formData, progressBar, callback) {
				formData.append('sid', session);
				formData.append('dir', objTree.getSelectedNode());

				var jqXHR = $.ajax({
					xhr: function() {
						var xhrobj = $.ajaxSettings.xhr();
						if (xhrobj.upload) {
							xhrobj.upload.addEventListener('progress', function(event) {
								var percent = 0;
								var position = event.loaded || event.position;
								var total = event.total;
								if (event.lengthComputable) {
									percent = Math.ceil(position / total * 100);
								}
								$(progressBar).find('DIV').css('width', percent + '%');

							}, false);
						}
						return xhrobj;
					},
					url: uploadHandler,
					crossDomain: true,
					type: "POST",
					dataType: 'xml',
					contentType: false,
					processData: false,
					cache: false,
					data: formData,
					timeout: 0,
					success: function(data) {
						callback(data);
					}
				});
			};

			this.getUploadHandler = function(callback) {
				var opts = {
					script: '/ajax/privatecontent/getuploadhandler',
					postdata: {},
					callbackSuccess: function(result, status, xhr) {
						session = Base64.decode(result.data.session);
						uploadHandler = Base64.decode(result.data.uhandler);
						callback(uploadHandler);
					},
					callbackFail: function(xhr, status, error) {
						if (status != 'Login')
							bootbox.alert(error);
						else {
							objUser.showLogin();
						}
					}
				};

				objConnection.sendCommand(opts);
			}

			this.getLoadedDirs = function(id) {
				if (id == undefined) return parsedData.folder;
				for (var i = 0; i < parsedData.folder.length; i++) {
					if (parsedData.folder[i].id == id) {
						return parsedData.folder[i];
					}
				}
			};

			this.getLoadedFiles = function(id) {
				if (id == undefined) return parsedData.file;
				for (var i = 0; i < parsedData.file.length; i++) {
					if (parsedData.file[i].id == id) {
						return parsedData.file[i];
					}
				}
			};

			this.initialize = function() {
				init();
				return this;
			};

			return this.initialize();
		}
	});