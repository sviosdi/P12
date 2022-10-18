import React, { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'
import '../assets/TimeChart.css'
import { getRange } from '../utils/utils'

const TimeChart = ({ data: times }) => {
    const sessionsRange = getRange(times, 'sessionLength')
    const daysRange = getRange(times, 'day')
    const ref = React.useRef()
    const [timeW, setTimeW] = useState(0)

    const resizeChart = () => {
        const chart = document.querySelector('.c-time')
        const brect = chart.getBoundingClientRect()
        chart.style.height = `${1.0194 * brect.width}px`
        setTimeW(brect.width)
    }

    useEffect(() => {
        window.addEventListener('resize', resizeChart)
        console.log('TimeChart first drawned')
        resizeChart()
        return () => window.removeEventListener('resize', resizeChart)
    }, [])

    useEffect(() => {
        //console.log('useEffect() resizing...')
        if (ref.current.firstElementChild)
            ref.current.firstElementChild.remove()
        draw(ref.current)
    }, [timeW])

    const draw = () => {
        const paddingH = 10
        const paddingTop = 0.2 * timeW
        const paddingBottom = 0.1 * timeW

        var svg = d3
            .select(ref.current)
            .append('svg')
            .attr('id', 'times-curve')
            .style('position', 'absolute')
            .style('top', 0)
            .attr('width', timeW)
            .attr('height', timeW * 1.0194)

        var xScale = d3
            .scaleLinear()
            .domain([daysRange.min, daysRange.max])
            .range([0, timeW])
        var yScale = d3
            .scaleLinear()
            .domain([sessionsRange.min, sessionsRange.max])
            .range([timeW * 1.0194 - paddingBottom, paddingTop])
        var line = d3
            .line()
            .x((d) => xScale(d.day))
            .y((d) => yScale(d.sessionLength))
            .curve(d3.curveBundle)

        d3.select('#times-curve')
            .append('path')
            .attr('d', line(times))
            .attr('fill', 'none')
            .attr('stroke', 'white')
    }

    return <div ref={ref} className="chart3 c-time"></div>
}

export default TimeChart
