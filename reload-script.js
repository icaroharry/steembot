var cron = require('cron');

var job = new cron.CronJob('* * * * *', function() {
    console.log('Function executed!');
}, null, true);
