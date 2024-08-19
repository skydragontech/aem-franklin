// eslint-disable-next-line import/named
import { createOptimizedPicture, fetchPlaceholders, transform } from '../../scripts/aem.js';

export default async function decorate(block) {
  const placeholders = await fetchPlaceholders();
  const { transportSolutions } = placeholders;
  const h3 = block.querySelectorAll('h3');
  const picture = block.querySelectorAll('picture');
  // eslint-disable-next-line no-use-before-define
  const widthStyle = `u-${transform(1, h3.length)}`;

  const activitiesContainer = document.createElement('div');
  activitiesContainer.className = 'u-global-margin u-padding-vertical--lg u-padding-vertical--lg@phablet u-background--darker c-structured-activities';
  const titleH2 = document.createElement('h2');
  titleH2.className = 'c-structured-activities__title h2-like--chevron-bottom--white';
  titleH2.textContent = transportSolutions;
  activitiesContainer.appendChild(titleH2);
  const activitiesContent = document.createElement('div');
  activitiesContent.className = 'o-grid o-grid--no-margin c-activity__margin';

  h3.forEach((item, index) => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'c-activity';
    itemDiv.classList.add(widthStyle);

    const linkA = document.createElement('a');
    linkA.href = '/';
    linkA.className = 'c-activity__content';
    itemDiv.appendChild(linkA);

    const overlay = document.createElement('div');
    overlay.className = 'c-activity__overlay';
    linkA.appendChild(overlay);

    const h3Item = document.createElement('h3');
    h3Item.className = 'c-activity__title';
    h3Item.textContent = item.textContent;
    linkA.appendChild(h3Item);

    const imgContent = picture[index].querySelector('img');
    const imgItem = createOptimizedPicture(imgContent.src, imgContent.alt, false, [{ width: `${1920 / h3.width}` }]);
    imgItem.querySelector('img')
      .classList
      .add('c-activity__img');
    linkA.appendChild(imgItem.querySelector('img'));
    activitiesContent.appendChild(itemDiv);
  });
  activitiesContainer.appendChild(activitiesContent);
  block.replaceChildren(activitiesContainer);
}
