var smoothie = new SmoothieChart({enableDpiScaling:false});
smoothie.streamTo(document.getElementById("graphcanvas"));

// Data
var line1 = new TimeSeries();
var line2 = new TimeSeries();

setInterval(function() {
    line1.append(new Date().getTime(), Math.random());
    line2.append(new Date().getTime(), Math.random());
}, 1000);

// add to smoothiechart
smoothie.addTimeSeries(line1);
smoothie.addTimeSeries(line2);
