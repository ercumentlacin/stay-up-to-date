const { pipe } = require('../webSites');

async function getArticles(props = {}) {
  const { page = '', category = 'react', _articles = [], site } = props;

  for (const cb of pipe) {
    const articles = await cb({ page, category, site });
    _articles.push(...articles);
  }

  if (page < 5 || page === '' || page === 1) {
    return getArticles({
      page: (page || 1) + 1,
      category,
      _articles,
      site,
    });
  }

  return {
    data: _articles.sort((a, b) => new Date(b.date) - new Date(a.date)),
    category,
    site,
  };
}

module.exports = {
  getArticles,
};
