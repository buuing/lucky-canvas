const menuButton = document.querySelector('.menu-button')
const siteNav = document.querySelector('.site-nav')

menuButton.addEventListener('click', () => {
  const isOpen = siteNav.classList.toggle('is-open')
  menuButton.setAttribute('aria-expanded', String(isOpen))
})

document.querySelector('#current-year').textContent = new Date().getFullYear()
