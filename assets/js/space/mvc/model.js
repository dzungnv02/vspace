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

			this.loadSpace = function(callback) {
				var opts = {
					script: '/privatecontent/onload',
					postdata: {},
					timeout:0,
					callbackSuccess: function(result, status, xhr) {
						callback(result);
						objLayout.changeLoginButtonStatus();						
					},
					callbackFail: function(xhr, status, error) {
						if (status == 'Login') {
							objLayout.changeLoginButtonStatus();
							objUltis.alert(error, function() {								
								objUser.showLogin();
							});
						} else {
							objUltis.alert(error, function() {
								console.log(xhr);
							});
						}
					},
					callbackDone: function(xhr, status) {
						objLayout.loaded();
					}
				};
				objConnection.sendCommand(opts);
			};

			this.login = function(username, password, callback) {
				if (callback(username, password)) {
					var opts = {
						script: '/privatecontent/login',
						postdata: {
							username: username,
							password: password
						},
						callbackSuccess: function(result, status, xhr) {						
							appprofile = result.USER;
							objController.refresh();
							objLayout.changeLoginButtonStatus();
						},
						callbackFail: function(xhr, status, error) {
							var customErr = null;

							if (error == 'errUserNotFound') {
								customErr = 'Tài khoản không tồn tại!'
							} else if (error == 'errIncorrectPassword') {
								customErr = 'Mật khẩu không đúng!'
							}
							callback(username, password, customErr);
						},
						callbackDone: function(xhr, status) {
							objLayout.loaded();
						}
					};
					objConnection.sendCommand(opts);
				}
			};

			this.logout = function(callback) {
				var opts = {
					script: '/ajax/privatecontent/logout',
					postdata: {},
					callbackSuccess: function(result, status, xhr) {						
						callback(result);
						appprofile = null;
						objLayout.changeLoginButtonStatus();
					},
					callbackFail: function(xhr, status, error) {
						objUltis.alert(error, function() {
							console.log(xhr);
						});
					}
				};
				objConnection.sendCommand(opts);
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
						var sizeUsed = 0;
						if (result.folder != undefined) {
							if (!$.isArray(result.folder)) {
								var aryDir = [result.folder];
								result.folder = aryDir;
							}

							for (var i = 0; i < result.folder.length; i++) {
								if (result.folder[i].name === '..') continue;
								parsedData.folder[idx] = result.folder[i];
								parsedData.folder[idx].parentID = itemId;
								sizeUsed += parseFloat(parsedData.folder[idx].size);
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

							for (var i = 0; i < parsedData.file.length; i++) {
								sizeUsed += parseFloat(parsedData.file[i].size);
							}
						}

						if (itemId == null || itemId == -1) totalSizeUsed = sizeUsed;

						callback(parsedData);
					},
					callbackFail: function(xhr, status, error) {
						if (status == 'Login') {
							objUltis.alert(error, function() {
								objUser.showLogin();
							});
						} else {
							objUltis.alert(error, function() {
								console.log(xhr);
							});
						}
					}
				});
			};

			this.createFolder = function(newFolderName, destination) {
				var opts = {
					script: '/ajax/privatecontent/createdir',
					postdata: {
						destination: destination,
						foldername: newFolderName
					},
					callbackSuccess: function(result, status, xhr) {
						objController.refresh();
						objUltis.notification('Đã tạo thư mục '+newFolderName);
					},
					callbackFail: function(xhr, status, error) {
						if (status == 'Login') {
							objUltis.alert(error, function() {
								objUser.showLogin();
							})
						} else {
							var customErr = {
								el: status,
								err: error
							};
							objUltis.notification(status+': '+error)
						}
					}
				};

				objConnection.sendCommand(opts);
			};

			this.delete = function(items, callback) {
				if (items == undefined || items.length == 0) return false;

				var opts = {
					script: '/ajax/privatecontent/delete',
					postdata: {
						id: items.join()
					},
					timeout: 0,
					callbackSuccess: function(result, status, xhr) {
						if (callback == undefined) {
							objController.refresh();
						} else callback();
					},
					callbackFail: function(xhr, status, error) {
						if (status == 'Login') {
							objUltis.alert(error, function() {
								objUser.showLogin();
							});
						} else {
							objUltis.alert(error, function() {
								console.log(xhr);
							});
						}
					}
				};

				objConnection.sendCommand(opts);
			};

			this.upload = function(formData, progressBar, callback) {
				var bar = $(progressBar).find('div');
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
								bar.css('width', percent + '%');
								if (percent == 100) bar.addClass('progress-wait');
							}, false);
						}
						return xhrobj;
					},
					url: window.atob(appprofile.uhandler) + 'space/upload',
					crossDomain: true,
					type: "POST",
					dataType: 'xml',
					contentType: false,
					processData: false,
					cache: false,
					data: formData,
					timeout: 0,
					success: function(data) {
						callback(data, bar);
					},
					error: function() {
						objUltis.alert(error, function() {
							console.log(xhr);
						});
					}
				});
			};

			this.paste = function(items, destination, act, callback) {
				if (items == undefined || items.length == 0) return false;

				var opts = {
					script: '/ajax/privatecontent/paste',
					postdata: {
						items: items.join(),
						destination: destination,
						act: act
					},
					timeout: 0,
					callbackSuccess: function(result, status, xhr) {
						if (callback == undefined) {
							objController.refresh();
						} else callback(result);
					},
					callbackFail: function(xhr, status, error) {
						if (status == 'Login') {
							objUltis.alert(error, function() {
								objUser.showLogin();
							});
						} else {
							objUltis.alert(error, function() {
								console.log(xhr);
							});
						}
					}
				};

				objConnection.sendCommand(opts);
			};


			this.rename = function(id, newname, callback) {
				var opts = {
					script: '/ajax/privatecontent/rename',
					postdata: {
						id: id,
						name: newname
					},
					callbackSuccess: function(result, status, xhr) {
						callback();
					},
					callbackFail: function(xhr, status, error) {
						if (status == 'Login') {
							objUltis.alert(error, function() {
								objUser.showLogin();
							});
						} else {
							objUltis.alert(error, function() {
								console.log(xhr);
							});
						}
					}
				};

				objConnection.sendCommand(opts);
			};

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

			this.getPreviewFileHeader = function (fileId) {

			}

			this.initialize = function() {
				init();
				return this;
			};

			return this.initialize();
		}
	});