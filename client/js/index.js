/*global $*/
(function (global) {
    "use strict";

    $(function () {
        var getLessonButtons = $('[data-action="get-lesson"]');
        var getLessonPopupElement = $('[data-popup="get-lesson"]');
        var popupOverlap = $('.overlap');
        var getLessonPopup = createPopup(getLessonPopupElement);
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
            getLessonButtons.each(function (i, el) {
                $(el).on('click', getLessonPopup.show);
            });
            tabset.init();
            tabset.selectTab(tabset.getTab(0));
            $('#feedbacks').scooch();
        }

        function createPopup(element, options) {
            options = options || {};
            function hide() {
                popupOverlap.hide();
                if ($.isFunction(options.close)) {
                    options.hide();
                }
                element.hide();
            }

            function show() {
                popupOverlap.show();
                element.show();
            }

            element.find('[data-action="close"]').on('click', hide);

            return {
                show: show,
                hide: hide
            };
        }
    });
}(this));