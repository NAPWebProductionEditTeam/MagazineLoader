/*
 * GET productactivity.
 */

var productactivity = require('../data/searchableproduct.js')
var index = 0;

exports.list = function(req, res) {

	var pid = typeof req.params.pid !== 'undefined' ? req.params.pid : 'default',
		data = productactivity.data,
		tmp = data[pid];
		res.send(tmp);
};

/*
 * GET productactivity.
 */
var fs = require('fs');





exports.list = function(req, res) {
	var pid = typeof req.params.pid !== 'undefined' ? req.params.pid : 'default';
	function getData(pid) {
		var data = fs.readFileSync('data/pids/' + pid + '.json'),
			myObj;

		try {
			myObj = JSON.parse(data).product;
			console.dir(myObj);
		} catch (err) {
			console.log('There has been an error parsing your JSON.')
			console.log(err);
		}
		return myObj;
	}


	var product = getData(pid);
	if(pid != 177426){
		var tmp = {productAvailability:{
			status:product.response,
			availability: product.response,
			event: product.searchableProductInfo.eventId,
			visible: true,
			associatedLiveEvent: null
			}
		}
	}else{
		var tmp = {}
	}	

	res.send(tmp);

	

};