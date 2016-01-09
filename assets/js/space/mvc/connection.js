$.extend(
	$.fn, {
		vsConnection: function(o) {
			if (o == null) o = {};
			var timer = null;
			var parsedData = null;
			var self = this;
			var noopScript = '/ajax/privatecontent/noop';
			var noopInterval = 120000; //2 minutes
			var ajaxTimeout = 10000;

			var init = function() {				
				return;
			};

			this.ping = function() {
				timer = setInterval(function() {
					var script = server + noopScript;
					var options = {
						async: true,
						cache: false,
						crossDomain: false,
						type: 'POST',
						dataType: 'text',
						error: function(xhr, status, error) {							
							console.debug(error);
						},
						success: function(result, status, xhr) {
							console.debug(status);
						},
						timeout: ajaxTimeout
					};

					$.ajax(script, options);
				}, noopInterval);
			};

			this.unping = function () {
				clearInterval(timer);
			};

			this.connectionSetup = function(callbackSuccess, callbackFail, dataType) {
				if (dataType == undefined) dataType = 'json';

				var options = {
					async: true,
					cache: false,
					crossDomain: false,
					type: 'POST',
					dataType: dataType,
					error: function(xhr, status, error) {
						if (callbackFail != null) {
							callbackFail(xhr, status, error);
						} else {
							console.debug(xhr);
							console.debug(status);
							console.debug(error);
						}
					},
					success: function(result, status, xhr) {
						try {
							if (result.ERROR.errCode != 0) {
								if (callbackFail == null) {
									console.log(xhr);
									console.log(result.ERROR.errCode);
									console.log(result.ERROR.err);
								} else {
									callbackFail(xhr, result.ERROR.errCode, result.ERROR.err);
								}
							} else if (callbackSuccess != null) {
								callbackSuccess(result, status, xhr);
							} else {
								console.debug(status);
								console.debug(result);
							}
						}
						catch (err) {
							if (callbackFail != null) {
								callbackFail (xhr, 'System', 'Có lỗi hệ thống xảy ra, vui lòng quay lại trong ít phút!');
							}
							console.debug(err);
						}
					},
					timeout: ajaxTimeout
				};

				$.ajaxSetup(options);
			};

			this.sendCommand = function(p) {
				if (p.postdata == undefined) p.postdata = null;
				if (p.script == undefined) p.script = null;
				if (p.callbackSuccess == undefined) p.callbackSuccess = null;
				if (p.callbackFail == undefined) p.callbackFail = null;
				p.script = p.script != null ? server + p.script : '';
				self.connectionSetup(p.callbackSuccess, p.callbackFail);

				var result = null;
				try {
					result = $.ajax(p.script, {
						data: p.postdata
					});

					return result;
				}
				catch(err) {
					console.debug(err);
				}
			};

			this.setOptions = function(opts) {
				o = opts;
			};

			this.getOptions = function(opt) {
				if (opt == null) return o;
				else return eval('o.' + opt);
			};

			this.initialize = function() {
				init();
				return this;
			};

			return this.initialize();
		}
	});