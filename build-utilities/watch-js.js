// Required libraries
var UglifyJS = require("uglify-js");
var fs = require('fs');
var watchr = require('watchr');
var nopt = require("nopt");

// Collect params passed from loadJSWatch in mag.sh
var knownOpts = { "dir" : [String, null], "file" :[String, Array]};
var collectedFiles = nopt(knownOpts,process.argv)

// loop through and build new array
var javaScriptSource = new Array();
for (var i = 0; i < collectedFiles.file.length; i++) {
    javaScriptSource[i] = "../" +collectedFiles.dir + collectedFiles.file[i]+".js";
}


console.log('Watching JS files for changes');
console.log('-----------------------------');


// using watchr to check for files changing
watchr.watch({paths:javaScriptSource,
	    listeners: {
        change: function(changeType,filePath,fileCurrentStat,filePreviousStat){
			var minFile ="../" +collectedFiles.dir + "magazineLoader.js";
            var result =[];
            for (var i = 0; i < collectedFiles.file.length; i++) {
                result.push(UglifyJS.minify(javaScriptSource[i]).code);
            }
            var mergedFile = result.join("");
           	fs.writeFile(minFile, mergedFile, function(err) {
	    		if(err) {
	        		console.log(err);
	    		} else {
	        		console.log("Updated: " + minFile);
	    		}
			}); 
        }
        
    },
    next: function(err,watchers){
        // Close watchers after 60 seconds
        // turned off for now
        /*
        setTimeout(function(){
            var i;
            for ( i=0;  i<watchers.length; i++ ) {
                watchers[i].close();
            }
        },60*1000);
        */
    }
});
