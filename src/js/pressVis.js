/*
Mestrado em Engenharia Informática e Tecnologia Web
Visualização de Informação
Projeto Final
Autor: Duarte Cota - 2022
Ficheiro da vis - pressão (t)
*/

//method to get maximum value of pressure
function getMaxPress(data, callback) {
    let maxValue = 0
    for (let i = 0; i < data.length; i++) {
        if (parseInt(data[i].press) > maxValue) {
            maxValue = parseInt(data[i].press)
        }
    }
    callback(maxValue)
}

//method to get the minimum value of pressure
function getMinPress(data, callback) {
    let minValue = Infinity
    for (i in data) {
        if (parseInt(data[i].press) < minValue)
            minValue = parseInt(data[i].press)
    }
    callback(minValue)
}

//method to keep the vis responsive
function responsify(svg) {
    const container = d3.select(svg.node().parentNode),
        width = parseInt(svg.style('width'), 10),
        height = parseInt(svg.style('height'), 10),
        aspect = width / height;
    svg.attr('viewBox', `0 0 ${width} ${height}`).
    attr('preserveAspectRatio', 'xMinYMid').
    call(resize);
    //detect resize event, call resize to set new atributes
    d3.select(window).on('resize.' + container.attr('id'), resize);

    function resize() {
        const targetWidth = parseInt(container.style('width'));
        svg.attr('width', targetWidth);
        svg.attr('height', Math.round(targetWidth / aspect));
    }
}

//mehtod to render vis
function pressVis(data) {
    d3.select('#chart').selectAll('*').remove();
    let XMIN = data[0].Time
    let XMAX = data.length - 1
    console.log('max ' + XMAX)
    let MAXPRESS = 0
    let MINPRESS = 0

    getMaxPress(data, (maxValue) => {
        MAXPRESS = maxValue + 10
    })

    getMinPress(data, (minValue) => {
        MINPRESS = minValue - 10
    })

    const svg = d3.select('#chart')
        .append('section')
        .attr('class', 'fade-efect')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .call(responsify) // call method to keep the chart responsive
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const xScale = d3.scaleLinear().range([0, width]);
    const yScale = d3.scaleLinear().range([height, 0]);

    xScale.domain([XMIN, XMAX]);
    yScale.domain([MINPRESS, MAXPRESS]);

    const yaxis = d3.axisLeft().scale(yScale);
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

    //create line
    var line = d3.line()
        .x(function(d, i) { return xScale(d.Time); })
        .y(function(d) { return yScale(d.press); })
        .curve(d3.curveMonotoneX)

    //add line to chart
    svg.append('path')
        .datum(data)
        .attr('class', 'line')
        .attr('d', line);

    //create area
    const area = d3
        .area()
        .x(data => xScale(data.Time))
        .y0(height)
        .y1(data => yScale(data.press));

    //append area to chart
    svg
        .append('path')
        .attr('transform', `translate(0,0)`)
        .datum(data)
        .style('fill', '#A3CCE9')
        .style('opacity', 1)
        .attr('stroke', '#1170AA')
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('stroke-width', 0.8)
        .attr('d', area);

    //append y label
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left)
        .attr('x', 0 - (height / 2))
        .attr('dy', '1.5em')
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
        .text('Pressão atmosférica (t)');

    //tooltip
    var bisect = d3.bisector(d => d.Time).left;
    var focus = svg
        .append('g')
        .append('circle')
        .style('fill', '#1170AA')
        .attr('stroke', '#1170AA')
        .attr('r', 3)
        .style('opacity', 0)
    var focusText = svg
        .append('g')
        .append('text')
        .style('opacity', 0)
        .attr('text-anchor', 'left')
        .attr('alignment-baseline', 'middle')
    svg
        .append('rect')
        .style('fill', 'none')
        .style('pointer-events', 'all')
        .attr('width', width)
        .attr('height', height)
        .on('mouseover', mouseover)
        .on('mousemove', mousemove)
        .on('mouseout', mouseout);

    function mouseover() {
        focus.style('opacity', 1)
        focusText.style('opacity', 1)
    }

    function mousemove() {
        // recover coordinate we need
        var x0 = xScale.invert(d3.mouse(this)[0]);
        var i = bisect(data, x0, 1);
        selectedData = data[i]
        focus
            .attr('cx', xScale(selectedData.Time))
            .attr('cy', yScale(selectedData.press))
        focusText
            .html(selectedData.press)
            .attr('x', xScale(selectedData.Time) + 15)
            .attr('y', yScale(selectedData.press))
            .style('font-size', '8px')
    }

    function mouseout() {
        focus.style('opacity', 0)
        focusText.style('opacity', 0)
    }
}