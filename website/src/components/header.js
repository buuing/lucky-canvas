export const createHeader = () => `
  <header class="site-header">
    <div class="header-inner">
      <a class="logo" href="./">lucky-canvas 抽奖插件</a>
      <button class="menu-button" type="button" aria-label="打开导航" aria-expanded="false">☰</button>
      <nav class="site-nav" aria-label="主导航">
        <a class="is-active" href="./">首页</a>
        <details class="nav-dropdown">
          <summary>使用</summary>
          <div class="dropdown-menu">
            <a href="#playground">在 JS / TS 中使用</a>
            <a href="#playground">在 Vue 中使用</a>
            <a href="#playground">在 React 中使用</a>
            <a href="#faq">在 微信小程序 中使用</a>
            <a href="#faq">在 UniApp 中使用</a>
            <a href="#faq">在 Taro 中使用</a>
          </div>
        </details>
        <details class="nav-dropdown">
          <summary>文档</summary>
          <div class="dropdown-menu">
            <a href="#playground">大转盘 LuckyWheel</a>
            <a href="#playground">九宫格 LuckyGrid</a>
            <a href="#playground">老虎机 SlotMachine</a>
          </div>
        </details>
        <details class="nav-dropdown">
          <summary>示例</summary>
          <div class="dropdown-menu">
            <a href="#playground">基础示例</a>
            <a href="#playground">完整示例</a>
          </div>
        </details>
        <a href="#faq">常见问题</a>
        <a href="#playground">Playground</a>
      </nav>
    </div>
  </header>
`
