const CryptoJS = require('crypto-js');

function b(e) {
    return T(e, (function (e) {
            return "object" === typeof (e) && null !== e ? b(e) : e
        }
    ))
}

function _(e, t) {
    return S(t, (function (r, n) {
            e[n] = t[n]
        }
    )),
        e
}

function w(e) {
    return e instanceof Array
}

function S(e, t) {
    for (var r in e)
        e.hasOwnProperty(r) && t(e[r], r)
}

function T(e, t) {
    var r = w(e) ? [] : {};
    for (var n in e)
        e.hasOwnProperty(n) && (r[n] = t(e[n], n));
    return r
}

function x(e) {
    return Date.now() + (e || 0)
}

function l(e) {
    return encodeURIComponent(e).replace(/!/g, "%21").replace(/'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/\*/g, "%2A")
}

function c(e, t) {
    var r = [];
    for (var n in e)
        e.hasOwnProperty(n) && r.push(t ? l(n).toLowerCase() : n);
    return r.sort((function (e, t) {
            return (e = e.toLowerCase()) === (t = t.toLowerCase()) ? 0 : e > t ? 1 : -1
        }
    ))
}

function obj2str(e, t) {
    var r, n, o, i = [], a = c(e);
    for (r = 0; r < a.length; r++)
        o = void 0 === e[n = a[r]] || null === e[n] ? "" : "" + e[n],
            n = t ? l(n).toLowerCase() : l(n),
            o = l(o) || "",
            i.push(n + "=" + o);
    return i.join("&")
}

function hmac_sha1(data, key) {
    var sha1 = CryptoJS.algo.SHA1.create();
    var hmac = CryptoJS.algo.HMAC.create(sha1, key);
    hmac.update(data);
    return hmac.finalize().toString(CryptoJS.enc.Hex);
}

function sha1(input) {
    return CryptoJS.SHA1(input).toString();
}

function getAuth(e) {
    var t, r = (e = e || {}).SecretId, f = e.Pathname, n = e.SecretKey, o = e.KeyTime,
        a = (e.method || e.Method || "get").toLowerCase(), s = b(e.Query || e.params || {}), u = function (e) {
            var t = {};
            for (var r in e) {
                var n = r.toLowerCase();
                (n.indexOf("x-cos-") > -1 || f.indexOf(n) > -1) && (t[r] = e[r])
            }
            return t
        }(b(e.Headers || e.headers || {})), l = e.Key || "";
    e.UseRawKey ? t = e.Pathname || e.pathname || "/" + l : 0 !== (t = e.Pathname || e.pathname || l).indexOf("/") && (t = "/" + t);
    var p = !1 !== e.ForceSignHost;
    if (!u.Host && !u.host && e.Bucket && e.Region && p && (u.Host = e.Bucket + ".cos." + e.Region + ".myqcloud.com"),
        !r)
        throw new Error("missing param SecretId");
    if (!n)
        throw new Error("missing param SecretKey");
    var d = Math.round(x(e.SystemClockOffset) / 1e3) - 1
        , g = d
        , h = e.Expires || e.expires;
    g += void 0 === h ? 900 : 1 * h || 0;
    var v = r
        , m = o || d + ";" + g
        , y = o || d + ";" + g
        , _ = c(u, !0).join(";").toLowerCase()
        , w = c(s, !0).join(";").toLowerCase()
        , S = hmac_sha1(y, n).toString()
        , T = [a, t, obj2str(s, !0), obj2str(u, !0), ""].join("\n")
        , E = ["sha1", m, sha1(T).toString(), ""].join("\n");
    return ["q-sign-algorithm=sha1", "q-ak=" + v, "q-sign-time=" + m, "q-key-time=" + y, "q-header-list=" + _, "q-url-param-list=" + w, "q-signature=" + hmac_sha1(E, S).toString()].join("&")
}

var a = getAuth(
    {
        SecretId: "null",
        SecretKey: "null",
        Method: 'GET',
        Pathname: '/',
        Query: {uploads: undefined, prefix: 'spectrum/QO37-dAMtiiUE8mp5JLYS50jx06SfVRUqeomAVaRqFsNDqA'}
        ,
        Headers: {'Content-Length': 5242880},
        Expires: undefined,
        UseRawKey: false,
        SystemClockOffset: 0,
        KeyTime: '1700119713;1700126913',
        ForceSignHost: true
    }
)

console.log(a)