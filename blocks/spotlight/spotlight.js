export default function decorate(block) {
  const spotlightWapper = document.createElement('a');
  spotlightWapper.classList.add('c-spotlight__wrapper');
  [...block.children].forEach((row) => {
    const divTemp = document.createElement('div');
    while (row.firstElementChild) divTemp.append(row.firstElementChild);
    [...divTemp.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'c-spotlight__img';
      } else {
        div.className = 'c-spotlight__content';
      }
      spotlightWapper.append(div);
    });
  });
  //
  // block.querySelectorAll('img')
  //   .forEach((img) => img.closest('picture')
  //     .replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.textContent = '';
  block.append(spotlightWapper);
}
