#!/bin/bash
appName="NAP HTML Magazine"
appVersion="2.0"
logFile="build-utilities/log.txt"

# Where the file is being run from 
localDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Sass projects to be complied
sassDir='sassFrameworks/'
sassFile[0]='gridAndStyleGuide'
sassFile[1]='magazineFramework'

# JS files in the build
jsDir='magazine-frontend/_framework/js/'
jsLoader='magazineLoader'
jsFiles[0]='magazineInit'
jsFiles[1]='browserDetection'
jsFiles[2]='magazineInteractiveLibrary'
jsFiles[3]='magazinePageAttachment'
jsFiles[4]='magazineAnalytics'
jsFiles[5]='magazineProductInteractions'
jsFiles[6]='magazinePageLoader'
jsFiles[7]='magazineAnimationEngine'
jsFiles[8]='magazineJavaScriptEngine'
jsFiles[9]='magazineBuilder'
jsFiles[10]='animationLibraries/CSS3-Engine'


# FUNCTIONS

# Collect user params
function collectParam {
while test $# -gt 0
do
  case $1 in
  # User options
    -c | --compile)
		case $2 in
			JS | js)
				bootUp-compile-js
				break
	      		;;
      		SASS | sass)
				bootUp-compile-sass
				break
	      		;;
	      	*)
				bootUp-compile
				break
	      		;;
		esac
		break
      ;; 
    -h | --help)
    	bootUp-help
    	break
      ;;
    -i | --install)
    	bootUp-install
    	break
      ;;
     -l | --logs)
		case $2 in
			r | read)
				readLogs Read
				break
	      		;;
      		c | clear)
				clearLogs
				break
	      		;;
	      	*)
				bootUp-logsMenu
				break
	      		;;
		esac
		break
      ;; 
    -s | --server)
		bootUp-server
		break
      ;;
    -u | --utilities)
		bootUp-utilities
		break
      ;;
    -v | --version)
		echo ${appName} 
		echo Version: ${appVersion}
		break
      ;;
    -w | --watch)
		case $2 in
			JS | js)
				bootUp-watch-js
				break
	      		;;
      		SASS | sass)
				bootUp-watch-sass
				break
	      		;;
	      	*)
				bootUp-watch
				break
	      		;;
		esac
		break
      ;;  
  # ...

  # Special cases
    *)
		bootUp-help
    	break
    	;;
    -?)
		echo Unknown parameter please use --help for more information
    	break
  esac

done
}

# Compile Sass files
function callCompass {
	compassActivity=$1
	echo 
	echo ${compassActivity} SASS files
	echo ------------------
	

	if [[ -z "$2" ]]
	userSelection=$2
	then
		sassProjectDir[0]="${sassFile[0]}"
		sassProjectDir[1]="${sassFile[1]}"
	else
		if [$userSelection == 1]
		then
			sassProjectDir[0]="${sassFile[0]}"
		else
			if [$userSelection == 2]
			then
				sassProjectDir[0]="${sassFile[1]}"
			fi
		fi
	fi

	cd "${sassDir}"
	for sassConfig in "${sassProjectDir[@]}"
		do
			echo 
  			echo ${compassActivity}: "${sassConfig}"
  			writeLog ${compassActivity} "${sassConfig}"
  			echo 
  			cd "${sassConfig}/"
  			compass ${compassActivity}
  			cd ../
	done
	cd "${localDIR}"
	echo 
}

# Uglify JS script files
function callUglifyScripts {
	echo Uglify JS
	echo ---------
	files=()
	for jsFile in "${jsFiles[@]}"
		do
			echo 
  			writeLog Uglify "${jsFile}"
  			files+= echo "${jsDir}""${jsFile}".js
	done
	echo
	echo Build: "${jsDir}""${jsLoader}".js
	node_modules/uglify-js/bin/uglifyjs -o "${jsDir}""${jsLoader}".js "${jsDir}""${jsFiles[0]}".js "${jsDir}""${jsFiles[1]}".js "${jsDir}""${jsFiles[2]}".js "${jsDir}""${jsFiles[3]}".js "${jsDir}""${jsFiles[4]}".js "${jsDir}""${jsFiles[5]}".js "${jsDir}""${jsFiles[6]}".js "${jsDir}""${jsFiles[7]}".js "${jsDir}""${jsFiles[8]}".js "${jsDir}""${jsFiles[9]}".js "${jsDir}""${jsFiles[10]}".js
}

