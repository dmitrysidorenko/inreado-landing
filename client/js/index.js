/*global $*/
(function (global) {
    "use strict";

    $(function () {
        var popups = {};
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
                    el: $el
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

        $.each(tabsetTabs, function (key, tab) {
            tabset.addTab(tab.el, tab.content);
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
                if (popups[popupId]) {
                    popups[popupId].show();
                }
            });
            tabset.init();
            tabset.selectTab(tabset.getTab(0));
            $('.m-scooch').scooch();
            popupOverlap.on('click', function () {
                $.each(popups, function (i, popup) {
                    popup.hide();
                });
            });
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
                element.show();
                $('html').addClass('popup-shown');
            }

            element.find('[data-action="close"]').on('click', hide);

            return {
                show: show,
                hide: hide
            };
        }
    });
}(this));