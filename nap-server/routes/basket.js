/*
 * http://confluence.net-a-porter.com/display/java/Web+API+calls#WebAPIcalls-AddToBasket
 */


exports.addSku = function(req, res) {
	results = {
		added: {
			message: "Product added to basket",
			result: "PRODUCT_ADDED"
		},
		nosize: {
			message: "Please specify a size",
			result: "SIZE_NOT_SPECIFIED"
		},
		nospace: {
			message: "There is no space in your basket for this item",
			result: "NO_SPACE_IN_BASKET"
		},
		soldout: {
			message: "This size is sold out",
			result: "SIZE_SOLD_OUT"
		},
		doesntexist: {
			message: "Product doesn't exist",
			result: "PRODUCT_DOESNT_EXIST"
		}
	}
	var selected = results['added'];
	var sku = req.params.sku
	res.send({
		"message": selected.message, "result": selected.result, "sku": sku
	});
};