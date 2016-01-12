/*
 * GET productactivity.
 */

var productactivity = require('../data/productactivity.js')
var index = 0;

exports.list = function(req, res) {

	var size = typeof req.query.size !== 'undefined' ? parseInt(req.query.size) : 10,
		limit = index + parseInt(size),
		data = productactivity.data,
		tmp = [];
	//console.log(index, limit)
	for (var i = index; i < limit; i++) {
		tmp.push(data[i])
	}
	index += 1 + Math.floor(Math.random() * size);


	if (index >= data.length) {
		index = 0;
	}
	res.send({
		productactivity: tmp
	});
};