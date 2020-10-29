// input: selector for a chart container e.g., ".chart"
export default function AreaChart(container){

    // initialization
    var margin = ({top: 20, right: 10, bottom: 20, left: 50});
    var width = 800 - margin.left - margin.right,
        height = 150 - margin.top - margin.bottom;

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

    const xAxis = d3.axisBottom()
        .scale(xScale)

    svg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);
        
    const yAxis = d3.axisLeft()
        .scale(yScale);

    svg.append("g")
        .attr("class", "axis y-axis")
        .call(yAxis);

    const brush = d3.brushX()
        .extent([[margin.left, 0.5], [width - margin.right, height - margin.bottom + 0.5]])
        .on("brush", brushed)
        .on("end", brushended);
    
    const gb = svg.append("g").attr('class', 'brush').call(brush);

    function brushed(event) {
        if (event.selection) {
          listeners["brushed"](event.selection.map(xScale.invert));
        }
    }

    function brushended(event) {
    }
        
    const listeners = { brushed: null };

	function update(data){ 
        // update scales, encodings, axes (use the total count)
        xScale.domain([
            d3.min(data, function(d) { return d.date; }),
            d3.max(data, function(d) { return d.date; })
        ]);
        yScale.domain([0, d3.max(data, function(d) { return d.total; })]);

        var area = d3.area()
            .x(d => xScale(d.date))
            .y1(d => yScale(d.total))
            .y0(yScale(0));
        
        svg.append("path")
            .datum(data)
            .attr("class", "area")
            .attr("d", area);

        svg.select(".x-axis")
            .call(xAxis);
    
        svg.select(".y-axis")
            .call(yAxis);
    }
    
    function on(event, listener) {
		listeners[event] = listener;
    }

	return {
        update,
        on
	};
}