"use strict";

/*jshint
    browser: true,
    strict: true
*/

(function() {
    var Mason = function(parent, childSelector, opts) {
        var self = this;

        self.parent = parent;
        self.childSelector = childSelector;
        self.gap = opts.gap;
        self.throttled = opts.throttled;

        self.utils = {
            getPrefixed: function (prop) {
                var i,
                    s = document.body.style,
                    v = ['ms','O','Moz','Webkit'];
                if (s[prop] === '') {
                    return prop;
                }
                prop = prop[0].toUpperCase() + prop.slice(1);

                for( i = v.length; i--; ) {
                    if( s[v[i] + prop] === '' ) {
                        return (v[i] + prop);
                    }
                }
            },
            getComputedStyleNum: function(el, prop) {
                return parseInt(getComputedStyle(el)[prop], 10);
            }

        };

        self.elements;
        self.colCount;
        self.timeout;

        self.init();
    };

    Mason.prototype = {
        init: function() {
            var self = this,
                domChildren = self.parent.querySelectorAll(self.childSelector),
                transition = self.utils.getPrefixed("transition");

            self.elements = [];

            for (var i = 0; i < domChildren.length; i++) {
                var el = domChildren[i],
                    height = self.utils.getComputedStyleNum(el, "height");

                self.elements.push({
                    el: el,
                    height: height
                });
            }

            window.addEventListener("resize", function() {
                if (self.throttled) {
                    clearTimeout(self.timeout);
                    self.timeout = setTimeout(function() {
                        self.onResize();
                    }, self.throttled);
                } else {
                    self.onResize();
                }
            }, false);

            window.dispatchEvent(new Event('resize'));
        },

        onResize: function() {
            var self = this;

            self.elementWidth = self.utils.getComputedStyleNum(self.elements[0].el, "width");
            var colCount = Math.floor((self.utils.getComputedStyleNum(self.parent, "width") + self.gap.x) / (self.elementWidth + self.gap.x));

            if (colCount !== self.colCount) {
                self.colCount = colCount;
                self.place();
            }
        },

        place: function() {
            var currentRow = 1,
                currentCol = 0,
                currentColHeight,
                colHeights = [],
                parentHeight = 0;

            // Place elements
            for (var i = 0; i < this.elements.length; i++) {
                var element = this.elements[i],
                    order = i + 1,
                    shiftX = this.getShiftX(currentCol),
                    shiftY = this.getShiftY(order);

                element.el.style.top = shiftY + "px";
                element.el.style.left = shiftX + "px";

                // Count col heights
                currentColHeight = colHeights[currentCol];
                colHeights[currentCol] = (currentColHeight !== undefined ? currentColHeight : 0) + element.height;

                //Increment col
                currentCol++;

                // Increment row?
                if (order > currentRow * this.colCount && (currentCol === this.colCount || (order === this.elements.length))) {
                    currentRow++;
                }

                // Col overflow?
                if (currentCol === this.colCount) {
                    currentCol = 0;
                }
            }

            // Count max col height
            for (var j = 0; j < colHeights.length; j++) {
                var colHeight = colHeights[j];

                if (colHeight > parentHeight) {
                    parentHeight = colHeight;
                }
            }

            this.parent.style.height = (parentHeight + (currentRow - 1) * this.gap.y) + "px";
        },

        getShiftX: function(currentCol) {
            return currentCol * (this.elementWidth + this.gap.x);
        },

        getShiftY: function(order) {
            var prevCols = order > this.colCount ? Math.floor((order - 1) / this.colCount) : 0,
                result = 0;

            while (prevCols) {
                var elNum = order - prevCols * this.colCount - 1;
                result += this.elements[elNum].height + this.gap.y;
                prevCols--;
            }

            return result;
        }
    };

    window.Mason = Mason;
})();