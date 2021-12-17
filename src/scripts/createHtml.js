const fs = require('fs');
const path = require('path');

const createHtml = () =>
  // eslint-disable-next-line implicit-arrow-linebreak
  fs.readdir(path.join(__dirname, '../../public/json'), (err, files) => {
    files?.forEach((file) => {
      const category = file.split('.')[0];
      const _articles = JSON.parse(
        fs.readFileSync(path.join(__dirname, `../../public/json/${file}`)),
      );

      const paginators = [];
      const articlePage = [];
      const articlesPerPage = 5;
      const pages = Math.ceil(_articles.length / articlesPerPage);

      for (let i = 0; i < pages; i += 1) {
        paginators.push(i + 1);
      }

      for (let i = 0; i < articlesPerPage; i += 1) {
        articlePage.push(_articles[i]);
      }

      const articles = _articles.map((article) => {
        const { title, link, date, site } = article;

        return `
        <div class="article-card article">
          <h2 class="article-card-title">
            <a href="${link}" target='_blank'>${title}</a>
          </h2>
          <div class="article-card-meta">
            <span class="article-card-date">${date}</span>
            <span class="article-card-site">${site}</span>
          </div>
        </div>
      `;
      });
      fs.writeFileSync(
        path.join(__dirname, `../../public/${category}.html`),
        `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
          <title>${category}</title>
          <link rel="stylesheet" href="/css/style.css" />
        </head>
        <body>
          <div class="container">
            <div class="row">
              <nav>
                <ul>
                  <li>
                    <a href="/">home</a>
                  </li>
                  <li>
                    <a href="/css.html">css</a>
                  </li>
                  <li>
                    <a href="/react.html">react</a>
                  </li>
                  <li>
                  <a href="/node.html">node</a>
                  </li>
                  <li>
                    <a href="/javascript.html">javascript</a>
                  </li>
                </ul>
              </nav>
            </div>

            <div class="row">
              ${articles.join('')}
            </div>

            <footer>
            
            </footer>

          </div>

          <script src="/js/app.js"></script>
          
        </body>
      </html>`,
      );
    });
  });

module.exports = {
  createHtml,
};
