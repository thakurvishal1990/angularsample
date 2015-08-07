angular.module('bootstrap-tab', [])
    .directive('showtab', function () {
        return {
            restrict: 'AE',
            link: function (scope, element, attrs) {
                element.click(function(e) {
                    e.preventDefault();
                    $(element).tab('show');
                });
            }
        };
    });
