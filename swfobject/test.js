/*
 *  
 *  
 *
 *
 *
 */

var krpano = undefined;
 
$( document ).ready(function() {krpano = document.getElementById("krpanoSWFObject");});

function changepano(name) {
    //some random scene to change to for testing
    name = name || "virtualtourblank10"; 
    
    //scene_num + 1 = actual scene numbering based on the .xml file naming
    //var krpano = document.getElementById("krpanoSWFObject");
    krpano.call("loadpano('" + name + ".xml',null,MERGE,BLEND(1));");
}

function getpanonum(num) {
    //some random scene to change to for testing
    //num = num || "0";
    //num = "virtualtourblank" + num;
    
    //scene_num + 1 = actual scene numbering based on the .xml file naming
    //var krpano = document.getElementById("krpanoSWFObject");
    krpano.call("loadpano('" + "virtualtourblank23" + ".xml',null,MERGE,BLEND(1));");
}


