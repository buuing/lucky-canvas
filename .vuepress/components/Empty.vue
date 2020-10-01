<template>
  <div></div>
</template>

<script>
export default {
  mounted () {
    const nodes = Array.from(document.querySelector('.sidebar-links').children)
    const dfs = (nodes, lev = 1) => {
      if (!nodes) return false
      for (let node of nodes) {
        if (node.nodeName === 'LI' && lev === 2) {
          node.className += ' lev2'
        }
        if (node.nodeName === 'LI' && lev === 3) {
          node.className += ' lev3'
        }
        dfs(node.children, node.nodeName === 'UL' ? lev + 1 : lev)
      }
    }
    dfs(nodes.slice())
  }
}
</script>

<style>
  blockquote {
    color: #2c3e50;
    padding: 5px 15px;
    border-radius: 2px;
    border-left: 3px solid #ed4014;
    background: #ffffff;
  }
  blockquote code {
    font-weight: 700;
  }
  .lev2 a {
    font-weight: 600;
  }
  .lev3 a {
    padding-left: 1.7rem;
    color: #777;
    font-size: 0.9rem;
    font-weight: 400;
  }
  .lev3::before {
    content: '';
    display: block;
    width: 0.3rem;
    height: 0.3rem;
    background: #555;
    border-radius: 50%;
    transform: translate(1rem, 1.05rem);
  }
  .hidden {
    display: none;
  }
</style>
