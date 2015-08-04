angular.module('app', ['data', 'ngSanitize', 'angular-carousel', 'ngAnimate', 'ui.bootstrap', 'ui.router']).config(['$stateProvider', '$urlRouterProvider', '$uiViewScrollProvider', function ($stateProvider, $urlRouterProvider, $uiViewScrollProvider) {
    "use strict";

    $uiViewScrollProvider.useAnchorScroll();

    $stateProvider
        .state('possibilities', {
            url: '/possibilities'
        })
        .state('advantages', {
            url: '/advantages'
        })
        .state('pricing', {
            url: '/pricing'
        });
}]);
angular.module('app').controller('app', ['$scope', '$modal', '$http', 'data', 'mobileQuery', '$anchorScroll', '$location', '$state', function ($scope, $modal, $http, data, mobileQuery, $anchorScroll, $location, $state) {
    "use strict";

    angular.extend($scope, {
        selectFeature: function (feature) {
            $scope.features.forEach(function (f) {
                f.active = false;
            });
            feature.active = true;
        },
        selectSubFeature: function (feature, subFeature) {
            feature.subFeatures.forEach(function (sf) {
                sf.active = false;
            });
            subFeature.active = true;
            $scope.showSubFeaturesPopup(feature);
        },
        nextFeature: function () {
            var active = $scope.features.filter(function (f) {
                return f.active;
            })[0];
            if (active) {
                var index = $scope.features.indexOf(active) + 1;
                if (index >= $scope.features.length) {
                    index = 0;
                }
                $scope.selectFeature($scope.features[index]);
            }
        },
        prevFeature: function () {
            var active = $scope.features.filter(function (f) {
                return f.active;
            })[0];
            if (active) {
                var index = $scope.features.indexOf(active) - 1;
                if (index < 0) {
                    index = $scope.features.length - 1;
                }
                $scope.selectFeature($scope.features[index]);
            }
        },
        showGetLessonPopup: function () {
            if ($scope.modalInstance) {
                $scope.modalInstance.close();
            }
            $scope.modalInstance = $modal.open({
                animation: true,
                template: angular.element('#get-lesson').html(),
                controller: 'getLesson',
                size: 'mobile'
            });
            $scope.modalInstance.result.then(function () {
                $scope.showSuccessPopup();
            });
        },
        showSuccessPopup: function () {
            if ($scope.modalInstance) {
                $scope.modalInstance.close();
            }
            $scope.modalInstance = $modal.open({
                animation: true,
                template: angular.element('#success').html(),
                size: 'mobile success'
            });
        },
        showSubFeaturesPopup: function (feature) {
            if ($scope.modalInstance) {
                $scope.modalInstance.close();
            }
            if (!$scope.isMobile.value) {
                return;
            }
            $scope.modalInstance = $modal.open({
                animation: true,
                template: angular.element('#subFeatures').html(),
                size: 'mobile',
                controller: 'subFeatures',
                resolve: {
                    feature: function () {
                        return feature;
                    }
                }
            });
        }
    });

    angular.extend($scope, data, {
        selectedTab: 0,
        isMobile: mobileQuery.isMobile
    });

    $scope.$on('$stateChangeSuccess', function (event, toState) {
        $anchorScroll.yOffset = 49;
        $location.hash();
        $anchorScroll($state.current.name);
    });

    mobileQuery.run();
}]);
angular.module('app').controller('getLesson', ['$scope', '$http', function ($scope, $http) {
    "use strict";

    angular.extend($scope, {
        data: {
            name: 'domdom',
            phone: '',
            email: 'dom@dom'
        }
    });

    angular.extend($scope, {
        onSubmit: function () {
            $http.post('/get-lesson', $scope.getLessonPopup).then(function () {
                $scope.$close();
            }, function () {
                $scope.$close();
            });
        }
    });
}]);
angular.module('app').controller('subFeatures', ['$scope', 'feature', function ($scope, feature) {
    "use strict";

    angular.extend($scope, {
        feature: feature
    });

    angular.extend($scope, {});
}]);
angular.module('app').service('mobileQuery', ['$timeout', function ($timeout) {
    "use strict";
    var isMobileMediaQuery = 'only screen and (max-width : 1024px), only screen and (max-device-width : 773px)';
    this.isMobile = {
        value: false
    };
    var _this = this;

    this.run = function () {
        updateQuery();
        angular.element(window).resize(onResize);
    };
    function onResize() {
        $timeout(function () {
            updateQuery();
        }, 0);
    }

    function updateQuery() {
        _this.isMobile.value = testQuery(isMobileMediaQuery);
    }

    function testQuery(query) {
        var styleEl = angular.element('<style>@media ' + query + ' {html{cursor:wait}}</style>').appendTo(angular.element('head')),
            isMatch = angular.element('html').css('cursor') === 'wait';
        styleEl.remove();
        return isMatch;
    }
}]);
angular.module('app').directive('centerTab', [function () {
    "use strict";

    return function ($scope, $element, $attr) {
        $attr.$observe('centerTab', function (newVal) {
            if (newVal === "true") {
                centerTab();
            }
        });

        function centerTab() {
            var $parent = angular.element($element.parent());
            var parentScrollLeft = $parent.scrollLeft();
            var parentWidth = $parent.width();
            var tabWidth = $element.width();
            var tabLeft = $element.position().left;
            var perfectTabLeft = (parentWidth - tabWidth) / 2;
            var shift = perfectTabLeft - tabLeft;
            var scroll = parentScrollLeft - shift;
            $parent.scrollLeft(scroll);
        }
    };
}]);