var _self = "undefined" != typeof window ? window : "undefined" != typeof WorkerGlobalScope && self instanceof WorkerGlobalScope ? self : {},
    Prism = function(u) {
        var c = /\blang(?:uage)?-([\w-]+)\b/i,
            t = 0,
            E = {
                manual: u.Prism && u.Prism.manual,
                disableWorkerMessageHandler: u.Prism && u.Prism.disableWorkerMessageHandler,
                util: {
                    encode: function(e) {
                        return e instanceof N ? new N(e.type, E.util.encode(e.content), e.alias) : Array.isArray(e) ? e.map(E.util.encode) : e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\u00a0/g, " ")
                    },
                    type: function(e) {
                        return Object.prototype.toString.call(e).slice(8, -1)
                    },
                    objId: function(e) {
                        return e.__id || Object.defineProperty(e, "__id", {
                            value: ++t
                        }), e.__id
                    },
                    clone: function a(e, n) {
                        var r, t, s = E.util.type(e);
                        switch (n = n || {}, s) {
                            case "Object":
                                if (t = E.util.objId(e), n[t]) return n[t];
                                for (var i in r = {}, n[t] = r, e) e.hasOwnProperty(i) && (r[i] = a(e[i], n));
                                return r;
                            case "Array":
                                return t = E.util.objId(e), n[t] ? n[t] : (r = [], n[t] = r, e.forEach(function(e, t) {
                                    r[t] = a(e, n)
                                }), r);
                            default:
                                return e
                        }
                    }
                },
                languages: {
                    extend: function(e, t) {
                        var a = E.util.clone(E.languages[e]);
                        for (var n in t) a[n] = t[n];
                        return a
                    },
                    insertBefore: function(a, e, t, n) {
                        var r = (n = n || E.languages)[a],
                            s = {};
                        for (var i in r)
                            if (r.hasOwnProperty(i)) {
                                if (i == e)
                                    for (var l in t) t.hasOwnProperty(l) && (s[l] = t[l]);
                                t.hasOwnProperty(i) || (s[i] = r[i])
                            }
                        var o = n[a];
                        return n[a] = s, E.languages.DFS(E.languages, function(e, t) {
                            t === o && e != a && (this[e] = s)
                        }), s
                    },
                    DFS: function e(t, a, n, r) {
                        r = r || {};
                        var s = E.util.objId;
                        for (var i in t)
                            if (t.hasOwnProperty(i)) {
                                a.call(t, i, t[i], n || i);
                                var l = t[i],
                                    o = E.util.type(l);
                                "Object" !== o || r[s(l)] ? "Array" !== o || r[s(l)] || (r[s(l)] = !0, e(l, a, i, r)) : (r[s(l)] = !0, e(l, a, null, r))
                            }
                    }
                },
                plugins: {},
                highlightAll: function(e, t) {
                    E.highlightAllUnder(document, e, t)
                },
                highlightAllUnder: function(e, t, a) {
                    var n = {
                        callback: a,
                        selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
                    };
                    E.hooks.run("before-highlightall", n);
                    for (var r, s = n.elements || e.querySelectorAll(n.selector), i = 0; r = s[i++];) E.highlightElement(r, !0 === t, n.callback)
                },
                highlightElement: function(e, t, a) {
                    for (var n, r, s = e; s && !c.test(s.className);) s = s.parentNode;
                    s && (n = (s.className.match(c) || [, ""])[1].toLowerCase(), r = E.languages[n]), e.className = e.className.replace(c, "").replace(/\s+/g, " ") + " language-" + n, e.parentNode && (s = e.parentNode, /pre/i.test(s.nodeName) && (s.className = s.className.replace(c, "").replace(/\s+/g, " ") + " language-" + n));
                    var i = {
                            element: e,
                            language: n,
                            grammar: r,
                            code: e.textContent
                        },
                        l = function(e) {
                            i.highlightedCode = e, E.hooks.run("before-insert", i), i.element.innerHTML = i.highlightedCode, E.hooks.run("after-highlight", i), E.hooks.run("complete", i), a && a.call(i.element)
                        };
                    if (E.hooks.run("before-sanity-check", i), i.code)
                        if (E.hooks.run("before-highlight", i), i.grammar)
                            if (t && u.Worker) {
                                var o = new Worker(E.filename);
                                o.onmessage = function(e) {
                                    l(e.data)
                                }, o.postMessage(JSON.stringify({
                                    language: i.language,
                                    code: i.code,
                                    immediateClose: !0
                                }))
                            } else l(E.highlight(i.code, i.grammar, i.language));
                        else l(E.util.encode(i.code));
                    else E.hooks.run("complete", i)
                },
                highlight: function(e, t, a) {
                    var n = {
                        code: e,
                        grammar: t,
                        language: a
                    };
                    return E.hooks.run("before-tokenize", n), n.tokens = E.tokenize(n.code, n.grammar), E.hooks.run("after-tokenize", n), N.stringify(E.util.encode(n.tokens), n.language)
                },
                matchGrammar: function(e, t, a, n, r, s, i) {
                    for (var l in a)
                        if (a.hasOwnProperty(l) && a[l]) {
                            if (l == i) return;
                            var o = a[l];
                            o = "Array" === E.util.type(o) ? o : [o];
                            for (var u = 0; u < o.length; ++u) {
                                var c = o[u],
                                    g = c.inside,
                                    d = !!c.lookbehind,
                                    p = !!c.greedy,
                                    m = 0,
                                    f = c.alias;
                                if (p && !c.pattern.global) {
                                    var h = c.pattern.toString().match(/[imuy]*$/)[0];
                                    c.pattern = RegExp(c.pattern.source, h + "g")
                                }
                                c = c.pattern || c;
                                for (var b = n, y = r; b < t.length; y += t[b].length, ++b) {
                                    var F = t[b];
                                    if (t.length > e.length) return;
                                    if (!(F instanceof N)) {
                                        if (p && b != t.length - 1) {
                                            if (c.lastIndex = y, !(P = c.exec(e))) break;
                                            for (var v = P.index + (d ? P[1].length : 0), k = P.index + P[0].length, w = b, A = y, x = t.length; w < x && (A < k || !t[w].type && !t[w - 1].greedy); ++w)(A += t[w].length) <= v && (++b, y = A);
                                            if (t[b] instanceof N) continue;
                                            S = w - b, F = e.slice(y, A), P.index -= y
                                        } else {
                                            c.lastIndex = 0;
                                            var P = c.exec(F),
                                                S = 1
                                        }
                                        if (P) {
                                            d && (m = P[1] ? P[1].length : 0);
                                            k = (v = P.index + m) + (P = P[0].slice(m)).length;
                                            var $ = F.slice(0, v),
                                                j = F.slice(k),
                                                _ = [b, S];
                                            $ && (++b, y += $.length, _.push($));
                                            var C = new N(l, g ? E.tokenize(P, g) : P, f, P, p);
                                            if (_.push(C), j && _.push(j), Array.prototype.splice.apply(t, _), 1 != S && E.matchGrammar(e, t, a, b, y, !0, l), s) break
                                        } else if (s) break
                                    }
                                }
                            }
                        }
                },
                tokenize: function(e, t) {
                    var a = [e],
                        n = t.rest;
                    if (n) {
                        for (var r in n) t[r] = n[r];
                        delete t.rest
                    }
                    return E.matchGrammar(e, a, t, 0, 0, !1), a
                },
                hooks: {
                    all: {},
                    add: function(e, t) {
                        var a = E.hooks.all;
                        a[e] = a[e] || [], a[e].push(t)
                    },
                    run: function(e, t) {
                        var a = E.hooks.all[e];
                        if (a && a.length)
                            for (var n, r = 0; n = a[r++];) n(t)
                    }
                },
                Token: N
            };
        function N(e, t, a, n, r) {
            this.type = e, this.content = t, this.alias = a, this.length = 0 | (n || "").length, this.greedy = !!r
        }
        if (u.Prism = E, N.stringify = function(t, a, e) {
            if ("string" == typeof t) return t;
            if (Array.isArray(t)) return t.map(function(e) {
                return N.stringify(e, a, t)
            }).join("");
            var n = {
                type: t.type,
                content: N.stringify(t.content, a, e),
                tag: "span",
                classes: ["token", t.type],
                attributes: {},
                language: a,
                parent: e
            };
            if (t.alias) {
                var r = Array.isArray(t.alias) ? t.alias : [t.alias];
                Array.prototype.push.apply(n.classes, r)
            }
            E.hooks.run("wrap", n);
            var s = Object.keys(n.attributes).map(function(e) {
                return e + '="' + (n.attributes[e] || "").replace(/"/g, "&quot;") + '"'
            }).join(" ");
            return "<" + n.tag + ' class="' + n.classes.join(" ") + '"' + (s ? " " + s : "") + ">" + n.content + "</" + n.tag + ">"
        }, !u.document) return u.addEventListener && (E.disableWorkerMessageHandler || u.addEventListener("message", function(e) {
            var t = JSON.parse(e.data),
                a = t.language,
                n = t.code,
                r = t.immediateClose;
            u.postMessage(E.highlight(n, E.languages[a], a)), r && u.close()
        }, !1)), E;
        var e = document.currentScript || [].slice.call(document.getElementsByTagName("script")).pop();
        return e && (E.filename = e.src, E.manual || e.hasAttribute("data-manual") || ("loading" !== document.readyState ? window.requestAnimationFrame ? window.requestAnimationFrame(E.highlightAll) : window.setTimeout(E.highlightAll, 16) : document.addEventListener("DOMContentLoaded", E.highlightAll))), E
    }(_self);
