var myConfig = {
 	type: 'line',
  legend:{
  },
 	title: {
 	  text: 'Standard deviation of IPS versus different clipping value'
 	},
 	plot: {
 	  tooltip: {
 	    visible: false
 	  },
 	  cursor: 'hand'
 	},
 	crosshairX:{},
 	scaleX: {
    markers: [],
    offsetEnd:75,
 	  labels: ['1', '2', '5', '10', '15', '20', '30', '50', '100', '150', '200', '250', '300', '350', '400', '450', '500', '550'],
    "label":{
       "text":"Clipping Value"
   }
 	},
  "scale-y":{
    // "values":"50:61",
    "label":{
       "text":"IPS_Std"
   }
  },
	series: [
		{
			values: [5.808016810956327, 3.853466539582913, 6.294980536631843, 5.439615187105221, 6.343390677527667, 7.419082963294021, 9.849465106458537, 15.710537592007439, 8.396800342132616, 7.978578190262135, 8.036264381394915, 9.138211622907777, 7.872886521643472, 6.599653671867464, 6.676110640796489, 7.794566015611402, 6.189324417111622, 8.591661720116768],
			text: 'IPS_Std'
		}
	]
};

zingchart.render({
	id: 'myChart',
	data: myConfig,
	height: '100%',
	width: '100%'
});

/*
 * define Marker class to construct
 * markers on the fly easier.
 */
function Marker(_index) {
  return {
    type: 'line',
    lineColor: '#424242',
    lineWidth: 1,
    range: [_index],
    flat: false,
  }
}

/*
 * define Label class to construct
 * labels on the fly easier.
 */
function Label(_text, _id, _offsetX, _offsetY) {
  return {
      id: _id,
      text: _text,
      angle: 0,
      padding:'5 10 5 10',
      wrapText:true,
      textAlign: 'left',
      backgroundColor: '#eeeeee',
      offsetX: _offsetX,
      offsetY: _offsetY ? _offsetY : 0,
      cursor: 'pointer',
      flat: false,
      fontStyle: 'bold',
      fontSize: 13,
    }
}

// format the label text
function formatLabelText(_nodeindex, _scaleText) {
  var plotInfo = null;
  var nodeInfo;
  var seriesText = '';
  var labelString = isNaN(_scaleText) ? _scaleText + '<br>' : '';
  var color = '';
  var plotLength = zingchart.exec('myChart', 'getplotlength', {
      graphid : 0
  });

  for (var i = 0; i < plotLength; i++) {
    plotInfo = zingchart.exec('myChart', 'getobjectinfo', {
        object : 'plot',
        plotindex : i
    });
    nodeInfo = zingchart.exec('myChart', 'getobjectinfo', {
        object : 'node',
        plotindex : i,
        nodeindex: _nodeindex
    });
    color = plotInfo.lineColor ? plotInfo.lineColor : plotInfo.backgroundColor1;
    seriesText = plotInfo.text ? plotInfo.text : ('Series ' + (i+1));
    labelString += '<span style="color:' + color + '">' + seriesText + ':</span>' +
                   ' ' + nodeInfo.value + '<br>';
  }

  return labelString;
}

// global array for markers since you can only update the whole array
var markersArray = [];
var labelsArray = [];

// hash table for markers
var markerHashTable = {};
var labelsHashTable = {};

/*
 * Register a graph click event and then render a chart with the markers
 */
zingchart.bind('myChart','click', function(e) {
  var xyInformation;
  var nodeIndex;
  var scaleText;
  var xPos;
  var yPos;

  // make sure not a node click and click happend in plotarea
  if (e.target != "node" && e.plotarea) {
    xyInformation = zingchart.exec('myChart', 'getxyinfo', {
      x: e.ev.clientX,
      y: e.ev.clientY
    });

    // if anything is found, 0 corresponds to scale-x
    if (xyInformation && xyInformation[0] && xyInformation[2]) {
      nodeIndex = xyInformation[0].scalepos;
      scaleText = xyInformation[0].scaletext;

      console.log(xyInformation, nodeIndex, scaleText)
      // check hash table. Add marker
      if (!markerHashTable['nodeindex' + nodeIndex]) {
        var nodeInfo = zingchart.exec('myChart', 'getobjectinfo', {
          object: 'node',
          nodeindex: nodeIndex,
          plotindex:0
        });

        var labelText = formatLabelText(nodeIndex, scaleText);
        var labelId = 'label_' + nodeIndex;
        // create a marker
        var newMarker = new Marker(nodeIndex);
        var newLabel = new Label(labelText, labelId, nodeInfo.x, nodeInfo.y);

        markerHashTable['nodeindex' + nodeIndex] = true;
        markersArray.push(newMarker);

        labelsArray.push(newLabel);

        // render the marker
        myConfig.scaleX.markers = markersArray;
        myConfig.labels = labelsArray;
        zingchart.exec('myChart', 'setdata', {
          data: myConfig
        });
      } else {
        console.log('---marker already exists----')
      }
    }
  }

});

/*
 * Register a node_click event and then render a chart with the markers
 */
zingchart.bind('myChart','node_click', function(e) {

  // check hash table. Add marker
  if (!markerHashTable['nodeindex' + e.nodeindex]) {
    var labelText = formatLabelText(e.nodeindex, e.scaletext);
    var labelId = 'label_' + e.nodeindex;
    // create a marker
    var newMarker = new Marker(e.nodeindex, labelText, e.plotindex);
    var newLabel = new Label(labelText, labelId, e.ev.layerX, e.ev.layerY);

    markerHashTable['nodeindex' + e.nodeindex] = true;
    markersArray.push(newMarker);

    labelsArray.push(newLabel);

    // render the marker
    myConfig.scaleX.markers = markersArray;
    myConfig.labels = labelsArray;
    zingchart.exec('myChart', 'setdata', {
      data: myConfig
    });
  } else {
    console.log('---marker already exists----')
  }
});

var labelMouseDown = false;
var labelId = null;
var previousYPosition = null;
/*
 * bind mousedown event for dragging label
 */
zingchart.bind('myChart', 'label_mousedown', function(e) {
  labelMouseDown = true;
  labelId = e.labelid;
  zingchart.exec('myChart', 'hideguide');
});

zingchart.bind('myChart', 'mousemove', function(e) {
  if (labelMouseDown && labelId) {
    zingchart.exec('myChart', 'updateobject', {
        type : 'label',
        data : {
            id : labelId,
            offsetY: e.ev.layerY
        }
    });
  }
});

zingchart.bind('myChart', 'mouseup', function(e) {
  labelMouseDown = false;
  labelId = null;
  zingchart.exec('myChart', 'showguide');
});

zingchart.bind('myChart', 'doubleclick', function(e) {
  console.log(e)
});
