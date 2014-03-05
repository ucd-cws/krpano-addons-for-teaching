var count = 0;
//probably will go back to hard coding these values??
var firstpanonum = 1; //even if it starts at 0 put 1.
var lastpanonum = 53; //even if it ends at 52 put 53
var currentpanonum = -1; //starts with pano 1
var hotspotlist = new Array();
var classdata;
var nextallowed = true; //prevents problems with prev/next button

$( document ).ready(function() {
   
	var urlinfo = getUrlVars();
	var response = loadJSONFile(urlinfo);
	//file has been found and loaded
	
	if(response) {
		//createLeftSidePanel();
		classdata = new ClassData(response);
		classdata.initialize();
		
	    // hideAll();
	    // showAllHeaders();
		credits(); 
		
	}
	//enabling debugmode
	if(urlinfo["debug"] == 1) {
		debug();
	}
	
	setInterval('checkPanoNum()',15);
	
});

function loadFirstPano() {
	loadPanoNum(classdata.getFirstLocation());
	nextallowed = true;
	setInterval('setcallback()',15);
}

function scrollTo(num) {
	 window.location.href="#pano" + num;
}

//calls and loads either a video or text
function loadAction(name, type) {
	if(type == "video") {
		loadHSVideo(name);
	}
	else if(type == "text") {
		loadHSText(name);
	}
}
//the code below is subjected to change based on the code generated by krpano
function loadHSVideo(name) {
	krpano().call("closeallobjects();set(plugin["+name +"object].visible,true);" +
                  "tween(plugin["+ name +"object].alpha, 1);" + 
                  "stoppanosounds();plugin[" + name + "object].play();");
}

function loadHSText(name) {
	krpano().call("closeallobjects();set(plugin[" + name + "object].visible,true);"+
                  "tween(plugin[" + name + "object].alpha, 1);");
}


//==============================START DEBUG CODE ==================================//
function debug() {

	var $div = $('<div />').prependTo('body');
	$div.attr('id', 'debugmenu');
	$('#debugmenu').css("width","20%").css("float","left");
	$('#container').css("width","60%");
	setupmousepos();
	setInterval('updatemousepos()', 66);
	setInterval('updatepanodisplay()', 66);

	$( '#debugmenu' ).prepend('<div id=\"mypano\"></div>');
	$( '#debugmenu' ).prepend('<form action=\"javascript:void(0);\" id=\"gotopageform\"><div id=\"gotopagetext\"> Go to Pano </div><div> <input type=\"text\" id=\"gotopagebox\"><input type=\"submit\" id=\"gotopagesubmit\" value=\"Go\"</div></form> <br><span id=\"responsedd\"></span><br>');
	$( '#debugmenu' ).prepend('<div><a href=\"javascript:void(0);\" onclick=\"testThis();\">show number</a><br></div>');
	$( '#debugmenu' ).prepend('<div><a href=\"javascript:void(0);\" onclick=\"getNextHotspot();\">Look at hotspot</a><br></div>');
	
}

function setcallback() {
	if(krpano()) {
		krpano().set("events.onloadcomplete","js(enableNext());");
	}
}

function enableNext() {
	nextallowed = true;
}
function disableNext() {
	nextallowed = false;
}

function updatepanodisplay() {
	$('#mypano').text("Currently on pano" + currentpanonum);
}

function getNextHotspot() {
	if(hotspotlist[hotspotlist.length - 1] != currentpanonum) {
		loadXMLFile();
		count = 0;
	}
	lookToHotspot(hotspotlist[count]);
	$( "#responsedd" ).text( "This is " + hotspotlist[count]);
	count++;
	if(count == hotspotlist.length - 1) count = 0;
}

//jquery version
function loadXMLFile()  {
	var theurl = getFileName() + (currentpanonum - 1) + ".xml";
	var jqueryxml = $.ajax({
		type:"GET",
		cache: false,
		url: theurl,
		dataType: "xml",
		async:false,
	});

	var xmlDoc = jqueryxml.responseXML;
	hotspotlist = new Array();
	//set first value as pano num needed to check for later.
	//get a list of all the tags labeled "hotspot"
	//TODO: need a try and catch here to prevent odd crashes.
	var templist = xmlDoc.getElementsByTagName("hotspot");
	for(var i = 0; i < templist.length; i++) {
		hotspotlist[i] = templist[i].getAttribute("name");
	}
	hotspotlist[templist.length] = currentpanonum;

}