"undefined" != typeof module && module.exports && (module.exports = Prism), "undefined" != typeof global && (global.Prism = Prism), Prism.languages.markup = {
    comment: /<!--[\s\S]*?-->/,
    prolog: /<\?[\s\S]+?\?>/,
    doctype: /<!DOCTYPE[\s\S]+?>/i,
    cdata: /<!\[CDATA\[[\s\S]*?]]>/i,
    tag: {
        pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/i,
        greedy: !0,
        inside: {
            tag: {
                pattern: /^<\/?[^\s>\/]+/i,
                inside: {
                    punctuation: /^<\/?/,
                    namespace: /^[^\s>\/:]+:/
                }
            },
            "attr-value": {
                pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/i,
                inside: {
                    punctuation: [/^=/, {
                        pattern: /^(\s*)["']|["']$/,
                        lookbehind: !0
                    }]
                }
            },
            punctuation: /\/?>/,
            "attr-name": {
                pattern: /[^\s>\/]+/,
                inside: {
                    namespace: /^[^\s>\/:]+:/
                }
            }
        }
    },
    entity: /&#?[\da-z]{1,8};/i
}, Prism.languages.markup.tag.inside["attr-value"].inside.entity = Prism.languages.markup.entity, Prism.hooks.add("wrap", function(e) {
    "entity" === e.type && (e.attributes.title = e.content.replace(/&amp;/, "&"))
}), Object.defineProperty(Prism.languages.markup.tag, "addInlined", {
    value: function(e, t) {
        var a = {};
        a["language-" + t] = {
            pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
            lookbehind: !0,
            inside: Prism.languages[t]
        }, a.cdata = /^<!\[CDATA\[|\]\]>$/i;
        var n = {
            "included-cdata": {
                pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
                inside: a
            }
        };
        n["language-" + t] = {
            pattern: /[\s\S]+/,
            inside: Prism.languages[t]
        };
        var r = {};
        r[e] = {
            pattern: RegExp(/(<__[\s\S]*?>)(?:<!\[CDATA\[[\s\S]*?\]\]>\s*|[\s\S])*?(?=<\/__>)/.source.replace(/__/g, e), "i"),
            lookbehind: !0,
            greedy: !0,
            inside: n
        }, Prism.languages.insertBefore("markup", "cdata", r)
    }
}), Prism.languages.xml = Prism.languages.extend("markup", {}), Prism.languages.html = Prism.languages.markup, Prism.languages.mathml = Prism.languages.markup, Prism.languages.svg = Prism.languages.markup,
    function(e) {
        var t = /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/;
        e.languages.css = {
            comment: /\/\*[\s\S]*?\*\//,
            atrule: {
                pattern: /@[\w-]+?[\s\S]*?(?:;|(?=\s*\{))/i,
                inside: {
                    rule: /@[\w-]+/
                }
            },
            url: RegExp("url\\((?:" + t.source + "|.*?)\\)", "i"),
            selector: RegExp("[^{}\\s](?:[^{};\"']|" + t.source + ")*?(?=\\s*\\{)"),
            string: {
                pattern: t,
                greedy: !0
            },
            property: /[-_a-z\xA0-\uFFFF][-\w\xA0-\uFFFF]*(?=\s*:)/i,
            important: /!important\b/i,
            function: /[-a-z0-9]+(?=\()/i,
            punctuation: /[(){};:,]/
        }, e.languages.css.atrule.inside.rest = e.languages.css;
        var a = e.languages.markup;
        a && (a.tag.addInlined("style", "css"), e.languages.insertBefore("inside", "attr-value", {
            "style-attr": {
                pattern: /\s*style=("|')(?:\\[\s\S]|(?!\1)[^\\])*\1/i,
                inside: {
                    "attr-name": {
                        pattern: /^\s*style/i,
                        inside: a.tag.inside
                    },
                    punctuation: /^\s*=\s*['"]|['"]\s*$/,
                    "attr-value": {
                        pattern: /.+/i,
                        inside: e.languages.css
                    }
                },
                alias: "language-css"
            }
        }, a.tag))
    }(Prism), Prism.languages.clike = {
    comment: [{
        pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
        lookbehind: !0
    }, {
        pattern: /(^|[^\\:])\/\/.*/,
        lookbehind: !0,
        greedy: !0
    }],
    string: {
        pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
        greedy: !0
    },
    "class-name": {
        pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[\w.\\]+/i,
        lookbehind: !0,
        inside: {
            punctuation: /[.\\]/
        }
    },
    keyword: /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
    boolean: /\b(?:true|false)\b/,
    function: /\w+(?=\()/,
    number: /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,
    operator: /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
    punctuation: /[{}[\];(),.:]/
}, Prism.languages.javascript = Prism.languages.extend("clike", {
    "class-name": [Prism.languages.clike["class-name"], {
        pattern: /(^|[^$\w\xA0-\uFFFF])[_$A-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\.(?:prototype|constructor))/,
        lookbehind: !0
    }],
    keyword: [{
        pattern: /((?:^|})\s*)(?:catch|finally)\b/,
        lookbehind: !0
    }, {
        pattern: /(^|[^.])\b(?:as|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
        lookbehind: !0
    }],
    number: /\b(?:(?:0[xX][\dA-Fa-f]+|0[bB][01]+|0[oO][0-7]+)n?|\d+n|NaN|Infinity)\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee][+-]?\d+)?/,
    function: /[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
    operator: /-[-=]?|\+[+=]?|!=?=?|<<?=?|>>?>?=?|=(?:==?|>)?|&[&=]?|\|[|=]?|\*\*?=?|\/=?|~|\^=?|%=?|\?|\.{3}/
}), Prism.languages.javascript["class-name"][0].pattern = /(\b(?:class|interface|extends|implements|instanceof|new)\s+)[\w.\\]+/, Prism.languages.insertBefore("javascript", "keyword", {
    regex: {
        pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s])\s*)\/(\[(?:[^\]\\\r\n]|\\.)*]|\\.|[^/\\\[\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})\]]))/,
        lookbehind: !0,
        greedy: !0
    },
    "function-variable": {
        pattern: /[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/,
        alias: "function"
    },
    parameter: [{
        pattern: /(function(?:\s+[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)?\s*\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\))/,
        lookbehind: !0,
        inside: Prism.languages.javascript
    }, {
        pattern: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=>)/i,
        inside: Prism.languages.javascript
    }, {
        pattern: /(\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*=>)/,
        lookbehind: !0,
        inside: Prism.languages.javascript
    }, {
        pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*\s*)\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*\{)/,
        lookbehind: !0,
        inside: Prism.languages.javascript
    }],
    constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/
}), Prism.languages.insertBefore("javascript", "string", {
    "template-string": {
        pattern: /`(?:\\[\s\S]|\${[^}]+}|[^\\`])*`/,
        greedy: !0,
        inside: {
            interpolation: {
                pattern: /\${[^}]+}/,
                inside: {
                    "interpolation-punctuation": {
                        pattern: /^\${|}$/,
                        alias: "punctuation"
                    },
                    rest: Prism.languages.javascript
                }
            },
            string: /[\s\S]+/
        }
    }
}), Prism.languages.markup && Prism.languages.markup.tag.addInlined("script", "javascript"), Prism.languages.js = Prism.languages.javascript, "undefined" != typeof self && self.Prism && self.document && document.querySelector && (self.Prism.fileHighlight = function(e) {
    e = e || document;
    var o = {
        js: "javascript",
        py: "python",
        rb: "ruby",
        ps1: "powershell",
        psm1: "powershell",
        sh: "bash",
        bat: "batch",
        h: "c",
        tex: "latex"
    };
    Array.prototype.slice.call(e.querySelectorAll("pre[data-src]")).forEach(function(e) {
        if (!e.hasAttribute("data-src-loaded")) {
            for (var t, a = e.getAttribute("data-src"), n = e, r = /\blang(?:uage)?-([\w-]+)\b/i; n && !r.test(n.className);) n = n.parentNode;
            if (n && (t = (e.className.match(r) || [, ""])[1]), !t) {
                var s = (a.match(/\.(\w+)$/) || [, ""])[1];
                t = o[s] || s
            }
            var i = document.createElement("code");
            i.className = "language-" + t, e.textContent = "", i.textContent = "Loading…", e.appendChild(i);
            var l = new XMLHttpRequest;
            l.open("GET", a, !0), l.onreadystatechange = function() {
                4 == l.readyState && (l.status < 400 && l.responseText ? (i.textContent = l.responseText, Prism.highlightElement(i), e.setAttribute("data-src-loaded", "")) : 400 <= l.status ? i.textContent = "✖ Error " + l.status + " while fetching file: " + l.statusText : i.textContent = "✖ Error: File does not exist or is empty")
            }, l.send(null)
        }
    }), Prism.plugins.toolbar && Prism.plugins.toolbar.registerButton("download-file", function(e) {
        var t = e.element.parentNode;
        if (t && /pre/i.test(t.nodeName) && t.hasAttribute("data-src") && t.hasAttribute("data-download-link")) {
            var a = t.getAttribute("data-src"),
                n = document.createElement("a");
            return n.textContent = t.getAttribute("data-download-link-label") || "Download", n.setAttribute("download", ""), n.href = a, n
        }
    })
}, document.addEventListener("DOMContentLoaded", function() {
    self.Prism.fileHighlight()
}));
