import React, { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'
import '../assets/TimeChart.css'
import { getRange } from '../utils/utils'
import PropTypes from 'prop-types'

/**
 * The React component displaying the curve of average duration of sessions
 * @function TimeChart
 * @param { array } data The array of objects with day and sessionlength fields passed to the component as a property to display the session duration curve
 * @return { jsx } Returns the jsx component
 */
const TimeChart = ({ data: times }) => {
    const sessionsRange = getRange(times, 'sessionLength')
    const daysRange = getRange(times, 'day')
    const timesAmp = sessionsRange.max - sessionsRange.min
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
        resizeChart()
        return () => window.removeEventListener('resize', resizeChart)
    }, [])

    useEffect(() => {
        if (ref.current.firstElementChild) {
            ref.current.firstElementChild.remove()
        }
        d3.select(ref.current).append('g')
        draw()
    }, [timeW, times])

    const draw = () => {
        const paddingTop = 0.32 * timeW
        const paddingBottom = 0.2 * timeW
        const paddingH = 0.06 * timeW
        let plots = []
        for (let i in times) plots.push({})

        const g = d3
            .select(ref.current.firstElementChild)
            .append('svg')
            .attr('id', 'times-curve')
            .style('position', 'absolute')
            .style('top', 0)
            .attr('width', timeW)
            .attr('height', timeW * 1.0194)
            .style('font-size', timeW * 0.0581)

        g.append('text')
            .attr('x', 0.131 * timeW)
            .attr('y', 0.17 * timeW)
            .text('Durée moyenne des')
        g.append('text')
            .attr('x', 0.131 * timeW)
            .attr('y', 0.25 * timeW)
            .text('sessions')
        // Prepare the plot of the curve
        // Create the scale function for the x-axis
        const xScale = d3
            .scaleLinear()
            .domain([daysRange.min, daysRange.max]) // domain([1,7]) 1: Lundi 7: Dimanche
            .range([paddingH, timeW - paddingH]) // spreads the days [1..7] across the width of the component with a margin of paddingH pixels
        // Create the scale function for the y-axis
        const yScale = d3
            .scaleLinear()
            .domain([
                // timesAmp * 0.15 = an additional top space provided to compensate for the overshoot of the interpolation on the amplitude of the data
                sessionsRange.min - timesAmp * 0.15,
                sessionsRange.max + timesAmp * 0.1, // timesAmp * 0.1 = the additional buttom space
            ])
            // margins paddingBottom and paddingTop are provided to display captions
            .range([timeW * 1.0194 - paddingBottom, paddingTop])

        const line = d3
            .line()
            .x((d, i) => {
                let x = xScale(d.day)
                plots[i].x = x
                return x
            })
            .y((d, i) => {
                let y = yScale(d.sessionLength)
                plots[i].y = y
                return y
            })
            .curve(d3.curveNatural)

        d3.select('#times-curve')
            .append('path')
            .attr('d', line(times))
            .attr('fill', 'none')
            .attr('stroke', 'white')

        g.selectAll('times-days')
            .data(times)
            .enter()
            .append('text')
            .attr('class', 'times-days')
            .attr('x', (d, i) => plots[i].x - timeW * 0.012)
            .attr('y', 0.92 * timeW)
            .text((d) => [, 'L', 'M', 'M', 'J', 'V', 'S', 'D'][d.day])
        const tooltip = d3
            .select(ref.current.firstElementChild)
            .append('svg')
            .attr('class', 'times-tooltip')
            .style('position', 'absolute')
            .style('width', timeW * 0.17)
            .style('height', timeW * 0.087)
            .style('top', 50)
            .style('left', 50)
            .style('opacity', 0)
        tooltip
            .append('text')
            .attr('x', timeW * 0.0157)
            .attr('y', timeW * 0.061)
            .attr('id', 'times-tooltip-label')
            .style('font-size', timeW * 0.043)
            .text('')

        const spot = g
            .append('circle')
            .attr('class', 'times-spot')
            .attr('cx', 50)
            .attr('cy', 50)
            .attr('r', 3.5)
            .style('opacity', 0)

        let oldIdx = -1
        let idx = -1
        let tip = d3.select('.times-tooltip')
        let tipLabel = d3.select('#times-tooltip-label')
        const gForMouse = d3
            .select(ref.current.firstElementChild)
            .append('svg')
            .attr('id', 'gForMouse')
            .style('position', 'absolute')
            .style('top', 0)
            .attr('width', timeW)
            .attr('height', timeW * 1.0194)
            .style('font-size', timeW * 0.0581)
            .on('mousemove', (e) => {
                const w = (timeW - 2 * paddingH) / (times.length - 1)
                const dw = paddingH + w / 2
                if (e.offsetX < dw) {
                    idx = 0
                } else {
                    if (e.offsetX < timeW)
                        idx = Math.trunc((e.offsetX - dw) / w) + 1
                }
                if (idx !== oldIdx) {
                    oldIdx = idx
                    let px = idx === 0 ? 3 : paddingH + (idx - 1 / 2) * w
                    if (idx === times.length - 1) px = timeW * 0.82
                    tipLabel.text(`${times[idx].sessionLength} min`)
                    tip.style('left', px)
                    tip.style('top', plots[idx].y - timeW * 0.13)
                    tip.style('opacity', 1)
                    spot.attr('cx', plots[idx].x)
                    spot.attr('cy', plots[idx].y).style('opacity', 1)
                }
            })

        gForMouse.on('mouseout', (e) => {
            oldIdx = -1
            spot.style('opacity', 0)
            tip.style('opacity', 0)
        })
    }

    return <div ref={ref} className="chart3 c-time"></div>
}

TimeChart.propTypes = {
    data: PropTypes.array.isRequired,
}

export default TimeChart
