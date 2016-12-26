$.extend(
	$.fn, {
		vsUltis: function(o) {
			if (o == null) o = {};

			var init = function() {};

			this.alert = function(message, callback) {
				alertify.okBtn('Ok').alert(message, function() { 
					if (callback) callback()
				})
			};

			this.notification = function(message, callback) {
				alertify.log(message, function() { 
					if (callback) callback()
				})
			};

			this.base64 = function(str, type) {
				var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
				if (type == 'encode') str = Base64.encode(str);
				if (type == 'decode') str = Base64.decode(str);
				return str;
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
					hasCopy = 1;
					this.content = data;
				},
				get: function() {
					return this.content;
				},
				clear: function() {
					hasCopy = 0;
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