const axios = require("axios");
const cheerio = require("cheerio");

const URL = "https://vaultofthecards.com.au/collections/digimon-singles?filter.v.price.gte=&filter.v.price.lte=&sort_by=created-descending";

module.exports = async function () {

  const res = await axios.get(URL);
  const $ = cheerio.load(res.data);

  const items = [];

  $(".card__heading a").each((i, el) => {

    const name = $(el).text().trim();
    const link = "https://vaultofthecards.com.au" + $(el).attr("href");

    items.push({
      name,
      url: link
    });

  });

  return items;
};