import { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { getRange } from '../utils/utils'
import '../assets/ActivChart.css'

function bar(x, y, w, h, r) {
    return `M${x},${y}h${w}v${r - h}a${r},${r} 0 0 0 -${r},-${r}h${
        2 * r - w
    }a${r},${r} 0 0 0 -${r}, ${r}z`
}

const ActiveChart = ({ data }) => {
    const [vpW, setvpW] = useState(window.innerWidth)
    let shouldRender = true
    const resizeActivities = () => {
        setvpW(window.innerWidth)
    }

    data = data.map((e, i) => {
        e.count = i
        return e
    })

    const ref = useRef()
    useEffect(() => {
        window.addEventListener('resize', resizeActivities)
        //draw(ref.current) ?? utile ou pas ?
        return () => window.removeEventListener('resize', resizeActivities)
    }, [])

    useEffect(() => {
        //console.log('useEffect() resizing...')
        if (ref.current.firstElementChild)
            ref.current.firstElementChild.remove()
        draw(ref.current)
    }, [vpW])

    const draw = (chartRef) => {
        const chart = d3.select(ref.current).append('div')
        chart.attr('class', 'activities')
        chart.style('position', 'relative')
        const dep = 50 // dépassement vertical du rectangle de sélection par rapport à kilo.max
        const cal_dep = 25 // dépassement vertical de calo.max par rapport à kilo.max
        const deb = 17 // débordement horizontale du rectangle de sélection
        const hist_top = 112.5 - dep
        const hist_bottom = 62.5
        const hist_left = 43 - deb
        const hist_right = 90 - deb
        const hist_w = chartRef.clientWidth - (hist_right + hist_left)
        const hist_h = chartRef.clientHeight - (hist_bottom + hist_top)
        const hist_h_kilo = hist_h - dep

        const rangeKilo = getRange(data, 'kilogram')
        const rangeCalo = getRange(data, 'calories')
        const nbEl = data.length

        const kilo_hscale = hist_h_kilo / (rangeKilo.max - rangeKilo.min + 1)
        const calo_hscale = (hist_h_kilo + cal_dep) / rangeCalo.max

        const svg = chart
            .append('svg')
            .style('position', 'relative')
            .style('width', hist_w)
            .style('height', hist_h)
            .style('top', hist_top)
            .style('left', hist_left)

        const w = (hist_w - deb * 2 - 22) / (nbEl - 1)

        // affichage de l'axe de base, axe supérieur et axe intermédiaire
        svg.append('path')
            .attr('class', 'base-axis')
            .attr('d', `M${deb},${hist_h}h${hist_w - deb * 2}`)

        svg.append('path')
            .attr('class', 'axis')
            .attr('d', `M${deb},${dep}h${hist_w - deb * 2}`)

        svg.append('path')
            .attr('class', 'axis')
            .attr('d', `M${deb},${dep + hist_h_kilo / 2}h${hist_w - deb * 2}`)

        svg.selectAll('.select')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'select')
            .attr('x', (d, i) => i * w)
            .attr('y', 0)
            .attr('width', 22 + deb * 2)
            .attr('height', hist_h)
            .attr('id', (d, i) => `sel-${i}`)

        svg.selectAll('.kilo')
            .data(data)
            .enter()
            .append('path')
            .attr('class', 'kilo')
            .attr('d', (d, i) =>
                bar(
                    i * w + deb,
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
                bar(i * w + deb + 15, hist_h, 7, calo_hscale * d.calories, 3)
            )

        svg.selectAll('.transparent')
            .data(data)
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
                const rect = d3.select(`#sel-${d.count}`)
                rect.style('opacity', 0.5)
                let tt = document.getElementById('act-tooltip')
                const getPx = () => {
                    switch (d.count) {
                        case data.length - 1:
                            return hist_w + hist_left - 1.5 * deb - 22 - 54
                        default:
                            return d.count * w + hist_left + 22 + deb * 1.5
                    }
                }
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
                const rect = d3.select(`#sel-${d.count}`)
                rect.style('opacity', 0)
                tooltip.style('opacity', 0)
            })
        // affichage des jours
        chart
            .append('svg')
            .attr('class', 'base-axis-legend')
            .style('position', 'absolute')
            .style('top', hist_top + hist_h + 15)
            .style('left', hist_left + deb)
            .style('width', hist_w - deb * 2)
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
            .attr('y', hist_top + dep + 1)
            .text(rangeKilo.max)
        legendRight
            .append('text')
            .attr('x', 0)
            .attr('y', hist_top + dep + hist_h_kilo / 2 + 1)
            .text((rangeKilo.min - 1 + rangeKilo.max) / 2)
        legendRight
            .append('text')
            .attr('x', 0)
            .attr('y', hist_top + hist_h + 1)
            .text(rangeKilo.min - 1)

        // tooltip
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

export default ActiveChart
