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
// 8. slide no
// 9. video timestamp

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
    if (Ydata > 50) Ydata = 50;


    DescripArray.push(Descrip);
    completeDescripArray.push(Descrip);
    


    // console.log(Xdata, Ydata, Descrip);
    // Usage: pass a SINGLE Xdata, Ydata, Descrip
    XArray.push(Xdata);
    completeXArray.push(Xdata);
    
    if (XmaxValue < Xdata) XmaxValue = Xdata;
    // console.log(XmaxValue);

    
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
    

    if (XArray.length > 10 && XArray[XArray.length - 1] - XArray[0] > 30) {
      XArray.shift(); // remove first entry
      DescripArray.shift();
      YArray.shift();
    }
    
    var trace = {
        x: XArray,
        y: YArray,
        mode: 'lines+markers',
        // name: 'You',
        text: DescripArray,//['United States', 'Canada'],
        marker: {
          color: 'rgb(164, 194, 244)',
          size: 7,
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
        },
        yaxis: {
          title: 'Variation',
          showline: false,
          autotick: true,
          showTickLabels: false,
          range: [0, 10.2]
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
  console.log('hi');

  requestAPI=false;
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

  console.log('hello', resultsDesArray.length, resultsYArray.length);
  // variables to store information about slides, 6 is the slide no.
  var slides = [],
  totalCaptures = [],
  avgAttention = [];

  for (var i = 0; i < resultsDesArray.length; i++) {
    // var slideNo = parseInt(resultsDesArray[i].charAt(6));
    var splt = resultsDesArray[i].split(" ");
    var slideNo = parseInt(splt[1]);
    console.log('heya',slideNo);
    while (slides.length < slideNo) {
      // populate the arrays upto slideNo
      slides.push(String(slides.length + 1));
      avgAttention.push(0);
      totalCaptures.push(0);
    }

    avgAttention[slideNo - 1] = ((avgAttention[slideNo - 1] * totalCaptures[slideNo - 1]) + resultsYArray[i]) / (totalCaptures[slideNo - 1] + 1);
    totalCaptures[slideNo - 1]++;
  }

  console.log('ui', resultsDesArray.length, avgAttention, totalCaptures);

  // invert the avg array
  for (let i = 0; i < avgAttention.length; i++) {
    avgAttention[i] = 1 / (1 + avgAttention[i]);
  }
  console.log("done inv")
  // plot the graph
  var trace = {
    x: resultsXArray,
    y: resultsYArray,
    mode: 'lines+markers',
    // name: 'You',
    text: resultsDesArray,//['United States', 'Canada'],
    marker: {
      color: 'rgb(164, 194, 244)',
      size: 7,
      line: {
        color: 'white',
        width: 0.5
      }
    },
    type: 'scatter',
    hoverinfo: 'text'
  };
  console.log('defined trace')
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
        range: [0, 10.2]
      }
  };
  console.log('done layout')
  var TESTER = document.getElementById('results');
  Plotly.plot( TESTER, data, layout);
  console.log('finally plotted')

  // console.log(slides, avgAttention);
  if(mode=='video') {
    $('#myModalHorizontal2').modal('show');
    return;
  }
  // plot the bar graph
  var trace1 = {
    x: slides,
    y: avgAttention,
    marker: {color: 'rgb(55, 83, 109)'},
    type: 'bar'
  };

  var data = [trace1];

  var layout = {
    title: 'Average Attention per slide',
    xaxis: {
      title: 'Slide',
      tickfont: {
        size: 14,
        color: 'rgb(107, 107, 107)'
      }},
    yaxis: {
      title: 'Attention Level',
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