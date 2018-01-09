// Below is the plot function to use:
// Call it using:
// plot(Xdata, Yd)

// TODO:
// 3 VALUES,  ====> DONE
// xRANGE   ====> DONE (Capped the size of array)
// 1. remove scale values ===> ???
// 2. hover-> remove 10.777777 ====> DONE
// 3. implement variation graph   ====> DONE
// 4. implement for multiple users ====> DONE verification pending
// 5. finish -> whole graph + descrip;
// 6. cap y, show bar graph, change range to 5

console.log('hi');

var XArray = [],
    YArray = [],
    XLabel = "Time (s)",
    DescripArray = [];


var completeXArray = [],
    completeYArray = [],
    completeDescripArray = [];

var Yavg, // for storing moving average
    Yvar;

var XmaxValue = -100;

/* Example Usage:
  setInterval(function() {
                plot(Math.random() * 10, Math.random() * 100, String((Math.random() * 50)));
            }, 1000);
*/

function plot(Xdata, Ydata, Descrip) {
    // cap Ydata
    if (Ydata > 5) Ydata = 5;

    console.log(Xdata, Ydata, Descrip);
    // Usage: pass a SINGLE Xdata, Ydata, Descrip
    XArray.push(Xdata);
    completeXArray.push(Xdata);
    if (XArray.length > 20) XArray.shift(); // remove first entry
    if (XmaxValue < Xdata) XmaxValue = Xdata;
    console.log(XmaxValue);

    
    completeYArray.push(Ydata);
    if (completeYArray.length >= 3) {
      Yavg = completeYArray.slice(-3).reduce(function(a, b) {
        return a + b;
      }) / 3.0; // takes average of last three elements

      Yvar = Math.abs((Yavg - Ydata));
      YArray.push(Yvar);
    } else {
      XArray.shift(); // remove that data from it
    }
    
    if (YArray.length > 20) YArray.shift();

    DescripArray.push(Descrip);
    completeDescripArray.push(Descrip);
    if (DescripArray.length > 20) DescripArray.shift();


    var trace = {
        x: XArray,
        y: YArray,
        mode: 'lines+markers',
        // name: 'You',
        text: DescripArray,//['United States', 'Canada'],
        marker: {
          color: 'rgb(164, 194, 244)',
          size: 12,
          line: {
            color: 'white',
            width: 0.5
          }
        },
        type: 'scatter',
        hoverinfo: 'text'
    };

    var data = [trace];

    var layout = {
        title: 'Variation in Gaze',
        showlegend: false,
        hovermode: 'closest',
        xaxis: {
          title: XLabel,
          showgrid: false,
          zeroline: false
        },
        yaxis: {
          title: 'Variation',
          showline: false,
          autotick: true,
          showTickLabels: false,
          range: [0, 5]
        }
    };
      
    var TESTER = document.getElementById('graph');
    if (XArray.length > 5) Plotly.plot( TESTER, data, layout);
}

Number.prototype.map = function (in_min, in_max, out_min, out_max) {
  return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function showResults() {
  // Use this function at the end to display all the results, like overall graph, data etc.
  // Make a div called 'results' in your html where you want to see the resultant graph
  // change the name if you want to call it something else
data=false;
  var resultsYArray = [],
      resultsXArray = [],
      resultsDesArray = [];

  for (let i = 3; i < completeYArray.length; i++) {
    resultsXArray.push(completeXArray[i]);
    resultsDesArray.push(completeDescripArray[i]);

    var sum = completeYArray[i] + completeYArray[i - 1] + completeYArray[i - 2];
    Yavg = sum / 3.0; // takes average of last three elements

    Yvar = Math.abs((Yavg - completeYArray[i]));
    resultsYArray.push(Yvar);
  }

  // plot the graph
  var trace = {
    x: completeXArray,
    y: completeYArray,
    mode: 'lines+markers',
    // name: 'You',
    text: completeDescripArray,//['United States', 'Canada'],
    marker: {
      color: 'rgb(164, 194, 244)',
      size: 12,
      line: {
        color: 'white',
        width: 0.5
      }
    },
    type: 'scatter',
    hoverinfo: 'text'
  };

  var data = [trace];

  var layout = {
      title: 'Variation in Gaze',
      showlegend: false,
      hovermode: 'closest',
      xaxis: {
        title: XLabel,
        showgrid: false,
        zeroline: false
      },
      yaxis: {
        title: 'Variation',
        showline: false,
        autotick: true,
        showTickLabels: false,
        range: [0, 5]
      }
  };

  var TESTER = document.getElementById('results');
  Plotly.plot( TESTER, data, layout);

    $('#myModalHorizontal2').modal('show');
  // document.getElementById('myModalHorizontal2').modal('show');
}