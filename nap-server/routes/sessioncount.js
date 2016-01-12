/*
 * GET productactivity.
 */


var count = 10000 + Math.floor(Math.random()*25000);

exports.list = function(req, res) {
	
	count += 400 - Math.floor(Math.random()*800);
	count = Math.max(300,count)

	res.send({
		sessioncount: count
	});
};