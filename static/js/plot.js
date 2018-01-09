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
// 5. finish -> whole graph + descrip; ===> done
// 6. cap y, show bar graph of average attention per slide, change range to 5 ===> Done, debugging left
// 7. Do something about Xrange

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


    DescripArray.push(Descrip);
    completeDescripArray.push(Descrip);
    if (DescripArray.length > 20) DescripArray.shift();


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
      DescripArray.shift();
    }
    
    if (YArray.length > 20) YArray.shift();

    
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

    let layout = {
        title: 'Variation in Gaze',
        showlegend: false,
        hovermode: 'closest',
        xaxis: {
          title: XLabel,
          showgrid: false,
          zeroline: false,
          range: [0, 2*XmaxValue]
        },
        yaxis: {
          title: 'Variation',
          showline: false,
          autotick: true,
          showTickLabels: false,
          range: [0, 5.2]
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


  // variables to store information about slides, 6 is the slide no.
  var slides = [],
  totalCaptures = [],
  avgAttention = [];

  for (let i = 0; i < resultsDesArray.length; i++) {
    let slideNo = parseInt(resultsDesArray[i].charAt(6));
    while (slides.length < slideNo) {
      // populate the arrays upto slideNo
      slides.push(slides.length + 1);
      avgAttention.push(0);
      totalCaptures.push(0);
    }

    avgAttention[slideNo - 1] = ((avgAttention[slideNo - 1] * totalCaptures[i]) + resultsYArray) / (totalCaptures[i] + 1);
    totalCaptures[slideNo - 1]++;
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
        range: [0, 5.2]
      }
  };

  var TESTER = document.getElementById('results');
  Plotly.plot( TESTER, data, layout);


  // plot the bar graph
  var trace1 = {
    x: slides,
    y: avgAttention,
    marker: {color: 'rgb(55, 83, 109)'},
    type: 'bar'
  };

  var data = [trace1];

  var layout = {
    title: 'Average Attention Variance per slide',
    xaxis: {
      title: 'Slide',
      tickfont: {
        size: 14,
        color: 'rgb(107, 107, 107)'
      }},
    yaxis: {
      title: 'Variance ',
      titlefont: {
        size: 16,
        color: 'rgb(107, 107, 107)'
      },
      tickfont: {
        size: 14,
        color: 'rgb(107, 107, 107)'
      }
    },
    legend: {
      x: 0,
      y: 1.0,
      bgcolor: 'rgba(255, 255, 255, 0)',
      bordercolor: 'rgba(255, 255, 255, 0)'
    },
    barmode: 'group',
    bargap: 0.15,
    bargroupgap: 0.1
  };
  
  Plotly.newPlot('resultsBar', data, layout);


    $('#myModalHorizontal2').modal('show');
  // document.getElementById('myModalHorizontal2').modal('show');
}