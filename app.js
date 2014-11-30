
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , gumMachine = require('./routes/gumMachine');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//app.get('/', routes.index);
//app.get('/users', user.list);
app.get('/', gumMachine.addNewMachine);
app.post('/saveNewMachine', gumMachine.saveNewMachine);
app.get('/listMachines', gumMachine.listMachines);
app.get('/getMachineDetails/:id', gumMachine.getMachineDetails);
app.post('/getMachineDetails/:id', gumMachine.updateMachineDetails);
app.get('deleteMachine/:id', gumMachine.deleteMachine);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

/*app.use(app.router);
var nodePort = process.env.OPENSHIFT_NODEJS_PORT || 3000;
var nodeAddress =  process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
app.listen(nodePort, nodeAddress);*/
