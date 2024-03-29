import { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { getRange } from '../utils/utils'
import '../assets/ActivChart.css'
import PropTypes from 'prop-types'

/**
 * This function draws a rectangle with rounded top corners
 * @function
 * @param x horizontal position of the lower left corner of the rectangle
 * @param y vertical position of the lower left corner of the rectangle
 * @param w width of the rectangle
 * @param h height of the rectangle
 * @param r radius of the upper corners of the rectangle
 */
function bar(x, y, w, h, r) {
    return `M${x},${y}h${w}v${r - h}a${r},${r} 0 0 0 -${r},-${r}h${
        2 * r - w
    }a${r},${r} 0 0 0 -${r}, ${r}z`
}

/**
 * The React component displaying the bar chart of daily activities with weight & burned calories
 * @function ActiveChart
 * @param { array } data The array of objects with day, kilogram and calories fields passed to the component as a property for displaying the bar chart
 * @return { jsx }
 */
const ActiveChart = ({ data: activities }) => {
    const [vpW, setvpW] = useState(window.innerWidth)
    const resizeActivities = () => {
        setvpW(window.innerWidth)
    }

    const ref = useRef()
    useEffect(() => {
        window.addEventListener('resize', resizeActivities)
        return () => window.removeEventListener('resize', resizeActivities)
    }, [])

    useEffect(() => {
        // we add a count field to the data that will be used to know to what day each data refers to
        activities = activities.map((e, i) => {
            e.count = i
            return e
        })
        ActiveChart.rangeKilo = getRange(activities, 'kilogram')
        ActiveChart.rangeCalo = getRange(activities, 'calories')
    }, [activities])

    useEffect(() => {
        if (ref.current.firstElementChild)
            ref.current.firstElementChild.remove()
        draw()
    }, [vpW, activities])

    const draw = () => {
        const chart = d3.select(ref.current).append('div')
        chart.attr('class', 'activities')
        chart.style('position', 'relative')
        const dep = 50 // vertical overflow in px of the selection rectangle in relation to the max kilo
        const cal_dep = 25 // vertical overflow in px of the calo.max rectangle in relation to kilo.max
        const deb = 17 //horizontal padding in px of the selection rectangle in relation to the max kilo
        const hist_top = 112.5 - dep
        const hist_bottom = 62.5
        const hist_left = 43 - deb
        const hist_right = 90 - deb
        const hist_w = ref.current.clientWidth - (hist_right + hist_left)
        const hist_h = ref.current.clientHeight - (hist_bottom + hist_top)
        const hist_h_kilo = hist_h - dep

        const nbEl = activities.length
        const w = (hist_w - deb * 2 - 22) / (nbEl - 1) // The distance between two consecutive bars of kilos.
        const kilo_hscale =
            hist_h_kilo /
            (ActiveChart.rangeKilo.max - ActiveChart.rangeKilo.min + 1)
        const calo_hscale = (hist_h_kilo + cal_dep) / ActiveChart.rangeCalo.max

        const svg = chart
            .append('svg')
            .style('position', 'relative')
            .style('width', hist_w)
            .style('height', hist_h)
            .style('top', hist_top)
            .style('left', hist_left)

        // basic axis display
        svg.append('path')
            .attr('class', 'base-axis')
            .attr('d', `M${deb},${hist_h}h${hist_w - deb * 2}`)
        //  upper axis display
        svg.append('path')
            .attr('class', 'axis')
            .attr('d', `M${deb},${dep}h${hist_w - deb * 2}`)
        // intermediate axis display
        svg.append('path')
            .attr('class', 'axis')
            .attr('d', `M${deb},${dep + hist_h_kilo / 2}h${hist_w - deb * 2}`)

        // creation of 'background' gray selection rectangles
        svg.selectAll('.select')
            .data(activities)
            .enter()
            .append('rect')
            .attr('class', 'select')
            .attr('x', (d, i) => i * w)
            .attr('y', 0)
            .attr('width', 22 + deb * 2)
            .attr('height', hist_h)
            .attr('id', (d, i) => `sel-${i}`)

        //plot of each bar representing the kilos
        svg.selectAll('.kilo')
            .data(activities)
            .enter()
            .append('path')
            .attr('class', 'kilo')
            .attr('d', (d, i) =>
                bar(
                    i * w + deb,
                    hist_h,
                    7,
                    kilo_hscale * (d.kilogram - ActiveChart.rangeKilo.min + 1),
                    3
                )
            )
        //plot of each bar representing the calories
        svg.selectAll('.calo')
            .data(activities)
            .enter()
            .append('path')
            .attr('class', 'calo')
            .attr('d', (d, i) =>
                bar(i * w + deb + 15, hist_h, 7, calo_hscale * d.calories, 3)
            )
        // creation of the 'foreground' invisible selection rectangles
        svg.selectAll('.transparent')
            .data(activities)
            .enter()
            .append('rect')
            .attr('class', 'select-transparent')
            .attr('x', (d, i) => {
                return i * w
            })
            .attr('y', 0)
            .attr('width', 22 + deb * 2)
            .attr('height', hist_h)
            .on('mouseenter', (e, d) => {
                // e = the event, d = the activities data associated with .data(activities)
                // selects the corresponding 'background' gray rectangle and makes it visible
                const rect = d3.select(`#sel-${d.count}`)
                rect.style('opacity', 0.5)
                let tt = document.getElementById('act-tooltip')
                // compute the tooltip position
                const getPx = () => {
                    switch (d.count) {
                        case activities.length - 1:
                            return hist_w + hist_left - 1.5 * deb - 22 - 54
                        default:
                            return d.count * w + hist_left + 22 + deb * 1.5
                    }
                }
                // shows the tooltip
                tooltip.style('opacity', 1)
                tooltip.style('left', `${getPx()}px`)
                tooltip.style(
                    'top',
                    `${hist_h + hist_top - hist_h_kilo - 32}px`
                )
                tooltip.select('#tooltip-kilo').text(`${d.kilogram} kg`)
                tooltip.select('#tooltip-calo').text(`${d.calories} kCal`)
            })
            .on('mouseout', (e, d) => {
                // selects the corresponding 'background' gray rectangle and hides it
                const rect = d3.select(`#sel-${d.count}`)
                rect.style('opacity', 0)
                // hides the tooltip
                tooltip.style('opacity', 0)
            })
        // displays days number
        chart
            .append('svg')
            .attr('class', 'base-axis-legend')
            .style('position', 'absolute')
            .style('top', hist_top + hist_h + 15)
            .style('left', hist_left + deb)
            .style('width', hist_w - deb * 2)
            .style('height', 22)
            .selectAll()
            .data(activities)
            .enter()
            .append('text')
            .attr('x', (d, i) => w * i + 6)
            .attr('y', 18)
            .text((d, i) => i + 1)

        // creates the upper caption
        const legend = chart
            .append('svg')
            .style('position', 'absolute')
            .style('top', 20)
            .style('left', 20)
            .style('width', ref.current.clientWidth - 20)
            .style('height', 30)

        legend
            .append('text')
            .attr('class', 'legend')
            .attr('x', 15)
            .attr('y', 20)
            .text('Activité quotidienne')
            .append('g')
            .attr('class', 'sub-legend')
        const subLegend = legend.append('g').attr('class', 'sub-legend')
        subLegend
            .append('circle')
            .attr('class', 'legend-poids')
            .attr('cx', ref.current.clientWidth - 315)
            .attr('cy', 15)
            .attr('r', 4)
        subLegend
            .append('text')
            .text('Poids (kg)')
            .attr('x', ref.current.clientWidth - 300)
            .attr('y', 20)

        subLegend
            .append('circle')
            .attr('class', 'legend-cal')
            .attr('cx', ref.current.clientWidth - 200)
            .attr('cy', 15)
            .attr('r', 4)
        subLegend
            .append('text')
            .text('Calories brûlées (kCal)')
            .attr('x', ref.current.clientWidth - 185)
            .attr('y', 20)

        const legendRight = chart
            .append('svg')
            .attr('class', 'legend-right')
            .style('position', 'absolute')
            .attr('top', 0)
            .style('left', ref.current.clientWidth - hist_right / 2 - 10)
            .style('width', 30)
            .style('height', ref.current.clientHeight - 20)
        legendRight
            .append('text')
            .attr('x', 0)
            .attr('y', hist_top + dep + 1)
            .text(ActiveChart.rangeKilo.max)
        legendRight
            .append('text')
            .attr('x', 0)
            .attr('y', hist_top + dep + hist_h_kilo / 2 + 1)
            .text(
                (ActiveChart.rangeKilo.min - 1 + ActiveChart.rangeKilo.max) / 2
            )
        legendRight
            .append('text')
            .attr('x', 0)
            .attr('y', hist_top + hist_h + 1)
            .text(ActiveChart.rangeKilo.min - 1)

        // draws the tooltip
        const tooltip = chart
            .append('svg')
            .attr('id', 'act-tooltip')
            .style('position', 'absolute')
            .style('width', 54)
            .style('height', 63)
            .style('opacity', 0)

        tooltip
            .append('text')
            .attr('x', 5)
            .attr('y', 24)
            .attr('class', 'tooltip-data')
            .attr('id', 'tooltip-kilo')

        tooltip
            .append('text')
            .attr('x', 5)
            .attr('y', 50)
            .attr('class', 'tooltip-data')
            .attr('id', 'tooltip-calo')
    }

    return <div ref={ref}></div>
}

ActiveChart.propTypes = {
    data: PropTypes.array.isRequired,
}

export default ActiveChart
