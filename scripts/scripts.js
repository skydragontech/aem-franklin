import {
  sampleRUM,
  buildBlock,
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForLCP,
  loadBlocks,
  loadCSS,
  getMetadata,
} from './aem.js';
import { createElement } from './common.js';

const LCP_BLOCKS = []; // add your LCP blocks to the list

/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
 */
// eslint-disable-next-line no-unused-vars
function buildHeroBlock(main) {
  const h1 = main.querySelector('h1');
  const picture = main.querySelector('picture');
  // eslint-disable-next-line no-bitwise
  if (h1 && picture && (h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING)) {
    const section = document.createElement('div');
    section.append(buildBlock('hero', { elems: [picture, h1] }));
    main.prepend(section);
  }
}

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

// eslint-disable-next-line no-unused-vars
function buildPressReleases(main) {
  const template = getMetadata('template');

  function buildContactSection(contentSection) {
    const contact = createElement('div', { classes: 'u-1/3' });
    const contactSticky = createElement('div', { classes: 'c-structured-content__sticky' });
    const buttons = createElement('div', { classes: 'c-structured-content__buttons' });
    const downloadLink = createElement('a', {
      classes: ['content-download-svg', 'c-btn', 'c-btn--dark', 'c-download'],
      props: { href: '#' },
      textContent: 'Download press kit',
    });
    downloadLink.append(createElement('br'));
    downloadLink.innerHTML = `${downloadLink.innerHTML}  FR - EN - ES - DE - IT`;
    buttons.append(downloadLink);
    buttons.append(createElement('a', {
      classes: 'c-btn',
      props: {
        href: '#',
        ref: 'nofollow',
      },
      textContent: 'Subscribe to our press releases',
    }));
    contactSticky.append(buttons);

    const wrapper = createElement('div', { classes: 'c-structured-content__wrapper' });
    wrapper.append(createElement('p', {
      classes: ['h2-like', 'h2-like--small'],
      textContent: 'Press contact',
    }));
    const supportCfg = createElement('p', { classes: 'c-structured-content__contact' });
    supportCfg.append(createElement('span', {
      classes: 'c-structured-content__author',
      textContent: 'Severyne Molard',
    }));
    supportCfg.append(createElement('span'));
    supportCfg.innerHTML = `Phone : ${contentSection.getAttribute('data-phone')} <br> E-mail : ${contentSection.getAttribute('data-e-mail')}`;

    wrapper.append(supportCfg);
    contactSticky.append(wrapper);
    contact.append(contactSticky);
    return contact;
  }

  // replace all the content
  function buildPressContent(contentSection) {
    const contentContainerGlob = createElement('div', { classes: 'u-global-margin' });
    const contentContainer = createElement('div', { classes: ['c-structured-content', 'o-grid'] });
    contentContainerGlob.append(contentContainer);

    // build content header
    const header = createElement('div', { classes: 'c-structured-content__head' });
    const date = createElement('p', {
      classes: 'c-structured-content__date',
      textContent: getMetadata('publishdata'),
    });
    header.append(date);

    const title = createElement('h1', { classes: 'c-structured-content__title' });
    title.append(contentSection.querySelector('h1'));
    header.append(title);

    const tags = createElement('p', { classes: 'c-structured-content__tags' });
    const tagList = getMetadata('article:tag')
      .split(',');
    [...tagList].forEach((tag) => {
      const tagLink = createElement('a', {
        classes: 'c-structured-content__tags__link',
        props: { href: '#' },
        textContent: tag,
      });
      tags.append(tagLink);
    });
    header.append(tags);

    contentContainer.append(header);

    // render content
    const content = createElement('div', { classes: ['c-structured-content__content', 'u-4/6'] });
    const contentData = contentSection.cloneNode(true);
    // contentData.removeChild(contentData.querySelector('h1'));
    content.append(contentData.querySelector('.default-content-wrapper'));
    // render contact block
    const contact = buildContactSection(contentSection);
    contentContainer.append(content);
    contentContainer.append(contact);
    contentSection.replaceChildren(contentContainerGlob);
  }

  // auto build press releases
  if (template) {
    switch (template) {
      case 'Press releases': {
        let contentSection;
        main.querySelectorAll('.section')
          .forEach((pre) => {
            if (pre.classList.length === 1) {
              contentSection = pre;
            }
          });
        if (contentSection) {
          buildPressContent(contentSection);
        }
        break;
      }
      default:
        break;
    }
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
// eslint-disable-next-line
function buildAutoBlocks(main) {
  try {
    // buildHeroBlock(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

function buildArticles(main) {
  try {
    buildPressReleases(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Articles failed', error);
  }
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    main.id = 'content';
    decorateMain(main);
    // if homepage
    if (window.location.href.split('/')
      .pop() === '') {
      document.body.classList.add('appear');
      document.body.classList.add('home-page');
      document.body.classList.add('node--type-homepage');
    } else {
      document.body.classList.add('path-node');
    }
    // render articles
    buildArticles(main);
    await waitForLCP(LCP_BLOCKS);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadBlocks(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();

  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
