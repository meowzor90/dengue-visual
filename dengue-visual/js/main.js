//global variables
var map; //map object

var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#81F781",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
	
};

function getColor(d) {
    return d > 13000 ? '#151B54' :
           d > 11000  ? '#0041C2' :
           d > 9000 ? '#1F45FC' :
           d > 7000 ? '#357EC7' :
           d > 5000  ? '#659EC7' :
           d > 3000  ? '#44BBCC' :
           d > 1000   ? '#88DDDD' :
                      '#BBEEFF';
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.Census2000_TOTALPOP),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

var geojsonMarkerOptions1 = {
    radius: 8,
    fillColor: "#D61B1B",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.5 
};
//begin script when window loads
window.onload = initialize(); //->

//the first function called once the html is loaded
function initialize(){
  //<-window.onload
  setMap(); //->
};



//set basemap parameters
function setMap() {
  //<-initialize()
  
  //create  the map and set its initial view
  map = L.map('map').setView([1.355312,103.827068], 11);
  
  
  
  //add a marker in the given location
 // marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
 //var marker= L.marker([1.319802,103.856882 ], {icon: mosquitoIcon}).addTo(map);
//marker.bindPopup("<b>Hello world!</b><br>I am a mosquito.").openPopup();
  //add the tile layer to the map
  var openstreet = L.tileLayer(
    'http://{s}.tile.osm.org/{z}/{x}/{y}.png', 
    {
		  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	  }).addTo(map);
	
	var baseMaps = {
		"Minimal": openstreet,
	};
	
	//Using AJAX to load the geojson file 
	
	var layer1 = new L.GeoJSON.AJAX("data/breeding_area_hdb.geojson",{pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions).setRadius(feature.properties.COUNT_POST * 5);},
		onEachFeature: function (feature, layer) { layer.bindPopup('<b>No. of mosquito breeding habitats: '+feature.properties.COUNT_POST+'</b>')}}).addTo(map);
	
	var layer2 = new L.GeoJSON.AJAX("data/dengue_case_hdb.geojson",{pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions1).setRadius(feature.properties.COUNT_POST *5);},
		onEachFeature: function (feature, layer) { layer.bindPopup('<b>No. of dengue cases at this point: '+feature.properties.COUNT_POST+'</b>')}});
	
	var layer5 = new L.GeoJSON.AJAX("data/test.geojson",{style:style,
		onEachFeature: function (feature, layer) { layer.bindPopup('<b> Population size in this area: '+feature.properties.Census2000_TOTALPOP+'</b>')}});
	
	var layer3 = new L.GeoJSON.AJAX("data/regionline.geojson",{
		color: 'black',
		Opacity: 1,
		fillOpacity: 1,
		onEachFeature: function (feature, layer) { layer.bindPopup('<b>'+feature.properties.id+'</b>')}
	});
	
	var baseMap2 = {
		"Mosquito Breeding Area HDB": layer1,
		"Dengue Cases HDB": layer2,
		"Region": layer3,
		"Population Chloropleth": layer5
	};
	
	L.control.layers(baseMaps,baseMap2).addTo(map);
	
	//Labels of regions
	var northRegion = L.divIcon({
		className: 'regionName',
		html: 'North Region'
				
	});
	var westRegion = L.divIcon({
		className: 'regionName',
		html: 'West Region'
				
	});
	var centralRegion = L.divIcon({
		className: 'regionName',
		html: 'Central Region'
				
	});
	var eastRegion = L.divIcon({
		className: 'regionName',
		html: 'East Region'
				
	});
	var northEastRegion = L.divIcon({
		className: 'regionName',
		html: 'Northeast Region'
				
	});
	
	var north = L.marker([1.43101,103.77021], {icon: northRegion}),
		west = L.marker([1.37738,103.69043], {icon: westRegion}),
		central = L.marker([1.32032,103.80494], {icon: centralRegion}),
		east = L.marker([1.36157,103.92323], {icon: eastRegion}),
		northeast = L.marker([1.38563,103.85343], {icon: northEastRegion});
	
	
	var regionsLayer = L.layerGroup([north,west,central,east,northeast]);
	
	//Position of legends
	var legend = L.control({position: 'bottomright'});
	
	legend.onAdd = function (map) {

		var div = L.DomUtil.create('div', 'info legend'),
			grades = [0, 1000, 3000, 5000, 7000, 9000, 11000, 13000],
			labels = [];

		// loop through our density intervals and generate a label with a colored square for each interval
		for (var i = 0; i < grades.length; i++) {
			div.innerHTML +=
				'<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
				grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
		}

		return div;
	};
	
	// toggle on legend and region layer
	map.on('overlayadd', function (eventLayer) {
    // Switch to the chloropleth legend...
		if (eventLayer.name === "Population Chloropleth") {
			
			
			legend.addTo(this);
				
		}else if(eventLayer.name === "Region"){
			
			regionsLayer.addTo(map);
			
		} 
		
		else { // Or switch to the Population Change legend...
			
		}
	});
	
	//toggle off legend and region layer
	map.on('overlayremove', function (eventLayer) {
    // Switch to the chloropleth legend...
		if (eventLayer.name === "Population Chloropleth") {
			
			
			this.removeControl(legend);
				
		}else if(eventLayer.name === "Region"){
			
			this.removeLayer(regionsLayer);
			
		} 
		
		else { // Or switch to the Population Change legend...
			
		}
	});

    
	
};




function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.popupContent) {
        layer.bindPopup(feature.properties.popupContent);
    }
};

console.log("My first geoweb mapping application")
