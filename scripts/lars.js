d3.json("data/lars-combined.json", function(data) {
    console.log(data);

    var ndx = crossfilter(data);

    var parseDate = d3.time.format("%Y-%m-%d %H:%M:%S").parse;

    data.forEach(function(d) {
    	d.datetime = parseDate(d.datetime);
      d.activity = d.Activity;
    });

    var dateDim = ndx.dimension(function(d) {return d.datetime;});
    var acceleration = dateDim.group().reduceSum(function(d) {return d.acceleration;});

    var minDate = dateDim.bottom(1)[0].datetime;
    var maxDate = dateDim.top(1)[0].datetime;

    var accelerationlineChart  = dc.lineChart("#chart-line-acceleration-lars");

    accelerationlineChart
       .width(700).height(200)
       .dimension(dateDim)
       .group(acceleration)
       .x(d3.time.scale().domain([minDate,maxDate]))
       .yAxisLabel("Acceleration")
       ;

    var anglex = dateDim.group().reduceSum(function(d) {return d.anglex;});
    var angley = dateDim.group().reduceSum(function(d) {return d.angley;});
    var anglez = dateDim.group().reduceSum(function(d) {return d.anglez;});

    var angleLineChart  = dc.lineChart("#chart-line-anglex-lars");

    angleLineChart
       .width(700).height(200)
       .dimension(dateDim)
       .group(anglex, 'x')
       .stack(angley, 'y')
       .stack(anglez, 'z')
       .x(d3.time.scale().domain([minDate,maxDate]))
       .yAxisLabel("Angles")
       ;

    var chartringyear = dc.pieChart("#chart-ring-year-lars");

    var activDim = ndx.dimension(function(d) {return d.activity;});
    var activCount = activDim.group().reduceSum(function(d) {return 5;});

    // we need two of them, each chart wants its own, otherwise they don't
    // cross-update
    var activDim2 = ndx.dimension(function(d) {return d.activity;});
    var activCount2 = activDim.group().reduceSum(function(d) {return 5;});

    chartringyear
      .width(200)
      .height(200)
      .innerRadius(50)
      .dimension(activDim)
      .group(activCount)
      ;

    var chartrowyear = dc.rowChart("#chart-row-year-lars");

    chartrowyear
      .width(600)
      .height(400)
      .dimension(activDim2)
      .group(activCount2)
      // .ordering(function(d){ return -d.value; })
      // .xAxisLabel("seconden")
      ;


    var datatable = dc.dataTable("#dc-data-table-lars");

    datatable
        .dimension(dateDim)
        .group(function(d) {return d.datetime.getDate() + "/" + (d.datetime.getMonth() + 1) + "/" + d.datetime.getFullYear();})
        // dynamic columns creation using an array of closures
        .columns([
            function(d) { return d.datetime.getDate() + "/" + (d.datetime.getMonth() + 1) + "/" + d.datetime.getFullYear(); },
            function(d) { return d.datetime.getHours() + ":" + d.datetime.getMinutes() + ":" + d.datetime.getSeconds(); },
            function(d) {return d.activity;}
        ]);

    dc.renderAll();

});