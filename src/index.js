const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

async function getSmashingMagazine(props) {
  const { page, category, site = 'smashingmagazine' } = props;

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
      site,
    });
  });
  return articles;
}

async function getCssTrick(props) {
  const { page, category, site = 'css-tricks' } = props;

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
      site,
    });
  });
  return articles;
}

async function getHashNode(props = {}) {
  const { category = 'javascript', site = 'hashnode' } = props;
  const url = `  https://hashnode.com/n/ajax/${category}/content?type=hot&postType=story&limit=15`;
  const articles = [];
  const date_option = {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  try {
    const { data } = await axios({
      headers: {
        accept: '*/*',
        'accept-language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
        'sec-ch-ua':
          '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'sec-gpc': '1',
      },
      referrer: 'https://hashnode.com/n/javascript',
      referrerPolicy: 'strict-origin-when-cross-origin',
      body: null,
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      url,
    });

    articles.push(
      ...data.posts.map((post) => ({
        title: post.title,
        link: `${
          post.publication.domain || post.publication.username + 'hashnode.dev'
        }/${post.slug}`,
        date: new Date(post.dateAdded).toLocaleDateString('en-us', date_option),
        site,
      }))
    );
  } catch (error) {
    console.log(error);
  }

  return articles;
}

async function getDevTo(props = {}) {
  const { category = 'javascript', site = 'devto' } = props;
  const url = `https://dev.to/search/feed_content?per_page=15&page=0&tag=${category}t&sort_by=published_at&sort_direction=desc&tag_names%5B%5D=${category}t&approved=&class_name=Article`;
  const articles = [];
  const date_option = {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  try {
    const { data } = await axios({
      headers: {
        accept: 'application/json',
        'accept-language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
        'content-type': 'application/json',
        'sec-ch-ua':
          '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'sec-gpc': '1',
        'x-csrf-token':
          '26xLGQoBNWb4nSUYeCLENwdmzkj89nA4NnAfJJQU0JK+tmh4t9CrcRGdibw5VDouLQBooIg4iqIHJYKQcqMG/A==',
      },
      referrer: 'https://dev.to/t/react/latest',
      referrerPolicy: 'strict-origin-when-cross-origin',
      body: null,
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      url,
    });

    articles.push(
      ...data.result.map((post) => ({
        title: post.title,
        link: `https://dev.to${post.path}`,
        date: new Date(post.published_at_int).toLocaleDateString(
          'en-us',
          date_option
        ),
        site,
      }))
    );
  } catch (error) {
    console.log(error);
  }

  return articles;
}

const pipe = [getSmashingMagazine, getCssTrick, getHashNode, getDevTo];

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
    data: _articles,
    category,
    site,
  };
}

getArticles({ page: 1, category: 'css' }).then(({ data, category }) => {
  fs.writeFileSync(
    `./public/json/${category}.json`,
    JSON.stringify(data, null, 2)
  );
});
