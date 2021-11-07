

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/buuing/cdn/imgs/lucky-canvas.png" width="128" alt="logo" />
  <h1>lucky-canvas 抽奖插件</h1>
  <p>一个基于 JavaScript 的跨平台 ( 大转盘 / 九宫格 ) 抽奖插件</p>
  <p>
    <a href="https://github.com/buuing/lucky-canvas/stargazers" target="_black">
      <img src="https://img.shields.io/github/stars/buuing/lucky-canvas?color=%23ffba15&logo=github&style=flat-square" alt="stars" />
    </a>
    <a href="https://github.com/buuing/lucky-canvas/network/members" target="_black">
      <img src="https://img.shields.io/github/forks/buuing/lucky-canvas?color=%23ffba15&logo=github&style=flat-square" alt="forks" />
    </a>
    <a href="https://github.com/buuing" target="_black">
      <img src="https://img.shields.io/badge/Author-%20buuing%20-7289da.svg?&logo=github&style=flat-square" alt="author" />
    </a>
    <a href="https://github.com/buuing/lucky-canvas/blob/master/LICENSE" target="_black">
      <img src="https://img.shields.io/github/license/buuing/lucky-canvas?color=%232dce89&logo=github&style=flat-square" alt="license" />
    </a>
  </p>
</div>

<br />

## 官方文档 & Demo演示

> **中文**：[https://100px.net/usage/js.html](https://100px.net/usage/js.html)  

> **English**：**If anyone can help translate the document, please contact me** `ldq404@qq.com`


<br />

## 在 Js / JQuery 中使用

### 方式 1：通过 script 标签引入

- **CDN 链接：** [https://cdn.jsdelivr.net/npm/lucky-canvas@1.6/dist/index.umd.min.js](https://cdn.jsdelivr.net/npm/lucky-canvas@1.6/dist/index.umd.min.js)

```html
<div id="my-lucky"></div>
<script src="https://cdn.jsdelivr.net/npm/lucky-canvas@1.6/dist/index.umd.min.js"></script>
<script>
  const myLucky = new LuckyCanvas.LuckyWheel('#my-lucky', {
    width: '200px',
    height: '200px',
    blocks: [{ padding: '10px', background: '#869cfa' }],
    prizes: [
      { fonts: [{ text: '0' }], background: '#e9e8fe' },
      { fonts: [{ text: '1' }], background: '#b8c5f2' },
      { fonts: [{ text: '2' }], background: '#e9e8fe' },
      { fonts: [{ text: '3' }], background: '#b8c5f2' },
      { fonts: [{ text: '4' }], background: '#e9e8fe' },
      { fonts: [{ text: '5' }], background: '#b8c5f2' },
    ],
  })
</script>
```

<br />

## 🙏🙏🙏 点个Star

**如果您觉得这个项目还不错, 可以在 [Github](https://github.com/buuing/lucky-canvas) 上面帮我点个`star`, 支持一下作者 ☜(ﾟヮﾟ☜)**
