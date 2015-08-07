angular.module('popup-dir',[]).directive('showpopupdir', ['$window', '$document', '$log',
    function($window, $document, $log) {

      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          $document.bind('click', function(event) {
            $log.info(event);
            if(angular.element(event.target).hasClass('type-icon') || angular.element(event.target).hasClass('icon-bar'))
            {
              //$window.alert('Foo!');
              
              var x = angular.element(event.target).offset();
                                    var tt = $window.outerHeight;
                  var ftht = angular.element('.landing-footer').outerHeight();
                  angular.element('.landing-container').before(angular.element(".notifications-popover-wrapper").clone().attr('id','maybe_clone').css({ 'position': 'absolute', 'left': '-1000px' }));
                   var ppht = angular.element('#maybe_clone').removeClass("hide").show().outerHeight();
                  
                                    if(x.top >= (tt-(ftht+ppht+20))){
                    
                  angular.element('.notifications-popover-wrapper').css('top', (x.top - (ppht-15) ) + 'px');
                  }
                  else{
                    
                  angular.element('.notifications-popover-wrapper').css('top', (x.top) + 'px');
                  }
                                     angular.element('#maybe_clone').remove();
                                     angular.element('.notifications-popover-wrapper').removeClass('hide');
            }else{
            angular.element('.notifications-popover-wrapper').addClass('hide');
            }
          })
        }
      };
    }
  ]);

