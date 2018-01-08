/**
 * Created by 王冬 on 2018/1/8.
 * QQ: 20004604
 * weChat: qq20004604
 */

function getTimingInfo() {
    if (!window.performance || !window.performance.timing) {
        return null
    }
    var t = window.performance.timing;
    var times = {};

    //【重要】页面加载完成的时间
    //【原因】这几乎代表了用户等待页面可用的时间
    times.loadPage = t.loadEventEnd - t.navigationStart;

    //【重要】解析 DOM 树结构的时间
    //【原因】反省下你的 DOM 树嵌套是不是太多了！
    times.domReady = t.domComplete - t.responseEnd;

    //【重要】重定向的时间
    //【原因】拒绝重定向！比如，http://example.com/ 就不该写成 http://example.com
    times.redirect = t.redirectEnd - t.redirectStart;

    //【重要】DNS 查询时间
    //【原因】DNS 预加载做了么？页面内是不是使用了太多不同的域名导致域名查询的时间太长？
    // 可使用 HTML5 Prefetch 预查询 DNS ，见：[HTML5 prefetch](http://segmentfault.com/a/1190000000633364)
    times.lookupDomain = t.domainLookupEnd - t.domainLookupStart;

    //【重要】读取页面第一个字节的时间
    //【原因】这可以理解为用户拿到你的资源占用的时间，加异地机房了么，加CDN 处理了么？加带宽了么？加 CPU 运算速度了么？
    // TTFB 即 Time To First Byte 的意思
    // 维基百科：https://en.wikipedia.org/wiki/Time_To_First_Byte
    times.ttfb = t.responseStart - t.navigationStart;

    //【重要】内容加载完成的时间
    //【原因】页面内容经过 gzip 压缩了么，静态资源 css/js 等压缩了么？
    times.request = t.responseEnd - t.requestStart;

    //【重要】执行 onload 回调函数的时间
    //【原因】是否太多不必要的操作都放到 onload 回调函数里执行了，考虑过延迟加载、按需加载的策略么？
    times.loadEvent = t.loadEventEnd - t.loadEventStart;

    // DNS 缓存时间
    times.appcache = t.domainLookupStart - t.fetchStart;

    // 卸载页面的时间
    times.unloadEvent = t.unloadEventEnd - t.unloadEventStart;

    // TCP 建立连接完成握手的时间
    times.connect = t.connectEnd - t.connectStart;

    if (true) {
        console.log('%c%s%s', 'color:red', '页面加载完成的时间         ：', times.loadPage)
        console.log('%c%s%s', 'color:red','解析 DOM 树结构的时间      ：', times.domReady)
        console.log('重定向的时间              ：', times.redirect)
        console.log('DNS 查询时间              ：', times.lookupDomain)
        console.log('读取页面第一个字节的时间   ：', times.ttfb)
        console.log('内容加载完成的时间         ：', times.request)
        console.log('执行 onload 回调函数的时间 ：', times.loadEvent)
        console.log('DNS 缓存时间              ：', times.appcache)
        console.log('卸载页面的时间             ：', times.unloadEvent)
        console.log('TCP 建立连接完成握手的时间 ：', times.connect)
    }

    console.log(times)
    return times;
}

if (window.onload) {
    let f = window.onload
    window.onload = function () {
        f()
        setTimeout(() => {
            getTimingInfo()
        }, 1000)
    }
} else {
    window.onload = function () {
        setTimeout(() => {
            getTimingInfo()
        }, 1000)
    }
}