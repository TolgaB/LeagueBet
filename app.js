var Client = require('coinbase').Client;

var client = new Client({'apiKey': 'xskFxylIUOOS53RF',
                         'apiSecret': 'gQObKBi2WH7NSaU6z3b0S4TLdJCzjrQW',});

client.getAccount('primary', function(err, primary) {
  primary.sendMoney({'to': 'kevinfang28@gmail.com',
                     'amount': '0.1',
                     'currency': 'BTC'}, function(err, tx) {
    console.log(tx);
  });
});
