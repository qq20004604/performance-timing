<h3>使用说明</h3>

> 安装

```
npm install
```

> 查看DEMO

```
npm run dev
```

> 使用

采用的是 js 文件获取数据，Vue 组件输出图表；

三种输出方式：

1. 设置 js 文件的 outputLog 的值为 ``true``， 则默认在控制台输出结构；
2. 通过引入 js 文件的 getData 方法，然后通过 ``getData().then(timer => {})`` 来获取值；
3. 直接暴露出 ``getTimingInfo`` 方法，可以自行调用（但需要注意，只有 onload 结束后，才能确保所有数据有值）；

可以直接引入 Vue 组件（使用 less），然后根据需要，修改 less 里设置的常量，比如表格的宽高、整个显示区域的宽高等（目前不支持自适应）。

