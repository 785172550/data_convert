// Copyright Data Design Group, Inc 2010-2016 All Rights Reserved.
var j, k, i;
var mye = eval;
var myhid = true;
var copyright = "Copyright 2010-2018 Data Design Group, Inc.";

function SeqObj(e) {
    this.n = e - 1 || 0, this.nInit = this.n, this.next = function () {
        return ++this.n
    }, this.curr = function () {
        return this.n
    }, this.reset = function () {
        this.n = this.nInit
    }
}

function queryGetVal(CSV, s, rownum) {
    if (CSV) {
        var j, k;
        for (k = 0; k < CSV.maxColumnsFound; k++) eval("var f" + (k + 1) + "=''"), eval("var F" + (k + 1) + "=''"), eval("var h" + (k + 1) + "=''"), eval("var H" + (k + 1) + "=''");
        for (k = 0; k < CSV.arHeaderRow.length; k++) {
            eval("var h" + (k + 1) + "=CSV.arHeaderRow[" + k + "]"), eval("var H" + (k + 1) + "=CSV.arHeaderRow[" + k + "].toUpperCase()");
            try {
                eval("var " + CSV.arHeaderRow[k] + "=CSV.arHeaderRow[" + k + "]")
            } catch (e) {}
        }
        if (rownum >= 0)
            for (k = 0; k < CSV.table[rownum].length; k++) {
                eval("var f" + (k + 1) + "=CSV.table[" + rownum + "][" + k + "]"), eval("var F" + (k + 1) + "=CSV.table[" + rownum + "][" + k + "].toUpperCase()");
                try {
                    eval("var " + CSV.arHeaderRow[k] + "=CSV.table[" + rownum + "][" + k + "]")
                } catch (e) {}
            }
        try {
            return eval(s)
        } catch (e) {
            return !0
        }
    }
}

function temGetVal(CSV, s, rownum, seq, options) {
    if (CSV) {
        var j, k, rn = rownum + 1,
            nr = CSV.table.length,
            nh = CSV.arHeaderRow.length,
            nf = 0,
            br = "\n",
            lb = "{",
            rb = "}",
            tab = "    ",
            v = "";
        for (options = options || {}, k = 0; k < CSV.maxColumnsFound; k++) eval("var f" + (k + 1) + "=''"), eval("var F" + (k + 1) + "=''"), eval("var h" + (k + 1) + "=''"), eval("var H" + (k + 1) + "=''");
        for (k = 0; k < CSV.arHeaderRow.length; k++) eval("var h" + (k + 1) + "=CSV.arHeaderRow[k]"), eval("var H" + (k + 1) + "=CSV.arHeaderRow[k].toUpperCase()"), options.global && options.global.length > 0 && (eval("h" + (k + 1) + "=h" + (k + 1) + "." + options.global.join(".")), eval("H" + (k + 1) + "=H" + (k + 1) + "." + options.global.join(".")));
        if (rownum >= 0)
            for (k = 0; k < CSV.table[rownum].length; k++) {
                eval("var f" + (k + 1) + "=CSV.table[rownum][k]"), eval("var F" + (k + 1) + "=CSV.table[rownum][k].toUpperCase()");
                try {
                    eval("var " + CSV.arHeaderRow[k] + "=CSV.table[rownum][k]")
                } catch (e) {}
                v = doTransformations(eval("f" + (k + 1)), k, CSV), eval("f" + (k + 1) + "=v"), v = doTransformations(eval("F" + (k + 1)), k, CSV), eval("F" + (k + 1) + "=v"), "f" + (k + 1) in options && (eval("f" + (k + 1) + "=f" + (k + 1) + "." + options["f" + (k + 1)].join(".")), eval("F" + (k + 1) + "=F" + (k + 1) + "." + options["F" + (k + 1)].join("."))), options.global && options.global.length > 0 && (eval("f" + (k + 1) + "=f" + (k + 1) + "." + options.global.join(".")), eval("F" + (k + 1) + "=F" + (k + 1) + "." + options.global.join(".")))
            }
        nf = rownum >= 0 ? CSV.table[rownum].length : 0;
        var a = s.split("."),
            b;
        for (j = 0; j < a.length; j++) b = a[j].trim().split("("), "csv" == b[0].trim().toLowerCase() && b.length > 1 && ")" === b[1].trim() && (a[j] = "csv(" + CSV.quote.enclose('"', "\\") + "," + CSV.quote.enclose('"', "\\") + ")");
        try {
            return eval(a.join("."))
        } catch (e) {
            return ""
        }
    }
}

