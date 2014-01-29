var count = 0;
//probably will go back to hard coding these values??
var firstpanonum = 1; //even if it starts at 0 put 1.
var lastpanonum = 53; //even if it ends at 52 put 53
var currentpanonum = -1; //starts with pano 1
var hotspotlist = new Array();

$( document ).ready(function() {
   
	// createmorelinks();
	var urlinfo = getUrlVars();
	var response = loadJSONFile(urlinfo);
	//file has been found and loaded
	if(response) {
		createLeftSidePanel();
		//enabling debugmode
		if(urlinfo["debug"] == 1)
		   debug();
		var classdata = new ClassData(response);
		classdata.printAll();
		hideAll();
		showAllHeaders();
	}
	//credits(); //make this small and as a footer
});

// found code here, not sure why it completely works.
// http://stackoverflow.com/questions/9114565/jquery-appending-a-div-to-body-the-body-is-the-object
function createLeftSidePanel() {
	var $div = $('<div />').prependTo('body');
	$div.attr('id', 'leftsidepanel');
	// $('#leftsidepanel').css("width", "20%");
	// $('#container').css("width","80%");
	//change the width of left panel div and the pano's div
}

function debug() {
	$( '#leftsidepanel' ).prepend('<div><a href=\"javascript:void(0);\" onclick=\"testThis();\">show number</a><br></div>');
	$( '#leftsidepanel' ).prepend('<div><a href=\"javascript:void(0);\" onclick=\"getNextHotspot();\">Look at hotspot</a><br></div>');
	$( '#leftsidepanel' ).append('<form action=\"javascript:void(0);\" id=\"gotopageform\"><div id=\"gotopagetext\"> Go to Pano </div><div> <input type=\"text\" id=\"gotopagebox\"><input type=\"submit\" id=\"gotopagesubmit\" value=\"Go\"</div></form> <br><span id=\"responsedd\"></span><br>');
}

