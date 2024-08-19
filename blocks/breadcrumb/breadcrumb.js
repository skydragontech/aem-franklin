import { createElement, getLanguagePath } from '../../scripts/common.js';
import { getOrigin } from '../../scripts/aem.js';

const svgHome = `<svg width="18px" version="1.1" id="Calque_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 24 24"
     style="enable-background:new 0 0 24 24;" xml:space="preserve">
<path d="M12,2L4,8v12h6v-7h4v7h6V8L12,2z M19,19h-4v-7H9v7H5V8.5l7-5.2l7,5.2V19L19,19z"/>
</svg>`;

const svgSeparator = `<svg width="6" height="16" viewBox="0 0 6 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 15.445L4.98171 7.99085L1 0.536674" stroke="black" stroke-width="1.5"></path>
</svg>
`;
export default function decorate(block) {
  const breadContainer = createElement('div', { classes: 'c-structured-content__prehead' });
  breadContainer.appendChild(createElement('div', { classes: 'c-breadcrumb' }));

  const breadcrumbItems = createElement('ul', { classes: ['c-breadcrumb', 'u-list'] });
  const breadcrumbList = (window.location.href).replace(getLanguagePath(), '')
    .replace(getOrigin(), '')
    .split('/');
  const breadcrumbHome = createElement('li', { classes: 'c-breadcrumb__item' });
  const linkHome = createElement('a', { props: { href: '/' } });
  const iconHome = createElement('span', { classes: 'c-breadcrumb__homeicon' });
  iconHome.innerHTML = svgHome;
  const separator = createElement('span', { classes: 'c-breadcrumb__separator' });
  separator.innerHTML = svgSeparator;
  linkHome.append(iconHome);
  breadcrumbHome.append(linkHome);
  breadcrumbHome.append(separator);
  breadcrumbItems.append(breadcrumbHome);
  breadcrumbList.forEach((breadcrumb, index) => {
    const item = createElement('li', { classes: 'c-breadcrumb__item' });
    if (index !== breadcrumbList.length - 1) {
      const itemLink = createElement('a', { props: { href: `${getLanguagePath()}${breadcrumb}` } });
      itemLink.append(createElement('span', { textContent: `${breadcrumb}` }));
      item.append(itemLink);
      const spanSeparator = createElement('span', { classes: 'c-breadcrumb__separator' });
      spanSeparator.innerHTML = svgSeparator;
      item.append(spanSeparator);
    } else {
      item.textContent = breadcrumb;
    }
    breadcrumbItems.append(item);
  });
  breadContainer.querySelector('.c-breadcrumb').append(breadcrumbItems);

  // add share list
  const iconsList = block.querySelectorAll('a');
  const shareListContainer = createElement('div', { classes: 'c-structured-content__share' });
  shareListContainer.append(createElement('span', { classes: 'c-structured-content__text', textContent: 'Share ' }));
  iconsList.forEach((icon) => {
    const itemLink = createElement('a', { classes: ['c-structured-content__link', 'js-share-button'] });
    itemLink.href = icon.href + window.location.href;
    const itemIcon = createElement('i', { classes: `icon-std-${icon.querySelector('img').getAttribute('data-icon-name')}` });
    itemLink.append(itemIcon);
    shareListContainer.append(itemLink);
  });
  breadContainer.append(shareListContainer);
  block.textContent = '';
  block.append(breadContainer);
}
