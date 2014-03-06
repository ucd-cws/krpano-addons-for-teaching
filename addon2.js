var count = 0;
//probably will go back to hard coding these values??
var firstpanonum = 1; //even if it starts at 0 put 1.
var lastpanonum = 53; //even if it ends at 52 put 53
var currentpanonum = -1; //starts with pano 1
var hotspotlist = new Array();
var currentindex = 0;
var thehotspots;

$( document ).ready(function() {
	
	var urlinfo = getUrlVars();
	var response = loadJSONFile(urlinfo);
	//file has been found and loaded
	
	if(response) {
		//createLeftSidePanel();
		var classdata = new ClassData(response);
		classdata.initialize();
		thehotspots = classdata.getHotSpots();
	    hideAll();
	    showAllHeaders();
		
	}
	//enabling debugmode
	if(urlinfo["debug"] == 1) {
		debug();
	}
	setInterval('checkPanoNum()',15);

});


function krpano() {
    return document.getElementById('krpanoSWFObject');
}

function load(index) {
	currentindex = index;
	thehotspots[currentindex].load();
}

function loadPanoNum(num) {
	num = getBaseName() + (num - 1) + ".xml"; 
	
	try{     //scene_num + 1 = actual scene numbering based on the .xml file naming		
		krpano().call("loadpano('" + num + "',null,MERGE,BLEND(1));");
	}
	catch(e){console.log("Couldn't load pano number " + num);}
}

function lookToHotspot(hotspot) {
	krpano().call("looktohotspot(" + hotspot + ");");
}

function checkPanoNum() {
	var newpanoid = getPanoID();
	if(newpanoid != currentpanonum) {
		currentpanonum = newpanoid;
		showCurrentText();
	}
}

function getPanoID() { 
	var url;
	try {
		url = krpano().get("xml.url");
		url = url.replace(getBaseName(), ''); //remove the name
		url = url.replace(".html", ''); //remove the .html
	}
	catch (e) {}//krpano has not finished loading yet

    if(url) {
		return parseInt(url) + 1;
    }
    return 1;
}

function loadFirstPano() {
	thehotspots[0].load();
	setcallback();
}

function enableNext() {
	$('#nextClick').on("click", function(event) {
		disableNext();
		nextButton();
	});

	$('#prevClick').on("click", function(event) {
		disableNext();
		prevButton();
	});
}

function disableNext() {
	$('#nextClick').off();
	$('#prevClick').off();
}

function nextButton() {
	if(currentindex < thehotspots.length) {
		currentindex++;
		thehotspots[currentindex].load();
		setcallback();
	}
}

function prevButton() {
	if(currentindex > 0) {
		currentindex--;
		thehotspots[currentindex].load();
		setcallback();
	}
}

function setcallback() {
	if(krpano()) {
		krpano().set("events.onloadcomplete","js(enableNext());");
	}
}

function scrollTo(num) {
	window.location.href="#pano" + num;
}

function getBaseName() {
	return thehotspots[0].getBaseName();
}

function loadJSONFile(got) {
    var filename = got["lecture"];
	if(!filename) return; //no filename received
	var filepath = "lectures/" + filename + ".json";
	var jsondata = $.ajax({
		type:"GET",
		cache: false,
		url: filepath,
		dataType: "json",
		async:false,
	});
	var jsondat = jsondata.responseText;
	return jQuery.parseJSON(jsondat); //return the json object
}

// http://stackoverflow.com/questions/439463/how-to-get-get-and-post-variables-with-jquery
function getUrlVars() {
	var $_GET = {};
	document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
		function decode(s) {
			return decodeURIComponent(s.split("+").join(" "));
		}
		$_GET[decode(arguments[1])] = decode(arguments[2]);
	});
	return $_GET;
}

function updateIndex(id) {
	//classdata.updateIndex(id);
	//currentindex = id;
}

//========================TEXT VISUAL MANIPULATION=======================

function showCurrentText() {
	unselectAll();
	hideAll();
	showAllHeaders();
	$("#pano" + currentpanonum).addClass('selected').children().show(5,scrollTo(currentpanonum));
}

function unselectAll() {
	$(".pano_stop").removeClass('selected');
}

function showAll() {
	$(".pano_stop").children().show();
}

function hideAll() {
	$(".pano_stop").children().hide();
}

function showAllHeaders() {
	$(".pano_stop").children('h2').show();
}
//====================END OF TEXT VISUAL MANIPULATION=================


function Pano(panonum, basename) {
 	this.panonum = panonum;
	this.basename = basename;
	this.loadPano = function(num) {
		num = this.basename + (num - 1) + ".xml"; //filename == base_name in json file.
		
        //scene_num + 1 = actual scene numbering based on the .xml file naming
		try{			
			krpano().call("loadpano('" + num + "',null,MERGE,BLEND(1));");
		}
		catch(e){console.log("Couldn't load pano number " + num);}
	}
	this.correctPano = function() {
		return this.panonum == currentpanonum; //currentpanonum is global
	}

	this.setCurrentIndex = function() {
		currentindex = thehotspots.indexOf(this);
	}

	this.load = function() {
		this.loadPano(this.panonum);
		this.setCurrentIndex();
	}
	this.getPanoNum = function() {
		return this.panonum;
	}
	this.getBaseName = function() {
		return this.basename;
	}
 }

