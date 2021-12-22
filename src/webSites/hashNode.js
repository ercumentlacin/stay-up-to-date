const axios = require('axios');
const { linkFormatter } = require('../utils');

async function getHashNode(props = {}) {
  const { category = 'javascript', site = 'hashnode' } = props;
  const url = `  https://hashnode.com/n/ajax/${category}/content?type=hot&postType=story&limit=15`;
  const articles = [];

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
        link: linkFormatter(
          `${
            post.publication.domain ||
            `${post.publication.username}.hashnode.dev`
          }/${post.slug}`,
        ),
        date: new Date(post.dateAdded).toLocaleDateString('en-us'),
        site,
      })),
    );
  } catch (error) {
    console.log(error);
  }

  return articles;
}

module.exports = {
  getHashNode,
};