function testThis() {
    //alert(currentpanonum);
	if(nextallowed) {
		classdata.getNext();
	}
}

function nextButton() {
	if(nextallowed) {
		classdata.getNext();
	}
}

function prevButton() {
	if(nextallowed) {
		classdata.getPrevious();
	}
}

//generates all of the links to all of the panos
function createMoreLinks() {
    for( var i = firstpanonum; i <= lastpanonum; i++) {
		$( '#debugmenu' ).append('<div><a id=\"' + "pano" + i + '\" href=\"javascript:void(0);\" onclick=\"loadPanoNum(' + i +');scrollTo('+ i +');\">Pano ' + i +'</a><br></div>');
    }
}

function setupmousepos() {
	$('#debugmenu').prepend('<div id=\"fieldofview\"><\div>');
	$('#debugmenu').prepend('<div id=\"mouseatv\"><\div>');
	$('#debugmenu').prepend('<div id=\"mouseath\"><\div>');
	$('#debugmenu').prepend('<div id=\"mousey\"><\div>');
	$('#debugmenu').prepend('<div id=\"mousex\"><\div>');
}

function updatemousepos()
{
	var values = new Array();
	if (krpano() && krpano().get) // it can take some time until krpano is loaded and ready
	{
		var mousex = krpano().get("mouse.x");
		var mousey = krpano().get("mouse.y");
		var fov = krpano().get("view.fov");
		if (mousex && mousey) // wait also for the jsmouse plugin
		{
			var hvs = krpano().get("screentosphere("+mousex +","+mousey +")");
			var hva = hvs.split(",");
			var ath = Number( hva[0] );
			var atv = Number( hva[1] );

			values["mouse_x"] = mousex;
			values["mouse_y"] = mousey;
			values["mouse_ath"] = ath.toFixed(2);
			values["mouse_atv"] = atv.toFixed(2);

			$('#mousex').text("mouse_x = " + values["mouse_x"]);
			$('#mousey').text("mouse_y = " + values["mouse_y"]);
			$('#mouseath').text("mouse_ath = " + values["mouse_ath"]);
			$('#mouseatv').text("mouse_atv = " + values["mouse_atv"]);
			$('#fieldofview').text("fov = " + fov);
		}
	}
} 

//=============================END OF DEBUG CODE======================================//




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

