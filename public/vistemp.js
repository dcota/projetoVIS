function getMaxTemp(data, callback) {
    let maxValue = 0
    for (i in data) {
        if (data[i].temp > maxValue)
            maxValue = data[i].temp
    }
    callback(maxValue)
}

function getMinTemp(data, callback) {
    let minValue = Infinity
    for (i in data) {
        if (data[i].temp < minValue)
            minValue = data[i].temp
    }
    callback(minValue)
}


function tempVis(data) {
    d3.select('#chart').selectAll('*').remove(); //////////////////
    let XMIN = 0
    let XMAX = data.length-1
    console.log('max ' + XMAX)
    let MAXTEMP = 0
    let MINTEMP = 0
    getMaxTemp(data, (maxValue) => {
        MAXTEMP = maxValue + 1
    })
    getMinTemp(data, (minValue) => {
        MINTEMP = minValue -1
    })
    const svg = d3.select('#chart')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .call(responsivefy) // all method to keep the chart responsive
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const xScale = d3.scaleLinear().range([0, width]);
    const yScale = d3.scaleLinear().range([height, 0]);

    xScale.domain([XMIN, XMAX]);
    yScale.domain([MINTEMP, MAXTEMP]);

    const yaxis = d3.axisLeft().scale(yScale);
    const xaxis = d3.axisBottom().scale(xScale);

    //append xaxis to chart
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xaxis);
    //append yaxis to chart
    svg.append("g")
        .attr("class", "axis")
        .call(yaxis);
    //create line
    var line = d3.line()
        .x(function (d, i) { return xScale(d.Time); }) // set the x values for the line generator
        .y(function (d) { return yScale(d.temp); }) // set the y values for the line generator 
        .curve(d3.curveMonotoneX) // apply smoothing to the line
    //add line to chart
    svg.append("path")
        .datum(data) // 10. Binds data to the line 
        .attr("class", "line") // Assign a class for styling 
        .attr("d", line); // 11. Calls the line generator 
    //create area
    const area = d3
        .area()
        .x(data => xScale(data.Time))
        .y0(height)
        .y1(data => yScale(data.temp));
    //append area to chart
    svg
        .append("path")
        .attr("transform", `translate(0,0)`)
        .datum(data)
        .style("fill", "lightblue")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 0.8)
        .attr("d", area);
    //append y label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "10px")
        .text("Temperatura (C)");
    //append x label
    svg.append("text")
        .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 20) + ")")
        .style("text-anchor", "middle")
        .style("font-size", "10px")
        .text("Tempo (s)");

    //tooltip
    var bisect = d3.bisector(d => d.Time).left;
    var focus = svg
        .append('g')
        .append('circle')
        .style("fill", "red")
        .attr("stroke", "black")
        .attr('r', 2)
        .style("opacity", 0)
    var focusText = svg
        .append('g')
        .append('text')
        .style("opacity", 0)
        .attr("text-anchor", "left")
        .attr("alignment-baseline", "middle")
    svg
        .append('rect')
        .style("fill", "none")
        .style("pointer-events", "all")
        .attr('width', width)
        .attr('height', height)
        .on('mouseover', mouseover)
        .on('mousemove', mousemove)
        .on('mouseout', mouseout);
    function mouseover() {
        focus.style("opacity", 1)
        focusText.style("opacity", 1)
    }
    function mousemove() {
        // recover coordinate we need
        var x0 = xScale.invert(d3.mouse(this)[0]);
        var i = bisect(data, x0, 1);
        selectedData = data[i]
        focus
            .attr("cx", xScale(selectedData.Time))
            .attr("cy", yScale(selectedData.temp))
        focusText
            .html(selectedData.temp)
            .attr("x", xScale(selectedData.Time) + 15)
            .attr("y", yScale(selectedData.temp))
            .style("font-size", "8px")
    }
    function mouseout() {
        focus.style("opacity", 0)
        focusText.style("opacity", 0)
    }
    //method to controll responsitivy
    function responsivefy(svg) {
        const container = d3.select(svg.node().parentNode),
            width = parseInt(svg.style('width'), 10),
            height = parseInt(svg.style('height'), 10),
            aspect = width / height;
        svg.attr('viewBox', `0 0 ${width} ${height}`).
            attr('preserveAspectRatio', 'xMinYMid').
            call(resize);
        d3.select(window).on('resize.' + container.attr('id'), resize);
        function resize() {
            const targetWidth = parseInt(container.style('width'));
            svg.attr('width', targetWidth);
            svg.attr('height', Math.round(targetWidth / aspect));
        }
    }
}