const TelegramBot = require('node-telegram-bot-api');
const {Client} = require('steem-rpc');
const request = require('superagent');
const _ = require('underscore');


const token = '250070713:AAGgsvIwc1ysnONUyR3qIKSFbz9VtrTuCn8';
const options = {};

// Setup polling way
const bot = new TelegramBot(token, {polling: true});
const api = Client.get(options, true);

// Matches /price
bot.onText(/\/price/, function (msg, match) {
  let chatId = msg.chat.id;
  request
    .get('https://api.coinmarketcap.com/v1/ticker/steem/')
    .end(function(err, res){
      if (!err && res.statusCode == 200) {
        let msg = `The current Steem price in US$ is ${res.body[0].price_usd}`;
        console.log(res.body);
        bot.sendMessage(chatId, msg);
      }
    });
});

// Matches /price
bot.onText(/\/get_account(.+)/, function (msg, match) {
  let chatId = msg.chat.id;
  let params = match[1].split(' ');
  api.initPromise.then(response => {
    api.database_api().exec("get_dynamic_global_properties", []).then(response => { 
      bot.sendMessage(chatId, response);
      console.log("get_dynamic_global_properties", response);
    })
  });
});
