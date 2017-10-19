// $(document).ready(
// 	function ()
// 	{
// 		initialize();
// 	}
// )
var lineplotSensorObjectID;

function initialize(){

	

}

$(document).on('click', '#logoutButton', function() {
	window.location.href = "/logout";
});

$(document).on('click','#btnLineplotClose', function() {
	hideLineplot();
});

$(document).on('click', '.widget-feature', function() {

	showLineplot();


	var featureID = this.id;
	var focus = featureID.split("/")[0];
	var sensorObjectID = featureID.split("/")[1];
	lineplotSensorObjectID = sensorObjectID;
	// var endtime = 1507216072;
	var endtime = moment().format('X');
	// use 12h window as default
	var starttime = endtime - 43200;

	getChartData(sensorObjectID, starttime, endtime, function(response){

		var csv = response.docs;
		updateLinePlot(csv,focus);		
	});

});

$(document).on('click','#btn12h', function(){

	if ($("#lineplot").is(":hidden")){

	}else{
		var sensorObjectID = lineplotSensorObjectID;
		var endtime = moment().format('X');
		var starttime = endtime - 43200;

		getChartData(sensorObjectID, starttime, endtime, function(response){
			var csv = response.docs;
			updateLinePlot(csv,focus);		
		});
	}
});

$(document).on('click','#btn24h', function(){

	if ($("#lineplot").is(":hidden")){

	}else{
		var sensorObjectID = lineplotSensorObjectID;
		var endtime = moment().format('X');
		var starttime = endtime - 86400;

		getChartData(sensorObjectID, starttime, endtime, function(response){
			var csv = response.docs;
			updateLinePlot(csv,focus);		
		});
	}
});


$(document).on('click','#btn48h', function(){

	if ($("#lineplot").is(":hidden")){

	}else{
		var sensorObjectID = lineplotSensorObjectID;
		var endtime = moment().format('X');
		var starttime = endtime - 172800;

		getChartData(sensorObjectID, starttime, endtime, function(response){
			var csv = response.docs;
			updateLinePlot(csv,focus);		
		});
	}
});

$(document).on('click','#btn1w', function(){

	if ($("#lineplot").is(":hidden")){

	}else{
		var sensorObjectID = lineplotSensorObjectID;
		var endtime = moment().format('X');
		var starttime = endtime - 604800;

		getChartData(sensorObjectID, starttime, endtime, function(response){
			var csv = response.docs;
			updateLinePlot(csv,focus);		
		});
	}
});


function showLineplot(){

	if ($( "#container-lineplot" ).is( ":hidden" )){
		$( "#container-lineplot" ).slideDown();
	}
}

function hideLineplot(){

	if($("#container-lineplot").not(":hidden")){
		$("#container-lineplot").slideUp();
	}
}


function getChartData(sensorObjectID, starttime, endtime, callback){

	if ($( "#lineplot" ).is( ":hidden" )){
		
	}else{

		var url = '/get/ChartData/' + sensorObjectID + '/'+starttime+'-'+endtime;
		$.get(url, function( response ) {
			if(response.status == 'ok'){
				callback(response);
			}
		});
	}
}

function updateLinePlot(csv, focus){

	if(focus=="t"){
		var visTemp = true;
		var visPres = false;
		var visHum = false;
	}else if(focus =="p"){
		var visTemp = false;
		var visPres = true;
		var visHum = false;
	}else if(focus =="h"){
		var visTemp = false;
		var visPres = false;
		var visHum = true;
	}else{
		var visTemp = true;
		var visPres = true;
		var visHum = true;
	}

	var temp = [];
	var pres = [];
	var hum = [];
	var time = [];
	
	 // Split the lines
	var lines = csv.split('\n');

	 // Iterate over the lines and add categories or series
	$.each(lines, function(lineNo, line) {
		var items = line.split(',');
		
		// header line containes categories
		if (lineNo == 0) {
	
		}
		// the rest of the lines contain data with their name in the first 
		// position
		else {
			
			$.each(items, function(itemNo, item) {
				if (itemNo == 0) {
					time.push(moment(item,'X').format("HH:mm"));
				}
				if (itemNo == 1){
					//temperature
					temp.push(parseFloat(item));
				} 
				if (itemNo == 2){
					//pressure
					pres.push(parseFloat(item));
				}
				if (itemNo == 3){
					//humidity
					hum.push(parseFloat(item));
				}
			});
		}
	});

	var options = {
		chart: {
			renderTo: 'lineplot',
			zoomType: 'x'
		},
		title: {
        	text: ''
    	},
    	credits: {
   			enabled: false
		},
		colors: ['#B25644', '#60708C', '#A18D76'],
		xAxis: [{
			categories: time
		}],
		yAxis: [{ // Primary yAxis
			labels: {
				format: '{value}°C',
			},
			title: {
				text: 'Temperature',
			},
			opposite: false

		}, { // Secondary yAxis

			gridLineWidth: 1,
			title: {
				text: 'Pressure'
			},
			labels: {
				format: '{value} mb'
			},
			opposite: true

		}, { // Tertiary yAxis

			gridLineWidth: 1,
			opposite: true,
			title: {
				text: 'Humidity'
			},
			labels: {
				format: '{value} %'
			}

		}],
		tooltip: {
		    shared: true
		},
		series: [

		{
			name: 'Temperature',
			type: 'spline',
			yAxis: 0,
			visible: visTemp,
			marker: {
				enabled: true
			},
			data: temp,
			tooltip: {
				valueSuffix: ' °C'
			}
		}, 

		{
			name: 'Pressure',
			type: 'spline',
			yAxis: 1,
			visible: visPres,
			data: pres,
			marker: {
				enabled: false
			},
			tooltip: {
				valueSuffix: ' mb'
			}

		}, 

		{
			name: 'Humidity',
			type: 'spline',
			yAxis: 2,
			visible: visHum,
			data: hum,
			marker: {
				enabled: false
			},
			tooltip: {
				valueSuffix: ' %'
			}
		}
		]
	};

	// Create the chart
	var chart = new Highcharts.chart(options);
	
}

function initialize(){


}