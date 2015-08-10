/*jshint maxparams: 12*/
var app = angular.module('app', ['data', 'ngSanitize', 'angular-carousel', 'ngAnimate', 'ui.bootstrap', 'ui.router', "pascalprecht.translate", "smoothScroll"])
app.config(['$stateProvider', '$urlRouterProvider', '$uiViewScrollProvider', '$translateProvider', "i18nLocales", "$provide",
    function ($stateProvider, $urlRouterProvider, $uiViewScrollProvider, $translateProvider, i18nLocales, $provide) {
        "use strict";

        configureRoutes();
        configureLocalizations();

        function configureRoutes() {
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

            $uiViewScrollProvider.useAnchorScroll();
            $provide.decorator('$anchorScroll', ["smoothScroll", "$delegate", function (smoothScroll, $anchorScroll) {
                return function (elementId) {
                    smoothScroll(document.getElementById(elementId), {offset: 49});
                };
            }]);
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

app.controller('app', ['$scope', '$modal', '$http', 'mobileQuery', '$anchorScroll', '$location', '$state', '$translate', '$q', "smoothScroll", function ($scope, $modal, $http, mobileQuery, $anchorScroll, $location, $state, $translate, $q, smoothScroll) {
    "use strict";

    angular.extend($scope, {
        selectedTab: 0,
        isMobile: mobileQuery.isMobile,
        features: [
            {
                "id": "reading",
                "active": true,
                "icon": "top__features-list__item__link_reading",
                "subFeatures": [
                    {id: "adaptedTexts", active: true},
                    {id: "contextTranslation"}
                ]
            },
            {
                "id": "listening",
                "active": false,
                "icon": "top__features-list__item__link_listening",
                "subFeatures": [
                    {id: "podcast", active: true},
                    {id: "rewind"},
                    {id: "transcription"}
                ]
            },
            {
                "id": "speaking",
                "active": false,
                "icon": "top__features-list__item__link_communication",
                "subFeatures": [
                    {id: "speakingPractice", active: true}
                ]
            },
            {
                "id": "preparation",
                "active": false,
                "icon": "top__features-list__item__link_preparing",
                "subFeatures": [
                    {id: "androidApplication", active: true},
                    {id: "webInterface"}
                ]
            },
            {
                "id": "efficiency",
                "active": false,
                "icon": "top__features-list__item__link_effective-study",
                "subFeatures": [
                    {id: "contentSelectionByUserLevel", active: true},
                    {id: "contentSelectionByTeacher"},
                    {id: "lessonPlanning"}
                ]
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
        ],
        advantages: [
            {
                id: "pricing",
                icon: "advantages__list__item__icon_materials"
            },
            {
                id: "speaking",
                icon: "advantages__list__item__icon_individual"
            },
            {
                id: "program",
                icon: "advantages__list__item__icon_grammatic"
            },
            {
                id: "application",
                icon: "advantages__list__item__icon_studying"
            },
            {
                id: "efficiency",
                icon: "advantages__list__item__icon_effective"
            }
        ],
        pricing: [
            {
                id: "quantity",
                icon: "pricing__list__item__icon_calendar"
            },
            {
                id: "duration",
                icon: "pricing__list__item__icon_time"
            },
            {
                id: "price",
                icon: "pricing__list__item__icon_card"
            }
        ],
        testimonials: [
            {
                id: 1
            },
            {
                id: 2
            },
            {
                id: 3
            },
            {
                id: 4
            }
        ]
    });

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
            $scope.showSubFeaturesPopup(feature, subFeature);
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
        showSubFeaturesPopup: function (feature, subFeature) {
            if ($scope.modalInstance) {
                $scope.modalInstance.close();
            }
            if (!$scope.isMobile.value) {
                return;
            }
            var modalInstance = $scope.modalInstance = $modal.open({
                animation: true,
                template: angular.element('#subFeatures').html(),
                size: 'mobile modal-carousel',
                controller: 'subFeatures',
                resolve: {
                    feature: function () {
                        return feature;
                    },
                    subFeature: function () {
                        return subFeature;
                    }
                }
            });
            modalInstance.result.then(function () {
                $scope.showGetLessonPopup();
            });
        }
    });

    $scope.$on('$stateChangeSuccess', function (event, toState) {
        $anchorScroll.yOffset = 49;
        $location.hash();
        $anchorScroll($state.current.name);
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

        var advantagesPromises = [];
        var advantagesLocalePath = "advantages.list.";
        $scope.advantages.forEach(function (advantage) {
            var d = $q.defer();
            var title = advantagesLocalePath + advantage.id + ".title";
            var text = advantagesLocalePath + advantage.id + ".text";

            $translate([title, text]).then(function (translation) {
                advantage.title = translation[title];
                advantage.text = translation[text];
                d.resolve();
            });
            advantagesPromises.push(d.promise);
        });

        var pricingPromises = [];
        var pricingLocalePath = "pricing.list.";
        $scope.pricing.forEach(function (item) {
            var d = $q.defer();
            var title = pricingLocalePath + item.id + ".title";
            var text = pricingLocalePath + item.id + ".text";

            $translate([title, text]).then(function (translation) {
                item.title = translation[title];
                item.text = translation[text];
                d.resolve();
            });
            advantagesPromises.push(d.promise);
        });

        var testimonialsPromises = [];
        var testimonialsLocalePath = "testimonials.list";
        $scope.testimonials.forEach(function (testimonial) {
            var d = $q.defer();
            var userNameResourceId = testimonialsLocalePath + ".id" + testimonial.id + ".userName";
            var textResourceId = testimonialsLocalePath + ".id" + testimonial.id + ".text";

            $translate([userNameResourceId, textResourceId]).then(function (translation) {
                testimonial.userName = translation[userNameResourceId];
                testimonial.text = translation[textResourceId];
                d.resolve();
            });
            testimonialsPromises.push(d.promise);
        });

        /*
         // not sure this is required
         $q.all([featurePromises, headerMenuItemsPromises, advantagesPromises, testimonialsPromises]).then(function () {
         // update scope when all translations are resolved
         });
         */
    }

    mobileQuery.run();
}]);
app.controller('getLesson', ['$scope', '$http', function ($scope, $http) {
    "use strict";

    angular.extend($scope, {
        data: {
            name: '',
            phone: '',
            email: '',
            hasAndroid: false
        }
    });

    angular.extend($scope, {
        onSubmit: function () {
            $http.post('/get-lesson', $scope.data).then(function () {
                $scope.$close();
            }, function () {
                $scope.$close();
            });
        }
    });
}]);
app.controller('subFeatures', ['$scope', 'feature', 'subFeature', function ($scope, feature, subFeature) {
    "use strict";

    angular.extend($scope, {
        feature: feature
    });

    angular.extend($scope, {
        showGetLessonPopup: function () {
            $scope.$close();
        }
    });

    feature.subFeatures.forEach(function (sf) {
        sf.active = false;
    });
    subFeature.active = true;
}]);
app.service('mobileQuery', ['$timeout', function ($timeout) {
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
app.directive('centerTab', [function () {
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
app.directive('focusIt', function () {
    "use strict";

    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            attrs.$observe('focusIt', function (newVal, oldVal) {
                if (newVal === 'true' || newVal === "") {
                    setTimeout(function () {
                        element.focus();
                    }, 700);
                }
            });
        }
    };
});