# Create symlinks for the server
function setUpServer {
	echo -----------------------
	echo Setting up NAP server
	echo -----------------------
	echo 
	echo Framework assets symlink
	echo ------------------------
	echo 
  	echo nap-server/static/alfresco/nap/webAssets/magazine/_framework: symlink to: magazine-frontend/_framework
  	writeLog "symlink" "nap-server/static/alfresco/nap/webAssets/magazine/_framework: to: magazine-frontend/_framework"
  	cd "${localDIR}"/nap-server/static/alfresco/nap/webAssets/magazine
	ln -s "${localDIR}"/magazine-frontend/_framework/ _framework
	cd "${localDIR}"
	echo 

	echo Shared assets symlink
	echo ----------------------
	echo 
  	echo nap-server/static/alfresco/nap/webAssets/magazine/shared: symlink to: magazine-frontend/shared
  	writeLog "symlink" "nap-server/static/alfresco/nap/webAssets/magazine/shared: to: magazine-frontend/shared"
  	cd "${localDIR}"/nap-server/static/alfresco/nap/webAssets/magazine
	ln -s "${localDIR}"/magazine-frontend/_shared/ _shared
	cd "${localDIR}"
	echo 
	
	echo Issue assets symlink
	echo --------------------
	echo 
  	echo nap-server/static/alfresco/nap/webAssets/magazine/issues/: symlink to: magazine-frontend/demo-magazine/issues
  	writeLog "symlink" "nap-server/static/alfresco/nap/webAssets/magazine/issues/: to: magazine-frontend/demo-magazine/issues"
  	cd "${localDIR}"/nap-server/static/alfresco/nap/webAssets/magazine
	ln -s "${localDIR}"/magazine-frontend/demo-magazine/assets/issues/ issues
	cd "${localDIR}"
	echo 

	echo Magazine content symlin
	echo ------------------------
	echo 
  	echo nap-server/public: symlink to: magazine-frontend/demo-magazine/pages
  	writeLog "symlink" "nap-server/public: to: magazine-frontend/demo-magazine/pages"
  	cd "${localDIR}"/nap-server
	ln -s "${localDIR}"/magazine-frontend/demo-magazine/pages/ public
	cd "${localDIR}"
	echo 

}

# Load node app that watchs JS
function loadJSWatch {
	echo
	cd build-utilities
	node watch-js.js -dir "${jsDir}" -file ${jsFiles[0]} -file ${jsFiles[1]} -file ${jsFiles[2]} -file ${jsFiles[3]} -file ${jsFiles[4]} -file ${jsFiles[5]} -file ${jsFiles[6]} -file ${jsFiles[7]} -file ${jsFiles[8]} -file ${jsFiles[9]}  -file ${jsFiles[10]}
}

# write to log file
function writeLog {
	logDate=$(date +"%m-%d-%Y")" : "$(date +"%T")
	message=$1
	file=$2
	echo ${logDate} - ${message}: ${file} >> ${localDIR}/${logFile} 
}

# clear log file 
function clearLogs {
	setUpLog
	readLogs Clear
}



# USER MENUS AND SERVICES

function setUpLog {
	echo  NAP magazine logs > ${localDIR}/${logFile} 
	echo  ----------------- >> ${localDIR}/${logFile} 
	echo  >> ${localDIR}/${logFile} 
}

# NPM install dependencies
function setupDependencies {
	clear
	echo -----------------------
	echo Setting up NAP magazine
	echo -----------------------
	echo 
	echo Set up dependencies
	echo -------------------
	writeLog "dependencies" "Run NPM install"
	npm install
    sudo gem install compass
	echo 
}

# set up of magazine complete
function setUpComplete {
	echo -----------------------
	echo Setup complete
	echo -----------------------
	echo
	echo What you like to launch the magazine express server? {y/n}:	
	read startServer
	if [ $startServer == y ]
	then
		bootUp-server
	fi
}

# start server
function startServer {
	clear
	echo -----------------------
	echo Starting NAP server
	echo -----------------------
	cd nap-server
	node app.js
	python -mwebbrowser http://localhost:3000
}

