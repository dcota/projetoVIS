function getMaxAlt(data, callback) {
    let maxValue = 0
    for (let i = 0; i < data.length; i++) {
        if (parseInt(data[i].h) > maxValue) {
            maxValue = parseInt(data[i].h)
        }
    }
    callback(maxValue)
}

function getMinAlt(data, callback) {
    let minValue = Infinity
    for (i in data) {
        if (parseInt(data[i].h) < minValue)
            minValue = parseInt(data[i].h)
    }
    callback(minValue)
}

function getMaxPress(data, callback) {
    let maxValue = 0
    for (let i = 0; i < data.length; i++) {
        if (parseInt(data[i].press) > maxValue) {
            maxValue = parseInt(data[i].press)
        }
    }
    callback(maxValue)
}


function getMinPress(data, callback) {
    let minValue = Infinity
    for (i in data) {
        if (parseInt(data[i].press) < minValue)
            minValue = parseInt(data[i].press)
    }
    callback(minValue)
}

function altPressVis(data) {
    d3.select('#chart').selectAll('*').remove();
    let XMIN = data[0].Time
    let XMAX = data.length - 1
    let MAXALT = 0
    let MINALT = 0
    let MAXPRESS = 0
    let MINPRESS = 0
    getMaxAlt(data, (maxValue) => {
        MAXALT = maxValue + 50
    })
    getMinAlt(data, (minValue) => {
        MINALT = minValue
    })
    getMaxPress(data, (maxValue) => {
        MAXPRESS = maxValue + 50
    })
    getMinPress(data, (minValue) => {
        MINPRESS = minValue - 50
    })
    const svg = d3.select('#chart')
        .append('div')
        .attr('class','fade-efect')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .call(responsivefy) // call method to keep the chart responsive
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const xScale = d3.scaleLinear().range([0, width]);
    const yScale = d3.scaleLinear().range([height, 0]);
    const y1Scale = d3.scaleLinear().range([height, 0]);

    xScale.domain([XMIN, XMAX]);
    yScale.domain([MINALT, MAXALT]);
    y1Scale.domain([MINPRESS, MAXPRESS]);

    const yaxis = d3.axisLeft().scale(yScale);
    const y1axis = d3.axisRight().scale(y1Scale);
    const xaxis = d3.axisBottom().scale(xScale);

    //append xaxis to chart
    svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xaxis);

    //append yaxis to chart
    svg.append('g')
        .attr('class', 'axis')
        .call(yaxis);

    //append y1axis to chart
    svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(' + width + ' ,0)')
        .call(y1axis);

    //create line for altitude
    var line = d3.line()
        .x(function (d, i) { return xScale(d.Time); }) 
        .y(function (d) { return yScale(d.h); }) 
        .curve(d3.curveMonotoneX)

    //add line to chart
    svg.append('path')
        .datum(data) 
        .attr('class', 'line') 
        .attr('d', line); 

    //create line for Pressure
    var line = d3.line()
        .x(function (d, i) { return xScale(d.Time); }) 
        .y(function (d) { return y1Scale(d.press); })
        .curve(d3.curveMonotoneX) 

    //add line to chart
    svg.append('path')
        .datum(data) 
        .attr('class', 'line')  
        .attr('d', line); 

    //create area - altitude
    const area = d3
        .area()
        .x(data => xScale(data.Time))
        .y0(height)
        .y1(data => yScale(data.h));

    //append area to chart - altitude
    svg
        .append('path')
        .attr('transform', `translate(0,0)`)
        .datum(data)
        .style('fill', '#FFBC79')
        .style('opacity', 0.4)
        .attr('stroke', '#715F25')
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('stroke-width', 0.6)
        .attr('d', area);

    //create area - pressure
    const area2 = d3
        .area()
        .x(data => xScale(data.Time))
        .y0(0)
        .y1(data => y1Scale(data.press));

    //append area to chart - altitude
    svg
        .append('path')
        .attr('transform', `translate(0,0)`)
        .datum(data)
        .style('fill', '#5FA2CE')
        .style('opacity', 0.4)
        .attr('stroke', '##1D3922')
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('stroke-width', 0.6)
        .attr('d', area2);

    //append y label
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left)
        .attr('x', 0 - (height / 2))
        .attr('dy', '2em')
        .style('text-anchor', 'middle')
        .style('font-size', '10px')
        .text('Altitude (m)');

    //append y1 label
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.right)
        .attr('x', 0 - (height / 2))
        .attr('dy', '59em')
        .style('text-anchor', 'middle')
        .style('font-size', '10px')
        .text('Pressão atmosférica (hPa)');

    //append x label
    svg.append('text')
        .attr('transform', 'translate(' + (width / 2) + ' ,' + (height + margin.top + 20) + ')')
        .style('text-anchor', 'middle')
        .style('font-size', '10px')
        .text('Tempo (s)');

    //append title
    svg.append('text')
        .attr('x', 220)             
        .attr('y', -6)
        .attr('text-anchor', 'middle')  
        .style('font-size', '15px')
        .text('Altitude e Pressão atmosférica (t)');

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