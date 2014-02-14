var count = 0;
//probably will go back to hard coding these values??
var firstpanonum = 1; //even if it starts at 0 put 1.
var lastpanonum = 53; //even if it ends at 52 put 53
var currentpanonum = -1; //starts with pano 1
var hotspotlist = new Array();
var name = "";

$( document ).ready(function() {
   
	name = getFileName();
	// createmorelinks();
	var urlinfo = getUrlVars();
	var response = loadJSONFile(urlinfo);
	//file has been found and loaded

	if(response) {
		createLeftSidePanel();
		var classdata = new ClassData(response);
		classdata.printAll();
	    hideAll();
	    showAllHeaders();
		var headheight =  $("#header").height()
		
		credits(); //make this small and as a footer
	}
	//enabling debugmode
	if(urlinfo["debug"] == 1) {
		if($('#leftsidepanel').length == 0) {
			createLeftSidePanel();
		}
		debug();
	}

});

//calls and loads either a video or text
function loadAction(name, type) {
	if(type == "video") {
		loadHSVideo(name);
	}
	else if(type == "text") {
		loadHSText(name);
	}
}

function loadHSVideo(name) {
	krpano().call("closeallobjects();set(plugin["+name +"object].visible,true);"+
                   "tween(plugin["+ name +"object].alpha, 1);" + 
                   "stoppanosounds();plugin[" + name + "object].play();");
}

function loadHSText(name) {
	krpano().call("closeallobjects();set(plugin[" + name + "object].visible,true)"+
                  ";tween(plugin[" + name + "object].alpha, 1);");
}