function temHandler(e, t, n, l, a) {
    if (e) {
        if ("" == t.trim()) return t;
        var r = (t = (t = t.replace(/\{\s/gm, "{lb} ").replace(/\{$/gm, "{lb}").replace(/\s\}/gm, " {rb}").replace(/^\}/gm, "{rb}")).split(/\r\n|\r|\n/).join("{br}")).replace(/\{/g, "{\n").split(/\{|\}/).join("\n"),
            o = 0,
            s = !1;
        lines = r.split("\n");
        for (var c = []; o < lines.length;) s && "" != lines[o] ? (c.push(temGetVal(e, lines[o], n, l, a)), s = !1) : "" == lines[o] ? s = !0 : c.push(lines[o]), o++;
        return c.join("")
    }
}

function csvFromTem(e, t, n, l, a, r, o) {
    var s;
    if (e) {
        var c = "",
            d = new SeqObj;
        for (c += temHandler(e, t, -1, 0), s = 0; s < e.table.length; s++) "false" != temHandler(e, r, s, s, null).toString().left(5) && (c += temHandler(e, n, s, d.next(), o), s != e.table.length - 1 && (c += temHandler(e, l, s, d.curr())));
        return c += temHandler(e, a, -1, d.curr(), o)
    }
}

function csvToTable(e, t, n, l, a) {
    var r, o, s, c = '<table class="table table-bordered table-hover table-condensed">\n',
        d = 0,
        i = "",
        u = [];
    if (e) {
        for (a = a || {}, s = getFldPosArr(e), o = 0; o < e.maxColumnsFound; o++) u.push(0);
        if (e.isFirstRowHeader || t) {
            for (c += "<thead><tr>", n && (c += "<th>#</th>"), d = 0; d < s.length; d++) c += '<th title="Field #' + ((o = s[d] - 1) + 1) + '">' + (i = o > e.arHeaderRow.length ? "FIELD" + o : e.arHeaderRow[o]).toHtml().replace(/\r\n|\r|\n/g, "<br/>") + "</th>\n";
            c += "</tr></thead>\n"
        }
        for (c += "<tbody>", r = 0; r < e.table.length; r++) {
            c += "<tr", a && "attr1" in a && ("" != a.attr1 && "" === a.attr1Row ? c += " " + a.attr1 : "" != a.attr1 && "E" === a.attr1Row && r % 2 ? c += " " + a.attr1 : "" == a.attr1 || "O" !== a.attr1Row || r % 2 || (c += " " + a.attr1), "" != a.attr2 && "" === a.attr2Row ? c += " " + a.attr2 : "" != a.attr2 && "E" === a.attr2Row && r % 2 ? c += " " + a.attr2 : "" == a.attr2 || "O" !== a.attr2Row || r % 2 || (c += " " + a.attr2)), c += ">\n", n && (c += "<td>" + (r + 1) + "</td>\n");
            for (d = 0; d < s.length; d++)
                if (i = doTransformations(i = (o = s[d] - 1) >= e.table[r].length ? " " : e.table[r][o], o, e), !e.statsCnt[o] || "N" != e.statsCnt[o].fieldType && "I" != e.statsCnt[o].fieldType)
                    if ("" != i && "dateOutFormat" in a && "" != a.dateOutFormat && e.statsCnt[o] && "D" == e.statsCnt[o].fieldType) {
                        try {
                            i = moment(i, e.dateformat[o]).format(a.dateOutFormat)
                        } catch (e) {}
                        c += "<td>" + i.toHtml().replace(/\r\n|\n|\r/g, "<br/>"), c += "</td>\n"
                    } else "" == i && (i = " "), c += "<td>" + i.toHtml().replace(/\r\n|\n|\r/g, "<br/>"), c += "</td>\n";
            else c += '<td align="right">' + i + "</td>\n", u[o] += 1 * i;
            c += "</tr>\n"
        }
        if (c += "</tbody>", l) {
            for (c += "<tfoot><tr>", n && (c += "<th>Sum</th>"), d = 0; d < s.length; d++) o = s[d] - 1, !e.statsCnt[o] || "N" != e.statsCnt[o].fieldType && "I" != e.statsCnt[o].fieldType ? c += "<th>&nbsp;</th>" : c += '<th align="right">' + u[o].toFixed(e.statsCnt[o].fieldDecs) + "</th>\n";
            c += "</tr></tfoot>\n"
        }
        return c += "</table>"
    }
}

function csvToTableHeaderValue(e, t, n, l, a) {
    var r, o, s, c = '<table class="table table-bordered table-hover table-condensed">\n',
        d = 0,
        i = "";
    if (e) {
        for (s = getFldPosArr(e), (e.isFirstRowHeader || t) && (c += "<thead><tr><th>Field</th><th>Value</th></tr></thead>"), c += "<tbody>", r = 0; r < e.table.length; r++) {
            for (d = 0; d < s.length; d++) {
                if (c += "<tr>", 0 == d && n && (c += "<th>Record #</th><th>" + (r + 1) + "</th></tr><tr>\n"), c += '<th title="Field #' + ((o = s[d] - 1) + 1) + '">' + (i = o > e.arHeaderRow.length ? "FIELD" + o : e.arHeaderRow[o]).toHtml().replace(/\r\n|\r|\n/g, "<br/>") + "</th>\n", i = doTransformations(i = (o = s[d] - 1) >= e.table[r].length ? " " : e.table[r][o], o, e), !e.statsCnt[o] || "N" != e.statsCnt[o].fieldType && "I" != e.statsCnt[o].fieldType)
                    if ("" != i && "dateOutFormat" in a && "" != a.dateOutFormat && e.statsCnt[o] && "D" == e.statsCnt[o].fieldType) {
                        try {
                            i = moment(i, e.dateformat[o]).format(a.dateOutFormat)
                        } catch (e) {}
                        c += "<td>" + i.toHtml().replace(/\r\n|\n|\r/g, "<br/>"), c += "</td>\n"
                    } else "" == i && (i = " "), c += "<td>" + i.toHtml().replace(/\r\n|\n|\r/g, "<br/>") + "</td>\n";
                else c += '<td align="right">' + i.toFixed(e.statsCnt[o].fieldDecs) + "</td>\n";
                c += "</tr>\n"
            }
            c += ""
        }
        return c += "</tbody>", c += "</table>"
    }
}

function csvToWikiTable(e, t, n, l) {
    var a, r, o, s = '{| class="wikitable sortable"\n',
        c = 0,
        d = "",
        i = [];
    if (e) {
        for (o = getFldPosArr(e), r = 0; r < e.maxColumnsFound; r++) i.push(0);
        if (e.isFirstRowHeader || t)
            for (s += "|-\n", n && (s += "! #\n"), c = 0; c < o.length; c++) s += "! " + (d = (r = o[c] - 1) > e.arHeaderRow.length ? "FIELD" + r : e.arHeaderRow[r]).toHtml().replace(/\r\n|\r|\n/g, "<br/>") + "\n";
        for (a = 0; a < e.table.length; a++) {
            for (s += "|-\n", n && (s += "! " + (a + 1) + "\n"), c = 0; c < o.length; c++) d = doTransformations(d = (r = o[c] - 1) >= e.table[a].length ? " " : e.table[a][r], r, e), c > 0 && (s += " |"), !e.statsCnt[r] || "N" != e.statsCnt[r].fieldType && "I" != e.statsCnt[r].fieldType ? ("" == d && (d = " "), s += "| " + d.toHtml().replace(/\r\n|\n|\r/g, "<br/>").replace(/\|/g, "<nowiki>|</nowiki>")) : (s += "| " + d.toFixed(e.statsCnt[r].fieldDecs), i[r] += 1 * d);
            s += "\n"
        }
        if (s += "", l)
            for (s += "|-\n", n && (s += "! Sum\n"), c = 0; c < o.length; c++) r = o[c] - 1, !e.statsCnt[r] || "N" != e.statsCnt[r].fieldType && "I" != e.statsCnt[r].fieldType ? s += "! \n" : s += "! " + i[r].toFixed(e.statsCnt[r].fieldDecs) + "\n";
        return s += "|}"
    }
}

function csvToXml(e, t, n) {
    var l, a, r, o = 0,
        s = t || "ROWSET",
        c = n || "ROW",
        d = '<?xml version="1.0"?>\n<' + s + ">\n",
        i = 0,
        u = "",
        m = "";
    if (e) {
        if (r = getFldPosArr(e), 0 === e.table.length) return d + "</" + s + ">";
        for (a = getCsvHeader(e), o = 0; o < e.table.length; o++) {
            for (d += "<" + c + ">\n", i = 0; i < r.length; i++) u = doTransformations(u = (l = r[i] - 1) >= e.table[o].length ? "" : e.table[o][l] + "", l, e), d += "<" + (m = l >= a.length ? "FIELD" + l : a[l].replace(/[:~\/\\;?$@%=\[\]+='"`|()*\^&<>]/, "-")).replace(/\s+/g, "_") + ">" + u.toXml() + "</" + m.replace(/\s+/g, "_") + ">\n";
            d += "</" + c + ">\n"
        }
        return d += "</" + s + ">"
    }
}

function csvToXmlProperties(e, t, n, l) {
    var a, r, o = 0,
        s = t || "ROWSET",
        c = n || "ROW";
    option = l || {};
    var d, i = '<?xml version="1.0"?>\n<' + s + ">\n",
        u = 0,
        m = "";
    if (e) {
        if (d = getFldPosArr(e), 0 === e.table.length) return i + "</" + s + ">";
        for (r = getCsvHeader(e), o = 0; o < e.table.length; o++) {
            for (i += "<" + c, u = 0; u < d.length; u++) m = (a = d[u] - 1) >= e.table[o].length ? "" : e.table[o][a], (!l.skipEmpty || null !== m && void 0 !== m && "" !== m) && (m = doTransformations(m, a, e), i += " " + (a >= r.length ? "FIELD" + a : r[a].replace(/[:~\/\\;?$@%=\[\]+='"`|()*\^&<>]/, "-")).replace(/\s+/g, "_") + '="' + (m + "").toXml() + '"');
            i += "></" + c + ">\n"
        }
        return i += "</" + s + ">"
    }
}

function csvToJSON(e, t) {
    var n, l, a, r = 0,
        o = "",
        s = [],
        c = 0,
        d = "",
        u = "",
        m = !1,
        h = 0;
    if (t.isKeyed && (t.mongoDbMode = !1), e) {
        s = getFldPosArr(e), a = getCsvHeader(e);
        var p = !1,
            g = !0;
        if (0 === e.table.length) return t.mongoDbMode ? "" : t.isKeyed ? "{}" : "[]";
        if (t.tryToObject) {
            for (r = 0; r < a.length; r++) {
                if (a[r].indexOf("/") >= 0) {
                    p = !0;
                    break
                }!isNaN(a[r].split("/")[0]) && Number.isInteger(1 * a[r].split("/")[0]) || (g = !1)
            }
            if (g && (p = !0), p) return csvToJSONSpecial(e, t)
        }
        for (t.mongoDbMode || (o = "[\n"), r = 0; r < e.table.length; r++) {
            for (t.mongoDbMode || (o += " "), o += "{", t.mongoDbMode || (o += "\n"), h = 0, c = 0; c < s.length; c++) n = s[c] - 1, m = document.getElementById("chknull" + (n + 1)) && document.getElementById("chknull" + (n + 1)).checked, "" == (d = n >= e.table[r].length ? "" : e.table[r][n]) && t.skipEmpty || (o += h > 0 ? "," + (t.mongoDbMode ? "" : "\n") : "", u = n >= a.length || !a[n] || "" == a[n] ? "FIELD" + (c + 1) : a[n], t.mongoDbMode || (o += "  "), o += ' "' + u.toJson() + '": ', d = doTransformations(d, n, e), !t.forceWrap && (e.statsCnt[n] && ("N" == e.statsCnt[n].fieldType || "I" == e.statsCnt[n].fieldType || "B" == e.statsCnt[n].fieldType) || t.autoNum && d.isNumeric()) ? "" != d.trim() ? ((d = d.toNumber() + "").left(1) == getDecimalChar() && (d = "0" + d), d.left(2) == "-" + getDecimalChar() && (d = "-0" + d.substr(1)), o += d) : o += "null" : !t.forceWrap && e.statsCnt[n] && "L" == e.statsCnt[n].fieldType ? "" != d.trim() ? o += d.toLocaleLowerCase() : o += "null" : m && "" == d || t.nullIsNull && ("NULL" == d.toUpperCase() || "\\N" === d) ? o += "null" : o += '"' + d.toJson() + '"', h++);
            t.mongoDbMode || (o += "\n"), o += " }", r < e.table.length - 1 && !t.mongoDbMode && (o += ","), o += "\n"
        }
        if (t.mongoDbMode || (o += "]"), !t.mongoDbMode && t.isKeyed) {
            l = 1, document.getElementById("txtKeyNum") && (l = document.getElementById("txtKeyNum").value || "1", (l = isNaN(l) ? 1 : +l) < 1 && (l = 1)), l -= 1, s = JSON.parse(o), o = "";
            var f = {},
                y = a[l],
                b = !1;
            for (i = 0; i < 2; i++) {
                for (f = {}, r = 0; r < s.length; r++)
                    if (l >= e.table[r].length ? keyvalue = "" : keyvalue = e.table[r][l], keyvalue = doTransformations(keyvalue, l, e), y in s[r] && delete s[r][y], keyvalue in f) {
                        if (0 == i) {
                            b = !0;
                            break
                        }
                        f[keyvalue].push(s[r])
                    } else switch (b) {
                        case !1:
                            f[keyvalue] = s[r];
                            break;
                        case !0:
                            f[keyvalue] = [s[r]]
                    }
                if (0 == i && !b) break
            }
            return JSON.stringify(f, null, 3)
        }
        return o
    }
}

function csv2jsonObj(hdr, v, options) {
    var t = [],
        p = [],
        o = {},
        firstArray = !0;

    function delete_null_properties(e, t) {
        for (var n in e) null === e[n] || "" === e[n] ? delete e[n] : t && "object" == typeof e[n] && delete_null_properties(e[n], t);
        if (_.isArray(e))
            for (n = 0; n < e.length; n++) void 0 === e[n] && (e.splice(n, 1), n--)
    }
    for (j = 0; j < hdr.length; j++) !isNaN(hdr[j].split("/")[0]) && Number.isInteger(1 * hdr[j].split("/")[0]) || (firstArray = !1);
    for (firstArray && (o = []), j = 0; j < hdr.length; j++)
        for (p = hdr[j].split("/"), s = "o", k = 0; k < p.length; k++) t = [], s = s + '["' + p[k].replace("\\", "\\\\").replace('"', '\\"') + '"]', k < p.length - 1 && !isNaN(p[k + 1]) && Number.isInteger(1 * p[k + 1]) ? eval("if (typeof " + s + '=="undefined")' + s + "=[]") : k < p.length - 1 && eval("if (typeof " + s + '=="undefined")' + s + "={}"), k == p.length - 1 && eval(s + "=v[j]");
    options.skipEmpty && delete_null_properties(o, !0);
    var spacing = options.mongoDbMode ? 0 : 3;
    return JSON.stringify(o, null, spacing)
}

function csvToJSONSpecial(e, t) {
    var n, l, a, r, o = 0,
        s = "[\n",
        c = [],
        d = 0,
        u = "",
        m = "",
        h = !1;
    if (t.mongoDbMode && (s = ""), e) {
        if (c = getFldPosArr(e), 0 === e.table.length) return t.mongoDbMode ? "" : s + "]";
        for (l = getCsvHeader(e), o = 0; o < e.table.length; o++) {
            for (s += " ", m = "[", d = 0; d < c.length; d++) n = c[d] - 1, h = document.getElementById("chknull" + (n + 1)) && document.getElementById("chknull" + (n + 1)).checked, u = doTransformations(u = n >= e.table[o].length ? "" : e.table[o][n], n, e), !t.forceWrap && (e.statsCnt[n] && ("N" == e.statsCnt[n].fieldType || "I" == e.statsCnt[n].fieldType || "B" == e.statsCnt[n].fieldType) || t.autoNum && u.isNumeric()) ? "" != u.rtrim() ? ((u = u.toNumber() + "").left(1) == getDecimalChar() && (u = "0" + u), u.left(2) == "-" + getDecimalChar() && (u = "-0" + u.substr(1)), m += u) : m += "null" : !t.forceWrap && e.statsCnt[n] && "L" == e.statsCnt[n].fieldType ? m += "" != u ? u.toLocaleLowerCase() : "null" : h && "" == u || t.nullIsNull && ("NULL" == u.toUpperCase() || "\\N" === u) ? m += "null" : m += '"' + u.toJson() + '"', m += d < c.length - 1 ? "," : "";
            m += "]", s += csv2jsonObj(l, JSON.parse(m), t), o < e.table.length - 1 && !t.mongoDbMode && (s += ","), s += "\n"
        }
        if (t.mongoDbMode || (s += "]"), !t.mongoDbMode && t.isKeyed) {
            a = 1, document.getElementById("txtKeyNum") && (a = document.getElementById("txtKeyNum").value || "1", (a = isNaN(a) ? 1 : +a) < 1 && (a = 1)), a -= 1, c = JSON.parse(s), s = "";
            var p = {},
                g = l[a],
                f = !1;
            for (i = 0; i < 2; i++) {
                for (p = {}, o = 0; o < c.length; o++)
                    if (r = doTransformations(r = a >= e.table[o].length ? "" : e.table[o][a], a, e), g in c[o] && delete c[o][g], r in p) {
                        if (0 == i) {
                            f = !0;
                            break
                        }
                        p[r].push(c[o])
                    } else switch (f) {
                        case !1:
                            p[r] = c[o];
                            break;
                        case !0:
                            p[r] = [c[o]]
                    }
                if (0 == i && !f) break
            }
            return JSON.stringify(p, null, 3)
        }
        return s
    }
}

function csvToJSONArray(e, t) {
    var n, l, a, r = 0,
        o = "[\n",
        s = 0,
        c = "",
        d = "",
        i = "{\n",
        u = !1;
    if (e) {
        if (a = getFldPosArr(e), 0 === e.table.length) return o + "]";
        if (l = getCsvHeader(e), t.useFieldsData) {
            for (i += '  "' + (t.fldPropName || "fields") + '": [', s = 0; s < a.length; s++) d = (n = a[s] - 1) >= l.length ? "FIELD" + n : l[n], s > 0 && (i += ", "), i += d.enclose('"');
            i += "],\n", i += '  "' + (t.dataPropName || "data") + '": '
        }
        for (r = 0; r < e.table.length; r++) {
            for (a.length > 1 && (o += "  ["), s = 0; s < a.length; s++) n = a[s] - 1, u = document.getElementById("chknull" + (n + 1)) && document.getElementById("chknull" + (n + 1)).checked, c = doTransformations(c = n >= e.table[r].length ? "" : e.table[r][n], n, e), t.forceWrap || !e.statsCnt[n] || "N" != e.statsCnt[n].fieldType && "I" != e.statsCnt[n].fieldType && "B" != e.statsCnt[n].fieldType ? !t.forceWrap && e.statsCnt[n] && "L" == e.statsCnt[n].fieldType ? "" != c.trim() ? o += c.toLocaleLowerCase() : o += "null" : u && "" == c || t.nullIsNull && ("NULL" == c.toUpperCase() || "\\N" === c) ? o += "null" : o += '"' + c.toJson() + '"' : "" != c.trim() ? ((c = c.toNumber() + "").left(1) == getDecimalChar() && (c = "0" + c), c.left(2) == "-" + getDecimalChar() && (c = "-0" + c.substr(1)), o += c) : o += "null", o += s < a.length - 1 ? "," : "";
            a.length > 1 && (o += "  ]"), r < e.table.length - 1 && (o += ","), o += "\n"
        }
        return o += "]", t.useFieldsData && (o = i + o + "\n}"), o
    }
}

function csvToJSONColumnArray(e, t) {
    var n, l, a, r = 0,
        o = "{\n",
        s = 0,
        c = "",
        d = !1;
    if (e) {
        if (a = getFldPosArr(e), 0 === e.table.length) return o + "]";
        for (l = getCsvHeader(e), s = 0; s < a.length; s++) {
            n = a[s] - 1, d = document.getElementById("chknull" + (n + 1)) && document.getElementById("chknull" + (n + 1)).checked, o += '   "' + (s >= l.length ? "FIELD" + n : l[n]) + '":[';
            var i = 0;
            for (r = 0; r < e.table.length; r++) o += ++i > 1 ? "," : "", c = doTransformations(c = s >= e.table[r].length ? "" : e.table[r][n], n, e), t.forceWrap || !e.statsCnt[n] || "N" != e.statsCnt[n].fieldType && "I" != e.statsCnt[n].fieldType && "B" != e.statsCnt[n].fieldType ? !t.forceWrap && e.statsCnt[n] && "L" == e.statsCnt[n].fieldType ? "" != c.trim() ? o += c.toLocaleLowerCase() : o += "null" : d && "" == c || t.nullIsNull && ("NULL" == c.toUpperCase() || "\\N" === c) ? o += "null" : o += '"' + c.toJson() + '"' : "" != c.trim() ? ((c = c.toNumber() + "").left(1) == getDecimalChar() && (c = "0" + c), c.left(2) == "-" + getDecimalChar() && (c = "-0" + c.substr(1)), o += c) : o += "null";
            o += "]", s < a.length - 1 && (o += ","), o += "\n"
        }
        return o += "}"
    }
}

function jsonToCsv(objArray, delimiter, bIncludeHeaders, bQuotes, noMultiLines) {
    var array, str = "",
        line = "",
        i, j, index, value, columns = [];
    try {
        array = "object" != typeof objArray ? JSON.parse(objArray) : objArray
    } catch (e) {
        if ("[" !== objArray.charAt(0) && "{" !== objArray.charAt(0)) throw e;
        array = eval("array=" + objArray)
    }
    if (!_.isObject(array) || null == array || _.isEmpty(array)) return line = "", str = "", bIncludeHeaders && (value = "Field1", line = bQuotes ? '"' + value.replace(/"/g, '""') + '"' + delimiter : value.toCsv(delimiter, '"'), str += line + "\n"), array && _.isObject(array) && _.isEmpty(array) || (value = null == array ? "" : array + "", noMultiLines && (value = value.replace(/\r\n|\r|\n/g, " ")), str += (bQuotes ? '"' : "") + ("" + value).toCsv(delimiter, '"') + (bQuotes ? '"' : "") + "\n"), str;
    var depth = getJsonLevel(array);
    if (2 == depth && _.isArray(array)) {
        for (bIncludeHeaders && (value = "Field1", line += bQuotes ? '"' + value.replace(/"/g, '""') + '"' + delimiter : value.toCsv(delimiter, '"'), str += line + "\n"), i = 0; i < array.length; i++) {
            var line = "";
            value = array[i], null == value ? value = "" : value += "", noMultiLines && (value = value.replace(/\r\n|\r|\n/g, " ")), line += (bQuotes ? '"' : "") + ("" + value).toCsv(delimiter, '"') + (bQuotes ? '"' : ""), str += line + "\n"
        }
        return str
    }
    if (3 == depth && _.isArray(array) && _.every(_.values(array), _.isArray)) {
        if (bIncludeHeaders) {
            var head = array[0];
            for (index in array[0]) value = "Field" + (1 * index + 1), columns.push(value), line += bQuotes ? '"' + value.replace(/"/g, '""') + '"' + delimiter : value.toCsv(delimiter, '"') + delimiter;
            line = line.slice(0, -1), str += line + "\n"
        } else
            for (index in array[0]) columns.push(index);
        for (i = 0; i < array.length; i++) {
            var line = "";
            for (j = 0; j < columns.length; j++) value = array[i][j], null == value ? value = "" : value += "", noMultiLines && (value = value.replace(/\r\n|\r|\n/g, " ")), line += ("" + value).toCsv(delimiter, '"', '"', bQuotes) + delimiter;
            line = line.slice(0, -1 * delimiter.length), str += line + "\n"
        }
        return str
    }
    for (; _.isObject(array) && !_.isArray(array) && 1 == _.keys(array).length && (_.isObject(_.values(array)[0]) || _.isArray(_.values(array)[0]) && _.isObject(_.values(array)[0][0]));) array = _.values(array)[0];
    for (0 == _.isArray(array) && 1 == _.isObject(array) && (array = JSON.flatten(array), array = JSON.parse("[" + JSON.stringify(array) + "]")), i = 0; i < array.length; i++)
        for (j = 0; j < columns.length; j++) value = array[i][columns[j]], 0 == _.isArray(value) && 1 == _.isObject(value) && columns[j] in array[i] && (array[i][columns[j]] = JSON.flatten(value));
    if (_.isObject(array[0]) && _.every(_.values(array), _.isObject))
        if (bIncludeHeaders) {
            var head = array[0];
            if (bQuotes)
                for (index in array[0]) value = index + "", columns.push(value), line += '"' + value.replace(/"/g, '""') + '"' + delimiter;
            else
                for (index in array[0]) value = index + "", columns.push(value), line += value.toCsv(delimiter, '"') + delimiter;
            line = line.slice(0, -1), str += line + "\n"
        } else
            for (index in array[0]) columns.push(index);
    if (0 === columns.length && 1 == _.isArray(array)) {
        for (str = "", bIncludeHeaders && (value = "Field1", line += bQuotes ? '"' + value.replace(/"/g, '""') + '"' + delimiter : value.toCsv(delimiter, '"'), str += line + "\n"), i = 0; i < array.length; i++) {
            var line = "";
            value = array[i], null == value ? value = "" : value += "", "[object Object]" == (value + "").substring(0, 15) && (value = JSON.valueArray(array[i]).slice(0, -1)), noMultiLines && (value = value.replace(/\r\n|\r|\n/g, " ")), line += (bQuotes ? '"' : "") + ("" + value).toCsv(delimiter, '"') + (bQuotes ? '"' : ""), str += line + "\n"
        }
        return str
    }
    for (i = 0; i < array.length; i++) {
        var line = "";
        if (bQuotes)
            for (j = 0; j < columns.length; j++) value = array[i][columns[j]], "[object Object]" == (value + "").substring(0, 15) && (value = JSON.valueArray(array[i][columns[j]]).slice(0, -1)), null == value ? value = "" : value += "", noMultiLines && (value = value.replace(/\r\n|\r|\n/g, " ")), line += '"' + value.replace(/"/g, '""') + '"' + delimiter;
        else
            for (j = 0; j < columns.length; j++) value = array[i][columns[j]], "[object Object]" == (value + "").substring(0, 15) && (value = JSON.valueArray(array[i][columns[j]]).slice(0, -1)), null == value ? value = "" : value += "", noMultiLines && (value = value.replace(/\r\n|\r|\n/g, " ")), line += ("" + value).toCsv(delimiter, '"') + delimiter;
        line = line.slice(0, -1 * delimiter.length), str += line + "\n"
    }
    return str
}

function csvToFixed(e, t) {
    var n, l = 0,
        a = "",
        r = [],
        o = 0,
        s = "",
        c = "",
        d = "";
    if (e) {
        r = getFldPosArr(e);
        var i = !1,
            u = !1;
        if (void 0 !== t.addsep && null != t.addsep || (t.addsep = " "), !t.addTable || "" !== t.addsep && " " !== t.addsep || (t.addsep = "|"), t || (t = {}), 0 === e.table.length) return a;
        var m = getCsvHeader(e),
            h = getCsvColLength(e) || [],
            p = 0;
        if (t.addTable) {
            for (o = 0; o < r.length; o++) n = r[o] - 1, e.isFirstRowHeader && m[n] && m[n].length > h[n] && (h[n] = m[n].length), p += h[n] + 1;
            if (t.addLineNumbers && (p += ("" + e.table.length).length + 1), a += "+".rpad(p, "-") + "+\n", e.isFirstRowHeader) {
                for (a += t.addsep, t.addLineNumbers && (a += "#".rpad(("" + e.table.length).length) + t.addsep), o = 0; o < r.length; o++) n = r[o] - 1, o > 0 && (a += t.addsep), a += (s = n >= m.length ? "" : m[n].replace(/\r\n|\r|\n/g, " ")).rpad(h[n]);
                a += t.addsep + "\n", a += "+".rpad(p, "-") + "+\n"
            }
        }
        var g = 0;
        for (l = 0; l < e.table.length; l++) {
            for (g++, t.addTable && (a += t.addsep), t.addLineNumbers && (a += ("" + g).rpad(("" + e.table.length).length) + t.addsep), o = 0; o < r.length; o++) n = r[o] - 1, o > 0 && (a += t.addsep), s = n >= e.table[l].length ? "" : e.table[l][n], !t.nullIsEmpty || "NULL" != s.toUpperCase() && "\\N" !== s || (s = ""), u = !1, i = !1, s = doTransformations(s, n, e), document.getElementById("chkrjust" + (n + 1)) && document.getElementById("chkrjust" + (n + 1)).checked && (u = !0), document.getElementById("chkcjust" + (n + 1)) && document.getElementById("chkcjust" + (n + 1)).checked && (i = !0), a += i ? s.replace(/\r\n|\r|\n/g, " ").cjust(h[n]) : u ? s.replace(/\r\n|\r|\n/g, " ").rjust(h[n]) : s.replace(/\r\n|\r|\n/g, " ").rpad(h[n]);
            var f;
            if (!t.addTable && t.addRuler && 1 == g) {
                for (f = 1; f <= a.length; f++) c += ("" + f).right(1);
                if (a.length >= 10) {
                    for (f = 1, o = 10; o <= a.length; o += 10, f++) d += "         " + ("" + f).right(1);
                    c = (d = d.rpad(c.length)) + "\n" + c
                }
            }
            t.addTable && (a += t.addsep), a += "\n", t.addTable && t.addLineSep && (a += "+".rpad(p, "-") + "+\n")
        }
        return t.addTable && !t.addLineSep && (a += "+".rpad(p, "-") + "+\n"), t.addRuler && !t.addTable && (a = c + "\n" + (r = c.split("\n"))[r.length - 1].replace(/[12346789]/g, "-").replace(/0/g, "|").replace(/5/g, "+") + "\n" + a), a
    }
}

function fixedToCsv(e, t, n, l, a, r, o) {
    var s, c, d = t.split("|") || [],
        i = "",
        u = "",
        m = [],
        h = "",
        p = e.split(/\n|\r|\r\n/gim);
    if ("" == p[p.length - 1] && p.pop(), l) {
        for (s = 0; s < d.length; s++) h = (m = d[s].split(",")).length > 2 ? m[2] : "F" + (s + 1), i += a ? '"' + h.replace(/"/g, '""') + '"' + n : h.toCsv(n, '"') + n;
        i = i.slice(0, -1 * n.length) + "\n"
    }
    var g = 0,
        f = 0;
    for (s = 0; s < p.length; s++)
        if (u = "", "" != p[s]) {
            for (c = 0; c < d.length; c++) g = (m = d[c].split(",") || []).length > 0 ? m[0] - 1 : 0, f = m.length > 1 ? m[1] : 0, m.length > 2 ? m[2] : "f" + (c + 1), value = o ? p[s].substr(g, f) : p[s].substr(g, f).trim(), null == value ? value = "" : value += "", u += a ? '"' + ("" + value).replace(/"/g, '""') + '"' + n : r ? "" + value + n : ("" + value).toCsv(n, '"') + n;
            i += (u = u.slice(0, -1 * n.length)) + "\n"
        } return i
}

function csvToMulti(e, t, n, l, a, r, o, s, c, d) {
    var i, u, m = 0,
        h = "",
        p = 0,
        g = "",
        f = "";
    if (r = r || "0", isNaN("0" + r) && (r = "0"), u = getFldPosArr(e), e) {
        if (l = l || "", 0 === e.table.length) return h;
        for (getCsvHeader(e), m = 0; m < e.table.length; m++) {
            for (p = 0; p < u.length; p++) f = "", (i = u[p] - 1) >= e.table[m].length ? g = "" : (g = e.table[m][i] + "") && o && (g = g.replace(/\r\n|\r|\n/g, " ")), g && d && (g = g.replace(/^null$/gim, "")), g = doTransformations(g, i, e), c && (g = g.toCsv(t, e.outputQuote, e.outputQuote, s)), n && (f = c ? i >= e.arHeaderRow.length ? ("".rpad(r) + "Field-" + (i + 1)).toCsv(t, e.outputQuote, e.outputQuote, s) + l : ("".rpad(r) + e.arHeaderRow[i].replace(/\r\n|\r|\n/g, " ")).toCsv(t, e.outputQuote, e.outputQuote, s) + l : i >= e.arHeaderRow.length ? "".rpad(r) + "Field-" + (i + 1) + l : "".rpad(r) + e.arHeaderRow[i].replace(/\r\n|\r|\n/g, " ") + l), h += f + g + "\n", a && (h += "\n");
            c || (h += t + "\n")
        }
        return h
    }
}

function csvToKml(e, t, n, l, a, r, o) {
    var s, c, d = 0,
        i = "",
        u = "",
        m = '<?xml version="1.0" encoding="UTF-8"?>\n';
    if (m += '<kml xmlns="http://earth.google.com/kml/2.0">\n', m += "<Document>\n", e) {
        if (0 === e.table.length) return m + "</Document></kml>";
        for (c = getCsvHeader(e), ("" == o.trim() || isNaN(o) || 1 * o < 1 || 1 * o > e.table[0].length) && (o = ""), d = 0; d < e.table.length; d++) {
            for (m += "<Placemark>\n", i = "", s = 0; s < e.table[d].length && !(s >= c.length); s++)
                if ((isNaN(l) || s != l - 1) && (isNaN(a) || s != a - 1) && (isNaN(r) || s != r - 1)) {
                    if (isNaN(t) || s != t - 1) {
                        if (isNaN(n) || s != n - 1) continue;
                        c[s] = "description", "" != o && (i = " " + e.table[d][o - 1])
                    } else c[s] = "name";
                    v = e.table[d][s] ? e.table[d][s] : "", v = doTransformations(v, s, e), m += "<" + c[s] + ">" + v.toHtml() + i.toHtml() + "</" + c[s] + ">\n"
                }! isNaN(l) && !isNaN(a) && l.length > 0 && a.length > 0 && 1 * l <= e.table[d].length && 1 * a <= e.table[d].length && e.table[d][1 * l - 1] && e.table[d][1 * a - 1] && (u = "" != r && !isNaN(r) && 1 * r <= e.table[d].length && e.table[d][1 * r - 1] ? doTransformations(e.table[d][1 * r - 1], 1 * r - 1, e) : "0", m += "<Point><coordinates>", m += doTransformations(e.table[d][a - 1], a - 1, e) + "," + doTransformations(e.table[d][l - 1], l - 1, e) + "," + u, m += "</coordinates></Point>\n"), m += "</Placemark>\n"
        }
        return m += "</Document>\n</kml>"
    }
}

function csvToCsv(e, t) {
    if (e) {
        if (0 === e.table.length) return "";
        t || (t = {});
        var n, l, a, r = t.delimiter,
            o = t.headingSpecified,
            s = t.excelForceMode,
            c = t.defaultHeader,
            d = t.noMultiLines,
            i = t.bQuotes,
            u = t.nullIsNull,
            m = t.neverEnclose,
            h = 0,
            p = "",
            g = 0;
        if (a = getFldPosArr(e), o || c) {
            for (l = getCsvHeader(e), g = 0; g < a.length; g++) h = a[g] - 1, g > 0 && (p += r), p += (h >= l.length ? "" : l[h]).toCsv(r, e.outputQuote, e.outputQuote);
            "" != p && (p += "\n")
        }
        for (h = 0; h < e.table.length; h++) {
            for (g = 0; g < a.length; g++) {
                if (n = a[g] - 1, (y = e.table[h][n] ? e.table[h][n] : "") && u && (y = y.replace(/^null$/gim, "")), y && d && (y = y.replace(/\r\n|\r|\n/g, " ")), "" != (y = doTransformations(y, n, e)) && "dateOutFormat" in t && "" != t.dateOutFormat && e.statsCnt[n] && "D" == e.statsCnt[n].fieldType) {
                    var f = y;
                    try {
                        var y = moment(y, e.dateformat[n]).format(t.dateOutFormat)
                    } catch (e) {
                        y = f
                    }
                }
                s && "" != y ? y.indexOf(",") < 0 && y.indexOf("\n") < 0 && y.indexOf("\r") < 0 ? p += "=" + y.toCsv(r, e.outputQuote, e.outputQuote, !0) : p += ("=" + y.toCsv(r, e.outputQuote, e.outputQuote, !0)).toCsv(r, e.outputQuote, e.outputQuote, !0) : i || !e.statsCnt[n] || "N" != e.statsCnt[n].fieldType && "I" != e.statsCnt[n].fieldType ? p += m ? y.toCsv(r, "", "", !1) : y.toCsv(r, e.outputQuote, e.outputQuote, i) : p += y || "", p += g < a.length - 1 ? r : ""
            }
            p += "\n"
        }
        return p
    }
}

function transposeCsv(e, t, n, l, a, r, o) {
    if (e) {
        if (0 === e.table.length) return "";
        var s, c, d, i = 0,
            u = "",
            m = 0;
        for (c = getFldPosArr(e), m = 0; m < c.length; m++) {
            for ((n || a) && (u += getCsvHeader(e)[i = c[m] - 1].toCsv(t, e.outputQuote), e.table.length > 0 && (u += t)), i = 0; i < e.table.length; i++) s = c[m] - 1, (d = e.table[i][s] ? e.table[i][s] : "") && r && (d = d.replace(/\r\n|\r|\n/g, " ")), d = doTransformations(d, s, e), l && "" != d ? d.indexOf(",") < 0 ? u += "=" + d.toCsv(t, e.outputQuote, e.outputQuote, l) : u += '"="' + d.toCsv(t, e.outputQuote, e.outputQuote, l) + '""' : o || !e.statsCnt[s] || "N" != e.statsCnt[s].fieldType && "I" != e.statsCnt[s].fieldType ? u += d.toCsv(t, e.outputQuote, e.outputQuote, o) : u += d || "", u += i < e.table.length - 1 ? t : "";
            u += "\n"
        }
        return u
    }
}

function getCsvColLength(e) {
    var t = 0,
        n = 0,
        l = 0,
        a = 0,
        r = new Array;
    if (e) {
        if (0 === e.table.length) return r;
        for (n = 0; n < e.maxColumnsFound; n++) r.push(0);
        for (t = 0; t < e.table.length; t++)
            for (n = 0; n < r.length; n++)
                if (!(n >= e.table[t].length)) {
                    if (e.table[t][n].length > r[n] && (r[n] = e.table[t][n].length), document.getElementById("fdecimals" + (n + 1)))
                        if (a = document.getElementById("fdecimals" + (n + 1)).value, !e.statsCnt[n] || "N" != e.statsCnt[n].fieldType && "I" != e.statsCnt[n].fieldType && "B" != e.statsCnt[n].fieldType) {
                            if ("" != a.trim() && e.statsCnt[n] && "" != e.table[t][n].trim() && ("D" == e.statsCnt[n].fieldType || (e.statsCnt[n].dateCnt - e.statsCnt[n].emptyCnt) / e.dataRowsFound >= .9)) try {
                                (l = moment(e.table[t][n], e.dateformat[n]).format(a).length) > r[n] && (r[n] = l)
                            } catch (e) {}
                        } else isNaN(a) ? a = 0 : a *= 1, "" != e.table[t][n].trim() && (l = (e.table[t][n].toNumber().toFixed(a) + "").length) > r[n] && (r[n] = l);
                    document.getElementById("fpadsize" + (n + 1)) && (l = document.getElementById("fpadsize" + (n + 1)).value, isNaN(l) ? l = 0 : l *= 1, l > 0 && (r[n] = l))
                } return r
    }
}

function isSqlKeywords() {
    return ["ACTION", "ADD", "AFTER", "ALL", "ALTER", "ANALYZE", "AND", "AS", "ASC", "ATTACH", "AUTOINCREMENT", "BEFORE", "BEGIN", "BETWEEN", "BY", "CASCADE", "CASE", "CAST", "CHECK", "COLLATE", "COLUMN", "COMMIT", "CONFLICT", "CONSTRAINT", "CREATE", "CROSS", "CURRENT_DATE", "CURRENT_TIME", "CURRENT_TIMESTAMP", "DATABASE", "DEFAULT", "DEFERRABLE", "DEFERRED", "DELETE", "DESC", "DETACH", "DISTINCT", "DROP", "EACH", "ELSE", "END", "ESCAPE", "EXCEPT", "EXCLUSIVE", "EXISTS", "EXPLAIN", "FAIL", "FOR", "FOREIGN", "FROM", "FULL", "GLOB", "GROUP", "HAVING", "IF", "IGNORE", "IMMEDIATE", "IN", "INDEX", "INDEXED", "INITIALLY", "INNER", "INSERT", "INSTEAD", "INTERSECT", "INTO", "IS", "ISNULL", "JOIN", "KEY", "LEFT", "LIKE", "LIMIT", "MATCH", "NATURAL", "NO", "NOT", "NOTNULL", "NULL", "OF", "OFFSET", "ON", "OR", "ORDER", "OUTER", "PLAN", "PRAGMA", "PRIMARY", "QUERY", "RAISE", "RECURSIVE", "REFERENCES", "REGEXP", "REINDEX", "RELEASE", "RENAME", "REPLACE", "RESTRICT", "RIGHT", "ROLLBACK", "ROW", "SAVEPOINT", "SELECT", "SET", "SUM", "SYSDATE", "TABLE", "TEMP", "TEMPORARY", "THEN", "TO", "TRANSACTION", "TRIGGER", "UNION", "UNIQUE", "UPDATE", "USING", "VACUUM", "VALUES", "VIEW", "VIRTUAL", "WHEN", "WHERE", "WITH", "WITHOUT"]
}

function csvToSql(e, t, n) {
    var l, a, r, o, s, c, d, i = 0,
        u = 0,
        m = "",
        h = "",
        p = "",
        g = "",
        f = [],
        y = [],
        b = [],
        k = [],
        C = [],
        v = !1,
        I = "",
        E = [],
        N = 0,
        S = 0,
        T = !1,
        B = 0,
        L = 0,
        R = 0;
    if (e) {
        t = t || "I", n.newlines = n.newlines || !1, "dualNeeded" in n || (n.dualNeeded = !1), "batchSize" in n && "" != n.batchSize.trim() && !isNaN(n.batchSize) || (n.batchSize = Number.MAX_VALUE), "useTerseValuesSize" in n && "" != n.useTerseValuesSize.trim() && !isNaN(n.useTerseValuesSize) || (n.useTerseValuesSize = Number.MAX_VALUE), n.useTerseValues || (n.useTerseValuesSize = ""), d = getCsvHeader(e);
        for (l = 0; l < d.length; l++) y[l] = d[l].replace(/\s+/g, "_"), y[l].length > S && (S = y[l].length), E[l] = !1, b[l] = k[l] = "", document.getElementById("fkey" + (l + 1)) && document.getElementById("fkey" + (l + 1)).checked && (N++, E[l] = !0), document.getElementById("fname" + (l + 1)) && (y[l] = document.getElementById("fname" + (l + 1)).value.replace(/\s+/g, "_")), document.getElementById("freq" + (l + 1)) && (C[l] = document.getElementById("freq" + (l + 1)).checked), document.getElementById("fsize" + (l + 1)) ? (b[l] = document.getElementById("fsize" + (l + 1)).value.trim(), isNaN(b[l]) ? b[l] = 30 : b[l] *= 1, b[l] < 1 && (b[l] = "")) : b[l] = 30, document.getElementById("fdec" + (l + 1)) && (k[l] = document.getElementById("fdec" + (l + 1)).value.trim(), isNaN(k[l]) ? k[l] = "" : (k[l] *= 1, k[l] < 0 && (k[l] = ""))), document.getElementById("finc" + (l + 1)) ? document.getElementById("finc" + (l + 1)).checked ? (f[l] = !0, L++) : f[l] = !1 : (f[l] = !0, L++);
        if (0 === d.length) return "";
        if (0 == L && "S" == t) return "";
        if (n.tableName.indexOf(" ") > 0 && "[" != n.tableName.charAt(0) && "`" != n.tableName.charAt(0) && (n.tableName = '"' + n.tableName + '"'), n.dropTable && (m += "DROP " + ("S" === t ? "VIEW " : "TABLE ") + (n.dropExists ? "IF EXISTS " : "") + n.tableName + ";\n"), n.createTable && "S" != t) {
            var A = n.newlines;
            for (n.newlines = !0, m += "CREATE TABLE " + (n.createNotExists ? "IF NOT EXISTS " : "") + n.tableName + "(", n.newlines && (m += "\n"), r = l = 0; l < d.length; l++, r++) {
                switch (n.newlines && r > 0 && (m += "\n"), m += r > 0 ? "  ," : "   ", m += y[l].rpad(S), h = "VC", l < e.statsCnt.length && (h = e.statsCnt[l].fieldType), document.getElementById("ftype" + (l + 1)) && (h = document.getElementById("ftype" + (l + 1)).value), h) {
                    case "B":
                        m += " BIT ";
                        break;
                    case "L":
                        m += " BOOLEAN ";
                        break;
                    case "NR":
                    case "N":
                        m += "N" == h ? " NUMERIC" : " NUMBER", e.statsCnt.length > 0 ? (o = e.statsCnt[l].fieldPrec + e.statsCnt[l].fieldDecs, s = e.statsCnt[l].fieldDecs) : (o = 0, s = k[l] ? k[l] : 0), b[l] && b[l] > o && (o = b[l]), m += "" != o ? "(" + o + "," + s + ")" : " ";
                        break;
                    case "BI":
                        m += " BIGINT ";
                        break;
                    case "IT":
                        m += " INT ";
                        break;
                    case "I":
                        m += " INTEGER ";
                        break;
                    case "M":
                        m += "MONEY";
                        break;
                    case "S":
                        m += " SERIAL ";
                        break;
                    case "D":
                        m += " DATE ";
                        break;
                    case "DT":
                        m += " DATETIME ";
                        break;
                    case "NVC":
                        m += " NVARCHAR(" + b[l] + ")";
                        break;
                    case "VC":
                        m += " VARCHAR(" + b[l] + ")";
                        break;
                    case "VCC":
                        m += " VARCHAR2(" + b[l] + ")";
                        break;
                    case "NC":
                        m += " NCHAR(" + b[l] + ")";
                        break;
                    default:
                        m += " CHAR(" + b[l] + ")"
                }
                C[l] && (m += " NOT NULL"), E[l] && 1 == N && (m += " PRIMARY KEY", "N" != h && "NR" != h && "I" != h && "IT" != h && "BI" != h || document.getElementById("selAutoIncrement") && (m += " " + document.getElementById("selAutoIncrement").value))
            }
            if (N > 1) {
                for (n.newlines && (m += "\n"), m += "  ,PRIMARY KEY(", x = 0; x < E.length; x++) E[x] && (m += (x > 0 ? "," : "") + y[x]);
                m += ")"
            }
            n.newlines && (m += "\n"), m += ");\n", n.newlines = A
        } else if (n.createTable && "S" === t) {
            for (m += "CREATE ", "" != n.insertAfterText.trim() && (m += " " + n.insertAfterText.trim()), m += "VIEW " + (n.createNotExists ? "IF NOT EXISTS " : "") + n.tableName + "(", n.newlines && (m += "\n"), r = l = 0; l < d.length; l++) f[l] && (r > 0 && (m += ","), m += y[l], n.newlines && (m += "\n"), r++);
            m += ") AS\n"
        }
        if (0 == L) return m;
        switch (t) {
            case "I":
                for (u = c = 0, i = 0; i < (e.table.length ? e.table.length : 1); i++) {
                    if (u++, 1 == ++c || !n.useTerseValues || u > 1 * n.useTerseValuesSize) {
                        for (u = 1, m += n.useReplace ? "REPLACE" : "INSERT", "" != n.insertAfterText.trim() && (m += " " + n.insertAfterText.trim()), m += " INTO " + n.tableName + "(", n.newlines && (m += "\n"), r = l = 0; l < d.length; l++) f[l] && (r > 0 && (m += ","), m += y[l], n.newlines && (m += "\n"), r++);
                        if (m += ") VALUES" + (n.useTerseValues ? "\n" : "") + " (", 0 === e.table.length) {
                            for (r = l = 0; l < d.length; l++) f[l] && (r > 0 && (m += ","), m += "?", n.newlines && (m += "\n"), r++);
                            return m + ");"
                        }
                    } else m += ",(";
                    for (n.newlines && (m += "\n"), r = l = 0; l < d.length; l++)
                        if (f[l]) {
                            if (h = 0 === e.table.length ? "VC" : e.statsCnt[l].fieldType, p = l >= e.table[i].length ? "" : e.table[i][l], T = !1, document.getElementById("ftype" + (l + 1)) && (h = document.getElementById("ftype" + (l + 1)).value), document.getElementById("ftem" + (l + 1)) && (g = document.getElementById("ftem" + (l + 1)).value), document.getElementById("ftrim" + (l + 1)) && document.getElementById("ftrim" + (l + 1)).checked && (p = p.trim()), document.getElementById("chkupper" + (l + 1)) && document.getElementById("chkupper" + (l + 1)).checked && (p = p.toUpperCase()), document.getElementById("chklower" + (l + 1)) && document.getElementById("chklower" + (l + 1)).checked && (p = p.toLowerCase()), document.getElementById("chknull" + (l + 1)) && document.getElementById("chknull" + (l + 1)).checked && (T = !0), r > 0 && (m += ","), "" != g) m += "N" === h || "NR" === h || "I" === h || "IT" === h || "S" === h || "D" === h || "DT" === h || "BI" === h || "M" === h || "L" === h ? "" == p ? g.replace("{f}", "NULL") : "D" == h || "DT" == h ? g.replace("{f}", "'" + p.toSql() + "'") : g.replace("{f}", p.toSql()) : g.replace("{f}", "'" + p.toSql() + "'");
                            else switch (h) {
                                case "B":
                                case "L":
                                case "NR":
                                case "M":
                                case "S":
                                case "N":
                                case "BI":
                                case "IT":
                                case "I":
                                    "" === p.trim() || ("NULL" == p.toUpperCase() || "\\N" === p) && n.useNullAsNull ? m += "NULL" : m += p.toSql();
                                    break;
                                case "DT":
                                case "D":
                                    if ("" === p || ("NULL" == p.toUpperCase() || "\\N" === p) && n.useNullAsNull) m += "NULL";
                                    else {
                                        if (n && n.dateOutFormat && "" != n.dateOutFormat) try {
                                            var w = p;
                                            p = moment(p, e.dateformat[l]).format(n.dateOutFormat)
                                        } catch (e) {
                                            p = w
                                        }
                                        m += "'" + p.toSql() + "'"
                                    }
                                    break;
                                default:
                                    "NULL" != p.toUpperCase() && "\\N" !== p || !n.useNullAsNull ? m += "" == p && T ? "NULL" : "NC" === h || "NVC" === h ? "N'" + p.toSql() + "'" : "'" + p.toSql() + "'" : m += "NULL"
                            }
                            n.newlines && (m += "\n"), r++
                        }! n.useTerseValues || i == e.table.length - 1 || u >= 1 * n.useTerseValuesSize ? m += ");\n" : m += ")\n"
                }
                break;
            case "U":
                for (v = !1, i = 0; i < (e.table.length ? e.table.length : 1); i++) {
                    for (I = "", m += "UPDATE", "" != n.insertAfterText.trim() && (m += " " + n.insertAfterText.trim()), m += " " + n.tableName + " SET ", n.newlines && (m += "\n"), l = 0; l < d.length; l++) E[l] && (I += ("" != I ? " AND " : "") + y[l] + "= {f" + l + "}");
                    for ("" === I && (I = y[0] + "= {f0}"), r = l = 0; l < d.length; l++) {
                        switch (f[l] && (r > 0 && (m += ","), m += y[l] + " = ", r++), h = 0 === e.table.length ? "VC" : e.statsCnt[l].fieldType, p = 0 === e.table.length ? "?" : l >= e.table[i].length ? "" : e.table[i][l], T = !1, document.getElementById("ftype" + (l + 1)) && (h = document.getElementById("ftype" + (l + 1)).value), document.getElementById("ftem" + (l + 1)) && (g = document.getElementById("ftem" + (l + 1)).value), document.getElementById("ftrim" + (l + 1)) && document.getElementById("ftrim" + (l + 1)).checked && (p = p.trim()), document.getElementById("chkupper" + (l + 1)) && document.getElementById("chkupper" + (l + 1)).checked && (p = p.toUpperCase()), document.getElementById("chklower" + (l + 1)) && document.getElementById("chklower" + (l + 1)).checked && (p = p.toLowerCase()), document.getElementById("chknull" + (l + 1)) && document.getElementById("chknull" + (l + 1)).checked && (T = !0), "" != g && (m += "N" === h || "NR" === h || "I" === h || "IT" === h || "S" === h || "D" === h || "DT" === h || "BI" === h || "M" === h || "L" === h ? "" == p ? g.replace("{f}", "NULL") : "D" == h || "DT" == h ? g.replace("{f}", "'" + p.toSql() + "'") : g.replace("{f}", p.toSql()) : g.replace("{f}", "'" + p.toSql() + "'"), v = !0), h) {
                            case "B":
                            case "L":
                            case "NR":
                            case "N":
                                !v && f[l] && ("" === p || ("NULL" == p.toUpperCase() || "\\N" === p) && n.useNullAsNull ? m += "NULL" : 0 === e.table.length ? m += p : m += p.toSql()), I = 0 === e.table.length ? I.replace("{f" + l + "}", p) : I.replace("{f" + l + "}", p.toSql());
                                break;
                            case "BI":
                            case "IT":
                            case "I":
                                !v && f[l] && ("" === p || ("NULL" == p.toUpperCase() || "\\N" === p) && n.useNullAsNull ? m += "NULL" : 0 === e.table.length ? m += p : m += p.toSql()), I = 0 === e.table.length ? I.replace("{f" + l + "}", p) : I.replace("{f" + l + "}", p.toSql());
                                break;
                            case "D":
                                if (!v && f[l])
                                    if ("" === p || ("NULL" == p.toUpperCase() || "\\N" === p) && n.useNullAsNull) m += "NULL";
                                    else if (0 === e.table.length) m += p;
                                else {
                                    if (n && n.dateOutFormat && "" != n.dateOutFormat) try {
                                        w = p, p = moment(p, e.dateformat[l]).format(n.dateOutFormat)
                                    } catch (e) {
                                        p = w
                                    }
                                    m += "'" + p.toSql() + "'"
                                }
                                I = 0 === e.table.length ? I.replace("{f" + l + "}", p) : I.replace("{f" + l + "}", "'" + p.toSql() + "'");
                                break;
                            default:
                                !v && f[l] && ("NULL" != p.toUpperCase() && "\\N" !== p || !n.useNullAsNull ? "" == p && T ? m += "NULL" : "NC" === h || "NVC" === h ? m += "N'" + p.toSql() + "'" : 0 === e.table.length ? m += p : m += "'" + p.toSql() + "'" : m += "NULL"), I = "NC" === h || "NVC" === h ? I.replace("{f" + l + "}", "N'" + p.toSql() + "'") : 0 === e.table.length ? I.replace("{f" + l + "}", p) : I.replace("{f" + l + "}", "'" + p.toSql() + "'")
                        }
                        f[l] && (n.newlines && (m += "\n"), r++)
                    }
                    m += " WHERE " + I, m += ";\n"
                }
                break;
            case "D":
                for (i = 0; i < (e.table.length ? e.table.length : 1); i++) {
                    for (I = "", m += "DELETE FROM " + n.tableName, n.newlines && (m += "\n"), l = 0; l < y.length; l++) E[l] && (I += ("" != I ? " AND " : "") + y[l] + "= {f" + l + "}");
                    for ("" === I && (I = y[0] + "= {f0}"), r = l = 0; l < d.length; l++) {
                        switch (r++, h = 0 === e.table.length ? "VC" : e.statsCnt[l].fieldType, p = 0 === e.table.length ? "?" : l >= e.table[i].length ? "" : e.table[i][l], document.getElementById("ftype" + (l + 1)) && (h = document.getElementById("ftype" + (l + 1)).value), document.getElementById("ftem" + (l + 1)) && (g = document.getElementById("ftem" + (l + 1)).value), document.getElementById("ftrim" + (l + 1)) && document.getElementById("ftrim" + (l + 1)).checked && (p = p.trim()), document.getElementById("chkupper" + (l + 1)) && document.getElementById("chkupper" + (l + 1)).checked && (p = p.toUpperCase()), document.getElementById("chklower" + (l + 1)) && document.getElementById("chklower" + (l + 1)).checked && (p = p.toLowerCase()), h) {
                            case "B":
                            case "L":
                            case "NR":
                            case "N":
                            case "BI":
                            case "IT":
                            case "M":
                            case "S":
                            case "I":
                                I = 0 === e.table.length ? I.replace("{f" + l + "}", p) : I.replace("{f" + l + "}", p.toSql());
                                break;
                            default:
                                I = "NC" === h || "NVC" === h ? I.replace("{f" + l + "}", "N'" + p.toSql() + "'") : 0 === e.table.length ? I.replace("{f" + l + "}", p) : I.replace("{f" + l + "}", "'" + p.toSql() + "'")
                        }
                        n.newlines && (m += "\n"), r++
                    }
                    m += " WHERE " + I, m += ";\n"
                }
                break;
            case "M":
                for (c = B = 0, i = 0; i < (e.table.length ? e.table.length : 1); i++) {
                    if (B++, 1 === ++c || B == n.batchSize) {
                        for (m += "MERGE INTO " + n.tableName + " t\nUSING (\n", I = "ON (", a = l = 0; l < y.length; l++) E[l] && (I += (a > 0 ? " AND " : " ") + "t." + y[l] + "= s." + y[l], a++);
                        "ON (" === I && (I += "t." + y[0] + "= s." + y[0], E.push(y[0])), I += " )"
                    } else(n.createTable || B < n.batchSize) && (m += "UNION ALL\n");
                    for (n.newlines && (m += "\n"), m += "SELECT ", R = l = 0; l < d.length; l++) f[l] && !E[l] && R++;
                    for (r = l = 0; l < d.length; l++)
                        if (f[l] || E[l]) {
                            if (h = 0 === e.table.length ? "VC" : e.statsCnt[l].fieldType, p = 0 === e.table.length ? "?" : l >= e.table[i].length ? "" : e.table[i][l], T = !1, document.getElementById("ftype" + (l + 1)) && (h = document.getElementById("ftype" + (l + 1)).value), document.getElementById("ftem" + (l + 1)) && (g = document.getElementById("ftem" + (l + 1)).value), document.getElementById("ftrim" + (l + 1)) && document.getElementById("ftrim" + (l + 1)).checked && (p = p.trim()), document.getElementById("chkupper" + (l + 1)) && document.getElementById("chkupper" + (l + 1)).checked && (p = p.toUpperCase()), document.getElementById("chklower" + (l + 1)) && document.getElementById("chklower" + (l + 1)).checked && (p = p.toLowerCase()), document.getElementById("chknull" + (l + 1)) && document.getElementById("chknull" + (l + 1)).checked && (T = !0), r > 0 && (m += ","), "" != g) "N" == h || "NR" == h || "I" == h || "IT" == h || "S" == h || "D" == h || "DT" == h || "BI" == h || "M" == h || "L" === h ? "" == p ? m += g.replace("{f}", "NULL") : "D" == h || "DT" == h ? m += g.replace("{f}", "'" + p.toSql() + "'") : 0 === e.table.length ? m += tmp.replace("{f}", p) : m += g.replace("{f}", p.toSql()) : 0 === e.table.length ? m += tmp.replace("{f}", p) : m += g.replace("{f}", "'" + p.toSql() + "'");
                            else {
                                switch (h) {
                                    case "B":
                                    case "L":
                                    case "NR":
                                    case "M":
                                    case "S":
                                    case "N":
                                    case "BI":
                                    case "IT":
                                    case "I":
                                        "" === p.trim() || ("NULL" == p.toUpperCase() || "\\N" === p) && n.useNullAsNull ? m += "NULL" : 0 === e.table.length ? m += p : m += p.toSql();
                                        break;
                                    case "DT":
                                    case "D":
                                        if ("" === p || ("NULL" == p.toUpperCase() || "\\N" === p) && n.useNullAsNull) m += "NULL";
                                        else if (0 === e.table.length) m += p;
                                        else {
                                            if (n && n.dateOutFormat && "" != n.dateOutFormat) try {
                                                w = p, p = moment(p, e.dateformat[l]).format(n.dateOutFormat)
                                            } catch (e) {
                                                p = w
                                            }
                                            m += "'" + p.toSql() + "'"
                                        }
                                        break;
                                    default:
                                        "NULL" != p.toUpperCase() && "\\N" !== p || !n.useNullAsNull ? "" == p && T ? m += "NULL" : "NC" === h || "NVC" === h ? m += "N'" + p.toSql() + "'" : 0 === e.table.length ? m += p : m += "'" + p.toSql() + "'" : m += "NULL"
                                }
                                1 === c && (m += " AS " + y[l])
                            }
                            n.newlines && (m += "\n"), r++
                        } if (n.dualNeeded && (m += " FROM " + (n.dualTableName || "myView")), i == e.table.length - 1 || B == n.batchSize || 0 === e.table.length) {
                        if (m += "\n) s\n", m += I, R > 0)
                            for (m += "\n  WHEN MATCHED THEN \n     UPDATE SET ", r = l = 0; l < y.length; l++) !E[l] && f[l] && (m += (r > 0 ? ", " : " ") + "t." + y[l] + "=s." + y[l], r++);
                        for (m += "\n  WHEN NOT MATCHED THEN\n     INSERT(", r = l = 0; l < y.length; l++)(E[l] || f[l]) && (m += (r > 0 ? ", " : " ") + y[l], r++);
                        for (m += ")\n     VALUES(", r = l = 0; l < y.length; l++)(E[l] || f[l]) && (m += (r > 0 ? ", " : " ") + "s." + y[l], r++);
                        m += ")\n;\n"
                    } else m += "\n";
                    if (B == n.batchSize && (B = 0), 0 === e.table.length) break
                }
                break;
            case "S":
                for (c = B = 0, n.createTable && (n.batchSize = Number.MAX_VALUE), i = 0; i < (e.table.length ? e.table.length : 1); i++) {
                    for (B++, ++c > 1 && (n.createTable || B < n.batchSize) && (m += "UNION ALL\n"), n.newlines && (m += "\n"), m += "SELECT ", r = l = 0; l < d.length; l++)
                        if (f[l]) {
                            if (h = 0 === e.table.length ? "VC" : e.statsCnt[l].fieldType, p = 0 === e.table.length ? "" : l >= e.table[i].length ? "" : e.table[i][l], T = !1, document.getElementById("ftype" + (l + 1)) && (h = document.getElementById("ftype" + (l + 1)).value), document.getElementById("ftem" + (l + 1)) && (g = document.getElementById("ftem" + (l + 1)).value), document.getElementById("ftrim" + (l + 1)) && document.getElementById("ftrim" + (l + 1)).checked && (p = p.trim()), document.getElementById("chkupper" + (l + 1)) && document.getElementById("chkupper" + (l + 1)).checked && (p = p.toUpperCase()), document.getElementById("chklower" + (l + 1)) && document.getElementById("chklower" + (l + 1)).checked && (p = p.toLowerCase()), document.getElementById("chknull" + (l + 1)) && document.getElementById("chknull" + (l + 1)).checked && (T = !0), r > 0 && (m += ","), "" != g) 0 === e.table.length ? m += g.replace("{f}", "?") : m += "N" === h || "NR" === h || "I" === h || "IT" === h || "S" === h || "D" === h || "DT" === h || "BI" === h || "M" === h || "L" === h ? "" == p ? g.replace("{f}", "NULL") : "D" == h || "DT" == h ? g.replace("{f}", "'" + p.toSql() + "'") : g.replace("{f}", p.toSql()) : g.replace("{f}", "'" + p.toSql() + "'");
                            else switch (h) {
                                case "B":
                                case "L":
                                case "NR":
                                case "M":
                                case "S":
                                case "N":
                                case "BI":
                                case "IT":
                                case "I":
                                    0 === e.table.length ? m += "?" : "" === p.trim() || ("NULL" == p.toUpperCase() || "\\N" === p) && n.useNullAsNull ? m += "NULL" : m += p.toSql();
                                    break;
                                case "DT":
                                case "D":
                                    if (0 === e.table.length) m += "?";
                                    else if ("" === p || ("NULL" == p.toUpperCase() || "\\N" === p) && n.useNullAsNull) m += "NULL";
                                    else {
                                        if (n && n.dateOutFormat && "" != n.dateOutFormat) try {
                                            w = p, p = moment(p, e.dateformat[l]).format(n.dateOutFormat)
                                        } catch (e) {
                                            p = w
                                        }
                                        m += "'" + p.toSql() + "'"
                                    }
                                    break;
                                default:
                                    0 === e.table.length ? m += "?" : "NULL" != p.toUpperCase() && "\\N" !== p || !n.useNullAsNull ? m += "" == p && T ? "NULL" : "NC" === h || "NVC" === h ? "N'" + p.toSql() + "'" : "'" + p.toSql() + "'" : m += "NULL"
                            }
                            n.newlines && (m += "\n"), r++, 1 === c && (m += " AS " + y[l])
                        } n.dualNeeded && (0 !== e.table.length || n.createTable) && (m += " FROM " + (n.dualTableName || "myView")), i == e.table.length - 1 || B == n.batchSize || 0 === e.table.length ? m += ";\n" : m += "\n", B == n.batchSize && (B = 0)
                }
                0 !== e.table.length || n.createTable || ((m = m.replace(/\?\sAS\s/gim, " ").rtrim()).endsWith(";") && (m = m.slice(0, -1)), m += "\nFROM " + (n.tableName || "mytable") + ";")
        }
        return e.table.length, m
    }
}

function geoJsonToCsv(geo, delimiter, bIncludeHeaders, bQuotes, noMultiLines) {
    var j, k, p, s = "",
        value = "",
        cols = {},
        colArray = ["latitude", "longitude", "altitude", "geometry"],
        obj = {},
        t = "";
    if ("string" == typeof geo) try {
        geo = JSON.parse(geo)
    } catch (e) {
        geo = eval("geo=" + geo)
    }
    var colnum = 0;
    if ("Feature" === geo.type && (geo = {
            type: "FeatureCollection",
            features: [geo]
        }), "FeatureCollection" === geo.type) {
        for (j = 0; j < geo.features.length; j++) "Point" === geo.features[j].geometry.type ? ("latitude" in cols || (cols.latitude = ++colnum), "longitude" in cols || (cols.longitude = ++colnum), "altitude" in cols || (cols.altitude = ++colnum)) : "coordinates" in cols || (cols.coordinates = ++colnum, colArray.push("coordinates"));
        for (j = 0; j < geo.features.length; j++)
            for (p in geo.features[j].properties) p in cols || (cols[p] = ++colnum, colArray.push(p));
        if (bIncludeHeaders) {
            for (j = 0; j < colArray.length; j++) t += colArray[j].toCsv(delimiter, '"', '"', bQuotes) + delimiter;
            t = t.slice(0, -1 * delimiter.length) + "\n"
        }
        for (j = 0; j < geo.features.length; j++) {
            "latitude" in cols && geo.features[j].geometry && geo.features[j].geometry.type && geo.features[j].geometry.coordinates && geo.features[j].geometry.coordinates.length >= 2 && "Point" === geo.features[j].geometry.type ? (s += (bQuotes ? '"' : "") + geo.features[j].geometry.coordinates[1] + (bQuotes ? '"' : "") + delimiter, s += (bQuotes ? '"' : "") + geo.features[j].geometry.coordinates[0] + (bQuotes ? '"' : "") + delimiter, geo.features[j].geometry.coordinates.length > 2 ? s += (bQuotes ? '"' : "") + geo.features[j].geometry.coordinates[2] + (bQuotes ? '"' : "") + delimiter : s += (bQuotes ? '""' : "") + delimiter) : (s += (bQuotes ? '""' : "") + delimiter, s += (bQuotes ? '""' : "") + delimiter, s += (bQuotes ? '""' : "") + delimiter), geo.features[j].geometry.type ? (value = geo.features[j].geometry.type, s += ("" + value).toCsv(delimiter, '"', '"', bQuotes) + delimiter) : s += (bQuotes ? '""' : "") + delimiter, "coordinates" in cols && ("Point" != geo.features[j].geometry.type ? (value = geo.features[j].geometry.coordinates, "[object Object]" == (value + "").substring(0, 15) && (value = JSON.valueArray(value).slice(0, -1)), s += ("" + value).toCsv(delimiter, '"', '"', bQuotes) + delimiter) : s += (bQuotes ? '""' : "") + delimiter);
            for (k = 0; k < colArray.length; k++) p = colArray[k], "latitude" != p && "longitude" !== p && "altitude" !== p && "coordinates" !== p && "geometry" != p && (p in geo.features[j].properties ? (value = geo.features[j].properties[p], null == value && (value = ""), "[object Object]" == (value + "").substring(0, 15) && (value = JSON.valueArray(value).slice(0, -1)), noMultiLines && (value = (value + "").replace(/\r\n|\r|\n/g, " ")), s += (value + "").toCsv(delimiter, '"', '"', bQuotes) + delimiter) : s += (bQuotes ? '""' : "") + delimiter);
            s = s.slice(0, -1 * delimiter.length) + "\n"
        }
    }
    return t + s
}

function htmlEscape(e) {
    return String(e).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

function getCsvHeader(e) {
    var t, n = new Array;
    if (e) {
        e || alert("Missing CSV"), e.arHeaderRow || alert("Missing arHeaderRow");
        var l = e.arHeaderRow.length;
        for (l < e.maxColumnsFound && (l = e.maxColumnsFound), t = 0; t < l; t++) e.arHeaderRow[t] || e.arHeaderRow.push("FIELD" + (t + 1)), n.push(e.arHeaderRow[t]), e.headerToUpper ? (e.arHeaderRow[t] = e.arHeaderRow[t].toUpperCase(), n[n.length - 1] = n[n.length - 1].toUpperCase()) : e.headerToLower && (e.arHeaderRow[t] = e.arHeaderRow[t].toLowerCase(), n[n.length - 1] = n[n.length - 1].toLowerCase());
        return n
    }
}

function sqlOptions(e) {
    if (e) {
        var t = getCsvColLength(e),
            n = getCsvHeader(e),
            l = '<table class="table table-bordered table-hover table-condensed">\n<tr>\n<th>Col #</th>';
        l += "<th>Field Name</th>", l += "<th>Data Type</th><th>Max Size</th>", l += "<th title='# of decimals'>#<br/>Dec</th>", l += '<th>Key</th><th>Include<br/><input type="checkbox" checked onclick="setCheckboxes(\'finc\',this.checked)"/></th>', l += '<th>Required<br/><input type="checkbox" onclick="setCheckboxes(\'freq\',this.checked)"/></th>', l += '<th>Trim<br/><input type="checkbox" checked onclick="setCheckboxes(\'ftrim\',this.checked)"/></th>', l += "<th>Upper<br/><input type=\"checkbox\" onclick=\"setCheckboxes('chkupper',this.checked);if(this.checked)setCheckboxes('chklower',false)\"/></th>", l += "<th>Lower<br/><input type=\"checkbox\" onclick=\"setCheckboxes('chklower',this.checked);if(this.checked)setCheckboxes('chkupper',false)\"/></th>", l += '<th title="Use keyword NULL">Use NULL for Empty Field<br/><input type="checkbox" checked onclick="setCheckboxes(\'chknull\',this.checked)"/></th>', l += '<th title="Modify output by using {f} for field value. Ex: {f}+100">Template<br/>({f}=field)<br/>Ex: {f}+100</th></tr>';
        var a, r = "<tr><td>{#}</td>";
        for (r += '<td><input type=text id="fname{#}" size="15" value="{FIELDNAME{#}}" title="{FTITLE{#}}"></td>\n', r += '<td><select id="ftype{#}" title="Choose data type of column" >', r += '<option value="VC" {VC{#}}>VarChar</option>', r += '<option value="NVC" {VC{#}}>NVarChar</option>', r += '<option value="VCC" {VCC{#}}>VarChar2</option>', r += '<option value="C" {C{#}}>Char</option>', r += '<option value="NC" {C{#}}>NChar</option>', r += '<option value="NR" {NR{#}}>Number</option>', r += '<option value="N" {N{#}}>Numeric</option>', r += '<option value="IT" {IT{#}}>Int</option>', r += '<option value="I" {I{#}}>Integer</option>', r += '<option value="BI" {I{#}}>BigInt</option>', r += '<option value="D" {D{#}}>Date</option>', r += '<option value="DT" {DT{#}}>Date Time</option>', r += '<option value="B" {B{#}}>Bit(0,1)</option>', r += '<option value="L" {L{#}}>Boolean</option>', r += '<option value="M" {M{#}}>Money</option>', r += '<option value="S" {S{#}}>Serial</option>', r += '</select>\n</td><td><input id="fsize{#}"size=4 maxlength=4 value="{FIELDSIZE{#}}"></td>\n', r += '<td><input id="fdec{#}"size=2 maxlength=2 value="{DECSIZE{#}}" readonly></td>', r += '<td><input type=checkbox id="fkey{#}"  value="Y" ></td>\n', r += '<td><input type=checkbox id="finc{#}"  value="Y" checked></td>\n', r += '<td><input type=checkbox id="freq{#}"  value="Y" ></td>\n', r += '<td><input type=checkbox id="ftrim{#}" value="Y" checked></td>\n', r += '<td><input type=checkbox id="chkupper{#}"  value="Y" onclick="if(this.checked)document.getElementById(\'chklower{#}\').checked=false"></td>\n', r += '<td><input type=checkbox id="chklower{#}"  value="Y" onclick="if(this.checked)document.getElementById(\'chkupper{#}\').checked=false"></td>\n', r += '<td><input type=checkbox id="chknull{#}" value="Y" checked></td>\n', r += '<td><input type="text" id="ftem{#}" value="" size="15" maxlength="200"></td>', r += "</tr>", a = 0; a < n.length; a++) l += r.replace(/\{#\}/g, "" + (a + 1)).replace("{FIELDNAME" + (a + 1) + "}", n[a].replace(/[@+<>"'?.,-\/#!$%\^&*;:{}=\-`~()\[\]\\|]/g, "").replace(/\s+/g, "_").replace(/_+/g, "_")).replace("{FIELDSIZE" + (a + 1) + "}", 0 != (t.length > 0 && t[a]) ? t[a] : 30), 0 != e.statsCnt.length ? (l = (l = "N" === e.statsCnt[a].fieldType ? l.replace("{DECSIZE" + (a + 1) + "}", e.statsCnt[a].fieldDecs) : l.replace("{DECSIZE" + (a + 1) + "}", "")).replace("{FTITLE" + (a + 1) + "}", "Type:" + e.statsCnt[a].fieldType + ",Counts: Total Records: " + e.table.length + ",Empty Records:" + e.statsCnt[a].emptyCnt), "VC" === e.statsCnt[a].fieldType ? l = l.replace("{VC" + (a + 1) + "}", "selected") : "VCC" === e.statsCnt[a].fieldType ? l = l.replace("{VCC" + (a + 1) + "}", "selected") : "C" === e.statsCnt[a].fieldType ? l = l.replace("{C" + (a + 1) + "}", "selected") : "N" === e.statsCnt[a].fieldType ? l = l.replace("{N" + (a + 1) + "}", "selected") : "I" === e.statsCnt[a].fieldType ? l = l.replace("{I" + (a + 1) + "}", "selected") : "B" === e.statsCnt[a].fieldType ? l = l.replace("{B" + (a + 1) + "}", "selected") : "D" === e.statsCnt[a].fieldType ? l = l.replace("{D" + (a + 1) + "}", "selected") : "S" === e.statsCnt[a].fieldType ? l = l.replace("{S" + (a + 1) + "}", "selected") : "M" === e.statsCnt[a].fieldType && (l = l.replace("{M" + (a + 1) + "}", "selected"))) : l = (l = (l = l.replace("{VC" + (a + 1) + "}", "selected")).replace("{FTITLE" + (a + 1) + "}", "Type: Varchar,Counts: Total Records: " + e.table.length + ",Empty Records: 0")).replace("{DECSIZE" + (a + 1) + "}", "");
        return l += "</table>"
    }
}

function setOptions(e) {
    var t;
    if (e) {
        var n = getCsvHeader(e);
        for (document.getElementById("fkey1") && (document.getElementById("fkey1").checked = !0), document.getElementById("freq1") && (document.getElementById("freq1").checked = !0), t = 0; t < n.length; t++) document.getElementById("fname" + (t + 1)) && (document.getElementById("fname" + (t + 1)).value = n[t].replace(/[@+<>"'?.,-\/#!$%\^&*;:{}=\-`~()\[\]\\|]/g, "").replace(/\s+/g, "_").replace(/_+/g, "_"), document.getElementById("ftype" + (t + 1)) && e.statsCnt[t] && 0 === e.statsCnt[t].emptyCnt && (document.getElementById("freq" + (t + 1)).checked = !0))
    }
}

function minOptions(e) {
    var t = document && document.getElementById("chkNullJson");
    if (e) {
        var n = getCsvHeader(e),
            l = '<table class="table table-bordered table-hover table-condensed">\n<tr>\n<th>Col #</th><th>Field</th>';
        l += '<th>Trim Left<br/><input type="checkbox" onclick="setCheckboxes(\'ftriml\',this.checked)"/></th>', l += '<th>Trim Right<br/><input type="checkbox" onclick="setCheckboxes(\'ftrimr\',this.checked)"/></th>', l += "<th>Upper<br/><input type=\"checkbox\" onclick=\"setCheckboxes('chkupper',this.checked);if(this.checked){setCheckboxes('chklower',false);setCheckboxes('chkProper',false);}\"/></th>", l += "<th>Lower<br/><input type=\"checkbox\" onclick=\"setCheckboxes('chklower',this.checked);if(this.checked){setCheckboxes('chkupper',false);setCheckboxes('chkProper',false);}\"/></th>", l += "<th title=\"1st letter of word capitalized the rest not\">Proper Case<br/><input type=\"checkbox\" onclick=\"setCheckboxes('chkProper',this.checked);if(this.checked){setCheckboxes('chkupper',false);setCheckboxes('chklower',false);}\"/></th>", l += '<th>Remove Punctuation<br/><input type="checkbox" onclick="setCheckboxes(\'chkpunct\',this.checked)"/></th>', l += '<th>Crunch Spaces<br/><input type="checkbox" onclick="setCheckboxes(\'chkcrunch\',this.checked)"/></th>', t && (l += '<th>Use null for Empty Field<br/><input type="checkbox" onclick="setCheckboxes(\'chknull\',this.checked)"/></th>\n'), l += "<th># Decimals or Date Format</th>\n", l += "</tr>";
        var a, r = "<tr><td>{#}</td>";
        for (r += "<td>{FIELDNAME{#}}</td>\n", r += '<td><input type=checkbox id="ftriml{#}" value="Y" title="Trim Left"></td>\n', r += '<td><input type=checkbox id="ftrimr{#}" value="Y" title="Trim Right"></td>\n', r += '<td><input type=checkbox id="chkupper{#}"  value="Y" onclick="if(this.checked){document.getElementById(\'chkProper{#}\').checked=document.getElementById(\'chklower{#}\').checked=false}"></td>\n', r += '<td><input type=checkbox id="chklower{#}"  value="Y" onclick="if(this.checked){document.getElementById(\'chkProper{#}\').checked=document.getElementById(\'chkupper{#}\').checked=false}"></td>\n', r += '<td><input type=checkbox id="chkProper{#}" value="Y" onclick="if(this.checked){document.getElementById(\'chklower{#}\').checked=document.getElementById(\'chkupper{#}\').checked=false}"></td>\n', r += '<td><input type=checkbox id="chkpunct{#}"  value="Y" title="Remove punctuation"></td>\n', r += '<td><input type=checkbox id="chkcrunch{#}" value="Y" title="Replace 2 or more spaces with 1"></td>\n', t && (r += '<td><input type=checkbox id="chknull{#}" value="Y" title="Use null instead of empty string"></td>\n'), r += '<td><input type="text" size="10" id="fdecimals{#}"  value=""  title="Specify # of decimal places or output date format"></td>\n', r += "</tr>", a = 0; a < n.length; a++) l += r.replace(/\{#\}/g, "" + (a + 1)).replace("{FIELDNAME" + (a + 1) + "}", n[a].replace(/\s+/g, "_"));
        return l += "</table>"
    }
}

function flatOptions(e) {
    if (e) {
        var t = getCsvColLength(e),
            n = getCsvHeader(e),
            l = '<table class="table table-bordered table-hover table-condensed">\n<tr>\n<th>Col #</th><th>Field Name</th>';
        l += '<th>Trim<br/><input type="checkbox" onclick="setCheckboxes(\'ftrim\',this.checked)"/></th><th>Pad Size</th><th># Decimals or Date Format</th>', l += "<th>Upper<br/><input type=\"checkbox\" onclick=\"setCheckboxes('chkupper',this.checked);if(this.checked){setCheckboxes('chklower',false);}\"/></th>", l += "<th>Lower<br/><input type=\"checkbox\" onclick=\"setCheckboxes('chklower',this.checked);if(this.checked){setCheckboxes('chkupper',false);}\"/></th>", l += "<th>Right<br/>Justify<br/><input type=\"checkbox\" onclick=\"setCheckboxes('chkrjust',this.checked);if(this.checked){setCheckboxes('chkcjust',false);}\"/></th>", l += "<th>Center<br/>Justify<br/><input type=\"checkbox\" onclick=\"setCheckboxes('chkcjust',this.checked);if(this.checked){setCheckboxes('chkrjust',false);}\"/></th></tr>";
        var a, r = "<tr><td>{#}</td>";
        for (r += "<td>{FIELDNAME{#}}</td>\n", r += '<td><input type=checkbox id="ftrim{#}" value="Y" ></td>\n', r += '<td><input type=text id="fpadsize{#}" size=3 maxlength=3 value="{FIELDSIZE{#}}" ></td>\n', r += '<td><input type=text id="fdecimals{#}" size=10 value="" ></td>\n', r += '<td><input type=checkbox id="chkupper{#}"  value="Y" onclick="if(this.checked)document.getElementById(\'chklower{#}\').checked=false"></td>\n', r += '<td><input type=checkbox id="chklower{#}"  value="Y" onclick="if(this.checked)document.getElementById(\'chkupper{#}\').checked=false"></td>\n', r += '<td><input type=checkbox id="chkrjust{#}"  value="Y" onclick="if(this.checked)document.getElementById(\'chkcjust{#}\').checked=false"></td>\n', r += '<td><input type=checkbox id="chkcjust{#}"  value="Y" onclick="if(this.checked)document.getElementById(\'chkrjust{#}\').checked=false"></td>\n', r += "</tr>", a = 0; a < n.length; a++) l += r.replace(/\{#\}/g, "" + (a + 1)).replace("{FIELDNAME" + (a + 1) + "}", n[a].replace(/\s+/g, "_")).replace("{FIELDSIZE" + (a + 1) + "}", 0 != (t.length > 0 && t[a]) ? t[a] : "");
        return l += "</table>"
    }
}

function parseAndOptions(e, t) {
    var n, l = 0;
    if (e) {
        if (document.getElementById("txtRowLimit") && (e.limit = document.getElementById("txtRowLimit").value), document.getElementById("txtSkipLimit") && (e.skip = document.getElementById("txtSkipLimit").value), document.getElementById("chkHeader") && (e.isFirstRowHeader = document.getElementById("chkHeader").checked), document.getElementById("chkHeaderUpper") && (e.headerToUpper = document.getElementById("chkHeaderUpper").checked), document.getElementById("chkHeaderLower") && (e.headerToLower = document.getElementById("chkHeaderLower").checked), document.getElementById("txt1")) {
            for (e.parse(document.getElementById("txt1").value), n = 0; n < e.maxColumnsFound; n++) e.statsCnt[n] && "D" === e.statsCnt[n].fieldType && l++;
            detCsvDateFormat && l > 0 ? detCsvDateFormat(e) : e.dateformat = void 0
        }
        if (document.getElementById("divOptions") && (e.prevColumnsFound != e.maxColumnsFound || t) && (document.getElementById("divOptions").innerHTML = sqlOptions(e), setOptions(e), e.prevColumnsFound = e.maxColumnsFound), document.getElementById("divFlatOptions") && (e.prevColumnsFound != e.maxColumnsFound || t) && (document.getElementById("divFlatOptions").innerHTML = flatOptions(e), e.prevColumnsFound = e.maxColumnsFound), document.getElementById("divMinOptions") && (e.prevColumnsFound != e.maxColumnsFound || t) && (document.getElementById("divMinOptions").innerHTML = minOptions(e), e.prevColumnsFound = e.maxColumnsFound), document.getElementById("divInputCounts")) {
            if (document.getElementById("divInputCounts").innerHTML = "Input Records- Header: " + (0 == e.arHeaderRow.length && e.isFirstRowHeader ? "missing" : e.isFirstRowHeader + (e.isFirstRowHeader ? " &nbsp; Header Fields: " + e.headerColumns : "")) + "\n<br/>Data:  Separator: " + ("\t" == e.delimiter ? "Tab" : " " == e.delimiter ? "Space" : e.delimiter || " ") + " &nbsp; &nbsp;  Fields: " + e.maxColumnsFound + " &nbsp; &nbsp;  Records: " + (e.dataRowsFound <= 0 ? "0" : e.dataRowsFound), e.isFirstRowHeader)
                for (n = 0; n < e.arHeaderRow.length; n++)
                    if (e.arHeaderRow[n].isNumeric() || "" == e.arHeaderRow[n]) {
                        document.getElementById("divInputCounts").innerHTML += "<br/><b>WARNING</b> - Are you sure your First row is column names?";
                        break
                    } for (n = 0; n < e.headerErrors.length; n++) document.getElementById("divInputCounts").innerHTML += "<br/><b>WARNING</b> - Heading column # " + e.headerErrors[n].field + " is empty.";
            for (e.skipEmptyRowCnt > 0 && (document.getElementById("divInputCounts").innerHTML += "<br/><b>WARNING</b> - Empty lines skipped: " + e.skipEmptyRowCnt), e.isFirstRowHeader && e.headerImbalance && e.dataRowsFound > 0 ? document.getElementById("divInputCounts").innerHTML += "<br/><b>WARNING</b> - Your column header has " + e.headerColumns + " columns but these lines do not: " + e.headerImbalanceRows : e.fieldImbalance && (document.getElementById("divInputCounts").innerHTML += "<br/><b>WARNING</b> - Your first line has " + e.maxColumnsFound + " columns but these lines do not: " + e.fieldImbalanceRows), e.quote != e.detectedQuote && (document.getElementById("divInputCounts").innerHTML += "<br/><b>WARNING</b> - Are you sure your Quoting Character setting is correct? <small>(See Input Options)</small>"), n = 0; n < e.statsCnt.length; n++) e.statsCnt[n] && "D" != e.statsCnt[n].fieldType && (e.statsCnt[n].dateCnt - e.statsCnt[n].emptyCnt) / e.dataRowsFound >= .9 && (document.getElementById("divInputCounts").innerHTML += "<br/><b>WARNING</b> - Field: " + (e.arHeaderRow[n] || n + 1) + " appears to be a DATE yet it has non-date values");
            var a, r = 0,
                o = ["", "Spaces before quoting character", "Data after quoting character", "Missing end Quoting character"];
            for (a in e.relaxedInfo) {
                if (++r > 5) {
                    document.getElementById("divInputCounts").innerHTML += "<br/>...";
                    break
                }
                document.getElementById("divInputCounts").innerHTML += "<br/><b>WARNING</b> - " + o[e.relaxedInfo[a].error] + " at line: " + a + ", Column:" + e.relaxedInfo[a].column
            }
        }
    }
}

function clearAll() {
    var e = !1;
    document.getElementById("chkAppend") && (e = document.getElementById("chkAppend").checked), document.getElementById("sepAuto") && (document.getElementById("sepAuto").checked = !0), CSV && (CSV.delimiter = ",", CSV.autodetect = !0, CSV.quote = '"', CSV.outputQuote = '"', CSV.maxColumnsFound = 0), document.getElementById("txt1") && (document.getElementById("txt1").value = ""), e || document.getElementById("txta") && (document.getElementById("txta").value = ""), document.getElementById("txtCols") && (document.getElementById("txtCols").value = ""), document.getElementById("chkHeader") && (document.getElementById("chkHeader").checked = !0), document.getElementById("chkHeaderUpper") && (document.getElementById("chkHeaderUpper").checked = !1), document.getElementById("chkHeaderLower") && (document.getElementById("chkHeaderLower").checked = !1), e || document.getElementById("diva") && (document.getElementById("diva").innerHTML = ""), document.getElementById("divOptions") && (document.getElementById("divOptions").innerHTML = ""), document.getElementById("divFlatOptions") && (document.getElementById("divFlatOptions").innerHTML = ""), document.getElementById("divMinOptions") && (document.getElementById("divMinOptions").innerHTML = ""), document.getElementById("chkInputQuote") && (document.getElementById("chkInputQuote").checked = !1), document.getElementById("chkOutputQuote") && (document.getElementById("chkOutputQuote").checked = !1), document.getElementById("chkIgnoreDoubleQuote") && (document.getElementById("chkIgnoreDoubleQuote").checked = !1), document.getElementById("chkDecodeLiterals") && (document.getElementById("chkDecodeLiterals").checked = !1), parseAndOptions(), setupSortDD()
}

function getUserOptions(e) {}

function radiovalue(e) {
    if (!e) return "";
    var t = e.length;
    if (void 0 == t) return e.checked ? e.value : "";
    for (var n = 0; n < t; n++)
        if (e[n].checked) return e[n].value;
    return ""
}

function setRadioValue(e, t) {
    if (e) {
        var n = e.length;
        if (void 0 != n) {
            "\t" === (t = (t || "") + "") && (t = "\\t");
            for (var l = 0; l < n; l++) e[l].checked = !1, e[l].value == t && (e[l].checked = !0)
        } else e.checked = e.value == t.toString()
    }
}

function sortStr() {
    var e, t, n, l, a;
    for (l = "", n = 1; n <= 4; n++) document.getElementById("selSortFld" + n) && "" != (t = document.getElementById("selSortFld" + n).value) && (a = document.getElementById("selSortType" + n).value, e = document.getElementById("selSortAsc" + n).value, n > 1 && (l += ","), l += a + t + e);
    return CSV.setSortFlds(l), CSV.mySortNeeded = !0, l
}

function setupSortDD() {
    var e, t, n, l;
    for (t = 1; t <= 4; t++)
        if (e = document.getElementById("selSortFld" + t)) {
            if (e.options.length - 1 == CSV.maxColumnsFound) break;
            for (e.options.length = 1, e.selectedIndex = 0, n = 1; n <= CSV.maxColumnsFound; n++)(l = document.createElement("option")).text = l.value = "" + n, e.options.add(l)
        } sortStr(), typeof csvCreateQueryUI == typeof Function && csvCreateQueryUI(), document.getElementById("btnColsReset") && document.getElementById("btnColsReset").click()
}

function getFldPosArr(e) {
    var t, n, l = [];
    if (e) {
        if ("" != e.displayPoss) {
            for (l = e.displayPoss.split(","), t = 0; t < l.length; t++)
                if (l[t] = (l[t] + "").trim(), isNaN(l[t]) && l[t] > " ")
                    for (n = 0; n < e.arHeaderRow.length; n++)(l[t] + "").toUpperCase() == e.arHeaderRow[n].toUpperCase() && (l[t] = n + 1);
            for (t = l.length - 1; t >= 0; t--)(isNaN(l[t]) || l[t] < 1 || l[t] > e.maxColumnsFound) && l.splice(t, 1)
        }
        if (0 == l.length)
            for (t = 0; t < e.maxColumnsFound; t++) l[l.length] = t + 1;
        if (0 == l.length)
            for (t = 0; t < e.arHeaderRow.length; t++) l[l.length] = t + 1;
        return l
    }
}

function flattenSqlJson(e) {
    var t, n = [];
    for (t = 0; t < e.length; t++) {
        var l = {};
        for (k = 0; k < e[t].length; k++) l[e[t][k].column] = e[t][k].value;
        n[t] = l
    }
    return n
}

function getExampleCsv() {
    return 'id,name,amount,Remark\n1,"Johnson, Smith, and Jones Co.",345.33,Pays on time\n2,"Sam ""Mad Dog"" Smith",993.44,\n3,"Barney & Company",0,"Great to work with\nand always pays with cash."\n4,Johnson\'s Automotive,2344,\n'
}

function getExampleCsvJson() {
    return "id,name/first,name/last,rating/0,rating/1,rating/2\n1,Dan,Jones,8,7,9\n2,Bill,Barner,7,6,5\n3,Joe,Smoe,4,3,\n"
}

function getExampleXml(e) {
    e = (e || 1) - 1;
    return '<?xml version="1.0"?>\n<ROWSET>\n<ROW>\n<id>1</id>\n<name>Johnson, Smith, and Jones Co.</name>\n<amount>345.33</amount>\n<Remark>Pays on time</Remark>\n</ROW>\n<ROW>\n<id>2</id>\n<name>Sam &quot;Mad Dog&quot; Smith</name>\n<amount>993.44</amount>\n<Remark></Remark>\n</ROW>\n<ROW>\n<id>3</id>\n<name>Barney &amp; Company</name>\n<amount>0</amount>\n<Remark>Great to work with\nand always pays with cash.</Remark>\n</ROW>\n<ROW>\n<id>4</id>\n<name>Johnson&apos;s Automotive</name>\n<amount>2344</amount>\n<Remark></Remark>\n</ROW>\n</ROWSET>'
}

function getExampleJson(e) {
    return ['[\n  {\n    "id":1,    "name":"Johnson, Smith, and Jones Co.",\n    "amount":345.33,    "Remark":"Pays on time"\n  },\n  {\n    "id":2,    "name":"Sam \\"Mad Dog\\" Smith",\n    "amount":993.44,    "Remark":""\n  },\n  {\n    "id":3,    "name":"Barney & Company",\n    "amount":0,    "Remark":"Great to work with\\nand always pays with cash."\n  },\n  {\n    "id":4,    "name":"Johnson\'s Automotive",\n    "amount":2344,    "Remark":""\n  }\n]\n', '{ "data" : [\n  {    "id":1,    "name":"Johnson, Smith, and Jones Co."  },\n  {    "id":2,    "name":"Sam \\"Mad Dog\\" Smith"  },\n  {    "id":3,    "name":"Barney & Company"  },\n  {    "id":4,    "name":"Johnson\'s Automotive"  }\n] }\n', '{ "race" : \n { "entries" : [\n  {    "id":11,    "name":"Johnson, Smith, and Jones Co."  },\n  {    "id":22,    "name":"Sam \\"Mad Dog\\" Smith"  },\n  {    "id":33,    "name":"Barney & Company"  },\n  {    "id":44,    "name":"Johnson\'s Automotive"  }\n] }\n}\n', '{\n    "id":1,    "name":"Johnson, Smith, and Jones Co.",    "amount":345.33,    "Remark":"Pays on time"\n}\n', '[\n    [      1,      "Johnson, Smith, and Jones Co.",      345.33    ],\n    [      99,      "Acme Food Inc.",      2993.55    ]\n]'][e = (e || 1) - 1]
}

function getExampleKml() {
    return 'National Park,$ Obligated,State,Latitude,Longitude\nAbraham Lincoln Birthplace NHS,"$34,584",KY,37.6116333423,-85.6442940021\nAcadia,"$102,631",ME,44.3593807753,-68.2397319808\nAndersonville,"$65,133",GA,32.197905290823,-84.1302615685733\nAndrew Johnson ,"$17,949",TN,36.1562449930463,-82.8370902853041\nAntietam,"$54,743",MD,39.462381614,-77.7359854016\nAppomattox Court House,"$12,651",VA,37.3826448073,-78.8027430409\nAssateague Island,"$51,921",MD,38.0556022623662,-75.2453836072023\nBig Bend,"$535,983",TX,29.0103562389,-103.311115521\nBig South Fork National River and Recreation Area,"$3,009","TN, KY",36.3837375235,-84.6743069824\n'
}

function getExampleFlat() {
    return '1     Johnson, Smith, and Jones Co.  345.33     Pays on time                  \n2     Sam "Mad Dog" Smith            993.44              \n3     Barney & Company               0          Great to work with and always pays with cash.      \n4     Johnson\'s Automotive           2344        \n'
}

function getExampleGeoJson(e) {
    return '{ \n    "type": "FeatureCollection",\n    "features": [\n      { "type": "Feature",\n        "geometry": {"type": "Point", "coordinates": [-75.343, 39.984]},\n        "properties": { \n          "name": "Location A",\n          "category": "Store"\n        }\n      },\n      { "type": "Feature",\n        "geometry": {"type": "Point", "coordinates": [-80.24, 40.12]},\n        "properties": { \n          "name": "Location B",\n          "category": "House"\n        }\n      },\n      { "type": "Feature",\n        "geometry": {"type": "Point", "coordinates": [ -77.2, 41.427]},\n        "properties": { \n          "name": "Location C",\n          "category": "Office"\n        }\n      }\n    ]\n  }'
}

function loadScript(e) {
    var t = document.createElement("script");
    t.type = "text/javascript", t.id = "dynScriptTemp", t.src = e, document.getElementsByTagName("head")[0].appendChild(t)
}

function loadScriptAndRun(e) {
    e.startsWith("?") || (e = "?" + e), loadScript("/cgi-bin/url-to-json.php" + e)
}

function loadDataAndRun(e) {
    document.getElementById("txt1").value = e.html.join("\n"), document.getElementById("btnRun").click()
}

function loadURL(e) {
    if ("" == e.trim()) return alert("Missing URL"), !1;
    loadScriptAndRun("?callback=loadDataAndRun&url=" + encodeURIComponent(e))
}

function prettyJSON(e, t) {
    t = t || 3;
    if ("undefined" == typeof JSON) return e;
    try {
        if ("string" == typeof e) return JSON.stringify(JSON.parse(e), null, t);
        if ("object" == typeof e) return JSON.stringify(e, null, t)
    } catch (e) {}
    return e
}

function getJsonLevel(e) {
    "string" == typeof e && (e = JSON.parse(e));
    var t, n, l = JSON.stringify(e, null, "\t").split(/\r\n|\n|\r/gm),
        a = 0;
    for (t = 0; t < l.length; t++) "\t" == l[t].charAt(0) && (n = l[t].match(/\t+/gm))[0].length > a && (a = n[0].length);
    return a + 1
}

function saveOutput(e, t, n) {
    var l = new Blob([e], {
        type: "text/plain;charset=utf-8"
    });
    saveAs(l, t, !0)
}

function saveExcel(e, t) {
    var n = "convertcsv",
        l = {};
    return t && (l.autodetect = CSV.autodetect, l.isFirstRowHeader = CSV.isFirstRowHeader, l.quote = CSV.quote, l.delimiter = CSV.delimiter, l.table = CSV.table.slice(0)), document.getElementById("fn") && (n = document.getElementById("fn").value), CSV.autodetect = !0, CSV.isFirstRowHeader = !1, CSV.quote = '"', document.getElementById("frm1") && document.getElementById("outSepComma") && (CSV.delimiter = radiovalue(document.frm1.outsep) || ",", "o" === CSV.delimiter && (CSV.delimiter = document.getElementById("outSepOtherVal").value), CSV.autodetect = !1), document.getElementById("chkOutputQuote") && document.getElementById("chkOutputQuote").checked && (CSV.quote = "'"), document.getElementById(e) ? CSV.parse(document.getElementById(e).value) : CSV.parse(e), alasql('SELECT * INTO XLSX("' + n + '.xlsx",{headers:false}) FROM ?', [CSV.table]), t && (CSV.autodetect = l.autodetect, CSV.isFirstRowHeader = l.isFirstRowHeader, CSV.quote = l.quote, CSV.delimiter = l.delimiter, CSV.table = l.table.slice(0), CSV.parse(CSV.stringify())), !1
}

function saveFile(e, t) {
    var n = "\r\n";
    null === t && (t = ""), "" != t && (t = "." + t);
    var l = document.getElementById("fn").value.trim();
    "" == l && (l = document.getElementById("fn").value = "convertcsv"), document.getElementById("eol") && (n = document.getElementById("eol").value || n), "LF" == n && (n = "\n"), "CRLF" == n && (n = "\r\n"), saveOutput(e.replace(/\r\n|\r|\n/gm, n), l + t, null)
}

function loadCsv() {
    var e = "",
        t = "",
        n = 0,
        l = "",
        a = "";
    storageSup.has_html5_storage() && (null == storageSup.getCacheCsv() && storageSup.setCacheCsv("N"), "Y" == storageSup.getCacheCsv() && (document.getElementById("txt1") && "Y" != sessionStorage.getItem("clearPressed") && (document.getElementById("chkHeader") && (document.getElementById("chkHeader").checked = "Y" == localStorage.getItem("csvChkHeader"), e = localStorage.getItem("csvDelimiter"), setRadioValue(document.forms.frm1.sep, e), t = localStorage.getItem("csvQuote"), n = localStorage.getItem("csvBackslash"), l = localStorage.getItem("chkReplaceAccents"), a = localStorage.getItem("chkIgnoreDoubleQuote"), CSV.autodetect = !0, e && "" != e && (CSV.autodetect = !1, CSV.delimiter = e), t && "" != t && (CSV.quote = t, document.getElementById("chkInputQuote") && (document.getElementById("chkInputQuote").checked = "'" === t)), a && "" != a && document.getElementById("chkIgnoreDoubleQuote") && (CSV.ignoreQuote = "Y" == a, document.getElementById("chkIgnoreDoubleQuote").checked = CSV.ignoreQuote), l && "" != l && document.getElementById("chkReplaceAccents") && (document.getElementById("chkReplaceAccents").checked = "Y" === l), CSV.decodeBackslashLiterals = !1, "" != n && (CSV.decodeBackslashLiterals = "Y" === n, document.getElementById("chkDecodeLiterals") && (document.getElementById("chkDecodeLiterals").checked = CSV.decodeBackslashLiterals))), assignText(storageSup.getCsv())), sessionStorage.setItem("clearPressed", "")))
}

function saveCsv() {
    var e = CSV.quote || '"',
        t = "N";
    storageSup.has_html5_storage() && (document.getElementById("chkReplaceAccents") && localStorage.setItem("chkReplaceAccents", document.getElementById("chkReplaceAccents").checked ? "Y" : ""), document.getElementById("chkIgnoreDoubleQuote") && localStorage.setItem("chkIgnoreDoubleQuote", document.getElementById("chkIgnoreDoubleQuote").checked ? "Y" : ""), document.getElementById("chkDecodeLiterals") && (t = document.getElementById("chkDecodeLiterals").checked), document.getElementById("txt1") && document.getElementById("txt1").value != getExampleCsv() && document.getElementById("txt1").value.length > 0 && storageSup.putCsv(document.getElementById("txt1").value, document.getElementById("chkHeader").checked ? "Y" : "N", radiovalue(document.forms.frm1.sep), e, t ? "Y" : "N"))
}

function clearPage() {
    storageSup && storageSup.has_html5_storage() && sessionStorage.setItem("clearPressed", "Y"), window.location.reload(!0)
}

function doTransformations(e, t, n) {
    var l;
    if (document.getElementById("ftrim" + (t + 1)) && document.getElementById("ftrim" + (t + 1)).checked && (e = e.trim()), document.getElementById("ftriml" + (t + 1)) && document.getElementById("ftriml" + (t + 1)).checked && (e = e.ltrim()), document.getElementById("ftrimr" + (t + 1)) && document.getElementById("ftrimr" + (t + 1)).checked && (e = e.rtrim()), document.getElementById("chkupper" + (t + 1)) && document.getElementById("chkupper" + (t + 1)).checked && (e = e.toUpperCase()), document.getElementById("chklower" + (t + 1)) && document.getElementById("chklower" + (t + 1)).checked && (e = e.toLowerCase()), document.getElementById("chkProper" + (t + 1)) && document.getElementById("chkProper" + (t + 1)).checked && (e = e.toProperCase()), document.getElementById("chkpunct" + (t + 1)) && document.getElementById("chkpunct" + (t + 1)).checked && (n.statsCnt[t] ? "N" != n.statsCnt[t].fieldType && "I" != n.statsCnt[t].fieldType && (e = e.removePunctuation()) : e = e.removePunctuation()), document.getElementById("chkcrunch" + (t + 1)) && document.getElementById("chkcrunch" + (t + 1)).checked && (e = e.crunch()), document.getElementById("fdecimals" + (t + 1)) && "" != document.getElementById("fdecimals" + (t + 1)).value)
        if (l = document.getElementById("fdecimals" + (t + 1)).value, !n.statsCnt[t] || "N" != n.statsCnt[t].fieldType && "I" != n.statsCnt[t].fieldType && "B" != n.statsCnt[t].fieldType) {
            if ("" != e.trim() && n.statsCnt[t] && ("D" == n.statsCnt[t].fieldType || (n.statsCnt[t].dateCnt - n.statsCnt[t].emptyCnt) / n.dataRowsFound >= .9)) {
                var a = e;
                try {
                    l = l.toUpperCase();
                    e = moment(e, n.dateformat[t]).format(l)
                } catch (t) {
                    e = a
                }
            }
        } else isNaN(l) ? l = 0 : l *= 1, "" != e.trim() && (e = e.toNumber().toFixed(l) + "");
    return e
}

function setOutputSingleQuote(e) {
    CSV.outputQuote = e ? "'" : '"'
}

function setInputSingleQuote(e) {
    CSV.quote = e ? "'" : '"', parseAndOptions(CSV, !0)
}

function setCheckboxes(e, t) {
    var n, l;
    for (n = 0; n < CSV.maxColumnsFound; n++)(l = document.getElementById(e + (n + 1))) && (l.checked = t)
}
