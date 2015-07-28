/*global $*/
(function (global) {
    "use strict";
    var isMobileMediaQuery = 'only screen and (max-width : 1024px), only screen and (max-device-width : 773px)';

    var isMobile = true;
    updateQuery();

    function updateQuery() {
        isMobile = testQuery(isMobileMediaQuery);
    }

    $(function () {
        var popups = {};
        var features = {};
        var popupOverlap = $('.overlap');
        var tabsetTabs = {};
        var tabsetParentElement = $('[data-tabset-element]');
        var tabset = new global.TabSet(tabsetParentElement, {selectedClass: 'm-active'});
        tabsetParentElement.find('[data-tabset-tab]').each(function (i, el) {
            var $el = $(el);
            var key = $el.data('tabset-tab');
            if (!key) {
                return;
            }
            if (!tabsetTabs[key]) {
                tabsetTabs[key] = {
                    content: null,
                    el: $el,
                    cb: function () {
                        $.each(features, function (featureName, feature) {
                            if (featureName === key + '-0') {
                                feature.show();

                            } else {
                                feature.hide();
                            }
                        });
                    }
                };
            }
        });
        $('[data-tabset-content]').each(function (i, el) {
            var $el = $(el);
            var key = $el.data('tabset-content');
            if (!key) {
                return;
            }
            if (tabsetTabs[key]) {
                tabsetTabs[key].content = $el;
            }
        });

        $('[data-show-feature]').each(function (i, el) {
            var $el = $(el);
            var featureName = $el.data('show-feature');
            if (!features[featureName]) {
                features[featureName] = {
                    tab: $el,
                    content: null
                };
                features[featureName].show = function () {
                    this.tab.addClass('active');
                    this.content.addClass('active');
                }.bind(features[featureName]);
                features[featureName].hide = function () {
                    this.tab.removeClass('active');
                    this.content.removeClass('active');
                }.bind(features[featureName]);
                features[featureName].init = function () {
                    var thisFeature = this;
                    this.tab.on('click', function () {
                        updateQuery();
                        if (!isMobile) {
                            $.each(features, function (key, feature) {
                                feature.hide();
                            });
                            thisFeature.show();
                        }
                    })
                }.bind(features[featureName]);
            }
        });
        $('[data-feature]').each(function (i, el) {
            var $el = $(el);
            var featureName = $el.data('feature');
            if (features[featureName]) {
                features[featureName].content = $el;
            }
        });

        $.each(tabsetTabs, function (key, tab) {
            tabset.addTab(tab.el, tab.content, tab.cb);
        });

        init();


        function init() {
            $('[data-popup]').each(function (i, el) {
                var $el = $(el);
                var popupId = $el.data('popup');
                popups[popupId] = createPopup($el, {});
            });
            $('[data-open-popup]').click(function () {
                var popupId = $(this).data('open-popup');
                var isMobileOnly = !!$(this).data('popup-mobile');
                if (popups[popupId]) {
                    updateQuery();
                    var decision = isMobileOnly ? isMobile : true;
                    if (decision) {
                        popups[popupId].show();
                    } else {
                        popupOverlap.hide();
                        $.each(popups, function (i, popup) {
                            popup.hide();
                        });
                    }
                }
            });


            $.each(features, function (key, feature) {
                feature.init();
            });

            tabset.init();
            tabset.selectTab(tabset.getTab(0));
            $('.m-scooch').scooch();
            popupOverlap.on('click', function () {
                $.each(popups, function (i, popup) {
                    popup.hide();
                });
            });

            processForm();
        }

        function createPopup(element, options) {
            options = options || {};
            function hide() {
                popupOverlap.hide();
                if ($.isFunction(options.close)) {
                    options.hide();
                }
                element.hide();
                $('html').removeClass('popup-shown');
            }

            function show() {
                $.each(popups, function (i, popup) {
                    popup.hide();
                });
                popupOverlap.show();

                updateQuery();
                element.css({
                    marginTop: 0,
                    marginLeft: 0
                });
                if (!isMobile) {
                    element.css('visibility', 'hidden');
                    element.show();
                    var width = element.width();
                    var height = element.height();

                    element.css({
                        marginTop: -height / 2,
                        marginLeft: -width / 2
                    });
                    element.css('visibility', 'visible');
                } else {
                    element.show();
                }


                $('html').addClass('popup-shown');
            }

            element.find('[data-action="close"]').on('click', hide);

            return {
                show: show,
                hide: hide
            };
        }

        function processForm() {
            $('[data-form]').on('submit', function (event) {
                var data = {};
                $.each($(this).serializeArray(), function (_, kv) {
                    data[kv.name] = kv.value;
                });
                $.ajax({
                    url: '/get-lesson',
                    data: data,
                    type: 'POST',
                    success: function () {
                        popups.success.show();
                    },
                    error: function () {
                        console.log('Error');
                        popups.success.show();
                    }
                });
                console.log(data);
                return false;
            });
        }
    });

    function testQuery(query) {
        var styleEl = $('<style>@media ' + query + ' {html{cursor:wait}}</style>').appendTo($('head')),
            isMatch = $('html').css('cursor') === 'wait';
        styleEl.remove();
        return isMatch;
    }
}(this));
