function capitalize(s) {
    return s[0].toUpperCase() + s.substr(1);
}

var layout = {
    margin: {
        l: 75, 
        r: 50, 
        t: 50, 
        b: 75,
    },
    xaxis: {
        rangeslider: {},
        tickfont: {
            size: 14,
        },
    },
    yaxis: {
        tickfont: {
            size: 14,
      	},
        showticklabels: false, 
    },
    annotations: [
        {
            text: 'Neutral', 
            y: 0,
            x: 0,
            xref: 'paper',
            yref: 'y',
            xanchor: 'right',
            yanchor: 'bottom',
            showarrow: false, 
        },

        {
            text: 'Positive', 
            y: 0.9,
            x: 0,
            xref: 'paper',
            yref: 'paper',
            xanchor: 'right',
            yanchor: 'bottom',
            showarrow: false, 
        },

        {
            text: 'Negative', 
            y: 0.1,
            x: 0,
            xref: 'paper',
            yref: 'paper',
            xanchor: 'right',
            yanchor: 'bottom',
            showarrow: false, 
        }
    ] 
};

function makeGraph(trace1) {
	var header = "How are people on Twitter feeling about..."
	//var trace1 = !{JSON.stringify(graph_data)};   
	for (var i = 0; i < trace1.length; i++) { 
    	trace1[i]['name'] = capitalize(trace1[i]['name']); 
    	header = header + ' ' + trace1[i]['name']; 
    	if( i == trace1.length -1) {
        	header += '?'; 
    	}
    	else {
     		header += ', '; 
    	}
    	trace1[i]['line'] = {};
    	trace1[i]['mode'] = 'lines'; 
    	switch(trace1[i]['name']) {
        	case 'Clinton': 
            	trace1[i]['line']['color'] = 'rgb(40, 9, 236)'; 
        	break; 
        	case 'Trump': 
            	trace1[i]['line']['color'] = 'rgb(250, 0, 6)'; 
        	break; 
        	case 'Johnson':
         	   trace1[i]['line']['color'] = 'rgb(254, 154, 0)';  
        	break; 
        	case 'Stein': 
        	    trace1[i]['line']['color'] = 'rgb(0, 140, 0)'; 
        	break; 
        	case 'Kaine': 
        	    trace1[i]['line']['color'] = 'rgb(0, 248, 179)'; 
        	break; 
        	case 'Pence': 
        	    trace1[i]['line']['color'] = 'rgb(182, 4, 246)'; 
        	break; 
        	case 'Democrat': 
        	    trace1[i]['line']['color'] = 'rgb(115, 156, 251)';  
        	break; 
        	case 'Republican': 
        	    trace1[i]['line']['color'] = 'rgb(252, 99, 189)'; 
        	break; 
    	}
	}

	document.getElementById("demo").innerHTML = header;
	Plotly.newPlot('graph-div', trace1, layout); 
}



/*var elements = document.getElementsByClassName("class-1");
                    var i; 
                    for (i = 0, len = elements.length; i < len; i++) {
                    // elements[i].style ...
                        localStorage[i] = elements[i].value; 
                    }
                    document.getElementById('sel').onchange = function() {
                    localStorage[i] = document.getElementById("sel").value;
                    }
                    window.onload= function(){
                        for(var j = 0; j < localStorage.length; j++) {
                            if(localStorage[i])
                                document.getElementById("sel").value = localStorage['sel'];
                        }
                    }*/

