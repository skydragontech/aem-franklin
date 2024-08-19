export default class {
  constructor() {
    const defaults = {
      selector: document.querySelectorAll('.js-show-submenu'),
      breakPt: 768,
    };

    this.settings = defaults;
    this.init();
  }

  init() {
    const {
      selector,
      breakPt,
    } = this.settings;
    if (!selector) return;

    [...selector].forEach((elem) => {
      const mainBlock = [...document.getElementsByTagName('main')];
      mainBlock.forEach((block) => {
        block.addEventListener('click', () => {
          elem.classList.remove('open');
        });
      });

      elem.addEventListener('mouseover', (e) => {
        if (window.innerWidth > breakPt) {
          this.toggleSubmenu(e, elem);
        }
      });

      elem.addEventListener('click', (e) => {
        if (window.innerWidth > breakPt) {
          const btnEl = elem.getElementsByTagName('button')[0];

          if (e.target === btnEl) {
            window.location.href = btnEl.getAttribute('data-url');
          }
        } else {
          if (!e.target.classList.contains('c-header-subnav__sublink')) {
            e.preventDefault();
          }
          if (e.target.classList.contains('c-no-after')) {
            window.location.href = e.target.href;
            e.preventDefault();
          }
          this.toggleSubmenu(e, elem);
        }
      });
    });
  }

  toggleSubmenu(e, el) {
    const { selector } = this.settings;
    if (!selector) return;

    // const burgerMenuButton = document.querySelector('.js-show-mobile-menu');
    const overlay = document.getElementById('js-header-overlay');

    [...selector].forEach((elem) => {
      elem.classList.remove('open');
    });

    // burgerMenuButton.addEventListener('click', () => {
    //   el.classList.remove('open');
    // });
    overlay.addEventListener('click', () => {
      el.classList.remove('open');
    });

    if (el.classList.contains('open') || e.target.classList.contains('js-subnav-return')) {
      el.classList.remove('open');
    } else {
      el.classList.add('open');
    }
  }
}
