const express = require('express');

const app = express();
const port = process.env.PORT || 8080;
const path = require('path');

app.use(express.static('public'));
app.use(express.static('css'));
app.use('/static', express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/react', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/react.html'));
});

app.get('/css', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/css.html'));
});

app.get('/javascript', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/javascript.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