function testThis() {
    alert(currentpanonum);
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

function krpano() {
    return document.getElementById('krpanoSWFObject');
}

//jquery version
function loadXMLFile()
{
	var theurl = "virtualtourblank" + (currentpanonum - 1) + ".xml";
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
	var templist = xmlDoc.getElementsByTagName("hotspot");
	for(var i = 0; i < templist.length; i++) {
		hotspotlist[i] = templist[i].getAttribute("name");
	}
	hotspotlist[templist.length] = currentpanonum;

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

function lookToHotspot(hotspotname) {
	krpano().call("looktohotspot(" + hotspotname + ");");
}

function lookAt() {
}

function getlookat()
{
	var krpano = krpano();
	if (krpano && krpano.get) // it can take some time until krpano is loaded and ready
	{
		var mousex = krpano.get("mouse.x");
		var mousey = krpano.get("mouse.y");
		if (mousex && mousey) // wait also for the jsmouse plugin
		{
			var hvs = krpano.get("screentosphere("+mousex +","+mousey +")");
			var hva = hvs.split(",");
			var ath = Number( hva[0] );
			var atv = Number( hva[1] );

			values["mouse_x"] = mousex;
			values["mouse_y"] = mousey;
			values["mouse_ath"] = ath.toFixed(2);
			values["mouse_atv"] = atv.toFixed(2);
		}
	}

	//display them immediately.
} 


//uses the name of the file to determine the scene #
//temporary hack that only works if the file contains its own scene number(integer)
function getPanoID() { 
	var url;
	try {
		url = krpano().get("xml.url");
		url = url.replace(/\D+/g, ''); //remove all non-digits
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
		num = "virtualtourblank" + (num - 1) + ".xml"; //filename will be a variable in the json file.
		
        //scene_num + 1 = actual scene numbering based on the .xml file naming
		try{
			krpano().call("loadpano('" + num + "',null,MERGE,BLEND(1));");
		}
		catch(e){}

		return true;
    }
	return false;
}

function loadThumbNail(num) {
	if( firstpanonum <= num && num <= lastpanonum) {
		num = "virtualtourblankdata/graphics/virtualtourblank" + num + "_thumbnail.jpg";
		$( '#leftsidepanel' ).append('<img class="thumbnail" src=\"' + num + '\">'); 
	}
}

function loadIcon(name){
	
}

//generates all of the links to all of the panos
function createMoreLinks() {
    for( var i = firstpanonum; i <= lastpanonum; i++) {
		$( '#leftsidepanel' ).append('<div><a id=\"' + "pano" + i + '\" href=\"javascript:void(0);\" onclick=\"loadPanoNum(' + i +');\">Pano ' + i +'</a><br></div>');
    }
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

function ClassData(thedata) {
	var classdata = this.classdata = thedata.VirtualClass;
	var locations = this.locations = classdata.locations;
	//var uses = 1; needed later on to prevent malicious intent?
	var content = this.content = "";

	var addcontent = this.addcontent = function() {
		$( '#leftsidepanel' ).append(content);
	}

	var startdiv = this.startdiv = function() {
		content = content + '<div>';
	}
	var enddiv = this.enddiv = function() {
		content = content + '</div>';
	}
	var addtitle = this.addtitle = function(title) {
		content = content + '<h1>'+ title +'</h1>';
	}
	var settitle = this.settitle = function(title) {
		$('head > title').text(title);
	}
	var adddescription = this.adddescription = function(description) {
		content = content + '<p id = \"introduction\">'+ description +'</p>';
	}
	//essentially a startdiv() with an id. needs an enddiv()
	var addspotname = this.addpano = function(name, number) {
		var pano = "pano" + number;
		content = content + '<div id=\"' + pano + '\"' + 'class=\"pano_stop\">';
		starth2();

		content = content + '<a href=\"javascript:void(0);\"' + 
			                'onclick=\"loadPanoNum(' + number +');\"> '+ name;
		if(classdata.enable_thumbnails)
			addthumbnail(number);
		content = content + '</a>';
		endh2();
	}
	var starth2 = function() {
		content = content + '<h2>';
	}
	var endh2 = function() {
		content = content + '</h2>';
	}
	var addthumbnail = this.addthumbnail = function(num) {
		//needs to perform some checking because not all thumbnails exist.
		var name = "virtualtourblankdata/graphics/virtualtourblank" + (num - 1) + "_thumbnail.jpg";
		content = content + '<img class="thumbnail" src=\"' + name + '\">'; 
	}

	var addview = this.addview = function(data, name) {
		content = content + '<a href=\"javascript:void(0);\"' +
									 'onclick=\"lookToHotspot(\'' + name +'\');\">'+ data + '</a>';
	}

	var addicon = this.addicon = function(name) {
		content = content + '<div class=\"icons ' + name + '\"></div>'; 
	}

	var startul = this.startul = function() {
		content = content + '<ul class=\"hotspots\">';
	}
	var endul = this.endul = function() {
		content = content + '</ul>';
	}
	var startli = this.startli = function() {
		content = content + '<li class=\"hotspots\">';
	}
	var endli = this.endli = function() {
		content = content + '</li>';
	}

	//public function that will print the data onto the left panel
	this.printAll = function() {
		settitle( classdata.title );
		addtitle( classdata.title );
		adddescription(classdata.description);
		for(var i = 0; i < locations.length; i++) {
			addspotname(locations[i].title, locations[i].pano_num);
			//adddescription(locations[i].description);
			var hotspots = locations[i].hotspots;
			startul();
			for(var j = 0; j < hotspots.length; j++) {
				startli();
				addview(hotspots[j].display_id + ". " + 
						hotspots[j].label, hotspots[j].id);
				if(classdata.enable_icons) {
					addicon(hotspots[j].icon);
				}
				endli();
			}
			endul();
			enddiv();
		}
		addcontent();
	}
}

function credits() {
	//crediting to where we got the icons.
	$('#leftsidepanel').append('<div class="credits"><a href=\"http://www.famfamfam.com/lab/icons/silk/\">Icons: Silk by FAMFAMFAM </a></div>');
	
}
