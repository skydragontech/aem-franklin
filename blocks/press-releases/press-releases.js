import { getLanguagePath } from '../../scripts/common.js';
import {
  ffetch,
  createList,
  splitTags,
} from '../../scripts/lib-ffetch.js';
import {
  createOptimizedPicture,
  getMetadata,
  getOrigin,
  readBlockConfig,
  toClassName,
} from '../../scripts/aem.js';

const locale = getMetadata('locale');
const stopWords = ['a', 'an', 'the', 'and', 'to', 'for', 'i', 'of', 'on', 'into'];

function createPressReleaseFilterFunction(activeFilters) {
  return (pr) => {
    if (activeFilters.tags) {
      if (!toClassName(pr.tags)
        .includes(activeFilters.tags)) {
        return false;
      }
    }
    if (activeFilters.search) {
      const terms = activeFilters.search.toLowerCase()
        .split(' ')
        .map((e) => e.trim())
        .filter((e) => !!e);
      const text = pr.content.toLowerCase();
      if (!terms.every((term) => !stopWords.includes(term) && text.includes(term))) return false;
    }
    return true;
  };
}

function filterPressReleases(pressReleases, activeFilters) {
  return pressReleases.filter(createPressReleaseFilterFunction(activeFilters));
}

function createFilter(pressReleases, activeFilters, createDropdown, createFullText) {
  const tags = Array.from(new Set(pressReleases.flatMap((n) => n.filterTag)
    .sort()));
  const fullText = createFullText('search', activeFilters.search, 'type here to search');
  const tagFilter = createDropdown(tags, activeFilters.tags, 'tags', 'All', 'filter by tags');
  const tagSelection = tagFilter.querySelector('select');
  tagSelection.addEventListener('change', (e) => {
    e.target.form.submit();
  });
  return [
    fullText,
    tagFilter,
  ];
}

function getPressReleases(limit, filter) {
  const indexUrl = new URL(`${getLanguagePath()}press-releases.json`, getOrigin());
  let pressReleases = ffetch(indexUrl);
  if (filter) pressReleases = pressReleases.filter(filter);
  if (limit) pressReleases = pressReleases.limit(limit);
  return pressReleases.all();
}

function buildPressReleaseArticle(entry) {
  const {
    path,
    image,
    title,
    description,
    publishDate,
  } = entry;
  const card = document.createElement('a');
  card.href = path;
  const picture = createOptimizedPicture(image, title, false, [{ width: '365' }]);
  picture.className = 'c-spotlight__img';
  const pictureTag = picture.outerHTML;
  const date = new Date((publishDate * 1000) + (new Date().getTimezoneOffset() * 60000));
  card.innerHTML = `
           
            ${pictureTag}
            <div class="c-spotlight__content">
                <span class="c-spotlight__date">${date.toLocaleDateString(locale)}</span>
                <div class="c-spotlight__top">
                  <h3 class="c-spotlight__title">
                    <span><a href="${path}">${title}</a></span>
                  </h3>
                  <p class="c-spotlight__text">${description}</p>
                </div>
                <div class="c-spotlight__bottom">
                    <span class="c-link">
                      <svg width="18" height="21" viewBox="0 0 18 21" fill="none"
                           xmlns="http://www.w3.org/2000/svg">
                            <path class="fill" fill-rule="evenodd" clip-rule="evenodd"
                                d="M7.33031 0.969727L17.2109 10.8503L7.33007 20.7221L6.26989 19.661L15.0891 10.8498L6.26965 2.03039L7.33031 0.969727ZM0 11.6046H11.7593L4.51607 18.8272L3.45693 17.765L8.13067 13.1046H0V11.6046ZM0 8.61257V10.1126L11.7763 10.1126L4.51607 2.87299L3.45693 3.93516L8.14769 8.61257L0 8.61257Z"
                                fill="black"></path>
                        </svg>
                    </span>
                </div>
            </div>
`;
  return card;
}

function createPressReleaseList(block, pressReleases, {
  filter = filterPressReleases,
  filterFactory = createFilter,
  articleFactory = buildPressReleaseArticle,
  limit,
}) {
  // eslint-disable-next-line no-param-reassign
  pressReleases = pressReleases.map((pr) => ({
    ...pr,
    filterTag: splitTags(pr.tags),
  }));
  createList(pressReleases, filter, filterFactory, articleFactory, limit, block);
}

function createFeaturedPressReleaseList(block, pressReleases) {
  createPressReleaseList(block, pressReleases, {
    filter: null,
    filterFactory: null,
  });
}

function createLatestPressReleases(block, pressReleases) {
  createPressReleaseList(block, pressReleases, { filterFactory: null });
}

export default async function decorate(block) {
  const isFeatured = block.classList.contains('featured');
  const isLatest = !isFeatured && block.classList.contains('latest');

  if (isFeatured) {
    const links = [...block.firstElementChild.querySelectorAll('a')]
      .map(({ href }) => (href ? new URL(href).pathname : null))
      .filter((pathname) => !!pathname);
    const pressReleases = await getPressReleases(
      links.length,
      ({ path }) => links.indexOf(path) >= 0,
    );
    createFeaturedPressReleaseList(block, pressReleases);
    return;
  }

  if (isLatest) {
    const cfg = readBlockConfig(block, false);
    const filter = cfg.tags && createPressReleaseFilterFunction({ tags: toClassName(cfg.tags) });
    const pressReleases = await getPressReleases(3, filter);
    createLatestPressReleases(block, pressReleases);
  } else {
    const pressReleases = await getPressReleases();
    createPressReleaseList(block, pressReleases, { limit: 8 });
  }
}
