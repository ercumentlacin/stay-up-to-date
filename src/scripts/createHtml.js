const fs = require('fs');
const path = require('path');

const createHtml = () => {
  fs.readdir(path.join(__dirname, '../public/json'), (err, files) => {
    files?.forEach((file) => {
      const category = file.split('.')[0];
      const _articles = JSON.parse(
        fs.readFileSync(path.join(__dirname, `../public/json/${file}`)),
      );
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
        path.join(__dirname, `../public/${category}.html`),
        `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
          <title>${category}</title>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/css/bootstrap.min.css" />
        </head>
        <body>
          <div class="container">
            <div class="row">
              ${articles.join('')}
            </div>
          </div>
        </body>
      </html>`,
      );
    });
  });
};

module.exports = {
  createHtml,
};
