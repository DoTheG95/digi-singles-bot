const axios = require("axios");
const cheerio = require("cheerio");

const URL = "https://getthosemons.co.nz/collections/just-re-stocked?filter.p.vendor=Digimon+Card+Game&sort_by=created-descending";

module.exports = async function (seenUrls = new Set()) {
  try {
    const res = await axios.get(URL);
    const $ = cheerio.load(res.data);

    const items = [];

    // Loop through all product links
    $(".card__heading a").each((i, el) => {
      const name = $(el).text().trim();
      const link = "https://getthosemons.co.nz" + $(el).attr("href");

      // If this item has been seen before, stop iterating
      if (seenUrls.has(link)) {
        return false; // break out of .each()
      }

      items.push({ name, url: link });
    });

    return items; // only new items
  } catch (err) {
    console.error("Error fetching GetThoseMons:", err.message);
    return [];
  }
};