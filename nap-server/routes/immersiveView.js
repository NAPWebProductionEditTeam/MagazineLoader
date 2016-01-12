/*
 * GET productactivity.
 */
var fs = require('fs');

var index = 0;
var contains = [314594, 321042, 32154, 323372];



exports.list = function(req, res) {

	function getData(pid) {
		var data = fs.readFileSync('data/pids/' + pid + '.json'),
			myObj;

		try {
			myObj = JSON.parse(data).immersive;
			console.dir(myObj);
		} catch (err) {
			console.log('There has been an error parsing your JSON.')
			console.log(err);
		}
		return myObj;
	}

	function getCustomList(list) {
		var data = fs.readFileSync('data/customlists.json'),
			myObj;

		try {
			myObj = JSON.parse(data)[list];
			console.dir(myObj);
		} catch (err) {
			console.log('There has been an error parsing your JSON.')
			console.log(err);
		}
		return myObj;
	}



	// check for the custom list!! 
	if (typeof req.query.products !== "undefined") {
		var pids = req.query.products.split(',');
		var list = [];
		for (var i = 0; i < pids.length; i++) {
			var pid = pids[i]
			list.push(getData(pid));
		}


		res.send({
			productList: list,
			selectedIndex: 0
		});
	} else if (typeof req.query.customLists !== "undefined") {
		var pids = getCustomList(req.query.customLists)
		var list = [];
		for (var i = 0; i < pids.length; i++) {
			var pid = pids[i]
			list.push(getData(pid));
		}


		res.send({
			productList: list,
			selectedIndex: 0
		});
	} else {
 
	}



	// var size = typeof req.query.size !== 'undefined' ? parseInt(req.query.size) : 10,
	// 	limit = index + parseInt(size),
	// 	data = productactivity.data,
	// 	tmp = [];
	// //console.log(index, limit)
	// for (var i = index; i < limit; i++) {
	// 	tmp.push(data[i])
	// }
	// index += 1 + Math.floor(Math.random() * size);
	// if (index >= data.length) {
	// 	index = 0;
	// }
	// res.send({
	// 	productactivity: tmp
	// });
};