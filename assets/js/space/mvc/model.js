$.extend(
	$.fn, {
		vsSpaceModel: function(o) {
			if (o == null) o = {};

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
						id: itemId,
						src: 'server' /*'list.xml'*/
					},
					callbackSuccess: function(result, status, xhr) {
						parsedData = {
							folder: [],
							file: []
						};
						var idx = 0;
						for (var i = 0; i < result.folder.length; i++) {
							if (result.folder[i].name == '..') continue;
							parsedData.folder[idx] = result.folder[i];
							parsedData.folder[idx].parentID = itemId;
							idx++;
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

			this.delete = function (aryId, dlg) {
				if (aryId == undefined || aryId.length == 0) return false;

				var opts = {
					script: '/ajax/privatecontent/delete',
					postdata: {
						id: aryId.join()
					},
					callbackSuccess: function(result, status, xhr) {
						objController.refresh();
						dlg.modal('hide');
					},
					callbackFail: function(xhr, status, error) {
						bootbox.alert(error);
					}
				};

				objConnection.sendCommand(opts);
			}

			this.initialize = function() {
				init();
				return this;
			};

			return this.initialize();
		}
	});