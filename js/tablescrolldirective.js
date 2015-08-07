angular.module('datatablescroll-dir',[]).directive('tablescrolldir', ['$window', '$document', '$log',
    function($window, $document, $log) {

      return {
        restrict: 'A',
        //bindToController: true,
        link: function(scope, element, attrs) {
          //if($(element).find('tbody').length > 0){
            scope.$on('updatetable',function(event, data){
              scope.updatetable();
            })
            scope.updatetable=function(){
          var refrshht = angular.element(".new-notifications-header").outerHeight();
                                    var tblhdht = angular.element(".landing-data-content-info thead tr").outerHeight();
                                    var reqsuitht = angular.element(".req-suitrev-menu").outerHeight();
                                    var tot = $window.outerHeight,ht;
                                    var tblftht = angular.element(".landing-page-footer").outerHeight();
                                    //if (($('.footer-req-agent').hasClass('footer-active')) || ($('.footer-service-center').hasClass('footer-active'))) {
                                        //ht = tot - (tblhdht+refrshht+topht+bottomht+reqsuitht+tblftht+14);
                                        ht = tot - (tblhdht+refrshht+reqsuitht+tblftht+100);
                                    /*}
                                    else{
                                        ht = tot - (tblhdht+refrshht+topht+bottomht+reqsuitht+tblftht);
                                    }*/
                                    angular.element('.landing-data-content-info tbody').css('height',ht);
                                  }
                                }
       // }
      };
    }
  ]);

