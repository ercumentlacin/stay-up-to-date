const axios = require('axios');

async function getDevTo(props = {}) {
  const { category = 'javascript', site = 'devto' } = props;
  const url = `https://dev.to/search/feed_content?per_page=15&page=0&tag=${category}t&sort_by=published_at&sort_direction=desc&tag_names%5B%5D=${category}t&approved=&class_name=Article`;
  const articles = [];

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
        date: new Date(post.published_at_int).toLocaleDateString('en-us'),
        site,
      })),
    );
  } catch (error) {
    console.log(error);
  }

  return articles;
}
module.exports = {
  getDevTo,
};
