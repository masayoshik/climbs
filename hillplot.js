$(function () {
    var chart;
    $(document).ready(function() {
        var options = {
            chart: {
                renderTo: 'container',
                zoomType: 'x',
                resetZoomButton: {
                    position: {
                       align: 'left', // by default
                       verticalAlign: 'top', // by default
                    }
                },
     	        resetZoomEnabled: true,
                events: {
                    click: function(event){
                    //    zoomOut();
                    },
                    redraw : function(event){
                    //    alert("redrawn");
                    }
                }
            },
            title: {
                text: 'Comparing Profiles of Major Climbs'
            },
            marker: {
	        enabled : 'false'
	    },
            subtitle: {
                text: 'click on legend to hide/show climbs and you can also zoom in/out'
            },
            xAxis: {
                title: {
                    text: 'Distance [mile]'				
		}
            },
            yAxis: {
                title: {
                    text: 'Elevation Gain from the base [feet]'
                },
                min: -10.0,
                startOnTick: false,
                showFirstLabel: false
            },
            tooltip: {
                crosshairs: [true, true],
                formatter: function() {
                        return '<b>'+ this.series.name +'</b><br/>'
                      //  ' '+ this.y + 'feet';
                }
            },
            legend : {
               layout: 'horizontal',
               itemWidth: 200,
               width: 600
            },
	    plotOptions: {
	        series: {
		    events: {
		       legendItemClick: function(event) {
		            var visibility = this.visible ? 'visible' : 'hidden';
			    //    if (!confirm('The series is currently '+ 
		   	    //            visibility +'. Do you want to change that?')) {
			    //        return false;
			    //    }
		        }
                    }			    
                },
                line: {
                    lineWidth: 2,
                    marker: {
                        enabled: false,
                    },
                    shadow: true,
	        }
            },
        };
        jQuery.getJSON('climb.js', function(json) {
             var j = 0;
             options['series'] = [];
	     for (c in json.climbdata){
		     var item = {};
		     item['name'] = json.climbdata[j].name;
		     item['data'] = json.climbdata[j].data;
		     item['visible'] = true;
                     j++;
                     options.series.push(item);
             }
             AA8_list = AA8.split(" ");
	     for (c in json.climbdata){
                 if ( AA8_list.indexOf(json.climbdata[c].name) != -1){
                    options.series[c].visible = true;
	         }else{
                    options.series[c].visible = false;
                 }
             }
             chart = new Highcharts.Chart(options);
        });
//    $('#AA8button').click(function() {
//        chart.addSeries({
//            data: [216.4, 194.1, 95.6, 54.4, 29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5]        
//        });
//        $('#AA8button').unbind('click');
    });
});
