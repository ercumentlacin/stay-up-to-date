const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

async function getSmashingMagazine({ page, category }) {
  const host = `https://www.smashingmagazine.com/category/${category}/`;
  const url = !!page && page > 1 ? `${host}/page/${page}/` : host;

  const { data: html } = await axios.get(url);
  const $ = cheerio.load(html);
  const articles = [];

  $('.article--post').each((i, el) => {
    const $el = $(el);
    const title = $el.find('.article--post__title.h1').text().trim();
    const link = $el.find('.article--post__title.h1 a').attr('href');
    const reading_time = $el.find('.article--post__reading-time').text().trim();
    const date = $el.find('.article--post__time').attr('datetime');

    articles.push({
      title,
      link,
      reading_time,
      date,
    });
  });
  return articles;
}
async function getCssTrick({ page, category }) {
  const host = `https://css-tricks.com/tag/${category}/`;
  const url = !!page && page > 1 ? `${host}/page/${page}/` : host;

  const { data: html } = await axios.get(url);
  const $ = cheerio.load(html);
  const articles = [];

  $('.article-card.article').each((i, el) => {
    const $el = $(el);
    const title = $el.find('h2').text().trim();
    const link = $el.find('h2 a').attr('href');
    const date = $el.find('time').text().trim();

    articles.push({
      title,
      link,
      date,
    });
  });
  return articles;
}

async function getArticles({
  page = '',
  category = 'react',
  _articles = [],
  site,
} = {}) {
  const articles = await getCssTrick({ page, category });

  _articles.push(...articles);

  if (page < 5 || page === '' || page === 1) {
    return getArticles({
      page: (page || 1) + 1,
      category,
      _articles,
      site,
    });
  }
  return {
    data: _articles,
    category,
    site,
  };
}

getArticles({ page: 1, category: 'react', site: 'css-tricks' }).then(
  ({ data, category, site }) => {
    fs.writeFileSync(
      `./public/articles/${site}/${category}.json`,
      JSON.stringify(data, null, 2)
    );
    console.log('done');
    console.log(`./public/articles/${site}/${category}.json`);
  }
);
