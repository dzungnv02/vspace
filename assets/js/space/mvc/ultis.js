$.extend(
	$.fn, {
		vsUltis: function(o) {
			if (o == null) o = {};

			var init = function() {};

			this.showAlert = function(title, message, callback) {
				bootbox.dialog({
					title: title,
					message: message,
					show: false
				}).on('hide.bs.modal', function(e) {
					callback();
				}).modal('show');
			};

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
						.toFixed(decimal) * 1 + ' ' + ["Byte", "KB", "MB", "GB","TB", "PB", "EB", "ZB", "YB"][i];
				}
			};

			this.getXPath = function(node) {
				var pathes = [];
				node.each(function(index, element) {
					var path, $node = jQuery(element);
					while ($node.length) {
						var realNode = $node.get(0),
							name = realNode.localName;
						if (!name) {
							break;
						}
						name = name.toLowerCase();
						var parent = $node.parent();
						var sameTagSiblings = parent.children(name);
						if (sameTagSiblings.length > 1) {
							allSiblings = parent.children();
							var index = allSiblings.index(realNode) + 1;
							if (index > 0) {
								name += ':nth-child(' + index + ')';
							}
						}
						path = name + (path ? ' > ' + path : '');
						$node = parent;
					}
					pathes.push(path);
				});
				return pathes.join(',');
			};

			this.clipBoard = {
				content: null,
				act: null,
				put: function(data) {
					this.content = data;
				},
				get: function() {
					return this.content;
				},
				clear: function() {
					this.content = null;
				},
				do :
				function(act) {
					this.act = act;
				}
			};

			this.removeVietnameseSign = function(str) {
                        str = str.toLowerCase();
                        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
                        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
                        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
                        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
                        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
                        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
                        str = str.replace(/đ/g, "d");
                        str = str.replace(/^\-+|\-+$/g, "");
                        return str.toUpperCase();
                    }

			this.initialize = function() {
				init();
				return this;
			};

			return this.initialize();
		}
	});