const { Client, GatewayIntentBits } = require("discord.js");
const cron = require("node-cron");
const fs = require("fs");

const cherry = require("./stores/cherry");
const grandj = require("./stores/grandj");
const vault = require("./stores/vault");
const getthosemons = require("./stores/getthosemons");

const TOKEN = "MTQ4NjMxNzI5MzIxNzY0ODczMQ.G4xeU3.1DfX6vedRPBWmFsuC4chdx2JIWPKPM7f93BRUI";
const CHANNEL_ID = "1486321481292976228";

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

let seen = new Set();

if (fs.existsSync("seen.json")) {
  seen = new Set(JSON.parse(fs.readFileSync("seen.json")));
}

function saveSeen() {
  fs.writeFileSync("seen.json", JSON.stringify([...seen]));
}

async function checkStores(channel) {
  const stores = [
    await cherry(),
    await grandj(),
    await vault(),
    await getthosemons()
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

client.once("ready", async () => {
  const channel = await client.channels.fetch(CHANNEL_ID);

  console.log("Bot running");

  cron.schedule("*/3 * * * *", () => {
    checkStores(channel);
  });

  checkStores(channel);
});

client.login(TOKEN);