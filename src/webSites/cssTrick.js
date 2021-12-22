const axios = require('axios');
const cheerio = require('cheerio');
const { dateFormater, linkFormatter } = require('../utils');

async function getCssTrick(props = {}) {
  const { page, category } = props;
  const articles = [];

  const host = `https://css-tricks.com/tag/${category}/`;
  const url = !!page && page > 1 ? `${host}/page/${page}/` : host;

  try {
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);

    $('.article-card.article').each((i, el) => {
      const $el = $(el);
      const title = $el.find('h2').text().trim();
      const link = $el.find('h2 a').attr('href');
      const date = $el.find('time').text().trim();

      const dateFormated = dateFormater(
        date.split(', ').length > 2
          ? date.split(', ').slice(0, 2).join(', ')
          : date,
      );

      articles.push({
        title,
        link: linkFormatter(link),
        date: dateFormated === 'Invalid Date' ? date : dateFormated,
        site: 'css-tricks',
      });
    });
  } catch (error) {
    return articles;
  }

  return articles;
}

module.exports = {
  getCssTrick,
};
