import './styles.css'
import { createFooter } from './components/footer.js'
import { createHeader } from './components/header.js'

document.querySelector('#site-header').innerHTML = createHeader()
document.querySelector('#site-footer').innerHTML = createFooter()

const menuButton = document.querySelector('.menu-button')
const siteNav = document.querySelector('.site-nav')

menuButton.addEventListener('click', () => {
  const isOpen = siteNav.classList.toggle('is-open')
  menuButton.setAttribute('aria-expanded', String(isOpen))
})
