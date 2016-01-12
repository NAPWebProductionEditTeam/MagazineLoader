/*
 * http://confluence.net-a-porter.com/display/java/Web+API+calls#WebAPIcalls-AddToBasket
 */


exports.addSku = function(req, res) {
	results = {
		notSignedIn: {
			message: "You must be signed in to view your wishlist",
			result: "USER_NOT_SIGNED_IN"
		},
		alreadyInWishlist: {
			message: "This product is already in your wishlist",
			result: "PRODUCT_ALREADY_IN_WISHLIST"
		},
		productAdded: {
			message: "Product has been added to your wishlist",
			result: "PRODUCT_ADDED"
		},
		default: {
			message: "Unfortunately, this product could not be added to your wishlist",
			result: "PRODUCT_NOT_ADDED"
		}
	}
	var selected = results['notSignedIn'];
	var sku = req.params.sku
	res.send({
		"message": selected.message, "result": selected.result, "sku": sku
	});
};