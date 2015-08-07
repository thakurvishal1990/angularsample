angular.module('resizecustom',[])
    .directive('elheightresize', ['$window', function($window) {
    return {
        link: function(scope, elem, attrs) {
            scope.onResize = function() {
                var header = document.getElementsByTagName('header')[0];
                elem.windowHeight = $window.innerHeight - header.clientHeight;
            }
            scope.onResize();

            angular.element($window).bind('resize', function() {
                scope.onResize();
            })
        }
    }
}])