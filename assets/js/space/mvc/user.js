$.extend(
	$.fn, {
		vsUser: function(o) {
			if (o == null) o = {};
			var self = this;

			var init = function() {};

			this.validateLogin = function(username, password, customErr) {
				if (customErr == null) {
					var err = '';
					if (username == '') err = 'Bạn hãy nhập Tài khoản !'
					else if (password == '') err = 'Bạn hãy nhập Mật khẩu !';
					if (err !== '') {
						objUltis.alert(err, function(){ self.showLogin(username) });
						return false
					} else return true;
				} else objUltis.alert(customErr, function(){ self.showLogin(username) });
			}

			this.showLogin = function(username) {
				appprofile = null;
				var user = '';
				if (username !== undefined) user = username;
				var html = '<div id="loginbox"><input type="hidden"/>'
					+'<input type="text" name="username" placeholder="Tài khoản" value="'+user+'"/><br/>'
					+'<input type="password" name="password" placeholder="Mật khẩu"/></div>';

				alertify.okBtn('Đăng nhập').cancelBtn('Hủy').confirm(html, function() {
					var username = $('#loginbox > input[name="username"]').val().trim();
				 	var password = $('#loginbox > input[name="password"]').val().trim();
				 	objLayout.setLoading();
				 	objSpaceModel.login(username, password, self.validateLogin);
				},function() {
					self.showLogin();
				})
			}

			this.initialize = function() {
				init();
				return this;
			};

			return this.initialize();
		}
	});