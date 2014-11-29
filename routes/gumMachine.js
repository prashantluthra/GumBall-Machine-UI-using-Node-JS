/**
 * New node file
 */

exports.addNewMachine = function(req, res){
	res.render('addNewMachine', {page_title:"GumBall Machine"});
}

exports.updateMachineDetails = function(req,res){
	var id = req.params.id;
	var input = JSON.parse(JSON.stringify(req.body));
	var state = input.state;
	var activity = input.activity;
	
	var data = {
			id : id,
			serialNo : input.serialNo,
			modelNo : input.modelNo,
			count : input.count
	}
	console.log(data);
	if(activity=="Insert Quarter"){
		if(state=="No Coin"){
			res.render('getMachineDetails', {result:data, id:id, state:'Has Coin', Notify:'Coin Inserted'});
		}
		else
			res.render('getMachineDetails', {result:data, id:id, state:state, Notify:'Coin already Inserted'});
	}
	else{
		if(state=="No Coin"){
			res.render('getMachineDetails', {result:data,id:id, state:state, Notify:'There is no coin. Please insert Coin'})
		}
		else if(state=="Has Coin"){
			if(input.count > 0){
				var dataNew = {
						serialNo : input.serialNo,
						modelNo : input.modelNo,
						count : input.count-1
				}
				var restClient = require('restler');
				restClient.putJson('http://grailsgumballlabpart2.cfapps.io/GumMachines/'+id, dataNew).on('complete', function(data, response) {
					res.render('getMachineDetails', {result:dataNew, id:id, state:'No Coin', Notify:'Enjoy your gumball'});
				});
			}
			else {
				res.render('getMachineDetails', {result:data, id : id, state:state, Notify:'No Gumballs in Machine'});
			}
			
		}
	}

}


exports.listMachines = function(req,res){
	var restClient = require('restler');
	restClient.get('http://grailsgumballlabpart2.cfapps.io/GumMachines').on('complete', function(result) {
		  if (result instanceof Error) {
		    console.log('Error:', result.message);
		    this.retry(5000); // try again after 5 sec
		  } else {
			  console.log(result);
			  res.render('listMachines', {result:result});
		  }
		});
}

exports.getMachineDetails = function(req,res){
	var id = req.params.id;
	var restClient = require('restler');
	restClient.get('http://grailsgumballlabpart2.cfapps.io/GumMachines/'+id).on('complete', function(result) {
		  if (result instanceof Error) {
		    console.log('Error:', result.message);
		    this.retry(5000); // try again after 5 sec
		  } else {
			  console.log(result);
			  res.render('getMachineDetails', {result:result, id: id, state:'No Coin', Notify:'Please Insert Coin'});
		  }
		});
}

exports.saveNewMachine = function(req,res){
	var input = JSON.parse(JSON.stringify(req.body));
	var data = {
			serialNo : input.serialNo,
			modelNo : input.modelNo,
			count : input.count
	}
	console.log(data);
	var restClient = require('restler');
	
	restClient.post('http://grailsgumballlabpart2.cfapps.io/GumMachines', {
		  data: data,
		}).on('complete', function(data, response) {
			restClient.get('http://grailsgumballlabpart2.cfapps.io/GumMachines').on('complete', function(result) {
				  if (result instanceof Error) {
				    console.log('Error:', result.message);
				    this.retry(5000); // try again after 5 sec
				  } else {
					  console.log(result);
					  res.render('listMachines', {result:result});
				  }
				});
		});

}



exports.deleteMachine = function(req,res){
	var id = req.params.id;
	var restClient = require('restler');
	rest.del('http://grailsgumballlabpart2.cfapps.io/GumMachines/'+id).on('complete', function(result) {
		  if (result instanceof Error) {
		    console.log('Error:', result.message);
		    this.retry(5000); // try again after 5 sec
		  } else {
			  console.log(result);
			  res.render('listMachines');
		  }
		});
}