function krpano() {
    return document.getElementById('krpanoSWFObject');
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

//constantly checks current panonumber and updates it
// var checkpanonum = setInterval(function() {
// 	var newpanoid = getPanoID();
// 	if(newpanoid != currentpanonum) {
// 		currentpanonum = newpanoid;
// 		showCurrentText();
// 	}
// }, 15);

function checkPanoNum() {
	var newpanoid = getPanoID();
	if(newpanoid != currentpanonum) {
		currentpanonum = newpanoid;
		showCurrentText();
	}
}

function credits() {
	//crediting to where we got the icons.
	$('#content').append('<div id="credits"></div>');
	$('#credits').append('<a href=\"http://www.famfamfam.com/lab/icons/silk/\">Icons: Silk by FAMFAMFAM </a>')
}

function getFileName() {
	// var myname = location.pathname;
	// myname = myname.replace(/.*\//g, '');
	// myname = myname.replace('.html', '');
	// return myname;
	return classdata.getFileName();
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


function lookToHotspot(hotspotname) {
	krpano().call("looktohotspot(" + hotspotname + ");");
}


function getPanoID() { 
	var url;
	try {
		url = krpano().get("xml.url");
		url = url.replace(getFileName(), ''); //remove the name
		url = url.replace(".html", ''); //remove the .html
	}
	catch (e) {}//krpano has not finished loading yet

    if(url) {
		return parseInt(url) + 1;
    }
    return 1;
}

function loadPanoNum(num) {
	disableNext();
    //defaults to zeroth pano or sets to specified pano number
	//if( firstpanonum <= num && num <= lastpanonum) { //this may not be necessary.
		num = getFileName() + (num - 1) + ".xml"; //filename will be a variable in the json file.
		
        //scene_num + 1 = actual scene numbering based on the .xml file naming
		try{
			
			krpano().call("loadpano('" + num + "',null,MERGE,BLEND(1));");
		}
		catch(e){console.log("Couldn't load pano number " + num);}

	//	return true;
    //}
	//return false;
}

function updateIndex(id) {
	classdata.updateIndex(id);
}

function ClassData(thedata) {
	var classdata = thedata.VirtualClass;
	var locations = classdata.locations;
	var content = "";
	var tempCallNext = [];
	var idToIndex = {};
	var index = 0;

	var applycontent = function() {
		$( '#leftsidepanel' ).append(content);
	}

	var addheader = function(title,description) {
		content += '<div id=\"header\"><h1>'+ title +'</h1><br>';
		content += '<p id = \"introduction\">'+ description + '</p>'; 
		content += '<a href=\"javascript:void(0);\"' +
			       'onclick=\"prevButton();\"\>Previous</a>';
		content += '<a href=\"javascript:void(0);\"' +
			       'onclick=\"nextButton();\"\>Next</a>';
		content += '</div>';
	}

	var settitle = function(title) {
		$('head > title').text(title);
	}

	// var addthumbnail = function(num) {
	// 	//needs to perform some checking because not all thumbnails exist.
	// 	var aname = getFileName() + "data/graphics/" + getFileName() + (num - 1) + "_thumbnail.jpg";
	// 	content += '<img class="thumbnail" src=\"' + aname + '\">'; 
	// }

	var addhotspot = function(h, enable_icons) {
		idToIndex[h.id] = tempCallNext.length;
		var fun = function(){lookToHotspot(h.id);loadAction(h.id,h.icon);}
		tempCallNext.push(fun);

		var vidtime = "";
		if(h.video_duration && (h.video_duration).match(/^\d\d?:\d\d$/)) { //minutes:seconds
			//vidtime = " (" + h.video_duration + ")";
		}
		content += '<li class=\"hotspots\">';
		// content += '<a href=\"javascript:void(0);\"' +
		// 	'onclick=\"lookToHotspot(\'' + h.id +'\');' + 
		// 	'loadAction(\'' + h.id +'\',\'' + h.icon + '\'); ' + 
		// 	'updateIndex(\"' + h.id + '\");' + '\">'+ 
		// 	h.display_id + ". " + h.label + vidtime + '</a>';

		if(enable_icons) {
			addicon(h.icon);
		}
		content += '</li>';
	}

	var addicon = function(name) {
		content += '<span class=\"icons ' + name + '\"></span>'; 
	}

	var addlectureicon  = function(name) {
		var location = "icons/" + name + ".png";
		content += '<img class=\"lectureicon\" src=\"' + location  + '\">'
	}

	var panostops = function(places) {
		    var pano = "pano" + places.pano_num;

		    idToIndex[pano] = tempCallNext.length;
			var fun2 = function(){loadPanoNum(places.pano_num)}
			tempCallNext.push(fun2);
			
			content += '<div id=\"' + pano + '\"' + 'class=\"pano_stop\">';
			content += '<h2>';
			content += '<a href=\"javascript:void(0);\"' + 
			    'onclick=\"loadPanoNum(' + places.pano_num + ');' +
			    'updateIndex(' + '\'' +  pano + '\'' + ');' + '\">' +
			    '<span class="hotspot_name">'+ places.title +'</span>';
			
			// if(classdata.enable_thumbnails)
			// 	addthumbnail(places[i].pano_num);

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
		applycontent();
	}

	this.getFirstLocation = function() {
		return(locations[0].pano_num);
	}

	this.getFileName = function() {
		if(!classdata.base_name) {
			alert("Filename not specified");
		}
		return classdata.base_name;
	}

	this.getNext = function() {		
		if(hasNext()) {			
			index++;
			tempCallNext[index]();
		}
	}
	this.getPrevious = function() {
		if(hasPrev()) {
			index--;
			tempCallNext[index]();
		}
	}

	var hasNext = this.hasNext = function() {
		return index < tempCallNext.length - 1;
	}
 
    var hasPrev = this.hasPrev = function() {
		return index > 0;
	}

	this.updateIndex = function(id) {
		index = idToIndex[id];
		//alert(index);
	}
}

//NOTE going backwards still requires you to load the previous thing before going back.... THINK about this...
