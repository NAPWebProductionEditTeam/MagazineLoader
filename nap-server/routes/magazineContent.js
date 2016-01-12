
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.redirect('ajax_' + req.query["issueID"] + "_" + req.query["pageID"] + ".html")
};