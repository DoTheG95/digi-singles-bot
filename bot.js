const { Client, GatewayIntentBits } = require("discord.js");
const cron = require("node-cron");
const fs = require("fs");

const cherry = require("./stores/cherry");
const grandj = require("./stores/grandj");
const vault = require("./stores/vault");
const getthosemons = require("./stores/getthosemons");

const TOKEN = "MTQ4NjMxNzI5MzIxNzY0ODczMQ.GMpj6Q.QPTD9YHtrTS8oCWg4n_AhNuE7vd4E6c3unMt8I";
const CHANNEL_ID = "1486321482895327234";

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// Load seen items safely
let seen = new Set();
if (fs.existsSync("seen.json")) {
  try {
    const data = fs.readFileSync("seen.json", "utf8");
    if (data.trim()) seen = new Set(JSON.parse(data));
  } catch (err) {
    console.log("seen.json invalid, starting fresh");
    seen = new Set();
  }
}

function saveSeen() {
  fs.writeFileSync("seen.json", JSON.stringify([...seen], null, 2));
}

// Function to check all stores
async function checkStores(channel) {
  const stores = [
    await cherry(seen),
    await grandj(seen),
    await vault(seen),
    await getthosemons(seen)
  ];

  const products = stores.flat();

  for (const item of products) {
    if (!seen.has(item.url)) {
      if (seen.size > 0) {
        await channel.send(
          `🆕 **New Digimon Single**\n${item.name}\n${item.url}`
        );
      }
      seen.add(item.url);
    }
  }

  saveSeen();
}

client.once("clientReady", async () => {
  const channel = await client.channels.fetch(CHANNEL_ID);
  console.log("Bot running");

  // Run every 3 minutes
  cron.schedule("*/3 * * * *", () => {
    checkStores(channel);
  });

  // Run immediately
  checkStores(channel);
});

client.login(TOKEN);