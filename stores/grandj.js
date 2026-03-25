const axios = require("axios");
const cheerio = require("cheerio");

const URL = "https://grandjgames.com/tcgs/digimon/digimon-singles/?sort=newest&limit=16&mode=4";

module.exports = async function () {

  const res = await axios.get(URL);
  const $ = cheerio.load(res.data);

  const items = [];

  $(".card__heading a").each((i, el) => {

    const name = $(el).text().trim();
    const link = "https://grandjgames.com" + $(el).attr("href");

    items.push({
      name,
      url: link
    });

  });

  return items;
};