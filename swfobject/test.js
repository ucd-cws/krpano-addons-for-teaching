var count = 0;
var firstpanonum = 1; //even if it starts at 0 put 1.
var lastpanonum = 53; //even if it ends at 52 put 53
var currentpanonum = 1; //starts with pano 1

$( document ).ready(function() {
    $( '#leftsidepanel' ).prepend('<a href=\"javascript:void(0);\" onclick=\"testthis();\">show number</a><br>');
	$( '#leftsidepanel' ).prepend('<a href=\"javascript:void(0);\" onclick=\"lookat();\">Look at hotspot</a><br>');
	createmorelinks();

	//highlights the first pano as always (for now)
	$('#pano' + currentpanonum).toggleClass('highlight');

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
		
	checkpanonum();
	
});

//constantly checks current panonumber and updates it
var checkpanonum = setInterval(function() {
	if(getpanoid() != currentpanonum) {
		updatepanohighlight(getpanoid());
	}
}, 100);


//scrolls to a specified piece of text
function scrollto(id) {
	location.hash = "#" + id;
}

function krpano() {
    return document.getElementById('krpanoSWFObject');
}

function getallhotspots(panonum) {
	// var xmlDoc;
	// var hotspots;
	// if(typeof DOMParser !== 'undefined') { //Other Browsers
	// 	xmlDoc = new DOMParser();
	// 	hotspots = xmlDoc.parseFromString("virtualtourblank2.xml", "application/xml");
	// 	alert(hotspots.toSource());
	// }
	// else { //IE
	
	// 	xmlDoc = loadXMLDoc("virtualtourblank2.xml")
	// 	hotspots = xmlDoc.getElementsByTagName("hotspot");
	// 	for( var i = 0; i < hotspots.length; i++) {
	// 		alert(hotspots[i].getAttribute("name"));
	// 	}
	// }


}

function lookat() {
	//var hotspotname = "spot3";
	//krpano().call("looktohotspot(" + hotspotname + ");");
	getallhotspots(currentpanonum);
}

function testthis() {
    alert(getpanoid());
    krpano().call("testing();");
	alert(krpano().call("name"));
}

//uses the name of the file to determine the scene #
//temporary hack that only works if the file contains its own scene number(integer)
function getpanoid() { 
    var url = krpano().get("xml.url");
    url = url.replace(/\D+/g, ''); //remove all non-digits
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
        krpano().call("loadpano('" + num + "',null,MERGE,BLEND(1));");

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
		currentpanonum = new_value; //update global currentpanonum
		scrollto("pano"+currentpanonum);
	}	
}

function loadjsonfiles(filepath) {
	//load file
	var json = loadTextFileAjaxSync(filePath, "application/json");
	// return parsed json (as an object)
	return JSON.parse(optionsText);
}

function displaytext(textobject) {
	
}

