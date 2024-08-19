import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  const bannerContainer = document.createElement('div');
  bannerContainer.className = 'c-banner';
  const picture = createOptimizedPicture(block.querySelector('img').src, 'banner', true, [{ width: '1920' }]);
  picture.querySelector('img')
    .classList
    .add('c-banner__img');
  bannerContainer.append(picture);

  // overlay
  const overlay = document.createElement('div');
  overlay.className = 'c-banner__overlay';
  bannerContainer.append(overlay);

  const bannerContent = document.createElement('div');
  bannerContent.className = 'c-banner__content u-global-margin-fluid';
  // title
  if (block.querySelector('h1') || block.querySelector('p')) {
    const title = document.createElement('h1');
    title.className = 'c-banner__title';
    title.textContent = (block.querySelector('h1') ? block.querySelector('h1') : block.querySelector('p')).textContent;
    bannerContent.append(title);
  }
  // button
  const link = block.querySelector('a');
  if (link) {
    link.className = 'c-banner__btn c-btn c-btn--secondary';
    bannerContent.append(link);
  }
  bannerContainer.append(bannerContent);
  block.textContent = '';
  block.append(bannerContainer);
}
