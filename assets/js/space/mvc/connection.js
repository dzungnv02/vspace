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

			this.connectionSetup = function(opts) {				
				var callbackSuccess = opts.callbackSuccess;
				var callbackFail = opts.callbackFail;
				var dataType = (opts.dataType == undefined) ? 'json' : opts.dataType;				
				var timeout = opts.timeout;
				var crossDomain  = (opts.crossDomain == undefined) ? false : opts.crossDomain;
				var cache = (opts.cache == undefined) ? false : opts.cache;

				var options = {
					async: true,
					cache: false,
					crossDomain: crossDomain,
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
					timeout: timeout
				};

				if (opts.xhr != undefined) options.xhr  = opts.xhr;
				if (opts.contentType != undefined) options.contentType  = opts.contentType;
				if (opts.processData != undefined) options.processData  = opts.processData;

				$.ajaxSetup(options);
			};

			this.sendCommand = function(p) {
				if (p.postdata == undefined) p.postdata = null;
				if (p.script == undefined) p.script = null;
				if (p.callbackSuccess == undefined) p.callbackSuccess = null;
				if (p.callbackFail == undefined) p.callbackFail = null;
				if (p.xhr == undefined) p.xhr = null;
				if (p.timeout == undefined) p.timeout = ajaxTimeout;

				
				var iserver = p.server != undefined ? p.server : server;
				p.script = p.script != null ? iserver + p.script : '';
				self.connectionSetup(p);

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