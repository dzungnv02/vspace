/**
 * Created by dungnv02 on 10/26/2015.
 */
if(jQuery) (function($){
    $.extend($.fn, {
        dragSelect : function (o) {
            if( !o ) var o = {};
            if( o.container == undefined ) o.container = this;

            var containerPosition = null;

            var initSelect = function () {
              if (o.container == null)
                  return false;

              containerPosition = $(o.container).position();
              console.log(containerPosition);
            };

            this.initialize = function () {
                initSelect();
                return this;
            };
            return this.initialize();
        }
    });
})(jQuery);
