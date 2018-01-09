<template>
    <div id="performance">
        <div class="title">页面加载速度柱状图</div>
        <div class="axis-y">
            <div class="y-row y4">{{totalSeconds}}ms</div>
            <div class="y-row y3">{{parseInt(totalSeconds/3*2)}}ms</div>
            <div class="y-row y2">{{parseInt(totalSeconds/3)}}ms</div>
            <div class="y-row y1">0ms</div>
        </div>
        <div class="axis-x">
            <div class="x-col redirect">redirect</div>
            <div class="x-col app-cache">App cache</div>
            <div class="x-col DNS">DNS</div>
            <div class="x-col TCP">TCP</div>
            <div class="x-col request">request</div>
            <div class="x-col response">response</div>
            <div class="x-col processing">processing</div>
            <div class="x-col onload">onload</div>
        </div>
        <div class="container">
            <div class="arrow y-arrow"></div>
            <div class="arrow x-arrow"></div>
            <template v-if="timer">
                <div class="pillar redirect" :title="redirectTitle">
                    <div class="pillar-item" :style="redirect"></div>
                </div>
                <div class="pillar app-cache" :title="appCacheTitle">
                    <div class="pillar-item" :style="appCache"></div>
                </div>
                <div class="pillar DNS" :title="DNSTitle">
                    <div class="pillar-item" :style="DNS"></div>
                </div>
                <div class="pillar TCP" :title="TCPTitle">
                    <div class="pillar-item" :style="TCP"></div>
                </div>
                <div class="pillar request" :title="requestTitle">
                    <div class="pillar-item" :style="request"></div>
                </div>
                <div class="pillar response" :title="responseTitle">
                    <div class="pillar-item" :style="response"></div>
                </div>
                <div class="pillar processing" :title="processingTitle">
                    <div class="pillar-item" :style="processing"></div>
                </div>
                <div class="pillar onload" :title="onloadTitle">
                    <div class="pillar-item" :style="onload"></div>
                </div>
            </template>
        </div>
        <div class="description">
            <p><b>说明：</b></p>
            <ol>
                <li>显示方式采用的是累加制，因此有可能某些列显示比较短</li>
                <li>鼠标移动到柱状图对应的列，并短时间保持不动，可以显示该项数据的详细时间；</li>
                <li>
                    总计：{{timer ? timer.loadPage + 'ms': '0'}}<br>
                    下载到资源之前：{{timer ? timer.ttfb + 'ms': '0'}}<br>
                    下载资源：{{timer ? timer.requestAndResponse + 'ms': '0'}}<br>
                    DOM树解析：{{timer ? timer.domReady + 'ms': '0'}}<br>
                </li>
            </ol>
        </div>
    </div>
</template>
<style scoped lang="less" type="text/less">
    @width: 1000px;
    @height: 400px;
    @chart-top: 50px;
    @chart-width: 600px;
    /* 修改 @chart-height 时，记得修改 js 代码中的 chartHeight 的值 */
    @chart-height: 300px;
    @axis-y-row: (@chart-height - 10)/3;
    @axis-x-top: @chart-top + @chart-height + 5;

    #performance {
        position: relative;
        width: @width;
        height: @height;
        border: 1px solid #333;
        box-sizing: border-box;
    }

    #performance > .title {
        position: absolute;
        top: 0;
        width: 100%;
        height: @chart-top;
        line-height: @chart-top;
        font-size: @chart-top / 1.5;
        text-align: center;
    }

    /* -- y轴坐标 -- */
    #performance > .axis-y {
        position: absolute;
        top: @chart-top;
        left: 0;
        width: (40/500) * @width;
        font-size: 9px;
        height: @chart-height;
        .y-row {
            position: absolute;
            height: 10px;
            line-height: 10px;
            width: 100%;
            white-space: normal;
            text-align: right;
        }
        .y4 {
            top: 0 - 5px;
        }

        .y3 {
            top: @chart-height/3 - 7;
        }

        .y2 {
            top: @chart-height/3*2 - 7;
        }

        .y1 {
            top: @chart-height - 7;
        }
    }

    /* -- x轴坐标 -- */
    #performance > .axis-x {
        position: absolute;
        top: @chart-top + @chart-height + 5;
        left: (45/500) * @width;
        height: 20px;
        font-size: 9px;
        width: (@chart-width/500) * @width;
        .x-col {
            float: left;
            width: @chart-width / 8;
            word-wrap: break-word;
            text-align: center;
        }
    }

    /* -- 容器-- */
    #performance > .container {
        position: absolute;
        top: @chart-top;
        left: (45/500) * @width;
        height: @chart-height;
        border-left: 1px solid #000;
        border-bottom: 1px solid #000;
        width: @chart-width;
        box-sizing: border-box;
        .arrow {
            position: absolute;
            width: 10px;
            height: 10px;
            border-top: 1px solid #000;;
            border-right: 1px solid #000;
        }
        .y-arrow {
            top: 0;
            left: -11px;
            transform-origin: 100% 0;
            transform: rotate(-45deg);
        }
        .x-arrow {
            bottom: -11px;
            right: 0;
            transform-origin: 100% 0;
            transform: rotate(45deg);
        }
        .pillar {
            position: absolute;
            width: @chart-width / 8;
            height: 100%;
            background-color: #fff;
            .pillar-item {
                position: absolute;
                min-height: 1px;
                width: 100%;
            }
        }
        .redirect {
            left: @chart-width / 8 * 0;
            .pillar-item {
                background-color: #f3141d;
            }
        }
        .app-cache {
            left: @chart-width / 8 * 1;
            .pillar-item {
                background-color: #c516fe;
            }
        }
        .DNS {
            left: @chart-width / 8 * 2;
            .pillar-item {
                background-color: #210dfe;
            }
        }
        .TCP {
            left: @chart-width / 8 * 3;
            .pillar-item {
                background-color: #5afefe;
            }
        }
        .request {
            left: @chart-width / 8 * 4;
            .pillar-item {
                background-color: #60fe02;
            }
        }
        .response {
            left: @chart-width / 8 * 5;
            .pillar-item {
                background-color: #f9cc1d;
            }
        }
        .processing {
            left: @chart-width / 8 * 6;
            .pillar-item {
                background-color: #f3141d;
            }
        }
        .onload {
            left: @chart-width / 8 * 7;
            .pillar-item {
                background-color: #888;
            }
        }
    }

    #performance > .description {
        position: absolute;
        top: @chart-top;
        bottom: 0;
        left: @chart-width + 40 + 50;
        right: 10px;
    }
