export default class {
  constructor() {
    const defaults = {
      selector: document.querySelectorAll('.home-page'),
    };
    this.settings = defaults;
    this.init();
  }

  init() {
    const { selector } = this.settings;
    let position = document.documentElement.scrollTop;

    window.addEventListener('scroll', () => {
      const scrollPosition = window.scrollY;
      const scrollPositionIE = window.pageYOffset;
      const divCountry = [...document.querySelectorAll('.js-country-position')];
      const menu = [...document.querySelectorAll('.c-header')];

      if (selector[0]) {
        divCountry.forEach((elem) => {
          if (scrollPosition > elem.offsetTop || scrollPositionIE > elem.offsetTop) {
            selector[0].classList.add('home-page-header__active');
          } else {
            selector[0].classList.remove('home-page-header__active');
          }
        });
      }

      menu.forEach((elem) => {
        const lastScroll = document.documentElement.scrollTop || window.pageYOffset;

        if (lastScroll > position && lastScroll > 400 && !elem.classList.contains('menuMobileOpen')) {
          elem.classList.add('c-header__active');
        } else {
          elem.classList.remove('c-header__active');
        }

        position = lastScroll;
      });
    });
  }
}
