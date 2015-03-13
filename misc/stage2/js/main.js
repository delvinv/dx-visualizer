var paper;							// Initialise the Raphael canvas
var sampleName;						// If a sample dataset is chosen
var csvObjects;						// Array of objects extracted from the csv file
var cwidth = 500, cheight = 500;	// Width and Height of Raphael canvas
var dataRows, dataCols;
var arrSquares;

var defaultString = { fill: '#0ff', stroke: '#000', 'stroke-width': 0 };
var missingString = { fill: '#000', stroke: '#000', 'stroke-width': 0 };
var phoneString = { fill: '#f00', stroke: '#000', 'stroke-width': 0 };
var emailString = { fill: '#0f0', stroke: '#000', 'stroke-width': 0 };
var lineString = { fill: '#00f' };

// window.onload = function () {
$(document).ready(function() {
	// Set the raphael canvas
	paper = new Raphael(document.getElementById('raphaelviz'), cwidth, cheight);
    
    // Load a sample dataset file
    loadSampleCsv(0);
    // Where the entire visualization process takes place.
    visualizer();
});

function visualizer(){
	// Functionality inside anon function
    $.get(sampleName, function (lolo) {
    	var start = window.performance.now();
    	csvObjects = $.csv.toObjects(lolo);
    	console.log('Loading = '+ (window.performance.now()-start) );
    	// Generate a table and load it into table id
    	createHtmlTable(csvObjects);
    	// Create a viz in Raphael using contents of dataset as input.
    	var start = window.performance.now();
    	squaresViz(csvObjects);
    	console.log('Raphael = '+ (window.performance.now()-start) );
	});
}

// 1 = simple csv, 2 = good dataset, 3 = bad dataset
function loadSampleCsv(selected) {
	switch(selected){
		case 0: sampleName = 'data/sample1.csv';
			break;
		case 1: sampleName = 'data/own.csv';
			break;
		case 2:sampleName = 'data/md-good.csv'; 
			break;
		case 3:sampleName = 'data/md-bad.csv'; 
			break;
		case 4:sampleName = "data/sample2.csv" 
			break;
	}
}

function helloWorld(valo) {
	paper.clear();
	squaresViz(csvObjects);
}

function createHtmlTable(){
	var html = generateTable(csvObjects);
		
	// // Clear table
	$('#csvtable').empty();

	// // Populate Table in html with this dataset.
	$('#csvtable').html(html);
}

// build HTML table from the data objects
function generateTable(data) {
	// Patterns used for RegEx
	var phoneRE = /\d{10,14}/;	// Pattern for a 10-14 digit phone number
	var phoneRE2 = /.\d{2,}.\d{2,}/;
	var emailRE = /\S{2,40}@[a-zA-Z0-9-]{2,30}[.][a-zA-Z.]{2,20}/;	// Basic matcher for email addresses.

	var html = '';
	// If Object is empty, exit.
	if (typeof(data[0]) === 'undefined') {
		return null;
	}
	// Header of table
	html += '<tr id="table-header">\r\n';
	for (var item in data[0]) {
		html += ',<td>' + item  + '</td>\r\n';
	}
	html += '</tr>\r\n';

	for(var row in data) {
		html += '<tr>\r\n';
		// Print individual entries of this row.
		for(var item in data[row]) {
			// If missing entry then color accordingly in CSS
			if (data[row][item].length<1) {
				html += ',<td id="blanktext">' + data[row][item] + '</td>\r\n';	
			} else if (phoneRE2.test(data[row][item]) == true) {
				html += ',<td id="numtext">' + data[row][item] + '</td>\r\n';		
			} else if (emailRE.test(data[row][item]) == true) {
				html += ',<td id="emailtext">' + data[row][item] + '</td>\r\n';		
			} else {
				html += ',<td id="stringtext">' + data[row][item] + '</td>\r\n';
			}
		}
		html += '</tr>\r\n';
	}
	return html;
}

function getArraySize(data) {
	dataRows = data.length;
	dataCols = Object.keys(data[0]).length;
}

function setColorpicker(field, color){
	switch(field){
		case 1: defaultString.fill = color;
				console.log("ds = "+color+"; defaultString.fill = "+defaultString.fill);
				helloWorld();
				break;
		case 2: emailString.fill = color;
				helloWorld();
				break;
		case 3: phoneString.fill = color;
				helloWorld();
				break;
		case 4: missingString.fill = color;
				helloWorld();
				break;
		case 5: lineString.fill = color;
				helloWorld();
				break;	
	}
}

function squaresViz(data) {
	// Patterns used for RegEx
	var phoneRE = /\d{10,14}/;	// Pattern for a 10-14 digit phone number
	var phoneRE2 = /.\d{2,}.\d{2,}/;
	var emailRE = /\S{2,40}@[a-zA-Z0-9-]{2,30}[.][a-zA-Z.]{2,20}/;	// Basic matcher for email addresses.

	// If Object is empty, exit.
	if (typeof(data[0]) === 'undefined') {
		return null;
	}

	// Getting jquuery control values from the front page
	var xpadding = $( "#div-xpadding" ).slider( "value" );
	var ypadding = $( "#div-ypadding" ).slider( "value" );
	var xscale = $( "#div-xscale" ).slider( "value" )/100;
	var yscale = $( "#div-yscale" ).slider( "value" )/100;
	// Getting color values from the front page
	var defaultColor = 

	getArraySize(csvObjects);
	var xspacer = cwidth  / dataCols;		// Spacing out the individual squares in 2D space.
	var yspacer = cheight / dataRows;

	var rowCount = 1;

	arrSquares = new Array();
    
	for(var i=0; i<data.length;i++) {

		arrSquares[rowCount] = new Array();

		var columnIndex=0;		// Used to track the number of columns in the viz

		// Seperate rows into chunks
		if ( rowCount % 10 == 0 ){
			var demarcator = paper.rect(xpadding + columnIndex*(xspacer*xscale), 2 + ypadding + i*(yspacer*yscale), cwidth*xscale, 2);
			demarcator.attr(lineString);
		}
		// Print individual entries of this row.
		for(var j in data[i]) {
			arrSquares[rowCount][columnIndex] = 
					paper.rect(xpadding + columnIndex*(xspacer*xscale), ypadding 
					+ i*(yspacer*yscale), 22, 3);
			// If missing entry then color accordingly in CSS
			// var rect = paper.rect(xpadding + columnIndex*(xspacer*xscale), ypadding + i*(yspacer*yscale), 22, 3);
			if (data[i][j].length<1) {
	        	arrSquares[rowCount][columnIndex].attr(missingString);	
			} else if (phoneRE2.test(data[i][j]) == true) {
	        	arrSquares[rowCount][columnIndex].attr(phoneString);	
			} else if (emailRE.test(data[i][j]) == true) {
	        	arrSquares[rowCount][columnIndex].attr(emailString);		
			} else {
	        	arrSquares[rowCount][columnIndex].attr(defaultString);	
			}
			columnIndex++;
		}
		rowCount++;
	}
}
