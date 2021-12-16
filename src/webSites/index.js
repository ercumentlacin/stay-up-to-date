const { getSmashingMagazine } = require('./smashingMagazine');
const { getCssTrick } = require('./cssTrick');
const { getHashNode } = require('./hashNode');
const { getDevTo } = require('./devTo');

const pipe = [getSmashingMagazine, getCssTrick, getHashNode, getDevTo];

module.exports = {
  pipe,
};
