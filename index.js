const TelegramBot = require('node-telegram-bot-api');
const {Client} = require('steem-rpc');
const request = require('superagent');
const _ = require('underscore');

const token = '250070713:AAGgsvIwc1ysnONUyR3qIKSFbz9VtrTuCn8';
const options = {};

// Setup polling way
const bot = new TelegramBot(token, {polling: true});
const api = Client.get(options, true);

// Jared stuff

bot.onText(/recommend(ed|ing|ed|ation|ations|)/, function(msg, match) {
  let chatId = msg.chat.id;
  let n = msg.text.indexOf("@");
  let user = msg.text.substr(n + 1, msg.text.length - 1);
  user = user.split(/\?| |,|\./)[0].trim();
  console.log(user);
  bot.sendMessage(chatId, 'Let me search in my files. Wait a minute, bro!').then(function(sended) {
      api.initPromise.then(response => {
        api.database_api().exec("get_recommended_for", [user, 5]).then(response => {
          bot.sendMessage(chatId, 'Hey! Good news, I\'ve found this: ').then(function() {
            response.forEach((post) => {
              bot.sendMessage(chatId, `https://www.steemit.com${post.url}`);
            });
          });
        })
      });
  });
});

bot.onText(/accounts|steemers|steemians|users/, function (msg, match) {
  let chatId = msg.chat.id;
  api.initPromise.then(response => {
    api.database_api().exec("get_account_count", []).then(response => {
      let msg = `This is easy! The current number of ${match} is ${response} and growing! \u{1F4C8}`;
      bot.sendMessage(chatId, msg);
    })
  });
});


bot.onText(/trending|trends/, function (msg, match) {
  let chatId = msg.chat.id;
  bot.sendMessage(chatId, '\u{1F680} Steemit is rocking, bro. Let me show you what\'s happening, just give me a minute!').then(function(sended) {
    api.initPromise.then(response => {
      api.database_api().exec("get_discussions_by_trending", [{tag: '', limit: 5, filter_tags: []}]).then(response => {
        response.forEach((post) => {
          bot.sendMessage(chatId, `https://www.steemit.com${post.url}`);
        });
      })
    });
  });
});

bot.onText(/price/, function (msg, match) {
  let chatId = msg.chat.id;
  request
    .get('https://api.coinmarketcap.com/v1/ticker/steem/')
    .end(function(err, res){
      if (!err && res.statusCode == 200) {
        let msg = `Dude, I think you're rich \u{1F4B8} The current Steem price in US$ is ${res.body[0].price_usd}`;
        console.log(res.body);
        bot.sendMessage(chatId, msg);
      }
    });
});

bot.onText(/feeling/, function (msg, match) {
  let chatId = msg.chat.id;

  let message = `I'm so excited about Steemit!`;
  var photo = __dirname + '/img/giphy.gif';
  bot.sendVideo(chatId, photo, {caption: message});
});