# help menu
function helpMenu {
	clear
	echo -----------------------
	echo Help
	echo -----------------------
	echo
	echo "usage: magazine  [--compile <fileType>] [--help] [--install] [--logs <read/clear>] [--server] [--utilities] [--version] [--watch <fileType>]"
	echo -e ' \t\t' "[-c <fileType>] [-h] [-i] [-l <r/c>] [--s] [-u] [-v] [-w <f>]"
	echo
	echo Commands explained
	echo -----------------------
	echo
	echo -e "compile\t\t compile files, you can pass through the file type JS or SASS or load a menu by passing neither."
	echo -e "help\t\t Loads the file you looking at now."
	echo -e "install\t\t Run when the magazine is checked out, sets up application for local use."
	echo -e "logs\t\t Read logs generated by compressing SASS and uglifing JS."
	echo -e "server\t\t Start up node express server."
	echo -e "utilities\t Utilities menu."
	echo -e "version\t\t App version."
	echo -e "watch\t\t Watch files for changes, you can pass through the file type JS or SASS or load a menu by passing neither."
}

# Watch functions available
function watchMenu {
	clear
	echo -----------------------
	echo Watch files
	echo -----------------------
	echo Which scripts do you want to monitor for changes.
	echo 1. JS
	echo 2. SASS
	read watchSelect

	if [ $watchSelect -eq 1 ]
	then
		bootUp-watch-js
	else
		bootUp-watch-sass
	fi
}

# Load Utilities menu 
function loadUtilities {
	clear
	echo -----------------------
	echo Utilities
	echo -----------------------
	echo 1. Compile files
	echo 2. Watch files
	echo 3. Launch express server
	echo 4. Logs
	read selectUtility
	case $selectUtility in
		1)
			bootUp-compile
			break
	      	;; 
	    2)
			bootUp-watch
			break
	      	;; 
	    3)
			bootUp-server
			break
	      	;;  
	    4)
			bootUp-logsMenu
			break
	      	;;   
	esac
}

# Watch functions available
function compileMenu {
	clear
	echo -----------------------
	echo Compile files
	echo -----------------------
	echo Which scripts do you want to compile.
	echo 1. JS
	echo 2. SASS
	read compileSelect

	if [ $compileSelect -eq 1 ]
	then
		bootUp-compile-js
	else
		bootUp-compile-sass
	fi
}

# Load Utilities menu 
function logsMenu {
	clear
	echo -----------------------
	echo Logs
	echo -----------------------
	echo 1. Read logs
	echo 2. Clear logs
	read selectLogs
	case $selectLogs in
		1)
			readLogs Read
			break
  			;; 
	    2)
			clearLogs
			break
	      	;;   
	esac
}

# function to read log file
function readLogs {
	log=${localDIR}/${logFile} 
	clear
	echo $1 logs
	echo -----------------------
	echo
	echo "*** File - $log contents ***"
	echo
	cat $log
}

# Load compass watch
function loadSASSWatch {
	clear
	echo -----------------------
	echo Watch SASS project
	echo -----------------------
	echo Which SASS project do you want to monitor for changes.
	echo "1. gridAndStyleGuide (Grid and magazine content styles)"
	echo "2. magazineFramework (Magazine application styles)"
	read watchSelect

	if [ $watchSelect -eq 1 ]
	then
		callCompass watch 1
	else
		callCompass watch 2
	fi
}



# DIFFERENT BOOT UP FUNCTIONS

# Default load sequence
function bootUp-install {
	setUpLog
	setupDependencies
	callCompass compile
	callUglifyScripts
	setUpServer
	setUpComplete
}

# Default load utilities
function bootUp-utilities {
	loadUtilities
}

# Default load compile
function bootUp-compile {
	compileMenu
}

# load watch js
function bootUp-compile-js {
	echo
	callUglifyScripts
}

# load watch sass
function bootUp-compile-sass {
	echo
	callCompass compile
}

# Default load watch
function bootUp-watch {
	clear
	watchMenu
}

# load watch js
function bootUp-watch-js {
	loadJSWatch
}

# load watch sass
function bootUp-watch-sass {
	loadSASSWatch
}

# Default load watch
function bootUp-server {
	startServer
}

# Default load watch
function bootUp-help {
	helpMenu
}

# Default load watch
function bootUp-logsMenu {
	logsMenu
}

function init {
	if [ $# -eq 0 ]
		then
		bootUp-help
	else
		collectParam $1 $2
	fi
}
init $1 $2