</style>
<script>
    const chartsHeight = 300
    import {getData} from '../../../index.js'

    export default {
        created() {
            getData().then(timer => {
                this.totalSeconds = timer.redirect +
                    timer.appCache +
                    timer.DNS +
                    timer.TCP +
                    timer.request +
                    timer.response +
                    timer.processing +
                    timer.onload
                this.timer = timer
            })
        },
        data() {
            return {
                timer: null,
                totalSeconds: 0
            }
        },
        computed: {
            redirect() {
                if (this.timer && this.totalSeconds) {
                    let nowHeight = this.timer.redirect / this.totalSeconds * chartsHeight
                    return {
                        bottom: 0,
                        height: `${nowHeight}px`
                    }
                }
            },
            redirectTitle() {
                return `重定向：${this.timer.redirect}ms`
            },
            appCache() {
                if (this.timer && this.totalSeconds) {
                    let nowHeight = this.timer.appCache / this.totalSeconds * chartsHeight
                    let nowBottom = 0
                    return {
                        bottom: `${nowBottom / this.totalSeconds * chartsHeight}px`,
                        height: `${nowHeight}px`
                    }
                }
            },
            appCacheTitle() {
                return `查询缓存：${this.timer.appCache}ms`
            },
            DNS() {
                if (this.timer && this.totalSeconds) {
                    let nowHeight = this.timer.DNS / this.totalSeconds * chartsHeight
                    let nowBottom = this.timer.redirect + this.timer.appCache
                    return {
                        bottom: `${nowBottom / this.totalSeconds * chartsHeight}px`,
                        height: `${nowHeight}px`
                    }
                }
            },
            DNSTitle() {
                return `DNS查询：${this.timer.DNS}ms`
            },
            TCP() {
                if (this.timer && this.totalSeconds) {
                    let nowHeight = this.timer.TCP / this.totalSeconds * chartsHeight
                    let nowBottom = this.timer.redirect + this.timer.appCache + this.timer.DNS
                    return {
                        bottom: `${nowBottom / this.totalSeconds * chartsHeight}px`,
                        height: `${nowHeight}px`
                    }
                }
            },
            TCPTitle() {
                return `TCP建立链接：${this.timer.TCP}ms`
            },
            request() {
                if (this.timer && this.totalSeconds) {
                    let nowHeight = this.timer.request / this.totalSeconds * chartsHeight
                    let nowBottom = this.timer.redirect + this.timer.appCache + this.timer.DNS + this.timer.TCP
                    return {
                        bottom: `${nowBottom / this.totalSeconds * chartsHeight}px`,
                        height: `${nowHeight}px`
                    }
                }
            },
            requestTitle() {
                return `请求数据～拿到返回数据第一个字节为止：${this.timer.request}ms`
            },
            response() {
                if (this.timer && this.totalSeconds) {
                    let nowHeight = this.timer.response / this.totalSeconds * chartsHeight
                    let nowBottom = this.timer.redirect + this.timer.appCache + this.timer.DNS + this.timer.TCP + this.timer.request
                    return {
                        bottom: `${nowBottom / this.totalSeconds * chartsHeight}px`,
                        height: `${nowHeight}px`
                    }
                }
            },
            responseTitle() {
                return `拿到返回数据第一个字节～拿到所有请求数据：${this.timer.response}ms\n从发起请求～接受完所有数据：${this.timer.request + this.timer.response}ms`
            },
            processing() {
                if (this.timer && this.totalSeconds) {
                    let nowHeight = this.timer.processing / this.totalSeconds * chartsHeight
                    let nowBottom = this.timer.redirect + this.timer.appCache + this.timer.DNS + this.timer.TCP + this.timer.request + this.timer.response
                    return {
                        bottom: `${nowBottom / this.totalSeconds * chartsHeight}px`,
                        height: `${nowHeight}px`
                    }
                }
            },
            processingTitle() {
                return `DOM树构成：${this.timer.processing}ms`
            },
            onload() {
                if (this.timer && this.totalSeconds) {
                    let nowHeight = this.timer.onload / this.totalSeconds * chartsHeight
                    let nowBottom = this.timer.redirect + this.timer.appCache + this.timer.DNS + this.timer.TCP + this.timer.request + this.timer.response + this.timer.processing
                    return {
                        bottom: `${nowBottom / this.totalSeconds * chartsHeight}px`,
                        height: `${nowHeight}px`
                    }
                }
            },
            onloadTitle() {
                return `onload函数：${this.timer.onload}ms`
            }
        },
        methods: {}
    }
</script>
