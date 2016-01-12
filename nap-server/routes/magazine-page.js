 var _ = require('underscore');

 exports.index = function(req, res) {
 	
 	var currentPage = req.params.page
 	console.log('magazine',currentPage)
 	var topMenu = [{
 		title: 'You Should Wear This',
 		index: 1,
 		classes: ''
 	}, {
 		title: 'The Clothes I Woke Up In',
 		index: 2,
 		classes: ''
 	}, {
 		title: 'Why Tea Stains',
 		index: 3,
 		classes: ''
 	}];
 	topMenu[currentPage - 1].classes += 'current';



 	res.locals = {
 		pageTitle: topMenu[currentPage - 1].title,
 		topMenu: topMenu
 	};

 	res.render("magazine/index", {
 		partials: {
 			header: "magazine/header",
 			footer: "magazine/footer",
 			content: "magazine/pages/page" + currentPage
 		}
 	});
 };