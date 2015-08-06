angular
    .module('app', ['data', 'ngSanitize', 'angular-carousel', 'ngAnimate', 'ui.bootstrap', 'ui.router', "pascalprecht.translate"])
    .config(['$stateProvider', '$urlRouterProvider', '$uiViewScrollProvider', '$translateProvider', "i18nLocales",
        function ($stateProvider, $urlRouterProvider, $uiViewScrollProvider, $translateProvider, i18nLocales) {
            "use strict";

            configureRoutes();
            configureLocalizations();

            function configureRoutes() {
                $uiViewScrollProvider.useAnchorScroll();
                $stateProvider
                    .state('features', {
                        url: '/features'
                    })
                    .state('advantages', {
                        url: '/advantages'
                    })
                    .state('pricing', {
                        url: '/pricing'
                    });
            }

            function configureLocalizations() {
                /*jshint -W089 */
                for (var locale in i18nLocales) {
                    $translateProvider.translations(locale, i18nLocales[locale]);
                }
                $translateProvider.fallbackLanguage('ru_RU');

                var languages = null;

                if (navigator.languages) {
                    languages = navigator.languages;
                } else {
                    var language = navigator.language || navigator.userLanguage;
                    languages = [language];
                }

                $translateProvider.preferredLanguage(determineLanguage(languages));

                function determineLanguage(languages) {
                    // check if chinese language is present
                    var preferredChinese = languages.some(function (language) {
                        if (language.indexOf('zh') !== -1) {
                            return true;
                        } else if (language.indexOf('CN') !== -1) {
                            return true;
                        }
                        return false;
                    });

                    // check if russian language is present
                    var preferredRussian = languages.some(function (language) {
                        if (language.indexOf('ru') !== -1) {
                            return true;
                        } else if (language.indexOf('RU') !== -1) {
                            return true;
                        }
                        return false;
                    });

                    var preferredLangKey = 'en_US';
                    if (preferredChinese) {
                        preferredLangKey = 'zh_CN';
                    } else if (preferredRussian) {
                        preferredLangKey = 'ru_RU';
                    }

                    return preferredLangKey;
                }
            }
        }]);

angular.module('app').controller('app', ['$scope', '$modal', '$http', 'mobileQuery', '$anchorScroll', '$location', '$state', '$translate', '$q', function ($scope, $modal, $http, mobileQuery, $anchorScroll, $location, $state, $translate, $q) {
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
        },

        features: [
            {
                "id": "reading",
                "active": true,
                "icon": "top__features-list__item__link_reading",
                "subFeatures": [{id: "adaptedTexts"}, {id: "contextTranslation"}]
            },
            {
                "id": "listening",
                "active": false,
                "icon": "top__features-list__item__link_listening",
                "subFeatures": [{id: "podcast"}, {id: "rewind"}, {id: "transcription"}]
            },
            {
                "id": "speaking",
                "active": false,
                "icon": "top__features-list__item__link_communication",
                "subFeatures": [{id: "speakingPractice"}]
            },
            {
                "id": "preparation",
                "active": false,
                "icon": "top__features-list__item__link_preparing",
                "subFeatures": [{id: "androidApplication"}, {id: "webInterface"}]
            },
            {
                "id": "efficiency",
                "active": false,
                "icon": "top__features-list__item__link_effective-study",
                "subFeatures": [{id: "contentSelectionByUserLevel"}, {id: "contentSelectionByTeacher"}, {id: "lessonPlanning"}]
            }
        ],
        headerMenuItems: [
            {
                "id": "features",
                "state": "features"
            },
            {
                "id": "advantages",
                "state": "advantages"
            },
            {
                "id": "pricing",
                "state": "pricing"
            }
        ]
    });

    $scope.$watch(function () {
        return $translate.use();
    }, function (newValue, prevValue) {
        updateTranslations();
    });

    function updateTranslations() {
        var featurePromises = [];

        var featuresLocalePath = "features.";
        $scope.features.forEach(function (feature) {
            var fd = $q.defer();
            var titleTopResourceId = featuresLocalePath + feature.id + ".titleTop";
            var titleBottomResourceId = featuresLocalePath + feature.id + ".titleBottom";

            $translate([titleTopResourceId, titleBottomResourceId]).then(function (translation) {
                feature.titleTop = translation[titleTopResourceId];
                feature.titleBottom = translation[titleBottomResourceId];
                fd.resolve();
            });
            featurePromises.push(fd.promise);

            feature.subFeatures.forEach(function (subFeature) {
                var sfd = $q.defer();
                var subFeaturePath = featuresLocalePath + feature.id + ".subFeatures.";
                var titlePath = subFeaturePath + subFeature.id + ".title";
                var textPath = subFeaturePath + subFeature.id + ".text";

                $translate([titlePath, textPath]).then(function (translation) {
                    subFeature.title = translation[titlePath];
                    subFeature.text = translation[textPath];
                    sfd.resolve();
                });

                featurePromises.push(sfd);
            });

        });

        var headerMenuItemsPromises = [];
        var headerMenuItemsLocalePath = "header.menu.items.";
        $scope.headerMenuItems.forEach(function (item) {
            var d = $q.defer();
            var title = headerMenuItemsLocalePath + item.id + ".title";

            $translate([title]).then(function (translation) {
                item.title = translation[title];
                d.resolve();
            });
            headerMenuItemsPromises.push(d.promise);
        });

        /*
         // not sure this is required
         $q.all([featurePromises, headerMenuItemsPromises]).then(function () {
         // update scope when all translations are resolved
         });
         */
    }

    /*angular.extend($scope, data, {
     selectedTab: 0,
     isMobile: mobileQuery.isMobile
     });*/

    $scope.$on('$stateChangeSuccess', function (event, toState) {
        $anchorScroll.yOffset = 49;
        $location.hash();
        $anchorScroll($state.current.name);
    });

    mobileQuery.run();
}]);
angular.module('app').controller('getLesson', ['$scope', '$http', function ($scope, $http) {
    "use strict";

    /*angular.extend($scope, {
     data: {
     name: 'domdom',
     phone: '',
     email: 'dom@dom'
     }
     });*/

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