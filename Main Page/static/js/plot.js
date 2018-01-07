// Below is the plot function to use:
// Call it using:
// plot(Xdata, Yd)

console.log('hi');

var XArray = [],
    YArray = [],
    XLabel = "test",
    DescripArray = [];


var completeXArray = [],
    completeYArray = [],
    completeDescripArray = [];

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

    YArray.push(Ydata);
    completeYArray.push(Ydata);
    if (YArray.length > 20) YArray.shift();

    DescripArray.push(Descrip);
    completeDescripArray.push(Descrip);
    if (DescripArray.length > 20) DescripArray.shift();


    var trace = {
        x: XArray,
        y: YArray,
        mode: 'markers',
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
        type: 'scatter'
    };

    var data = [trace];

    var layout = {
        title: 'Time',
        showlegend: false,
        xaxis: {
          title: XLabel,
          showgrid: false,
          zeroline: false
        },
        yaxis: {
          title: 'Attention',
          showline: false
        }
    };
      
    var TESTER = document.getElementById('graph');
    Plotly.plot( TESTER, data, layout);
}