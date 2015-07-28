/*global $*/
(function (global) {
    "use strict";

    function TabSet(parentElement, options) {
        this.options = $.extend({
            selectedClass: 'active'
        }, options);
        this.tabs = [];
        this.parentElement = parentElement;
    }

    TabSet.prototype = {
        addTab: function (el, content, cb) {
            var _this = this;
            var tab = {
                el: $(el),
                content: $(content),
                isBinded: false,
                init: function () {
                    if (!tab.isBinded) {
                        tab.isBinded = true;
                        tab.el.on('click', _this.selectTab.bind(_this, tab));
                    }
                },
                cb: cb || $.noop
            };
            this.tabs.push(tab);
        },
        getTab: function (index) {
            return this.tabs[index];
        },
        init: function () {
            this.tabs.forEach(function (tab) {
                tab.init();
            });
        },
        selectTab: function (tab) {
            this.tabs.forEach(function (tab) {
                tab.el.removeClass(this.options.selectedClass);
                tab.content.hide();
            }.bind(this));
            tab.el.addClass(this.options.selectedClass);
            tab.content.show();
            var parentScrollLeft = this.parentElement.scrollLeft();
            var parentWidth = this.parentElement.width();
            var tabWidth = tab.el.width();
            var tabLeft = tab.el.position().left;
            var perfectTabLeft = (parentWidth - tabWidth) / 2;
            var shift = perfectTabLeft - tabLeft;
            var scroll = parentScrollLeft - shift;
            this.parentElement.scrollLeft(scroll);
            if ($.isFunction(tab.cb)) {
                tab.cb.call(null);
            }
        }
    };

    global.TabSet = TabSet;
}(this));
