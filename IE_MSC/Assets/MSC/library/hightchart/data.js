/*
 Highcharts JS v8.0.4 (2020-03-10)

 Data module

 (c) 2012-2019 Torstein Honsi

 License: www.highcharts.com/license
*/
(function (b) { "object" === typeof module && module.exports ? (b["default"] = b, module.exports = b) : "function" === typeof define && define.amd ? define("highcharts/modules/data", ["highcharts"], function (u) { b(u); b.Highcharts = u; return b }) : b("undefined" !== typeof Highcharts ? Highcharts : void 0) })(function (b) {
    function u(z, b, u, H) { z.hasOwnProperty(b) || (z[b] = H.apply(null, u)) } b = b ? b._modules : {}; u(b, "mixins/ajax.js", [b["parts/Globals.js"], b["parts/Utilities.js"]], function (b, y) {
        var z = y.merge, u = y.objectEach; b.ajax = function (b) {
            var n =
            z(!0, { url: !1, type: "get", dataType: "json", success: !1, error: !1, data: !1, headers: {} }, b); b = { json: "application/json", xml: "application/xml", text: "text/plain", octet: "application/octet-stream" }; var r = new XMLHttpRequest; if (!n.url) return !1; r.open(n.type.toUpperCase(), n.url, !0); n.headers["Content-Type"] || r.setRequestHeader("Content-Type", b[n.dataType] || b.text); u(n.headers, function (b, n) { r.setRequestHeader(n, b) }); r.onreadystatechange = function () {
                if (4 === r.readyState) {
                    if (200 === r.status) {
                        var b = r.responseText; if ("json" ===
                        n.dataType) try { b = JSON.parse(b) } catch (E) { n.error && n.error(r, E); return } return n.success && n.success(b)
                    } n.error && n.error(r, r.responseText)
                }
            }; try { n.data = JSON.stringify(n.data) } catch (G) { } r.send(n.data || !0)
        }; b.getJSON = function (z, n) { b.ajax({ url: z, success: n, dataType: "json", headers: { "Content-Type": "text/plain" } }) }
    }); u(b, "modules/data.src.js", [b["parts/Globals.js"], b["parts/Utilities.js"]], function (b, y) {
        var u = y.defined, z = y.extend, F = y.isNumber, n = y.objectEach, r = y.pick, G = y.splat; y = b.addEvent; var E = b.Chart, I = b.win.document,
        C = b.merge, J = b.fireEvent, D = function (a, d, c) { this.init(a, d, c) }; z(D.prototype, {
            init: function (a, d, c) {
                var e = a.decimalPoint; d && (this.chartOptions = d); c && (this.chart = c); "." !== e && "," !== e && (e = void 0); this.options = a; this.columns = a.columns || this.rowsToColumns(a.rows) || []; this.firstRowAsNames = r(a.firstRowAsNames, this.firstRowAsNames, !0); this.decimalRegex = e && new RegExp("^(-?[0-9]+)" + e + "([0-9]+)$"); this.rawColumns = []; if (this.columns.length) { this.dataFound(); var g = !0 } this.hasURLOption(a) && (clearTimeout(this.liveDataTimeout),
                g = !1); g || (g = this.fetchLiveData()); g || (g = !!this.parseCSV().length); g || (g = !!this.parseTable().length); g || (g = this.parseGoogleSpreadsheet()); !g && a.afterComplete && a.afterComplete()
            }, hasURLOption: function (a) { return !(!a || !(a.rowsURL || a.csvURL || a.columnsURL)) }, getColumnDistribution: function () {
                var a = this.chartOptions, d = this.options, c = [], e = function (a) { return (b.seriesTypes[a || "line"].prototype.pointArrayMap || [0]).length }, g = a && a.chart && a.chart.type, f = [], x = [], h = 0; d = d && d.seriesMapping || a && a.series && a.series.map(function () { return { x: 0 } }) ||
                []; var k; (a && a.series || []).forEach(function (a) { f.push(e(a.type || g)) }); d.forEach(function (a) { c.push(a.x || 0) }); 0 === c.length && c.push(0); d.forEach(function (d) { var c = new A, t = f[h] || e(g), q = (a && a.series || [])[h] || {}, v = b.seriesTypes[q.type || g || "line"].prototype.pointArrayMap, B = v || ["y"]; (u(d.x) || q.isCartesian || !v) && c.addColumnReader(d.x, "x"); n(d, function (a, d) { "x" !== d && c.addColumnReader(a, d) }); for (k = 0; k < t; k++) c.hasReader(B[k]) || c.addColumnReader(void 0, B[k]); x.push(c); h++ }); d = b.seriesTypes[g || "line"].prototype.pointArrayMap;
                "undefined" === typeof d && (d = ["y"]); this.valueCount = { global: e(g), xColumns: c, individual: f, seriesBuilders: x, globalPointArrayMap: d }
            }, dataFound: function () { this.options.switchRowsAndColumns && (this.columns = this.rowsToColumns(this.columns)); this.getColumnDistribution(); this.parseTypes(); !1 !== this.parsed() && this.complete() }, parseCSV: function (a) {
                function d(a, d, c, e) {
                    function g(d) { h = a[d]; l = a[d - 1]; q = a[d + 1] } function f(a) { t.length < w + 1 && t.push([a]); t[w][t[w].length - 1] !== a && t[w].push(a) } function b() {
                        k > x || x > n ? (++x,
                        p = "") : (!isNaN(parseFloat(p)) && isFinite(p) ? (p = parseFloat(p), f("number")) : isNaN(Date.parse(p)) ? f("string") : (p = p.replace(/\//g, "-"), f("date")), v.length < w + 1 && v.push([]), c || (v[w][d] = p), p = "", ++w, ++x)
                    } var m = 0, h = "", l = "", q = "", p = "", x = 0, w = 0; if (a.trim().length && "#" !== a.trim()[0]) { for (; m < a.length; m++) { g(m); if ("#" === h) { b(); return } if ('"' === h) for (g(++m) ; m < a.length && ('"' !== h || '"' === l || '"' === q) ;) { if ('"' !== h || '"' === h && '"' !== l) p += h; g(++m) } else e && e[h] ? e[h](h, p) && b() : h === B ? b() : p += h } b() }
                } function c(a) {
                    var d = 0, c = 0, e = !1;
                    a.some(function (a, e) { var g = !1, f = ""; if (13 < e) return !0; for (var b = 0; b < a.length; b++) { e = a[b]; var h = a[b + 1]; var k = a[b - 1]; if ("#" === e) break; if ('"' === e) if (g) { if ('"' !== k && '"' !== h) { for (; " " === h && b < a.length;) h = a[++b]; "undefined" !== typeof q[h] && q[h]++; g = !1 } } else g = !0; else "undefined" !== typeof q[e] ? (f = f.trim(), isNaN(Date.parse(f)) ? !isNaN(f) && isFinite(f) || q[e]++ : q[e]++, f = "") : f += e; "," === e && c++; "." === e && d++ } }); e = q[";"] > q[","] ? ";" : ","; f.decimalPoint || (f.decimalPoint = d > c ? "." : ",", g.decimalRegex = new RegExp("^(-?[0-9]+)" +
                    f.decimalPoint + "([0-9]+)$")); return e
                } function e(a, d) {
                    var c = [], e = 0, b = !1, h = [], k = [], m; if (!d || d > a.length) d = a.length; for (; e < d; e++) if ("undefined" !== typeof a[e] && a[e] && a[e].length) {
                        var l = a[e].trim().replace(/\//g, " ").replace(/\-/g, " ").replace(/\./g, " ").split(" "); c = ["", "", ""]; for (m = 0; m < l.length; m++) m < c.length && (l[m] = parseInt(l[m], 10), l[m] && (k[m] = !k[m] || k[m] < l[m] ? l[m] : k[m], "undefined" !== typeof h[m] ? h[m] !== l[m] && (h[m] = !1) : h[m] = l[m], 31 < l[m] ? c[m] = 100 > l[m] ? "YY" : "YYYY" : 12 < l[m] && 31 >= l[m] ? (c[m] = "dd", b = !0) : c[m].length ||
                        (c[m] = "mm")))
                    } if (b) { for (m = 0; m < h.length; m++) !1 !== h[m] ? 12 < k[m] && "YY" !== c[m] && "YYYY" !== c[m] && (c[m] = "YY") : 12 < k[m] && "mm" === c[m] && (c[m] = "dd"); 3 === c.length && "dd" === c[1] && "dd" === c[2] && (c[2] = "YY"); a = c.join("/"); return (f.dateFormats || g.dateFormats)[a] ? a : (J("deduceDateFailed"), "YYYY/mm/dd") } return "YYYY/mm/dd"
                } var g = this, f = a || this.options, b = f.csv; a = "undefined" !== typeof f.startRow && f.startRow ? f.startRow : 0; var h = f.endRow || Number.MAX_VALUE, k = "undefined" !== typeof f.startColumn && f.startColumn ? f.startColumn : 0, n = f.endColumn ||
                Number.MAX_VALUE, l = 0, t = [], q = { ",": 0, ";": 0, "\t": 0 }; var v = this.columns = []; b && f.beforeParse && (b = f.beforeParse.call(this, b)); if (b) { b = b.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split(f.lineDelimiter || "\n"); if (!a || 0 > a) a = 0; if (!h || h >= b.length) h = b.length - 1; if (f.itemDelimiter) var B = f.itemDelimiter; else B = null, B = c(b); var w = 0; for (l = a; l <= h; l++) "#" === b[l][0] ? w++ : d(b[l], l - a - w); f.columnTypes && 0 !== f.columnTypes.length || !t.length || !t[0].length || "date" !== t[0][1] || f.dateFormat || (f.dateFormat = e(v[0])); this.dataFound() } return v
            },
            parseTable: function () {
                var a = this.options, d = a.table, c = this.columns, e = a.startRow || 0, g = a.endRow || Number.MAX_VALUE, f = a.startColumn || 0, b = a.endColumn || Number.MAX_VALUE; d && ("string" === typeof d && (d = I.getElementById(d)), [].forEach.call(d.getElementsByTagName("tr"), function (a, d) { d >= e && d <= g && [].forEach.call(a.children, function (a, g) { var h = c[g - f], k = 1; if (("TD" === a.tagName || "TH" === a.tagName) && g >= f && g <= b) for (c[g - f] || (c[g - f] = []), c[g - f][d - e] = a.innerHTML; d - e >= k && void 0 === h[d - e - k];) h[d - e - k] = null, k++ }) }), this.dataFound());
                return c
            }, fetchLiveData: function () {
                function a(k) {
                    function n(h, n, q) { function l() { f && c.liveDataURL === h && (d.liveDataTimeout = setTimeout(a, x)) } if (!h || 0 !== h.indexOf("http")) return h && e.error && e.error("Invalid URL"), !1; k && (clearTimeout(d.liveDataTimeout), c.liveDataURL = h); b.ajax({ url: h, dataType: q || "json", success: function (a) { c && c.series && n(a); l() }, error: function (a, d) { 3 > ++g && l(); return e.error && e.error(d, a) } }); return !0 } n(h.csvURL, function (a) { c.update({ data: { csv: a } }) }, "text") || n(h.rowsURL, function (a) { c.update({ data: { rows: a } }) }) ||
                    n(h.columnsURL, function (a) { c.update({ data: { columns: a } }) })
                } var d = this, c = this.chart, e = this.options, g = 0, f = e.enablePolling, x = 1E3 * (e.dataRefreshRate || 2), h = C(e); if (!this.hasURLOption(e)) return !1; 1E3 > x && (x = 1E3); delete e.csvURL; delete e.rowsURL; delete e.columnsURL; a(!0); return this.hasURLOption(e)
            }, parseGoogleSpreadsheet: function () {
                function a(d) {
                    var g = ["https://spreadsheets.google.com/feeds/cells", e, f, "public/values?alt=json"].join("/"); b.ajax({
                        url: g, dataType: "json", success: function (e) {
                            d(e); c.enablePolling &&
                            setTimeout(function () { a(d) }, 1E3 * (c.dataRefreshRate || 2))
                        }, error: function (a, d) { return c.error && c.error(d, a) }
                    })
                } var d = this, c = this.options, e = c.googleSpreadsheetKey, g = this.chart, f = c.googleSpreadsheetWorksheet || 1, x = c.startRow || 0, h = c.endRow || Number.MAX_VALUE, k = c.startColumn || 0, n = c.endColumn || Number.MAX_VALUE, l = 1E3 * (c.dataRefreshRate || 2); 4E3 > l && (l = 4E3); e && (delete c.googleSpreadsheetKey, a(function (a) {
                    var c = []; a = a.feed.entry; var e = (a || []).length, f = 0, b; if (!a || 0 === a.length) return !1; for (b = 0; b < e; b++) {
                        var l = a[b];
                        f = Math.max(f, l.gs$cell.col)
                    } for (b = 0; b < f; b++) b >= k && b <= n && (c[b - k] = []); for (b = 0; b < e; b++) { l = a[b]; f = l.gs$cell.row - 1; var t = l.gs$cell.col - 1; if (t >= k && t <= n && f >= x && f <= h) { var p = l.gs$cell || l.content; l = null; p.numericValue ? l = 0 <= p.$t.indexOf("/") || 0 <= p.$t.indexOf("-") ? p.$t : 0 < p.$t.indexOf("%") ? 100 * parseFloat(p.numericValue) : parseFloat(p.numericValue) : p.$t && p.$t.length && (l = p.$t); c[t - k][f - x] = l } } c.forEach(function (a) { for (b = 0; b < a.length; b++) "undefined" === typeof a[b] && (a[b] = null) }); g && g.series ? g.update({ data: { columns: c } }) :
                    (d.columns = c, d.dataFound())
                })); return !1
            }, trim: function (a, d) { "string" === typeof a && (a = a.replace(/^\s+|\s+$/g, ""), d && /^[0-9\s]+$/.test(a) && (a = a.replace(/\s/g, "")), this.decimalRegex && (a = a.replace(this.decimalRegex, "$1.$2"))); return a }, parseTypes: function () { for (var a = this.columns, d = a.length; d--;) this.parseColumn(a[d], d) }, parseColumn: function (a, d) {
                var c = this.rawColumns, e = this.columns, g = a.length, b = this.firstRowAsNames, n = -1 !== this.valueCount.xColumns.indexOf(d), h, k = [], r = this.chartOptions, l, t = (this.options.columnTypes ||
                [])[d]; r = n && (r && r.xAxis && "category" === G(r.xAxis)[0].type || "string" === t); for (c[d] || (c[d] = []) ; g--;) {
                    var q = k[g] || a[g]; var v = this.trim(q); var u = this.trim(q, !0); var w = parseFloat(u); "undefined" === typeof c[d][g] && (c[d][g] = v); r || 0 === g && b ? a[g] = "" + v : +u === w ? (a[g] = w, 31536E6 < w && "float" !== t ? a.isDatetime = !0 : a.isNumeric = !0, "undefined" !== typeof a[g + 1] && (l = w > a[g + 1])) : (v && v.length && (h = this.parseDate(q)), n && F(h) && "float" !== t ? (k[g] = q, a[g] = h, a.isDatetime = !0, "undefined" !== typeof a[g + 1] && (q = h > a[g + 1], q !== l && "undefined" !==
                    typeof l && (this.alternativeFormat ? (this.dateFormat = this.alternativeFormat, g = a.length, this.alternativeFormat = this.dateFormats[this.dateFormat].alternative) : a.unsorted = !0), l = q)) : (a[g] = "" === v ? null : v, 0 !== g && (a.isDatetime || a.isNumeric) && (a.mixed = !0)))
                } n && a.mixed && (e[d] = c[d]); if (n && l && this.options.sort) for (d = 0; d < e.length; d++) e[d].reverse(), b && e[d].unshift(e[d].pop())
            }, dateFormats: {
                "YYYY/mm/dd": {
                    regex: /^([0-9]{4})[\-\/\.]([0-9]{1,2})[\-\/\.]([0-9]{1,2})$/, parser: function (a) {
                        return Date.UTC(+a[1], a[2] - 1,
                        +a[3])
                    }
                }, "dd/mm/YYYY": { regex: /^([0-9]{1,2})[\-\/\.]([0-9]{1,2})[\-\/\.]([0-9]{4})$/, parser: function (a) { return Date.UTC(+a[3], a[2] - 1, +a[1]) }, alternative: "mm/dd/YYYY" }, "mm/dd/YYYY": { regex: /^([0-9]{1,2})[\-\/\.]([0-9]{1,2})[\-\/\.]([0-9]{4})$/, parser: function (a) { return Date.UTC(+a[3], a[1] - 1, +a[2]) } }, "dd/mm/YY": { regex: /^([0-9]{1,2})[\-\/\.]([0-9]{1,2})[\-\/\.]([0-9]{2})$/, parser: function (a) { var d = +a[3]; d = d > (new Date).getFullYear() - 2E3 ? d + 1900 : d + 2E3; return Date.UTC(d, a[2] - 1, +a[1]) }, alternative: "mm/dd/YY" },
                "mm/dd/YY": { regex: /^([0-9]{1,2})[\-\/\.]([0-9]{1,2})[\-\/\.]([0-9]{2})$/, parser: function (a) { return Date.UTC(+a[3] + 2E3, a[1] - 1, +a[2]) } }
            }, parseDate: function (a) {
                var d = this.options.parseDate, c, e = this.options.dateFormat || this.dateFormat, b; if (d) var f = d(a); else if ("string" === typeof a) {
                    if (e) (d = this.dateFormats[e]) || (d = this.dateFormats["YYYY/mm/dd"]), (b = a.match(d.regex)) && (f = d.parser(b)); else for (c in this.dateFormats) if (d = this.dateFormats[c], b = a.match(d.regex)) {
                        this.dateFormat = c; this.alternativeFormat = d.alternative;
                        f = d.parser(b); break
                    } b || (b = Date.parse(a), "object" === typeof b && null !== b && b.getTime ? f = b.getTime() - 6E4 * b.getTimezoneOffset() : F(b) && (f = b - 6E4 * (new Date(b)).getTimezoneOffset()))
                } return f
            }, rowsToColumns: function (a) { var d, c; if (a) { var e = []; var b = a.length; for (d = 0; d < b; d++) { var f = a[d].length; for (c = 0; c < f; c++) e[c] || (e[c] = []), e[c][d] = a[d][c] } } return e }, getData: function () { if (this.columns) return this.rowsToColumns(this.columns).slice(1) }, parsed: function () {
                if (this.options.parsed) return this.options.parsed.call(this,
                this.columns)
            }, getFreeIndexes: function (a, d) { var c, e = [], b = []; for (c = 0; c < a; c += 1) e.push(!0); for (a = 0; a < d.length; a += 1) { var f = d[a].getReferencedColumnIndexes(); for (c = 0; c < f.length; c += 1) e[f[c]] = !1 } for (c = 0; c < e.length; c += 1) e[c] && b.push(c); return b }, complete: function () {
                var a = this.columns, d, c = this.options, b, g, f = []; if (c.complete || c.afterComplete) {
                    if (this.firstRowAsNames) for (b = 0; b < a.length; b++) a[b].name = a[b].shift(); var n = []; var h = this.getFreeIndexes(a.length, this.valueCount.seriesBuilders); for (b = 0; b < this.valueCount.seriesBuilders.length; b++) {
                        var k =
                        this.valueCount.seriesBuilders[b]; k.populateColumns(h) && f.push(k)
                    } for (; 0 < h.length;) { k = new A; k.addColumnReader(0, "x"); b = h.indexOf(0); -1 !== b && h.splice(b, 1); for (b = 0; b < this.valueCount.global; b++) k.addColumnReader(void 0, this.valueCount.globalPointArrayMap[b]); k.populateColumns(h) && f.push(k) } 0 < f.length && 0 < f[0].readers.length && (k = a[f[0].readers[0].columnIndex], "undefined" !== typeof k && (k.isDatetime ? d = "datetime" : k.isNumeric || (d = "category"))); if ("category" === d) for (b = 0; b < f.length; b++) for (k = f[b], h = 0; h < k.readers.length; h++) "x" ===
                    k.readers[h].configName && (k.readers[h].configName = "name"); for (b = 0; b < f.length; b++) { k = f[b]; h = []; for (g = 0; g < a[0].length; g++) h[g] = k.read(a, g); n[b] = { data: h }; k.name && (n[b].name = k.name); "category" === d && (n[b].turboThreshold = 0) } a = { series: n }; d && (a.xAxis = { type: d }, "category" === d && (a.xAxis.uniqueNames = !1)); c.complete && c.complete(a); c.afterComplete && c.afterComplete(a)
                }
            }, update: function (a, b) {
                var d = this.chart; a && (a.afterComplete = function (a) {
                    a && (a.xAxis && d.xAxis[0] && a.xAxis.type === d.xAxis[0].options.type && delete a.xAxis,
                    d.update(a, b, !0))
                }, C(!0, d.options.data, a), this.init(d.options.data))
            }
        }); b.Data = D; b.data = function (a, b, c) { return new D(a, b, c) }; y(E, "init", function (a) {
            var b = this, c = a.args[0] || {}, e = a.args[1]; c && c.data && !b.hasDataDef && (b.hasDataDef = !0, b.data = new D(z(c.data, {
                afterComplete: function (a) {
                    var d; if (Object.hasOwnProperty.call(c, "series")) if ("object" === typeof c.series) for (d = Math.max(c.series.length, a && a.series ? a.series.length : 0) ; d--;) { var g = c.series[d] || {}; c.series[d] = C(g, a && a.series ? a.series[d] : {}) } else delete c.series;
                    c = C(a, c); b.init(c, e)
                }
            }), c, b), a.preventDefault())
        }); var A = function () { this.readers = []; this.pointIsArray = !0 }; A.prototype.populateColumns = function (a) { var b = !0; this.readers.forEach(function (b) { "undefined" === typeof b.columnIndex && (b.columnIndex = a.shift()) }); this.readers.forEach(function (a) { "undefined" === typeof a.columnIndex && (b = !1) }); return b }; A.prototype.read = function (a, d) {
            var c = this.pointIsArray, e = c ? [] : {}; this.readers.forEach(function (f) {
                var g = a[f.columnIndex][d]; c ? e.push(g) : 0 < f.configName.indexOf(".") ?
                b.Point.prototype.setNestedProperty(e, g, f.configName) : e[f.configName] = g
            }); if ("undefined" === typeof this.name && 2 <= this.readers.length) { var g = this.getReferencedColumnIndexes(); 2 <= g.length && (g.shift(), g.sort(function (a, b) { return a - b }), this.name = a[g.shift()].name) } return e
        }; A.prototype.addColumnReader = function (a, b) { this.readers.push({ columnIndex: a, configName: b }); "x" !== b && "y" !== b && "undefined" !== typeof b && (this.pointIsArray = !1) }; A.prototype.getReferencedColumnIndexes = function () {
            var a, b = []; for (a = 0; a < this.readers.length; a +=
            1) { var c = this.readers[a]; "undefined" !== typeof c.columnIndex && b.push(c.columnIndex) } return b
        }; A.prototype.hasReader = function (a) { var b; for (b = 0; b < this.readers.length; b += 1) { var c = this.readers[b]; if (c.configName === a) return !0 } }
    }); u(b, "masters/modules/data.src.js", [], function () { })
});
//# sourceMappingURL=data.js.map