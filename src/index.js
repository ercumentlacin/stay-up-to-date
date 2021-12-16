const fs = require('fs');
const path = require('path');
const { getArticles, createHtml } = require('./scripts');

// , 'vue', 'node', 'graphql', 'typescript'
const categorys = ['react', 'css', 'javascript', 'node'];

let countOfHtml = 0;

categorys.forEach((categoryName) => {
  getArticles({ page: 1, category: categoryName }).then(
    ({ data, category }) => {
      fs.writeFileSync(
        path.join(__dirname, `../public/json/${category}.json`),
        JSON.stringify(data, null, 2),
      );
      countOfHtml += 1;
      if (countOfHtml === categorys.length) {
        createHtml();
        console.log('done');
      }
    },
  );
});
