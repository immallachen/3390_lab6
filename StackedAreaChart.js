// input: selector for a chart container e.g., ".chart"
export default function StackedAreaChart(container){

    // initialization
    var margin = ({top: 20, right: 10, bottom: 20, left: 50});
    var width = 800 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;

    var svg = d3.select(container).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const xScale = d3
        .scaleTime()
        .range([0, width]);

    const yScale = d3
        .scaleLinear()
        .range([height, 0]);

    const colorScale = d3
        .scaleOrdinal()
        .range(d3.schemeTableau10);

    const xAxis = d3.axisBottom()
        .scale(xScale);

    svg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);
        
    const yAxis = d3.axisLeft()
        .scale(yScale);

    svg.append("g")
        .attr("class", "axis y-axis")
        .call(yAxis);

    let selected = false,xDomain, data;
    let key = "";

	function update(_data){ 
        // update scales, encodings, axes (use the total count)
        console.log(selected);
        data = _data;
        if(selected == true) {
            data = data.filter(d=> d.key == key);
        }
        xScale.domain(xDomain? xDomain: [
            d3.min(data, function(d) { 
                return d3.min(d, function(da) {
                    return da.data.date;
                })
            }),
            d3.max(data, function(d) { 
                return d3.max(d, function(da) {
                    return da.data.date;
                })
            })
        ]);
        yScale.domain([0, d3.max(data, function(d) {
            return d3.max(d, function(da) {
                return da[1];
            });
        })]);
        colorScale.domain(new Set(data.map(d => d.key)))

        var area = d3.area()
            .x(function(d) {
                return xScale(d.data.date);
            })
            .y0(d => yScale(d[0]))
            .y1(d => selected == true? yScale(0):yScale(d[1]));

        const areas = svg.selectAll(".area")
            .data(data, d => d.key);
        
        areas.enter() // or you could use join()
            .append("path")
            .attr("class", "area")
            .merge(areas)
            .attr('fill', function(d) {
                // console.log(d);
                return colorScale(d.key)
            })
            .attr("d", area)
            .on("mouseover", (event, d, i) => tooltip.text(d.key))
            .on("mouseout", (event, d, i) => tooltip.text(""))
            .on("click", (event, d) => {
                console.log(selected)
                // toggle selected based on d.key
                if(selected == false){
                    selected = true;
                    key = d.key;
                }
                else {
                    selected = false;
                    tooltip.text("");
                }
                update(_data); // simply update the chart again
            });
        
        areas.exit().remove();

        svg.select(".x-axis")
            .call(xAxis);
    
        svg.select(".y-axis")
            .call(yAxis);

        const tooltip = svg
            .append("text")
            .text("");
    }
    
    function filterByDate(range){
		xDomain = range; 
		update(data);
	}

	return {
        update,
        filterByDate
	};
}