const svg = d3.select("svg"),
    margin = {top: 30, right: 125, bottom: 40, left: 50},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const lineColours = ["#440154","#22a784"];

const xScale = d3.scaleLinear().range([0, width]),
    yScale = d3.scaleLinear().range([height, 0]),
    zScale = d3.scaleOrdinal(lineColours);

const bisectTime = d3.bisector(function(d) { return d.time; }).left;

const line = d3.line()
    .x(function(d) { return xScale(d.time); })
    .y(function(d) { return yScale(d.temperature); });

d3.csv("data/temperatures.csv", type, function(error, data) {
  if (error) throw error;

  const airports = data.columns.slice(1).map(function(id) {
    return {
      id: id,
      values: data.map(function(d) {
        return {time: d.time, temperature: d[id]};
      })
    };
  });

  xScale.domain([0, 23]);   // 0h to 23h
  yScale.domain([-12, 14]); // -12°C to 14°C

  // Maps airport names to colours
  zScale.domain(airports.map(function(c) { return c.id; }));

  // Draws axes
  g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale).tickPadding(7).tickSize(0))
    .append("text")
      .attr("x", width / 2)
      .attr("y", 30)
      .attr("dy", "0.70em")
      .style("text-anchor", "middle")
      .text("time");  

  g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(yScale).tickPadding(7).tickSize(0))
    .append("text")
      .attr("x", 0)
      .attr("y", -25)
      .attr("dy", "0.70em")
      .style("text-anchor", "middle")
      .text("temp (°C)");    

  // Draws one line per airport
  const airport = g.selectAll(".airport")
    .data(airports)
    .enter().append("g")
      .attr("class", "airport");  
   
  airport.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return zScale(d.id); });  

  // Places labels at the end of each line
  airport.append("text")
      .attr("class", "airports")
      .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + xScale(d.value.time) + "," + yScale(d.value.temperature) + ")"; })
      .attr("x", 10)
      .attr("y", function(d, i) { return 9 * i; })
      .attr("text-align", "right")
      .text(function(d) { return d.id  + " Airport"; }); 
 
  // Adds dots to lines
  const dots = airport.append("g")
    .style("fill", function(d) { return zScale(d.id); })
    .selectAll("circle")
      .data(function(d) { return d.values; })
    .enter().append("circle")
      .attr("cx", function(d) { return xScale(d.time); })
      .attr("cy", function(d) { return yScale(d.temperature); })
      .attr("r", 3);

  // Creates vertical line for exploring the visualization
  const focus = airport.append("g")
      .attr("class", "focus")
      .style("display", "none");

  focus.append('line')
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", height);

  // Creates overlay for listening to mouse events
  airport.append("rect")
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height)
      .on("mousemove", mouseover)
      .on("mouseout", mouseout);
   
  // Displays tooltip with temperatures
  function mouseover() {
    const x0 = xScale.invert(d3.mouse(this)[0]),
        y0 = yScale(d3.mouse(this)[0]),
        i = bisectTime(data, x0, 1),
        d0 = data[i - 1],
        d1 = data[i],
        d = x0 - d0.time > d1.time - x0 ? d1 : d0;  
    focus.style("display", null);        
    focus.transition()
        .duration(50)
        .attr("transform", "translate(" + xScale(d.time) + ", 0)");

    d3.select("#tooltip")
      .select("#time")
        .text(d.time + ":00");
    d3.select("#tooltip")
      .select("#temperature")
        .html('<span id="info" class="springbankLabel">Springbank Airport</span>' + d.Springbank + '°C' + '<br/><span id="info" class="calgaryLabel">Calgary Intl Airport</span>' + d["Calgary Intl"] + '°C');
    d3.select("#tooltip").classed("hidden", false);
  }

  // Hides tooltip 
  function mouseout() {
    focus.style("display", "none");
    d3.select("#tooltip").classed("hidden", true);
  } 
});

// Parses dates and converts temperature strings into numbers
function type(d, _, columns) {
  // d: object representing each row
  // _: index of the object
  // columns: header row
  d.time = +d.time;
  for (let i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
  return d;
}