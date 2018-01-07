// Below is the plot function to use:
// Call it using:
// plot(Xdata, Yd)

function plot(Xdata, Ydata, XLabel) {
    var trace = {
        x: Xdata,
        y: Ydata,
        mode: 'markers',
        name: 'You',
      //   text: ['United States', 'Canada'],
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
      
    var TESTER = document.getElementById('tester');
    Plotly.plot( TESTER, data, layout);
}