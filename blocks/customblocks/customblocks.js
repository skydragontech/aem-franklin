import { createOptimizedPicture, transform } from '../../scripts/aem.js';

export default function decorate(block) {
  const h2 = block.querySelectorAll('h2');
  const picture = block.querySelectorAll('picture');
  const p = block.querySelectorAll('p');
  const widthStyle = `u-${transform(1, h2.length)}`;

  const blocksContainer = document.createElement('div');
  blocksContainer.className = 'u-global-margin u-padding-vertical--xl u-padding-vertical--md@phablet';

  const grid = document.createElement('div');
  grid.className = 'o-grid';
  h2.forEach((item, index) => {
    const itemContainer = document.createElement('div');
    itemContainer.className = 'c-block-img';
    itemContainer.classList.add(widthStyle);

    const link = document.createElement('a');
    link.className = 'c-block-img__wrapper';
    link.href = item.querySelector('a').href;

    const overlay = document.createElement('div');
    overlay.className = 'c-block-img__overlay';
    link.appendChild(overlay);

    const top = document.createElement('div');
    top.className = 'c-block-img__top';

    const imgContent = picture[index].querySelector('img');
    const topImg = createOptimizedPicture(imgContent.src, imgContent.alt, false, [{ width: `${1920 / h2.width}` }]);
    topImg.querySelector('img').classList.add('c-block-img__img');

    top.appendChild(topImg.querySelector('img'));
    item.classList.add('c-block-img__title');
    const spanTitle = document.createElement('span');
    spanTitle.textContent = item.querySelector('a').textContent;
    item.replaceChildren(spanTitle);
    top.appendChild(item);
    link.appendChild(top);

    const content = document.createElement('div');
    content.className = 'c-block-img__content';
    const contentBottom = document.createElement('div');
    contentBottom.className = 'c-block-img__bottom';
    const pContent = p[index];
    pContent.classList.add('c-block-img__text');
    contentBottom.appendChild(pContent);
    const span = document.createElement('span');
    span.className = 'c-link c-link--white';
    contentBottom.appendChild(span);
    content.appendChild(contentBottom);
    link.appendChild(content);

    itemContainer.appendChild(link);
    grid.appendChild(itemContainer);
  });

  blocksContainer.appendChild(grid);
  block.replaceChildren(blocksContainer);
}
