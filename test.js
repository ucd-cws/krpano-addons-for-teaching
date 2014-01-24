var count = 0;
//probably will go back to hard coding these values??
var firstpanonum = 1; //even if it starts at 0 put 1.
var lastpanonum = 53; //even if it ends at 52 put 53
var currentpanonum = -1; //starts with pano 1
var hotspotlist = new Array();

$( document ).ready(function() {
   
	// createmorelinks();

	createleftsidepanel();
	test();

	loadjsonfile(getUrlVars());
	hideall();
	showallheaders();
});

// found code here, not sure why it completely works.
// http://stackoverflow.com/questions/9114565/jquery-appending-a-div-to-body-the-body-is-the-object
function createleftsidepanel() {
	var $div = $('<div />').prependTo('body');
	$div.attr('id', 'leftsidepanel');
}

function test() {
	$( '#leftsidepanel' ).prepend('<div><a href=\"javascript:void(0);\" onclick=\"testthis();\">show number</a><br></div>');
	$( '#leftsidepanel' ).prepend('<div><a href=\"javascript:void(0);\" onclick=\"getnexthotspot();\">Look at hotspot</a><br></div>');
	$( '#leftsidepanel' ).append('<form action=\"javascript:void(0);\" id=\"gotopageform\"><div id=\"gotopagetext\"> Go to Pano </div><div> <input type=\"text\" id=\"gotopagebox\"><input type=\"submit\" id=\"gotopagesubmit\" value=\"Go\"</div></form> <br><span id=\"responsedd\"></span><br>');
}

function testthis() {
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
	var newpanoid = getpanoid();
	if(newpanoid != currentpanonum) {
		currentpanonum = newpanoid;
		showcurrenttext();
	}
}, 15);

function showcurrenttext() {
	// var $this = $("#pano" + currentpanonum);
	// //show everything in selected div
	// $this.addClass('selected').children().show();
	// //hide everything other than the selected div
	// $this.siblings(".pano_stop").removeClass('selected').children().hide();
	// //show only the headers (titles) of the selected div's siblings
	// $this.siblings(".pano_stop").children('h2').show();

	unselectall();
	hideall();
	showallheaders();
	$("#pano" + currentpanonum).addClass('selected').children().show();
}

function unselectall() {
	$(".pano_stop").removeClass('selected');
}

function showall() {
	$(".pano_stop").children().show();
}

function hideall() {
	$(".pano_stop").children().hide();
}

function showallheaders() {
	$(".pano_stop").children('h2').show();
}

//scrolls to a specified piece of text
function scrollto(id) {
	//location.hash = "#" + id;
}

function krpano() {
    return document.getElementById('krpanoSWFObject');
}

//jquery version
function loadxmlfile()
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

function getnexthotspot() {
	if(hotspotlist[hotspotlist.length - 1] != currentpanonum) {
		loadxmlfile();
		count = 0;
	}
	lookat(hotspotlist[count]);
	$( "#responsedd" ).text( "This is " + hotspotlist[count]);
	count++;
	if(count == hotspotlist.length - 1) count = 0;
}

function lookat(hotspotname) {
	krpano().call("looktohotspot(" + hotspotname + ");");
}



//uses the name of the file to determine the scene #
//temporary hack that only works if the file contains its own scene number(integer)
function getpanoid() { 
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

function loadpanonum(num) {
    //defaults to zeroth pano or sets to specified pano number
	if( firstpanonum <= num && num <= lastpanonum) {
		//updatepanohighlight(num);
		num = "virtualtourblank" + (num - 1) + ".xml";
		
        //scene_num + 1 = actual scene numbering based on the .xml file naming
		try{
			krpano().call("loadpano('" + num + "',null,MERGE,BLEND(1));");
		}
		catch(e){}

		return true;
    }
	return false;
}

//generates all of the links to all of the panos
function createmorelinks() {
    for( var i = firstpanonum; i <= lastpanonum; i++) {
		$( '#leftsidepanel' ).append('<div><a id=\"' + "pano" + i + '\" href=\"javascript:void(0);\" onclick=\"loadpanonum(' + i +');\">Pano ' + i +'</a><br></div>');
    }
}



function updatepanohighlight(new_value) {
	if(currentpanonum != new_value) {
		$('#pano' + currentpanonum).toggleClass('highlight');
		$('#pano' + new_value).toggleClass('highlight');
		scrollto("pano"+new_value);
	}	
}

function loadjsonfile() {
	var got = getUrlVars(); 
	var response = jsonrequest(got["filename"]);
	if(response) {
		var classdata = new ClassData(response);
		classdata.printall();
	}
}

function jsonrequest(filename) {
	if(!filename) return; //no filename received
	var filepath = "swfobject/" + filename + ".json";
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
	var adddescription = this.adddescription = function(description) {
		content = content + '<p>'+ description +'</p>';
	}
	//essentially a startdiv() with an id.
	var addstartpano = this.addpano = function(name, number) {
		var pano = "pano" + number;
		content = content + '<div id=\"' + pano + '\"' + 'class=\"pano_stop\">' +
									 '<h2><a href=\"javascript:void(0);\"' + 
									 'onclick=\"loadpanonum(' + number +');\"> '+ name+ '</a></h2>';
	}
	var addview = this.addview = function(data, name) {
		content = content + '<li><a href=\"javascript:void(0);\"' +
									 'onclick=\"lookat(\'' + name +'\');\">'+ data + '</a></li>';
	}

	var startol = this.startol = function() {
		content = content + '<ol class=\"hotspots\">';
	}
	var endol = this.endol = function() {
		content = content + '</ol>';
	}

	//public function that will print the data onto the left panel
	this.printall = function() {
		//startdiv();
		//addtopanel(classdata.id);
		//addtitle( classdata.id );
		addtitle( classdata.title );
		adddescription(classdata.description);
		for(var i = 0; i < locations.length; i++) {
			addstartpano(locations[i].title, locations[i].pano_num);
			adddescription(locations[i].description);
			var hotspots = locations[i].hotspots;
			startol();
			for(var j = 0; j < hotspots.length; j++) {
				addview(hotspots[j].display_id + ". " + 
						hotspots[j].label, hotspots[j].id);
			}
			endol();
			enddiv();
		}
		addcontent();
		//enddiv();
	}
}




function AdminPanel(user, pass) {
	
	//ask for username and password later
	//generate all of the links along with hotspots as children.
	var username = admin;
	var password = cwspass;
	
	function checkcredentials() {
		
	}
}

