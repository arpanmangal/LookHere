// Below is the plot function to use:
// Call it using:
// plot(Xdata, Yd)

// TODO:
// 3 VALUES,  ====> DONE
// xRANGE   ====> DONE (Capped the size of array)
// 1. remove scale values ===> ???
// 2. hover-> remove 10.777777 ====> DONE
// 3. implement variation graph   ====> DONE
// 4. implement for multiple users
// 5. finish -> whole graph + descrip;

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
          range: [0, 3]
        }
    };
      
    var TESTER = document.getElementById('graph');
    if (XArray.length > 5) Plotly.plot( TESTER, data, layout);
}

Number.prototype.map = function (in_min, in_max, out_min, out_max) {
  return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
