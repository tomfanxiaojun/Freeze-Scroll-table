(function($) {
    $.fn.extend({
        fixedFreezeTb: function(options) {
            var cfg = $.extend(true, {
                scroll: {
                    height: null,
                    width: null,
                    headRow: {
                        className: 'fTHLC-head-row',
                        enabled: true,
                        overflow: 'auto'
                    },
                    leftCol: {
                        className: 'fTHLC-left-col',
                        enabled: true,
                        top: true,
                        overflow: 'auto',
                        fixedSpan: 1
                    },
                    syncWith: null
                },
                wrapper: {
                    outer: {
                        idName: null,
                        className: 'fTHLC-outer-wrapper'
                    },
                    inner: {
                        idName: null,
                        className: 'fTHLC-inner-wrapper'
                    },
                    innerTopScroll: {
                        idName: null,
                        className: 'fTHLC-inner-wrapper-TopScroll'
                    }
                },
                corner: {
                    append: true,
                    deepClone: false,
                    outer: {
                        idName: null,
                        className: 'fTHLC-outer-corner'
                    },
                    inner: {
                        idName: null,
                        className: 'fTHLC-inner-corner'
                    }
                }
            }, options);

            var scrollWidth = cfg.scroll.width;
            var scrollHeight = cfg.scroll.height;
            var fixedLeftWidth = null;
            var fixedHeadHeight = null;
            var minBarWidth = 30;
            var specificLength = 0;

            function getScrollWidth(table) {
                var width = scrollWidth;

                if (!width)
                    width = table.outerWidth(true) - getFixedLeftWidth(table);

                return width;
            }

            function getScrollHeight(table) {
                var height = scrollHeight;

                if (!height)
                    height = table.outerHeight(true) - getFixedHeadHeight(table);

                return height;
            }

            function getHeadRowCount(table) {
                return table.find('thead tr').length;
            }

            function getFixedHeadRows(table) {
                var rows = $([]);

                for (var i = 0; i < getHeadRowCount(table); i++) {
                    var row = $([]);

                    for (var j = 0; j < cfg.scroll.leftCol.fixedSpan; j++) {
                        row.push(table.find('thead tr:nth-child(' + (i + 1) + ') th:nth-child(' + (j + 1) + ')'));
                    }

                    rows.push(row);
                }

                return rows;
            }

            function getHeadFirstRows(table) {
                var rows = $([]);

                for (var i = 0; i < getHeadRowCount(table); i++) {
                    rows.push(table.find('thead tr:nth-child(' + (i + 1) + ') th:first-child'));
                }

                return rows;
            }

            function getHeadCols(table, n) {
                return table.find('thead tr:nth-child(' + (n + 1) + ') th');
            }

            function getFixedHeadHeight(table) {
                var height = fixedHeadHeight;

                if (!height) {
                    var rows = getHeadFirstRows(table);

                    rows.each(function() {
                        height += $(this).outerHeight(true);
                    });

                    fixedHeadHeight = height;
                }

                return height;
            }

            function getFixedLeftCols(table) {
                var cols = $([]);

                for (var i = 0; i < cfg.scroll.leftCol.fixedSpan; i++) {
                    cols.push(table.find('tbody tr:first-child td:nth-child(' + (i + 1) + ')'));
                }

                return cols;
            }

            function getFixedLeftWidth(table) {
                var width = fixedLeftWidth;

                if (!width) {
                    var cols = getFixedLeftCols(table);

                    cols.each(function() {
                        width += $(this).outerWidth(true);
                    });

                    fixedLeftWidth = width;
                }

                return width;
            }

            function getTableWidth(table) {
                var width = 0;

                table.find('tbody tr:first-child td').each(function() {
                    width += $(this).outerWidth(true);
                });

                return width;
            }

            function createOuter(table) {
                table
                    .wrap($(document.createElement('div'))
                        .attr('id', cfg.wrapper.outer.idName)
                        .addClass(cfg.wrapper.outer.className)
                        .css('max-width', getScrollWidth(table))
                        .css('height', getScrollHeight(table))
                        .css('position', 'relative')
                        .css('padding-left', getFixedLeftWidth(table) + 'px')
                        .css('padding-top', getFixedHeadHeight(table) + 'px')
                        .css('overflow', 'hidden'));
            }

            function getBarWidth(barContainer) {
                var tempWidth = barContainer[0].scrollWidth - barContainer.outerWidth();
                var widthSpan = barContainer.outerWidth() - tempWidth;
                var barWidth = 0;
                if (widthSpan > minBarWidth) {
                    specificLength = 0;
                    barWidth = widthSpan;
                } else {
                    specificLength = minBarWidth - widthSpan;
                    barWidth = minBarWidth;
                }

                return barWidth;
            }

            function createInner(table) {
                if (cfg.scroll.leftCol.top) {
                    cfg.scroll.headRow.overflow = 'hidden';
                }
                table
                    .wrap($(document.createElement('div'))
                        .attr('id', cfg.wrapper.inner.idName)
                        .addClass(cfg.wrapper.inner.className)
                        .css('overflow-x', cfg.scroll.headRow.overflow)
                        .css('overflow-y', cfg.scroll.leftCol.overflow)
                        .css('max-width', getScrollWidth(table))
                        .css('height', getScrollHeight(table)));
                if (cfg.scroll.leftCol.top) {
                    var leftCornerWidth = getFixedLeftWidth(table);
                    var tableWidth = getTableWidth(table);
                    var innerTopScrollHeight = '16px';
                    var innerTopScroll = $(document.createElement('div'))
                        .attr('id', cfg.wrapper.innerTopScroll.idName)
                        .addClass(cfg.wrapper.innerTopScroll.className)
                        .css('overflow-x', 'hidden')
                        .css('overflow-y', 'hidden')
                        .css('max-width', getScrollWidth(table))
                        .css('position', 'absolute')
                        .css('top', '0px')
                        .css('z-index', '1000')
                        .css('margin-left', '0px')
                        .addClass('scroll-background')
                        .css('height', innerTopScrollHeight);
                    var bar = $(document.createElement('div')).addClass('scroll-bar');
                    innerTopScroll.append(bar);
                    var innerTopScrollInnerDiv = $(document.createElement('div'))
                        .css('width', (tableWidth - leftCornerWidth) + 'px')
                        .css('height', innerTopScrollHeight)
                    innerTopScroll.append(innerTopScrollInnerDiv);
                    innerTopScroll.insertBefore(table.parent());
                    $(bar).css('width', getBarWidth(innerTopScroll) + 'px');
                    bar = $(bar);
                    bar.bind("mousedown", function(e) {
                        var $doc = $(document);
                        var isDragg = true;
                        var t = parseFloat(bar.position().left);
                        var pageX = e.pageX;
                        $doc.bind("mousemove.slimscroll", function(e) {
                            var currLeft = t + e.pageX - pageX;
                            currLeft = currLeft < 0 ? 0 : currLeft;
                            var outerWidth = $(innerTopScroll).outerWidth();
                            var barWidth = getBarWidth(innerTopScroll)
                            currLeft = (currLeft + barWidth) > outerWidth ? (outerWidth - barWidth) : currLeft;
                            bar.css('left', currLeft);
                            // need to set scroll left length
                            if (specificLength == 0) {
                                innerTopScroll.siblings().scrollLeft(parseFloat(currLeft));
                            } else if (specificLength > 0) {
                                var totalLength = outerWidth - barWidth + specificLength;
                                var showLength = outerWidth - barWidth;
                                var rate = parseFloat(totalLength / showLength);
                                innerTopScroll.siblings().scrollLeft(parseFloat(currLeft * rate));
                            }


                        });

                        $doc.bind("mouseup.slimscroll", function(e) {
                            isDragg = false;
                            $doc.unbind('.slimscroll');
                        });
                        return false;
                    })
                }

            }

            function setTableCSS(table) {
                var leftCornerWidth = getFixedLeftWidth(table);
                var tableWidth = getTableWidth(table);

                table
                    .css('border-collapse', 'collapse')
                    .css('width', (tableWidth - leftCornerWidth) + 'px');
            }

            function setTheadCSS(table) {
                var rows = getHeadFirstRows(table);
                var totalHeight = 0;

                rows.each(function(i) {
                    var cols = getHeadCols(table, i);
                    var totalWidth = 0;

                    cols.each(function(j) {
                        var width = $(this).outerWidth(true);
                        var height = $(this).outerHeight(true);

                        totalWidth += width;

                        if (j == 0)
                            totalHeight += height;

                        $(this)
                            .addClass(cfg.scroll.headRow.className)
                            .css('position', 'absolute')
                            .css('top', (totalHeight - height) + 'px')
                            .css('left', (totalWidth - width) + 'px');
                    });
                });
            }

            function setTbodyCSS(table) {
                var leftCornerWidth = getFixedLeftWidth(table);
                var tableWidth = getTableWidth(table);

                table.find('tbody tr').each(function() {
                    $(this).css('width', (tableWidth - leftCornerWidth) + 'px');
                });
            }

            function setLeftColumnCSS(table) {
                var total = 0;
                var cols = getFixedLeftCols(table);

                cols.each(function(i) {
                    var width = $(this).outerWidth(true);

                    total += width;
                    table
                        .find('tbody tr td:nth-child(' + (i + 1) + ')')
                        .addClass(cfg.scroll.leftCol.className)
                        .css('position', 'absolute')
                        .css('left', (total - width) + 'px');
                });
            }

            function recalHeight(table) {
                table.find('tbody tr').each(function() {
                    var maxHeight = 0;

                    for (var i = 0; i < cfg.scroll.leftCol.fixedSpan; i++) {
                        var h = $(this).find('td:nth-child(' + (i + 1) + ')').height();

                        if (h > maxHeight)
                            maxHeight = h;
                    }

                    $(this)
                        .find('td:nth-child(' + (cfg.scroll.leftCol.fixedSpan + 1) + ')')
                        .height(maxHeight);
                    $(this).hide().fadeIn(0);
                });
            }

            function appendCorner(table) {
                var corner = $('<div></div>')
                    .attr('id', cfg.corner.outer.idName)
                    .addClass(cfg.corner.outer.className)
                    .css('position', 'absolute')
                    .css('left', '0px')
                    .css('top', '0px')
                    .css('margin', '0')
                    .css('padding', '0')
                    .css('width', getFixedLeftWidth(table) + 'px')
                    .css('height', getFixedHeadHeight(table) + 'px');
                var innerTable = $('<table></table>')
                    .attr('id', cfg.corner.inner.idName)
                    .addClass(cfg.corner.inner.className)
                    .css('border-collapse', 'collapse');
                var thead = $('<thead></thead>');
                var rows = getFixedHeadRows(table);

                rows.each(function() {
                    var tr = $('<tr></tr>');

                    $(this).each(function() {
                        var th = $(this).clone(cfg.corner.deepClone);

                        $(this).removeAttr('id');
                        $(this).unbind();
                        th.appendTo(tr);
                    });

                    tr.appendTo(thead);
                });

                thead.appendTo(innerTable);
                innerTable.appendTo(corner);
                corner.appendTo(table.parent());
            }

            function recalHeaderPosition(table) {
                var leftPosition = [];

                table.find('tbody tr:first').each(function() {
                    $(this).find('td').each(function() {
                        var position = $(this).position();
                        leftPosition.push(position.left);
                    });
                });

                table.find('thead tr').each(function() {
                    $(this).find('th').each(function(i) {
                        $(this).css('left', leftPosition[i] + 'px');
                    });
                });
            }

            function init(table) {
                setLeftColumnCSS(table);
                setTbodyCSS(table);
                setTheadCSS(table);
                setTableCSS(table);

                createOuter(table);
                createInner(table);

                recalHeight(table);

                if (cfg.corner.append)
                    appendCorner(table);

                recalHeaderPosition(table);
            }

            function scrollCols(table) {
                table.find('tbody tr').each(function() {
                    for (var i = 0; i < cfg.scroll.leftCol.fixedSpan; i++) {
                        $(this)
                            .find('td:nth-child(' + (i + 1) + ')')
                            .css('top', $(this)
                                .find('td:nth-child(' + (cfg.scroll.leftCol.fixedSpan + 1) + ')')
                                .position()
                                .top + 'px');
                    }
                });
            }

            function scrollRows(table) {
                table.find('thead tr').each(function(i) {
                    if (i < getHeadRowCount(table)) {
                        $(this).find('th').each(function(j) {
                            $(this)
                                .css('left', table
                                    .find('tbody tr:first-child td:nth-child(' + (j + 1) + ')')
                                    .position()
                                    .left + 'px');
                        });
                    }
                });
            }

            function scrollOther(table, other) {
                other.scrollTop(table.scrollTop());
                other.scrollLeft(table.scrollLeft());
            }

            function syncTables(table) {
                var syncWith = cfg.scroll.syncWith;

                if ($.isArray(syncWith)) {
                    $.each(syncWith, function() {
                        scrollOther(table, $(this.toString()).parent());
                    });
                } else
                    scrollOther(table, $(syncWith).parent());
            }

            return this.each(function() {
                if ($(this)[0].tagName.toLowerCase() != "table")
                    return true;

                init($(this));

                if (cfg.scroll.leftCol.enabled || cfg.scroll.headRow.enabled) {
                    var _that = this;
                    var outScroll = $(this).parent();
                    var topScroll = $(this).parent().prev();
                    $(topScroll).scroll(function() {

                        $(outScroll)
                            .scrollLeft($(topScroll).scrollLeft());
                    })
                    $(this).parent().scroll(function() {
                        if (cfg.scroll.headRow.enabled)
                            scrollRows($(this));

                        if (cfg.scroll.leftCol.enabled)
                            scrollCols($(this));

                        if (cfg.scroll.syncWith)
                            syncTables($(this));
                    });


                }
            });
        }
    });
})(jQuery);
