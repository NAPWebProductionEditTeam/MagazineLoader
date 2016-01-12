/**
 * Module dependencies.
 */

var express = require('express'),
  cons = require('consolidate'),
  routes = require('./routes'),
  productactivity = require('./routes/productactivity'),
  sessioncount = require('./routes/sessioncount'),
  searchableproduct = require('./routes/searchableproduct'),
  searchableproductAvailability = require('./routes/searchableproduct-availability'),
  magazinePage = require('./routes/magazine-page'),
  immersiveview = require('./routes/immersiveView'),
  magazinecaption = require('./routes/magazinecaption'),
  basket = require('./routes/basket'),
  wishlist = require('./routes/wishlist'),
  status = require('./routes/status'),
  historyRedirect = require('./routes/history-redirect'),
  magazineContent = require('./routes/magazineContent'),
  advertContent = require('./routes/advertContent'),
  http = require('http'),
  path = require('path');



var setup = function(port, folder, log) {

    port = (typeof port === 'undefined') ? 3000 : port;
    folder = (typeof folder === 'undefined') ? '../nap' : folder;
    log = (typeof log === 'undefined') ? true : log;


    var app = express();
    app.configure(function() {
      app.set('port', process.env.PORT || 3000);
      app.set('views', __dirname + '/views');
      app.set('view engine', 'jade');
      app.use(express.favicon());
      app.use(express.logger('dev'));
      app.use(express.bodyParser());
      app.use(express.methodOverride());
      app.use(app.router);
      app.use(express.static(path.join(__dirname, folder)));
      app.use(express.static(path.join(__dirname, 'static')));
      app.use(express.static(path.join(__dirname, '../presentations')));

      // simple content redirect
      app.get('//1*',historyRedirect.index);

      // Fake AJAX call response
      app.get('/intl/magazineContent.nap',magazineContent.index);

      // Fake AJAX call response
      app.get('/test/advert',advertContent.index);

      //app.engine('mustache', cons.hogan);
      app.engine('mustache', require('hogan-express'));

      // set .html as the default extension 
      app.set('view engine', 'mustache');

    });

    app.configure('development', function() {
      app.use(express.errorHandler());
    });

    //app.get('/', routes.index);

    app.get('/magazine/page/:page', magazinePage.index);
    app.get('/webapi/feed/productactivity.json', productactivity.list);
    app.get('/webapi/feed/sessioncount/NAP.json', sessioncount.list);
    app.get('/intl/api/feed/searchableproduct/status/:pid.json', searchableproductAvailability.list);
    app.get('/webapi/feed/searchableproduct/:pid/m.json', searchableproduct.list);
    app.get('/webapi/immersiveView/list.json', immersiveview.list);
    app.get('/webapi/feed/magazinecaption/:pid.json', magazinecaption.list);
    app.get('/webapi/auth/status.json', status.list);
    app.get('/webapi/basket/addsku/:sku.json', basket.addSku);
    app.get('/webapi/wishlist/addsku/:sku.json', wishlist.addSku);
    http.createServer(app).listen(app.get('port'), function() {
      console.log("Express server listening on port " + app.get('port'));
    });
  };


setup(9090, 'public', true);

