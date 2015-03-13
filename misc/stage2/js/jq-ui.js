$(document).ready( function() {
// Scale and Padding sliders
  setSliders("#div-xscale", 0, 100, 99, "#amt-xscale");
  setSliders("#div-yscale", 0, 100, 99, "#amt-yscale");
  setSliders("#div-xpadding", 0, 100, 0, "#amt-xpadding");
  setSliders("#div-ypadding", 0, 100, 0, "#amt-ypadding");

// File selection menu
  $( "#files" ).selectmenu({
      change: function( event, data ) {
        loadNewSample($('#files')[0].selectedIndex);
      }
     });
// HTML5 Colorpickers
  $('#chd').change(function(event) {
    setColorpicker(1,$('#chd').val());
  });
  $('#che').change(function(event) {
    setColorpicker(2,$('#che').val());
  });
  $('#chp').change(function(event) {
    setColorpicker(3,$('#chp').val());
  });
  $('#chm').change(function(event) {
    setColorpicker(4,$('#chm').val());
  });
  $('#chl').change(function(event) {
    setColorpicker(5,$('#chl').val());
  });
  $('#chb').change(function(event) {
    paper.canvas.style.backgroundColor = $('#chb').val();
  });
// Buttons
  $('#btnClear').click(function(event) {
    paper.clear();
  });
  $('#btnDraw').click(function(event) {
    helloWorld();
  });
});

function setSliders (name, min, max, value, label) {
  $( name ).slider({
      // orientation: "vertical",
      range: "min",
      min: min,
      max: max,
      value: value,
      slide: function( event, ui ) {
        $( label ).val( ui.value );
        helloWorld( $( label ).val() );
      }
    });
    $( label ).val( $( name ).slider( "value" ) );
}

function loadNewSample(csvIndex) {
  paper.clear();
  loadSampleCsv(csvIndex);
  visualizer();
}

// Spectrum colorpicker jquery plugin
        // <script type="text/javascript" src="js/spectrum.js"></script>
        // <link rel="stylesheet" href="css/spectrum.css">
function colorpickers(){
  $("#colorpicker-default").spectrum({
    color: "#f00",
    change: function(color) {
      // setColorpicker(1,color.toHexString());
      setColorpicker(1, $('#chd').val());
    }
  });
}