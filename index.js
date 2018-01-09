/**
 * Created by 王冬 on 2018/1/8.
 * QQ: 20004604
 * weChat: qq20004604
 * 本文部分参考 http://www.alloyteam.com/2015/09/explore-performance/
 * 我已经自己根据时间顺序，以及对重点内容进行整理，并调整顺序和输出结构，以优化其实际使用价值
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

    //【重要】从最开始，到读取页面第一个字节，所耗费的时间
    //【原因】这可以理解为用户拿到你的资源占用的时间，加异地机房了么，加CDN 处理了么？加带宽了么？加 CPU 运算速度了么？
    // TTFB 即 Time To First Byte 的意思
    // 维基百科：https://en.wikipedia.org/wiki/Time_To_First_Byte
    times.ttfb = t.responseStart - t.navigationStart;

    //【重要】内容加载完成的时间（从请求开始到加载结束）
    //【原因】页面内容经过 gzip 压缩了么，静态资源 css/js 等压缩了么？
    // Response 从发起request请求，到所有资源下载完毕
    times.requestAndResponse = t.responseEnd - t.requestStart

    //【重要】解析 DOM 树结构的时间
    //【原因】反省下你的 DOM 树嵌套是不是太多了！
    times.domReady = t.domComplete - t.responseEnd;

    //-------------------------- 分割线 --------------------------

    // 0、Prompt for unload
    // 前一个页面卸载页面的时间
    times.unloadEvent = t.unloadEventEnd - t.unloadEventStart;

    // 1、redirect
    //【重要】重定向的时间
    //【原因】拒绝重定向！比如，http://example.com/ 就不该写成 http://example.com
    // 如果没有斜杠，就会有额外的重定向时间
    times.redirect = t.redirectEnd - t.redirectStart;

    // 2、appcache
    // DNS 缓存时间
    times.appcache = t.domainLookupStart - t.fetchStart;

    // 3、DNS
    //【重要】DNS 查询时间
    //【原因】DNS 预加载做了么？页面内是不是使用了太多不同的域名导致域名查询的时间太长？
    // 可使用 HTML5 Prefetch 预查询 DNS ，见：[HTML5 prefetch](http://segmentfault.com/a/1190000000633364)
    times.DNS = t.domainLookupEnd - t.domainLookupStart;

    // 4、TCP
    // TCP 建立连接完成握手的时间
    times.TCP = t.connectEnd - t.connectStart;

    // 5、request
    // 从发起请求到第一次获取返回的数据耗时
    times.request = t.responseStart - t.requestStart;

    // 6、response
    // 从获得返回资源的第一个字节，到下载完所有资源的耗时
    times.response = t.responseEnd - t.responseStart

    // 7、Processing
    // Processing document从开始加载到文档资源全部加载完毕
    times.processing = t.loadEventStart - t.domLoading

    // 8、onload
    //【重要】执行 onload 回调函数的时间
    //【原因】是否太多不必要的操作都放到 onload 回调函数里执行了，考虑过延迟加载、按需加载的策略么？
    times.onloadEventTime = t.loadEventEnd - t.loadEventStart;

    if (true) {
        console.info('%c%s%s', 'color:red', '页面加载完成总共耗时                     ：', times.loadPage + 'ms')
        console.info('%c%s%s', 'color:red', '从最开始，到读取页面第一个字节            ：', times.ttfb + 'ms')
        console.info('%c%s%s', 'color:red', '从发起request 请求，到所有资源下载完毕    ：', times.requestAndResponse + 'ms')
        console.info('%c%s%s', 'color:red', '从所有资源下载完毕，到DOM树解析完毕耗时   ：', times.domReady + 'ms')
        console.info('----下面是页面加载的每一步的耗时----')
        console.info(times.unloadEvent + 'ms', '：0、前一个页面卸载页面的时间 Prompt for unload')
        console.info(times.redirect + 'ms', '：1、触发重定向 redirect')
        console.info(times.appcache + 'ms', '：2、DNS 缓存时间 Appache')
        console.info(times.DNS + 'ms', '：3、进行DNS 查询 DNS')
        console.info(times.TCP + 'ms', '：4、TCP 建立连接完成握手的时间 TCP')
        console.info(times.request + 'ms', '：5、从发起请求到第一次获取返回的数据耗时 Request')
        console.info(times.response + 'ms', '：6、从获得返回资源的第一个字节，到下载完所有资源的耗时 Response')
        console.info(times.processing + 'ms', '：7、document从开始加载到文档资源全部加载完毕 Processing')
        console.info(times.onloadEventTime + 'ms', '：8、执行 onload 回调函数的时间 ：')
    }

    console.info(times)
    return times;
}

function drawImage(times, domId) {
    // 默认id是 performance
    var DOM = document.getElementById(domId ? domId : 'performance')
    if (!DOM) {
        return console.error('绘图DOM不存在')
    }
    var domWidth = DOM.clientWidth
    var domHeight = DOM.clientHeight
    if (domWidth === 0 || domHeight === 0) {
        return console.error('')
    }

    var totalSeconds = times.unloadEvent +
        times.redirect +
        times.appcache +
        times.DNS +
        times.TCP +
        times.request +
        times.response +
        times.processing +
        times.onloadEventTime
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