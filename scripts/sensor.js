d3.json("data/sensor.json", function(data) {
    console.log(data);

    var ndx = crossfilter(data);

    var parseDate = d3.time.format("%Y-%m-%d %H:%M:%S").parse;

    data.forEach(function(d) {
    	d.datetime = parseDate(d.datetime);
    });

    var dateDim = ndx.dimension(function(d) {return d.datetime;});
    var acceleration = dateDim.group().reduceSum(function(d) {return d.acceleration;});

    var minDate = dateDim.bottom(1)[0].datetime;
    var maxDate = dateDim.top(1)[0].datetime;

    var accelerationlineChart  = dc.lineChart("#chart-line-acceleration");

    accelerationlineChart
       .width(700).height(200)
       .dimension(dateDim)
       .group(acceleration)
       .x(d3.time.scale().domain([minDate,maxDate]))
       .yAxisLabel("Acceleration");

    dc.renderAll();

});
