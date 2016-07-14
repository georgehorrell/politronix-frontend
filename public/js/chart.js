TESTER = document.getElementById('tester');

var layout = {
    xaxis: {title: 'Time'},
    yaxis: {title: 'Approval Rating'},
    margin: { t: 0 }
};

Plotly.plot( TESTER, [{
    x: [1,2,3,4,5],
    y: [1,2,4,8,16] }], 
    layout );