//==============================START DEBUG CODE ==================================//
function debug() {
	setupmousepos();
	setInterval('updatemousepos()', 66);
	setInterval('updatepanodisplay()', 66);

	$( '#leftsidepanel' ).prepend('<div id=\"mypano\"></div>');
	$( '#leftsidepanel' ).prepend('<form action=\"javascript:void(0);\" id=\"gotopageform\"><div id=\"gotopagetext\"> Go to Pano </div><div> <input type=\"text\" id=\"gotopagebox\"><input type=\"submit\" id=\"gotopagesubmit\" value=\"Go\"</div></form> <br><span id=\"responsedd\"></span><br>');
	$( '#leftsidepanel' ).prepend('<div><a href=\"javascript:void(0);\" onclick=\"testThis();\">show number</a><br></div>');
	$( '#leftsidepanel' ).prepend('<div><a href=\"javascript:void(0);\" onclick=\"getNextHotspot();\">Look at hotspot</a><br></div>');

	
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

function testThis() {
    alert(currentpanonum);
}

//generates all of the links to all of the panos
function createMoreLinks() {
    for( var i = firstpanonum; i <= lastpanonum; i++) {
		$( '#leftsidepanel' ).append('<div><a id=\"' + "pano" + i + '\" href=\"javascript:void(0);\" onclick=\"loadPanoNum(' + i +');\">Pano ' + i +'</a><br></div>');
    }
}

function setupmousepos() {
	$('#leftsidepanel').prepend('<div id=\"fieldofview\"><\div>');
	$('#leftsidepanel').prepend('<div id=\"mouseatv\"><\div>');
	$('#leftsidepanel').prepend('<div id=\"mouseath\"><\div>');
	$('#leftsidepanel').prepend('<div id=\"mousey\"><\div>');
	$('#leftsidepanel').prepend('<div id=\"mousex\"><\div>');
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

	//display them immediately.
} 

//=============================END OF DEBUG CODE======================================//

function createModalMessage() {
	var temp = $('#container').append('<div id=\"modalmsg\"></div>');
}



// found code here, not sure why it completely works.
// http://stackoverflow.com/questions/9114565/jquery-appending-a-div-to-body-the-body-is-the-object
function createLeftSidePanel() {
	var $div = $('<div />').prependTo('body');
	$div.attr('id', 'leftsidepanel');
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
var checkpanonum = setInterval(function() {
	var newpanoid = getPanoID();
	if(newpanoid != currentpanonum) {
		currentpanonum = newpanoid;
		showCurrentText();
	}
}, 15);

//========================TEXT VISUAL MANIPULATION=======================

function showCurrentText() {
	unselectAll();
	hideAll();
	showAllHeaders();
	$("#pano" + currentpanonum).addClass('selected').children().show();
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

function credits() {
	//crediting to where we got the icons.
	$('#content').append('<div id="credits"></div>');
	$('#credits').append('<a href=\"http://www.famfamfam.com/lab/icons/silk/\">Icons: Silk by FAMFAMFAM </a>')
}

function getFileName() {
	var myname = location.pathname;
	myname = myname.replace(/.*\//g, '');
	myname = myname.replace('.html', '');
	return myname;
}

//jquery version
function loadXMLFile()
{
	var theurl = name + (currentpanonum - 1) + ".xml";
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
		url = url.replace(name, ''); //remove the name
		url = url.replace(".html", ''); //remove the .html
	}
	catch (e) {}//krpano has not finished loading yet

    if(url) {
		return parseInt(url) + 1;
    }
    return 1;
}

function loadPanoNum(num) {
    //defaults to zeroth pano or sets to specified pano number
	if( firstpanonum <= num && num <= lastpanonum) { //this may not be necessary.
		num = name + (num - 1) + ".xml"; //filename will be a variable in the json file.
		
        //scene_num + 1 = actual scene numbering based on the .xml file naming
		try{
			krpano().call("loadpano('" + num + "',null,MERGE,BLEND(1));");
		}
		catch(e){console.log("couldn't load pano number " + num);}

		return true;
    }
	return false;
}

function ClassData(thedata) {
	var classdata = this.classdata = thedata.VirtualClass;
	var locations = this.locations = classdata.locations;
	var content = this.content = "";

	var setcontent = function() {
		$( '#leftsidepanel' ).append(content);
	}

	var addheader = this.addheader = function(title,description) {
		content = content + '<div id=\"header\"><h1>'+ title +'</h1><br>';
		content = content + '<p id = \"introduction\">'+ description +'</p></div>';
	}
	var settitle = this.settitle = function(title) {
		$('head > title').text(title);
	}

	var addspotname = this.addpano = function(name, number) {
		var pano = "pano" + number;
		content = content + '<div id=\"' + pano + '\"' + 'class=\"pano_stop\">';
		content = content + '<h2>';
		content = content + '<a href=\"javascript:void(0);\"' + 
			                'onclick=\"loadPanoNum(' + number +
			                ');\"><span class="hotspot_name">'+ name +'</span>';
		if(classdata.enable_thumbnails)
			addthumbnail(number);
		content = content + '</a>';
		content = content + '</h2>';
	}

	var addthumbnail = function(num) {
		//needs to perform some checking because not all thumbnails exist.
		//var aname = "virtualtourblankdata/graphics/virtualtourblank" + (num - 1) + "_thumbnail.jpg";
		var aname = name + "data/graphics/" + name + (num - 1) + "_thumbnail.jpg";
		content = content + '<img class="thumbnail" src=\"' + aname + '\">'; 
	}

	var addview = function(h, enable_icons) {
		var vidtime = "";
		if(h.video_duration && (h.video_duration).match(/^\d\d?:\d\d$/)) { //minutes:seconds
			vidtime = " (" + h.video_duration + ")";
		}
		content = content + '<li class=\"hotspots\">';
		content = content + '<a href=\"javascript:void(0);\"' +
			'onclick=\"lookToHotspot(\'' + h.id +'\');' + 
			'loadAction(\'' + h.id +'\',\'' + h.icon + '\'); \">'+ 
			h.display_id + ". " + h.label + vidtime + '</a>';

		if(enable_icons) {
			addicon(h.icon);
		}
		content = content + '</li>';
	}

	var addicon = function(name) {
		content = content + '<span class=\"icons ' + name + '\"></span>'; 
	}

	var addlectureicon  = function(name) {
		var location = "icons/" + name + ".png";
		content = content + '<img class=\"lectureicon\" src=\"' + location  + '\">'
	}

	var hotspots = function(places) {
		for(var i = 0; i < places.length; i++) {

			var hotspots = places[i].hotspots;
			addspotname(places[i].title, places[i].pano_num);

			content = content + '<ul class=\"hotspots\">';
			for(var j = 0; j < hotspots.length; j++) {
				addview(hotspots[j], classdata.enable_icons);
			}
			content = content + '</ul>';
			content = content + '</div>';
		}
	}

	var addcontent = function() {
		content += '<div id=\"content\">'
		hotspots(locations);
		content += '</div>';
	}

	//public function that will print the data onto the left panel
	this.printAll = function() {
		settitle( classdata.title );
		addheader(classdata.title, classdata.description);
		addcontent();
		setcontent();

	}

	this.getfirstlocation = function() {
		return(locations[0].pano_num);
	}
}

