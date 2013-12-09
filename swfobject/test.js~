
var counter = 0;
var worked = 0;
//currently need a counter to make sure that the command has been run.
function trythis() {
    var krpano = document.getElementById("krpanoSWFObject");
    if(krpano && krpano.get && counter <= 1) {
	worked = krpano.set("view.fov", 10)
	counter = counter + 1;
    }
}

var lookat_interval = setInterval('trythis()', 21);
 

function changepano(name) {
    //some random scene to change to for testing
    name = name || "virtualtourblank10"; 
    
    //scene_num + 1 = actual scene numbering based on the .xml file naming
    var krpano = document.getElementById("krpanoSWFObject");
    krpano.call("loadpano('" + name + ".xml',null,MERGE,BLEND(1));");
}
