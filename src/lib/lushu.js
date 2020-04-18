var BMapLib = window.BMapLib = BMapLib || {};
(function () {
    function i(a, b) { this._point = a; this._html = b } var c = c || { version: "1.5.0" }; c.guid = "$BAIDU$"; (function () {
    window[c.guid] = window[c.guid] || {}; c.dom = c.dom || {}; c.dom.g = function (a) { if ("string" == typeof a || a instanceof String) return document.getElementById(a); else if (a && a.nodeName && (a.nodeType == 1 || a.nodeType == 9)) return a; return null }; c.g = c.G = c.dom.g; c.lang = c.lang || {}; c.lang.isString = function (a) { return "[object String]" == Object.prototype.toString.call(a) }; c.isString = c.lang.isString; c.dom._g = function (a) {
        if (c.lang.isString(a)) return document.getElementById(a);
        return a
    }; c._g = c.dom._g; c.dom.getDocument = function (a) { a = c.dom.g(a); return a.nodeType == 9 ? a : a.ownerDocument || a.document }; c.browser = c.browser || {}; c.browser.ie = c.ie = /msie (\d+\.\d+)/i.test(navigator.userAgent) ? document.documentMode || +RegExp.$1 : undefined; c.dom.getComputedStyle = function (a, b) { a = c.dom._g(a); var d = c.dom.getDocument(a); if (d.defaultView && d.defaultView.getComputedStyle) if (d = d.defaultView.getComputedStyle(a, null)) return d[b] || d.getPropertyValue(b); return "" }; c.dom._styleFixer = c.dom._styleFixer ||
        {}; c.dom._styleFilter = c.dom._styleFilter || []; c.dom._styleFilter.filter = function (a, b, d) { for (var e = 0, f = c.dom._styleFilter, h; h = f[e]; e++)if (h = h[d]) b = h(a, b); return b }; c.string = c.string || {}; c.string.toCamelCase = function (a) { if (a.indexOf("-") < 0 && a.indexOf("_") < 0) return a; return a.replace(/[-_][^-_]/g, function (b) { return b.charAt(1).toUpperCase() }) }; c.dom.getStyle = function (a, b) {
            var d = c.dom; a = d.g(a); b = c.string.toCamelCase(b); var e = a.style[b] || (a.currentStyle ? a.currentStyle[b] : "") || d.getComputedStyle(a, b); if (!e) {
                var f =
                    d._styleFixer[b]; if (f) e = f.get ? f.get(a) : c.dom.getStyle(a, f)
            } if (f = d._styleFilter) e = f.filter(b, e, "get"); return e
        }; c.getStyle = c.dom.getStyle; c.dom._NAME_ATTRS = function () { var a = { cellpadding: "cellPadding", cellspacing: "cellSpacing", colspan: "colSpan", rowspan: "rowSpan", valign: "vAlign", usemap: "useMap", frameborder: "frameBorder" }; if (c.browser.ie < 8) { a["for"] = "htmlFor"; a["class"] = "className" } else { a.htmlFor = "for"; a.className = "class" } return a }(); c.dom.setAttr = function (a, b, d) {
            a = c.dom.g(a); if ("style" == b) a.style.cssText =
                d; else { b = c.dom._NAME_ATTRS[b] || b; a.setAttribute(b, d) } return a
        }; c.setAttr = c.dom.setAttr; c.dom.setAttrs = function (a, b) { a = c.dom.g(a); for (var d in b) c.dom.setAttr(a, d, b[d]); return a }; c.setAttrs = c.dom.setAttrs; c.dom.create = function (a, b) { var d = document.createElement(a); return c.dom.setAttrs(d, b || {}) }; c.object = c.object || {}; c.extend = c.object.extend = function (a, b) { for (var d in b) if (b.hasOwnProperty(d)) a[d] = b[d]; return a }
    })(); var g = BMapLib.LuShu = function (a, b, d) {
        if (!(!b || b.length < 1)) {
        this._map = a; this._path = b;
            this.i = 0; this._setTimeoutQuene = []; this._projection = this._map.getMapType().getProjection(); this._opts = { icon: null, speed: 4E3, defaultContent: "" }; this._setOptions(d); if (!this._opts.icon instanceof BMap.Icon) this._opts.icon = defaultIcon
        }
    }; g.prototype._setOptions = function (a) { if (a) for (var b in a) if (a.hasOwnProperty(b)) this._opts[b] = a[b] }; g.prototype.start = function () {
        var a = this, b = a._path.length; if (a.i && a.i < b - 1) if (a._fromPause) a._fromStop || a._moveNext(++a.i); else return; else {
            a._addMarker(); a._timeoutFlag = setTimeout(function () {
                a._addInfoWin();
                a._moveNext(a.i)
            }, 400)
        } this._fromStop = this._fromPause = false
    }; g.prototype.stop = function () { this.i = 0; this._fromStop = true; clearInterval(this._intervalFlag); this._clearTimeout(); for (var a = 0, b = this._opts.landmarkPois, d = b.length; a < d; a++)b[a].bShow = false }; g.prototype.pause = function () { clearInterval(this._intervalFlag); this._fromPause = true; this._clearTimeout() }; g.prototype.hideInfoWindow = function () { this._overlay._div.style.visibility = "hidden" }; g.prototype.showInfoWindow = function () {
        this._overlay._div.style.visibility =
        "visible"
    }; c.object.extend(g.prototype, {
        _addMarker: function () { if (this._marker) { this.stop(); this._map.removeOverlay(this._marker); clearTimeout(this._timeoutFlag) } this._overlay && this._map.removeOverlay(this._overlay); var a = new BMap.Marker(this._path[0]); this._opts.icon && a.setIcon(this._opts.icon); this._map.addOverlay(a); a.setAnimation(BMAP_ANIMATION_DROP); this._marker = a }, _addInfoWin: function () {
            var a = new i(this._marker.getPosition(), this._opts.defaultContent); a.setRelatedClass(this); this._overlay = a;
            this._map.addOverlay(a)
        }, _getMercator: function (a) { return this._map.getMapType().getProjection().lngLatToPoint(a) }, _getDistance: function (a, b) { return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2)) }, _move: function (a, b, d) {
            var e = this, f = 0, h = this._opts.speed / 100; a = this._projection.lngLatToPoint(a); b = this._projection.lngLatToPoint(b); var j = Math.round(e._getDistance(a, b) / h); if (j < 1) e._moveNext(++e.i); else e._intervalFlag = setInterval(function () {
                if (f >= j) {
                    clearInterval(e._intervalFlag); e.i > e._path.length ||
                        e._moveNext(++e.i)
                } else { f++; var k = d(a.x, b.x, f, j), l = d(a.y, b.y, f, j); k = e._projection.pointToLngLat(new BMap.Pixel(k, l)); e._marker.setPosition(k); e._setInfoWin(k) }
            }, 10)
        }, _moveNext: function (a) { a < this._path.length - 1 && this._move(this._path[a], this._path[a + 1], this._tween.linear) }, _setInfoWin: function (a) {
            this._overlay.setPosition(a, this._marker.getIcon().size); var b = this._troughPointIndex(a); if (b != -1) {
                clearInterval(this._intervalFlag); this._overlay.setHtml(this._opts.landmarkPois[b].html); this._overlay.setPosition(a,
                    this._marker.getIcon().size); this._pauseForView(b)
            } else this._overlay.setHtml(this._opts.defaultContent)
        }, _pauseForView: function (a) { var b = this; a = setTimeout(function () { b._moveNext(++b.i) }, b._opts.landmarkPois[a].pauseTime * 1E3); b._setTimeoutQuene.push(a) }, _clearTimeout: function () { for (var a in this._setTimeoutQuene) clearTimeout(this._setTimeoutQuene[a]); this._setTimeoutQuene.length = 0 }, _tween: { linear: function (a, b, d, e) { return (b - a) * d / e + a } }, _troughPointIndex: function (a) {
            for (var b = this._opts.landmarkPois,
                d, e = 0, f = b.length; e < f; e++)if (!b[e].bShow) { d = this._map.getDistance(new BMap.Point(b[e].lng, b[e].lat), a); if (d < 10) { b[e].bShow = true; return e } } return -1
        }
    }); i.prototype = new BMap.Overlay; i.prototype.initialize = function (a) {
        var b = this._div = c.dom.create("div", { style: "border:solid 1px #ccc;width:auto;min-width:50px;text-align:center;position:absolute;background:#fff;color:#000;font-size:12px;border-radius: 10px;padding:5px;white-space: nowrap;" }); b.innerHTML = this._html; a.getPanes().floatPane.appendChild(b); this._map =
            a; return b
    }; i.prototype.draw = function () { this.setPosition(this.lushuMain._marker.getPosition(), this.lushuMain._marker.getIcon().size) }; c.object.extend(i.prototype, {
        setPosition: function (a, b) { var d = this._map.pointToOverlayPixel(a), e = c.dom.getStyle(this._div, "width"), f = c.dom.getStyle(this._div, "height"); overlayW = parseInt(this._div.clientWidth || e, 10); overlayH = parseInt(this._div.clientHeight || f, 10); this._div.style.left = d.x - overlayW / 2 + "px"; this._div.style.bottom = -(d.y - b.height) + "px" }, setHtml: function (a) {
            this._div.innerHTML =
            a
        }, setRelatedClass: function (a) { this.lushuMain = a }
    })
})();