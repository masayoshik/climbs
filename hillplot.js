$(function () {
    var chart;
    var region_group;
    $(document).ready(function() {
        var options = {
            chart: {
                renderTo: 'container',
                zoomType: 'x',
                type: 'line',
                width: 1250,
                height: 650,
                events: {
                    click: function(event){
                          chart.zoomOut();
                    }
                },
                backgroundColor: "#FFFFFF",
                borderWidth: 2 
            },
            title: {
                text: 'Comparing Climb Profiles'
            },
            marker: {
	        enabled : 'false'
	    },
            subtitle: {
                text: ''
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
                startOnTick: false,
            },
            tooltip: {
                crosshairs: [true, true],
                formatter: function() {
                        return '<b>'+ this.series.name +'</b><br/>' +
                        'Dist: '+ this.point.x + 'mi' +'<br/>' +
                        'Elev gain: '+ this.point.y + 'ft' +'<br/>' +
                        'Gradient (segment): '+ this.point.z + '%' +'<br/>' +
                        'Gradient (from start): '+ this.point.u + '%';
                }
            },
            legend : {
               layout: 'horizontal',
               itemWidth: 135,
               width: 540,
               align: 'right', 
               verticalAlign: 'top',
               y: 40 
            },
	    plotOptions: {
	        series: {
		    events: {
		       legendItemClick: function(event) {
		            var visibility = this.visible ? 'visible' : 'hidden';
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
        jQuery.getJSON('hilldata.js', function(json) {
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
             Start_list = AtStart.split(" ");
	     for (var c in json.climbdata){
                 if ( Start_list.indexOf(json.climbdata[c].name) != -1){
                    options.series[c].visible = true;
	         }else{
                    options.series[c].visible = false;
                 }
             }
             chart = new Highcharts.Chart(options);

             var vpos_base = chart.options.chart.height * 1/2 + 50;
             var vpos_max =  chart.options.chart.height - 50;
             var hpos_base = chart.options.chart.width-chart.options.legend.width;
             var vpos = vpos_base;
             var hpos = hpos_base;
             var vgap = 22;
             var hgap = 160;

             chart.renderer.text('Clicking each legend will toggle show/hide',hpos_base+10,chart.options.legend.y+5).add();

             chart.renderer.text('Toggle show/hide all climbs',hpos,vpos).add();
             vpos += 10;
             chart.renderer.button('Show All',hpos,vpos,
                 function(){
                     var all = [];
                     for (var c in chart.series){
                         all.push(chart.series[c].name);
                     }
                 group_show(all);
                 }
             ).add();
             chart.renderer.button('Hide All',hpos+hgap,vpos,
                 function(){
                     group_show([]);
                 }
             ).add();
             vpos += vgap + 20;
             
             chart.renderer.text('Select group to show',hpos+10,vpos).add();
             vpos += 10;
             vpos_base = vpos;
	     for (var g in json.group ){
                 var locallist = json.group[g];
                 chart.renderer.button(g,hpos,vpos,
                 (function(locallist){
                     return function() {
                        group_show(locallist);
                     }
                 })(locallist)).add();
                 vpos += vgap;
                 if (vpos > vpos_max){
                    vpos = vpos_base;
                    hpos += hgap;
                 }
             }

        });
    });
    // to show/hide a group of series in batch to improve performance..
    function group_show ( list ){
      var _redraw = chart.redraw;  // remember the original redraw func
      chart.redraw = function(){}; // disable redrawing for now
      for (var c in chart.series){
          if ( list.indexOf(chart.series[c].name) != -1){
              chart.series[c].show();
          }else{
              chart.series[c].hide();
          }
      }
      chart.redraw = _redraw; // bring it back
      chart.redraw();
   };

});