function Hotspot(panonum,hotspotid) {
	this.panonum = panonum;
	this.hotspotid = hotspotid;

	this.getHotSpotId = function() {
		return this.hotspotid;
	}
}

//who inherits from who
Hotspot.prototype = new Pano();
Video.prototype = new Hotspot();
//Set video's constructor to video
// by default, inheritance sets video's constructor to Hotspot's
Video.constructor = Video; 
Text.prototype = new Hotspot();
Text.constructor = Text;

function Video(panonum, hotspotid) {
	Hotspot.call(this, panonum, hotspotid);
    this.load = function() {
		if(!this.correctPano()) {
			this.loadPano(this.panonum); 
			this.setCurrentIndex();
			return ;
		}
		
		lookToHotspot(this.hotspotid);
		krpano().call("closeallobjects();set(plugin["+ this.hotspotid +"object].visible,true);" +
					  "tween(plugin["+ this.hotspotid +"object].alpha, 1);" + 
					  "stoppanosounds();plugin[" + this.hotspotid + "object].play();");
	}
}
function Text(panonum, hotspotid) {
	Hotspot.call(this, panonum, hotspotid);
	this.load = function() {
		if(!this.correctPano()) {
			this.loadPano(this.panonum);
			this.setCurrentIndex();
			return; 
		}

		lookToHotspot(this.hotspotid);
		krpano().call("closeallobjects();set(plugin[" + this.hotspotid + "object].visible,true);"+
					  "tween(plugin[" + this.hotspotid + "object].alpha, 1);");
	}
}


function ClassData(thedata) {
	var classdata = thedata.VirtualClass;
	var locations = classdata.locations;
	var content = "";
	var myhotspots = [];
	var pano_num;

	var addheader = function(title,description) {
		description = "";
		content += '<div id=\"header\"><h1>'+ title +'</h1><br>';
		content += '<p id = \"introduction\">'+ description + '</p>'; 
		content += '<a id="prevClick"\>Previous</a>';
		content += '<a id="nextClick"\>Next</a>';
		// content += '<a id="prevClick" href=\"javascript:void(0);\"' +
		// 	'onclick=\"prevButton();\"\>Previous</a>';
		// content += '<a id="nextClick" href=\"javascript:void(0);\"' +
		// 	'onclick=\"nextButton();\"\>Next</a>';
		content += '</div>';
	}

	var settitle = function(title) {
		$('head > title').text(title);
	}

	var addhotspot = function(h, enable_icons) {
		var indexnum = myhotspots.length;
		var ahotspot;
		var vidtime = "";

		if(h.icon == "video" && pano_num) {
			if(h.video_duration && (h.video_duration).match(/^\d\d?:\d\d$/)) { //minutes:seconds
				vidtime = " (" + h.video_duration + ")";
				ahotspot = new Video(pano_num, h.id);
			}
			else {
				alert("Video Duration must be in mm:ss");
			}
			
		}
		else if(h.icon == "text") {
			ahotspot = new Text(pano_num, h.id);
		}
		else {
			alert("Icon type unknown. Failed to set up hotspots.");
		}
		
		myhotspots.push(ahotspot);
		content += '<li class=\"hotspots\">';
		content += '<a href=\"javascript:void(0);\"' +
			'onclick=\"load(' + indexnum + ');\">' + 
			h.display_id + ". " + h.label + vidtime + '</a>';

		if(enable_icons) { //add icon
			content += '<span class=\"icons ' + h.icon + '\"></span>'; 
		}
		content += '</li>';
	}

	var panostops = function(places) {
		pano_num = places.pano_num;
		var indexnum = myhotspots.length;
		var pano = "pano" + places.pano_num;
		var aPano = new Pano(pano_num, classdata.base_name); 
		myhotspots.push(aPano);

		content += '<div id=\"' + pano + '\"' + 'class=\"pano_stop\">';
		content += '<h2>';
		content += '<a href=\"javascript:void(0);\"' + 
			'onclick=\"load(' + indexnum + ');' + '\">' +
			'<span class="hotspot_name">'+ places.title +'</span>';

		content += '</a>';
		content += '</h2>';

		content += '<ul class=\"hotspots\">';

		var hotspots = places.hotspots;
		for(var j = 0; j < hotspots.length; j++) {
			addhotspot(hotspots[j], classdata.enable_icons);
		}
		content += '</ul>';
		content += '</div>';
	}

	var addcontent = function() {
		content += '<div id=\"content\">'
		for(var i = 0; i < locations.length; i++) {
			panostops(locations[i]);
		}
		content += '</div>';
		$( '#leftsidepanel' ).append(content);
	}

	// found code here, not sure why it completely works.
	// http://stackoverflow.com/questions/9114565/jquery-appending-a-div-to-body-the-body-is-the-object
	var createLeftSidePanel = function() {
		var $div = $('<div />').prependTo('body');
		$div.attr('id', 'leftsidepanel');
	}

	//public function that injects desired html into the left panel
	this.initialize = function() {
		createLeftSidePanel();
		settitle( classdata.title );
		addheader(classdata.title, classdata.description);
		addcontent();
	}
	this.getHotSpots = function() {
		return myhotspots;
	}
}

