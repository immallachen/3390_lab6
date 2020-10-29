import AreaChart from './AreaChart.js';
import StackedAreaChart from './StackedAreaChart.js';

d3.csv('unemployment.csv', d3.autoType).then(data =>{
    data.forEach(function(d) {
        var total = 0;
        for(let prop in d) {
            if(prop !== 'date'){
                total += d[prop];
            }
        }
        d.total = total;
    });
    console.log(data);

    var stack = d3.stack()
        .keys(data.columns.slice(1))
        .order(d3.stackOrderNone)
        .offset(d3.stackOffsetNone);

    var series = stack(data);
    
    const stackedAreaChart = StackedAreaChart(".chart");
    stackedAreaChart.update(series);

    const areaChart = AreaChart(".chart2");
    areaChart.update(data);

    areaChart.on("brushed", (range)=>{
        stackedAreaChart.filterByDate(range); // coordinating with stackedAreaChart
    })
});
