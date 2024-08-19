import { readBlockConfig, fetchPlaceholders } from '../../scripts/aem.js';

export default async function decorate(block) {
  const placeholders = await fetchPlaceholders();
  const { keyFigures } = placeholders;

  const cfg = readBlockConfig(block, true);
  const keyfiguresContainer = document.createElement('div');
  keyfiguresContainer.className = 'c-structured-keyfigures';
  keyfiguresContainer.style.textAlign = 'center';

  const titleH2 = document.createElement('h2');
  titleH2.classList.add('h2-like--chevron-bottom');
  titleH2.textContent = keyFigures;
  keyfiguresContainer.appendChild(titleH2);
  const keyContent = document.createElement('div');
  keyContent.className = 'c-keyfigure u-global-margin';

  // eslint-disable-next-line guard-for-in,no-restricted-syntax
  for (const item in cfg) {
    const ketItem = document.createElement('div');
    ketItem.className = 'c-keyfigure__item';
    const spanKey = document.createElement('span');
    spanKey.textContent = item;
    ketItem.appendChild(spanKey);
    const spanValue = document.createElement('span');
    spanValue.className = 'c-keyfigure__number';
    spanValue.textContent = cfg[item];
    ketItem.appendChild(spanValue);

    keyContent.appendChild(ketItem);
  }
  keyfiguresContainer.appendChild(keyContent);

  // find button
  const btn = document.createElement('div');
  btn.className = 'u-align--center u-margin-top--sm';
  const btnLink = document.createElement('a');
  btnLink.className = 'c-btn c-btn--icon-arrow';
  btnLink.href = '/';
  btnLink.textContent = ' Find more > ';
  btn.appendChild(btnLink);
  keyfiguresContainer.appendChild(btn);
  block.textContent = '';
  block.append(keyfiguresContainer);
}
