
//global variable : krpano initialized when document is ready
var krpano = undefined;
var count = 0;
$( document ).ready(function() {
    krpano = document.getElementById("krpanoSWFObject");
    createmorelinks();
});


function getpanonum(num) {
    //defaults to zeroth pano or sets to specified pano number
    num = "virtualtourblank" + ( num || "0" ) + ".xml";
    
    //scene_num + 1 = actual scene numbering based on the .xml file naming
    krpano.call("loadpano('" + num + "',null,MERGE,BLEND(1));");
}

//generates all of the links to all of the panos
function createmorelinks() {
    for( var i = 0; i <= 52; i++) {
	$( '#leftsidepanel' ).append('<a href=\"javascript:void(0);\" onclick=\"getpanonum(' + i +');\">Pano ' + i +'</a><br>'); 
    }
}

// function loadfile() {
//     $.get('stuff.txt', function(data) {
// var lines = txt.responseText.split("\n");
// for (var i = 0, len = lines.length; i < len; i++) {
//     do something with lines[i];
// }
//     });
// }

function addtxt(string, location) {
    $( location ).prepend("<p>"+ string + "</p>");
    //$( location ).append("<p>"+ string + "</p>");
}
