$(document).ready(function() {
	// Load 
	loadMenu();
	loadTableLegend();
	// uploadCsv();

	$('#btn1').hover(function( event ) {
		console.log("Ich auch um");
		console.log(event);
	});

	$('#btn1').on({
		mouseenter: function(e) {
			console.log("entered");
		},
		mouseleave: function(e) {
			console.log("left button");
		},
		click: function(e) {
			var elem = $(this);
			console.log( elem.text() );
			e.preventDefault();
			$('ul.nav-menu').append('<li><a href="#">About</a></li>');
			$('#csvtable').empty();	
		}
	})

	$('#btn2').on( 'click', function( e ) {
		e.preventDefault();
		console.log($('#csvtable').css('display'));
		if( $('#csvtable').css('display') == 'none'){
			
			$('#csvtable').show("slow");
			$('.table-nav').show("fast");

			$('#btn2').html('Hide Table');
		} else {
			$('#btn2').html('Show Table');

			$('#csvtable').hide("slow");
			$('.table-nav').hide("fast");
		}
	})
});

function loadMenu() {
	$('ul.nav-menu').append('<li><a href="index.html">Home</a></li>');
	$('ul.nav-menu').append('<li><a href="good.html">DX Good</a></li>');
	$('ul.nav-menu').append('<li><a href="bad.html">DX Bad</a></li>');
	$('ul.nav-menu').append('<li><a href="fakegen1.html">50000 Rows</a></li>');
	$('ul.nav-menu').append('<li><a href="upload.html">Own Dataset</a></li>');
}

function loadTableLegend() {
		$('div.tableLegend').append('<p id="stringtext" style="width: 150px;">String</p>');
		$('div.tableLegend').append('<p id="numtext" style="width: 150px;">Phone Numbers</p>');
		$('div.tableLegend').append('<p id="emailtext" style="width: 150px;">E-mails</p>');
		$('div.tableLegend').append('<p id="blanktext" style="color:white; width: 150px;">Missing Value</p>');
}

function uploadCsv() {
	if(isAPIAvailable()) {
      $('#fileInput').on('change', function handleFileSelect (evt) {
      	var files = evt.target.files; // FileList object
	    var file1 = files[0];

		var reader = new FileReader();
	    reader.readAsText(file1);
	    reader.onload = function(event){
			var csv = event.target.result;
			try {
		    	var data = $.csv.toObjects(csv);
			}
			catch(err){
				alert(err);
			}
			var html = generateTable(data);
			// Clear table
			$('#csvtable').empty();
			// Populate Table in html with this dataset.
			$('#csvtable').html(html);    
		};	
      });
    }
}

// displays a warning if the browser doesn't support the HTML5 File API
  function isAPIAvailable() {
    // Check for the various File API support.
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      // Great success! All the File APIs are supported.
      return true;
    } else {
      alert("The browser you're using does not currently support\nthe HTML5 File API. As a result the file loading demo\nwon't work properly.");
      return false;
    }
  }

// 1 = simple csv, 2 = good dataset, 3 = bad dataset
function loadSampleCsv(selected) {
	var sampleName;
	if (selected == 1) {
		sampleName = 'data/sample1.csv';
	} else if (selected == 2) {
		sampleName = 'data/md-good.csv';
	} else if (selected == 3) {
		sampleName = 'data/md-bad.csv';
	} else if (selected == 4) {
		sampleName = "data/sample2.csv"
	}
	$.get(sampleName, function (lolo) {
    	var data = $.csv.toObjects(lolo);
		var html = generateTable(data);
		// Clear table
		$('#csvtable').empty();
		// Populate Table in html with this dataset.
		$('#csvtable').html(html);
	});
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

	// Main table. For each row in table, print entries.
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