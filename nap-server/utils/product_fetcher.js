var request = require('request');
var fs = require('fs');
var list = [314594, 321042, 32154, 323372];
var list =[198103,198116,310110,312144,312550,314191,315339,315284,316944,319417,322107,318849,323151, 310250,198698,198388,181604,194227,318312, 105685,169525,169531,177426,178084,179587,180338,181282,181632,183305,183866,187535,190507,190641,190675,191348,192159,192235,192857,193521,193745,197358,313101,189948,198264,310518,310536,314583, 310694,310839,312482,314015,325734,195348,310858,178424,194227,98548,195209, 189468,194849,196126,198395,313423,313851,314025,314748,314949,317974,317978,318444,322972,324666]

function makeProduct(pid){
	console.log(pid);
	request('http://www.net-a-porter.com/webapi/feed/searchableproduct/' + pid + '/m.json', function(error, response, body) {
		//var product = JSON.parse(body);
		
		var product = JSON.parse(body);

		//if (!error && response.statusCode == 200) {
		//console.log(product) // Print the google web page.
		//}
		request('http://www.net-a-porter.com/webapi/immersiveView/list.json?products=' + pid, function(error, response, body) {
			//var immersive = JSON.parse(body).productList[0];
			//console.log(JSON.parse(body).productList[0]);
			var immersive = JSON.parse(body).productList[0];
			console.log(immersive)

			var data = JSON.stringify({
				product: product,
				immersive: immersive
			});
			console.log('pid: ', pid)
			fs.writeFile('../data/pids/' + pid + '.json', data, function(err) {
				if (err) {
					console.log('There has been an error saving your configuration data.');
					console.log(err.message);
					return;
				}
				console.log('Configuration saved successfully.')
			});

		})
	})
}



for (var i = 0; i < list.length; i++) {

	var pid = list[i];
	makeProduct(pid);
	
}