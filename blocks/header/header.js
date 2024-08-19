import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import ShowSubMenu from '../../scripts/showSubMenu.js';
import HeaderScroll from '../../scripts/headerScroll.js';
import { getLanguagePath } from '../../scripts/common.js';

function buildTopSection(fragment, block) {
  // decorate headerTop
  const headerTop = document.createElement('div');
  headerTop.className = 'c-header-top';
  const headerTopSection = fragment.querySelectorAll('.section')[0];
  const headerTopTitle = document.createElement('p');
  headerTopTitle.textContent = headerTopSection.querySelector('p').textContent;
  headerTop.appendChild(headerTopTitle);

  const headerTopContent = document.createElement('div');
  headerTopContent.className = 'c-header-top__content';

  const headerTopClassName = ['language', 'contact', 'contact', 'search'];
  headerTopClassName.forEach((c, i) => {
    const headerTopContentItem = document.createElement('div');

    switch (c) {
      case 'language': {
        const languagesList = headerTopSection.querySelectorAll('div > ul > li > ul > li');
        languagesList.forEach((l) => {
          const languageItem = document.createElement('a');
          languageItem.classList.add('c-header-top__link');
          languageItem.href = l.querySelector('a').href;
          languageItem.textContent = l.textContent;
          headerTopContentItem.appendChild(languageItem);
        });
        break;
      }
      case 'search': {
        headerTopContentItem.appendChild(headerTopSection.querySelectorAll('div > ul > li')[i].firstElementChild);
        break;
      }
      default: {
        const contactItem = document.createElement('a');
        contactItem.className = 'c-header-top__link';
        const contactContent = headerTopSection.querySelectorAll('div > ul > li')[i].firstElementChild;
        contactItem.href = contactContent.href;
        const headerTopContentItemSpan = document.createElement('span');
        headerTopContentItemSpan.className = 'c-header-top__txt';
        headerTopContentItemSpan.textContent = contactContent.textContent;
        contactItem.appendChild(headerTopContentItemSpan);
        headerTopContentItem.appendChild(contactItem);
        break;
      }
    }
    headerTopContentItem.classList.add(`c-header-top__${c}`);
    headerTopContent.appendChild(headerTopContentItem);
  });
  headerTop.appendChild(headerTopContent);
  block.append(headerTop);
}

function buildNavSection(fragment, block) {
  const headerNav = document.createElement('nav');
  headerNav.className = 'c-header-subnav js-menu-action';
  const headerNavSection = fragment.querySelectorAll('.section')[1];
  // logo
  const logoSvg = headerNavSection.querySelector('img');
  const logoContainer = document.createElement('a');
  logoContainer.className = 'c-header-subnav__logo';
  logoContainer.appendChild(logoSvg);
  logoContainer.href = '/';
  headerNav.appendChild(logoContainer);
  // navigations
  const naviLists = headerNavSection.querySelectorAll('ul')[0];
  const navContainer = document.createElement('div');
  navContainer.className = 'c-header-subnav__items';
  naviLists.querySelectorAll('div > ul > li')
    .forEach((l) => {
      const menuItem = document.createElement('div');
      menuItem.className = 'c-header-subnav__item js-show-submenu';
      const menuLink = l.querySelector('li > a');
      menuLink.className = 'c-btn c-btn--no-style c-header-subnav__link';
      // fix link href
      if (menuLink.href !== '#') {
        menuLink.href = window.location.origin + getLanguagePath() + menuLink.href.replace('http://', '')
          .replace('/', '')
          .replace('https://', '')
          .replace('home', '');
      }
      menuItem.appendChild(menuLink);
      if (l.querySelector('li > ul') !== null) {
        // add subpages
        const submenuContainer = document.createElement('div');
        submenuContainer.className = 'c-header-subnav__submenu';
        l.querySelectorAll('li > ul > li > a')
          .forEach((sub) => {
            sub.className = 'c-header-subnav__sublink';
            submenuContainer.append(sub);
          });
        menuItem.appendChild(submenuContainer);
      }
      navContainer.appendChild(menuItem);
    });
  headerNav.append(navContainer);
  block.append(headerNav);
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  block.parentElement.className = 'c-header';
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : `${getLanguagePath()}nav`;
  const fragment = await loadFragment(navPath);
  // decorate nav DOM
  block.textContent = '';

  buildTopSection(fragment, block);
  buildNavSection(fragment, block);
  // add overlay of subpages
  const overlay = document.createElement('div');
  overlay.className = 'c-header-overlay';
  overlay.id = 'js-header-overlay';
  block.append(overlay);
  // eslint-disable-next-line no-unused-vars
  const showSub = new ShowSubMenu();
  // eslint-disable-next-line no-unused-vars
  const headerScroll = new HeaderScroll();
}
