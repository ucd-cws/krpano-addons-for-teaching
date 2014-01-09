
//global variable : krpano initialized when document is ready
//var krpano = undefined;
var count = 0;
var panonumber = 1;

$( document ).ready(function() {
    $( '#leftsidepanel' ).prepend('<a href=\"javascript:void(0);\" onclick=\"testthis();\">show number</a><br>');
	createmorelinks();


	//this is needed to grab the value from the input box 
    //and change the page number (currently the 0 and 52 are hard coded)
	$( "#gotopageform" ).submit(function( event ) {
		var value = parseInt($( "#gotopagebox" ).val());
		if ( loadpanonum(value) ) {
		}
		else {
			$( "#responsedd" ).text( "Must be 1 <= n <= 53!" ).show().fadeOut( 3000 );
			event.preventDefault();
		}
		$("#gotopagebox").val(''); //clear value of box
		return;
	});

});


function krpano() {
    return document.getElementById('krpanoSWFObject');
}

function testthis() {
    alert(getpanoid());
    krpano().call("testing();");
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

    // alert(scenelist.toSource());
    // alert(JSON.stringify(scenelist, null, 4));
}

function loadpanonum(num) {
    //defaults to zeroth pano or sets to specified pano number
	if( 1 <= num && num <= 53) {
		panonumber = num;
		num = "virtualtourblank" + (num - 1) + ".xml";
    
        //scene_num + 1 = actual scene numbering based on the .xml file naming
        krpano().call("loadpano('" + num + "',null,MERGE,BLEND(1));");
		//CALL SOME FUNCTION TO HIGHLIGHT STUFF
		return true;
    }
	return false;
}

//generates all of the links to all of the panos
function createmorelinks() {
    for( var i = 1; i <= 53; i++) {
    $( '#leftsidepanel' ).append('<a id=\"' + "pano" + i + '\" href=\"javascript:void(0);\" onclick=\"loadpanonum(' + i +');\">Pano ' + i +'</a><br>');
    }

   //TODO : Fix it so that Number of panos is not hard-coded
}
