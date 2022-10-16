import { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'

import '../assets/TestChart.css'

function bar(x, y, w, h, r) {
    return `M${x},${y}h${w}v${r - h}a${r},${r} 0 0 0 -${r},-${r}h${
        2 * r - w
    }a${r},${r} 0 0 0 -${r}, ${r}z`
}

const getRange = (data, prop) => {
    let max = data[0][prop]
    let min = max
    data.forEach((e) => {
        max = e[prop] > max ? e[prop] : max
        min = e[prop] < min ? e[prop] : min
    })
    return { max: max, min: min }
}

const TestChart = ({ data }) => {
    const ref = useRef()
    useEffect(() => {
        draw(ref.current)
    }, [])

    const draw = (chartRef) => {
        const chart = d3.select(chartRef)
        chart.attr('class', 'activities')
        chart.style('position', 'relative')
        const depassement = 25
        const hist_top = 112.5 - depassement
        const hist_bottom = 62.5
        const hist_left = 43
        const hist_right = 90
        const hist_w = chartRef.clientWidth - (hist_right + hist_left)
        const hist_h = chartRef.clientHeight - (hist_bottom + hist_top)
        const hist_h_kilo = hist_h - depassement

        const rangeKilo = getRange(data, 'kilogram')
        const rangeCalo = getRange(data, 'calories')
        const nbEl = data.length

        const kilo_hscale = hist_h_kilo / (rangeKilo.max - rangeKilo.min + 1)
        const calo_hscale = hist_h / rangeCalo.max

        const svg = chart
            .append('svg')
            .style('position', 'relative')
            .style('width', hist_w)
            .style('height', hist_h)
            .style('top', hist_top)
            .style('left', hist_left)

        const w = (hist_w - 22) / (nbEl - 1)

        // affichage de l'axe de base, axe supérieur et axe intermédiaire
        svg.append('path')
            .attr('class', 'base-axis')
            .attr('d', `M0,${hist_h}h${hist_w}`)

        svg.append('path')
            .attr('class', 'axis')
            .attr('d', `M0,${depassement}h${hist_w}`)

        svg.append('path')
            .attr('class', 'axis')
            .attr('d', `M0,${depassement + hist_h_kilo / 2}h${hist_w}`)

        svg.selectAll('.kilo')
            .data(data)
            .enter()
            .append('path')
            .attr('class', 'kilo')
            .attr('d', (d, i) =>
                bar(
                    i * w,
                    hist_h,
                    7,
                    kilo_hscale * (d.kilogram - rangeKilo.min + 1),
                    3
                )
            )

        svg.selectAll('.calo')
            .data(data)
            .enter()
            .append('path')
            .attr('class', 'calo')
            .attr('d', (d, i) =>
                bar(i * w + 15, hist_h, 7, calo_hscale * d.calories, 3)
            )

        // affichage des jours
        chart
            .append('svg')
            .attr('class', 'base-axis-legend')
            .style('position', 'absolute')
            .style('top', hist_top + hist_h + 15)
            .style('left', hist_left)
            .style('width', hist_w)
            .style('height', 22)
            .selectAll()
            .data(data)
            .enter()
            .append('text')
            .attr('x', (d, i) => w * i + 6)
            .attr('y', 18)
            .text((d, i) => i + 1)

        const legend = chart
            .append('svg')
            .style('position', 'absolute')
            .style('top', 20)
            .style('left', 20)
            .style('width', chartRef.clientWidth - 20)
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
            .attr('cx', chartRef.clientWidth - 315)
            .attr('cy', 15)
            .attr('r', 4)
        subLegend
            .append('text')
            .text('Poids (kg)')
            .attr('x', chartRef.clientWidth - 300)
            .attr('y', 20)

        subLegend
            .append('circle')
            .attr('class', 'legend-cal')
            .attr('cx', chartRef.clientWidth - 200)
            .attr('cy', 15)
            .attr('r', 4)
        subLegend
            .append('text')
            .text('Calories brûlées (kCal)')
            .attr('x', chartRef.clientWidth - 185)
            .attr('y', 20)

        const legendRight = chart
            .append('svg')
            .attr('class', 'legend-right')
            .style('position', 'absolute')
            .attr('top', 0)
            .style('left', chartRef.clientWidth - hist_right / 2 - 10)
            .style('width', 30)
            .style('height', chartRef.clientHeight - 20)
        legendRight
            .append('text')
            .attr('x', 0)
            .attr('y', hist_top + depassement + 1)
            .text(rangeKilo.max)
        legendRight
            .append('text')
            .attr('x', 0)
            .attr('y', hist_top + depassement + hist_h_kilo / 2 + 1)
            .text((rangeKilo.min - 1 + rangeKilo.max) / 2)
        legendRight
            .append('text')
            .attr('x', 0)
            .attr('y', hist_top + hist_h + 1)
            .text(rangeKilo.min - 1)
    }

    return <div ref={ref}></div>
}

export default TestChart
