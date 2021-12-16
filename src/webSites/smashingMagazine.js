const axios = require('axios');
const cheerio = require('cheerio');

async function getSmashingMagazine(props) {
  const { page, category, site = 'smashingmagazine' } = props;
  const articles = [];

  const _category = category === 'node' ? 'node.js' : category;

  const host = `https://www.smashingmagazine.com/category/${_category}/`;
  const url = !!page && page > 1 ? `${host}/page/${page}/` : host;

  try {
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);

    $('.article--post').each((i, el) => {
      const $el = $(el);
      const title = $el.find('.article--post__title.h1').text().trim();
      const link = $el.find('.article--post__title.h1 a').attr('href');
      const reading_time = $el
        .find('.article--post__reading-time')
        .text()
        .trim();
      const date = $el.find('.article--post__time').attr('datetime');

      articles.push({
        title,
        link: `www.smashingmagazine.com${link}`,
        reading_time,
        date: new Date(date).toLocaleDateString('en-us'),
        site,
      });
    });
  } catch (error) {
    console.log(error);
  }

  return articles;
}

module.exports = {
  getSmashingMagazine,
};
