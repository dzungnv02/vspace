$.extend(
	$.fn, {
		vsUltis: function(o) {
			if (o == null) o = {};

			var init = function() {};

			this.formatFileSize = function(size, decimal) {
				var i;
				i = Math.floor(Math.log(size) / Math.log(1024));
				if ((size === 0) || (parseInt(size) === 0)) {
					return "0 kB";
				} else if (isNaN(i) || (!isFinite(size)) || (size === Number.POSITIVE_INFINITY) || (size === Number.NEGATIVE_INFINITY) || (size == null) || (size < 0)) {
					console.info("Throwing error");
					throw Error("" + size + " did not compute to a valid number to be humanized.");
				} else {
					return (size / Math.pow(1024, i))
						.toFixed(decimal) * 1 + " " + ["Byte", "KB", "MB", "GB",
							"TB", "PB", "EB", "ZB",
							"YB"
						][i];
				}
			};

			this.initialize = function() {
				init();
				return this;
			};

			return this.initialize();
		}
	});