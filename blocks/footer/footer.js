import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { getLanguagePath } from '../../scripts/common.js';

function buildFooter(footerContent, section, footerUlElement) {
  switch (footerContent.getAttribute('data-position')) {
    case 'first': {
      // deal logo
      const footerLogo = footerContent.querySelector('div > p > a');
      if (footerLogo) {
        const footerLogoContainer = document.createElement('div');
        footerLogoContainer.id = 'block-marquedusite';
        footerLogoContainer.append(footerLogo);
        section.append(footerLogoContainer);
      }
      footerUlElement.className = 'u-list';
      section.append(footerUlElement);
      footerUlElement.classList.add('c-footer__link');
      const footerPElement = footerContent.querySelector('div > p:last-child');
      if (footerPElement) {
        const footerSlogan = document.createElement('div');
        footerSlogan.className = 'c-footer__slogan';
        footerSlogan.textContent = footerPElement.textContent;
        section.append(footerSlogan);
      }
      break;
    }
    case 'last': {
      footerUlElement.className = 'u-list';
      section.append(footerUlElement);
      footerUlElement.classList.add('c-footer__social-icons');
      section.classList.add('last-item');
      const footerIconsUl = section.querySelectorAll('ul > li');
      footerIconsUl.forEach((liElement) => {
        liElement.querySelector('span').className = '';
        liElement.querySelector('img').className = 'icon';
        const separator = document.createElement('i');
        separator.className = 'separator';
        liElement.append(separator);
      });
      // add contact and other buttons
      const footerCopyright = document.createElement('div');
      footerCopyright.className = 'c-footer__copyright c-contact-btn';
      const titles = footerContent.querySelectorAll('p');
      const links = footerContent.querySelectorAll('p > a');
      const icons = footerContent.querySelectorAll('p > a > span > img');
      links.forEach((link, i) => {
        link.textContent = titles[i].textContent;
        link.append(icons[i]);
        footerCopyright.append(link);
      });
      section.querySelector('ul')
        .after(footerCopyright);
      break;
    }
    default: {
      footerUlElement.className = 'u-list';
      section.append(footerUlElement);
      footerUlElement.classList.add('c-footer__link');
      break;
    }
  }
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : `${getLanguagePath()}footer`;
  const fragment = await loadFragment(footerPath);
  // render the country choose block
  block.textContent = '';
  block.append(fragment.querySelector('.choosecountry-container'));
  // decorate footer DOM
  const footerContainer = document.createElement('div');
  footerContainer.className = 'c-footer u-global-margin';
  [...fragment.querySelectorAll('.section')].forEach((section) => {
    const footerContent = section.cloneNode(true);
    section.className = 'c-footer__content';
    section.textContent = '';
    const footerUlElement = footerContent.querySelector('div > ul');
    if (footerUlElement) {
      buildFooter(footerContent, section, footerUlElement);
      footerContainer.append(section);
    }
  });
  block.append(footerContainer);
}
