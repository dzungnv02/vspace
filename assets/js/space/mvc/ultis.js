$.extend(
	$.fn, {
		vsUltis: function (o){
			if (o == null) o = {};
			
			var init = function () {};

			this.initialize = function() {
            	init();    
            	return this;
            };

            return this.initialize();
		}
});