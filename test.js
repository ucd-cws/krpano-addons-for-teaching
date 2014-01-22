var count = 0;
//probably will go back to hard coding these values??
var firstpanonum = 1; //even if it starts at 0 put 1.
var lastpanonum = 53; //even if it ends at 52 put 53
var currentpanonum = -1; //starts with pano 1
var hotspotlist = new Array();

$( document ).ready(function() {
   
	createmorelinks();

	checkforclick();

	test();

	loadjsonfile(getUrlVars());
});

function checkforclick() {
	//this is needed to grab the value from the input box 
    //and change the page number (currently the 1 and 53 are hard coded)
	$( "#gotopageform" ).submit(function( event ) {
		var value = parseInt($( "#gotopagebox" ).val());
		if ( loadpanonum(value) ) {
		}
		else {
			$( "#responsedd" ).text( "Must be " + firstpanonum +" <= n <= " + lastpanonum ).show().fadeOut( 3000 );
			event.preventDefault();
		}
		$("#gotopagebox").val(''); //clear value of box
		return;
	});
	try{
		checkpanonum();
	}
	catch(e) {}
}

function test() {
	$( '#leftsidepanel' ).prepend('<a href=\"javascript:void(0);\" onclick=\"testthis();\">show number</a><br>');
	$( '#leftsidepanel' ).prepend('<a href=\"javascript:void(0);\" onclick=\"getnexthotspot();\">Look at hotspot</a><br>');
}

function testthis() {
    alert(currentpanonum);
	var obj = loadjsonfile("swfobject\samplelecture.json");
	var classdata = new ClassData(obj);
	classdata.printall();
}

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
		updatepanohighlight(newpanoid);
		currentpanonum = newpanoid;
	}
}, 25);


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
		updatepanohighlight(num);
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
		$( '#leftsidepanel' ).append('<a id=\"' + "pano" + i + '\" href=\"javascript:void(0);\" onclick=\"loadpanonum(' + i +');\">Pano ' + i +'</a><br>');
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

	var addtopanel = this.addtopanel = function(data) {
		$( '#leftsidepanel' ).append('<div>'+ data +'</div>');
	}
	this.printall = function() {
		addtopanel(classdata.id);
		addtopanel(classdata.title);
		addtopanel(classdata.description);
		for(var i = 0; i < locations.length; i++) {
			addtopanel("    " + locations[i].title);
		}	
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

