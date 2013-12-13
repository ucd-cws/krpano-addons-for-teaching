
//global variable : krpano initialized when document is ready
//var krpano = undefined;
var count = 0;

$( document ).ready(function() {
    //krpano = document.getElementById("krpanoSWFObject");
    createmorelinks();

    $( '#leftsidepanel' ).prepend('<a href=\"javascript:void(0);\" onclick=\"callme()\">BLAH</a><br>');

    //below is testing the resizing functionality using jquery
    var maxdocwidth = document.body.clientWidth

    $('#leftsidepanel').resizable({
	handles: 'e',
	resize: function(event, ui){
            var currentWidth = ui.size.width;
            
            // this accounts for padding in the panels + 
            // borders, you could calculate this using jQuery
            var padding = 12; 
            
            // this accounts for some lag in the ui.size value, if you take this away 
            // you'll get some instable behaviour
            $(this).width(currentWidth);
            
            // set the content panel width
            $('#container').width(maxdocwidth - currentWidth - padding);            
	}
    });
    
});

function callme() {
    krpano().call("change_pano2();");
}

function krpano() {
        return document.getElementById('krpanoSWFObject');
}

function getpanonum(num) {
    //defaults to zeroth pano or sets to specified pano number
    num = "virtualtourblank" + ( num || "0" ) + ".xml";
    
    //scene_num + 1 = actual scene numbering based on the .xml file naming
    krpano().call("loadpano('" + num + "',null,MERGE,BLEND(1));");
}

//generates all of the links to all of the panos
function createmorelinks() {
    for( var i = 0; i <= 52; i++) {
	$( '#leftsidepanel' ).append('<a href=\"javascript:void(0);\" onclick=\"getpanonum(' + i +');\">Pano ' + (i + 1) +'</a><br>'); 
    }
   //TODO : Number of panos is hard-coded
}

// function loadfile() {
//     $.get('stuff.txt', function(data) {
// var lines = txt.responseText.split("\n");
// for (var i = 0, len = lines.length; i < len; i++) {
//     do something with lines[i];
// }
//     });
// }

//used for testing by terence
function addtxt(string, location) {
    $( location ).prepend("<p>"+ string + "</p>");
    //$( location ).append("<p>"+ string + "</p>");
}
