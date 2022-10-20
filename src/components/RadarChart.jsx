import React, { useEffect, useState } from 'react'
import * as d3 from 'd3'
import '../assets/RadarChart.css'
import { getRange } from '../utils/utils'

const RadarChart = ({ data: performances }) => {
    const ref = React.useRef()
    const [radarW, setRadarW] = useState(0)
    const performancesRange = getRange(performances, 'value')

    const N = performances.length
    let radarPointsRef = []
    for (let i = 0; i < N; i++) {
        const ang = Math.PI / 6 // tourner l'ensemble de 30°
        radarPointsRef.push({
            x: Math.cos((i * Math.PI * 2) / N + ang),
            y: Math.sin((i * Math.PI * 2) / N + ang),
        })
    }

    const resizeChart = () => {
        const chart = document.querySelector('.c-radar')
        const brect = chart.getBoundingClientRect()
        chart.style.height = `${1.0194 * brect.width}px`
        setRadarW(brect.width)
    }

    useEffect(() => {
        window.addEventListener('resize', resizeChart)
        //draw(ref.current)
        console.log('RadarChart first drawned')
        resizeChart()
        return () => window.removeEventListener('resize', resizeChart)
    }, [])

    useEffect(() => {
        if (ref.current.firstElementChild) {
            ref.current.firstElementChild.remove()
        }
        d3.select(ref.current).append('g')
        draw()
    }, [radarW])

    const radarLine = (w) => {
        return `M${radarW / 2},${radarW / 2}
            ${radarPointsRef.reduce(
                (prev, curr, idx) =>
                    `${prev + (idx === 0 ? 'M' : 'L')}${
                        radarW / 2 + w * curr.x
                    },${radarW / 2 - w * curr.y}`,
                ''
            )}Z`
    }

    const draw = () => {
        const g = d3
            .select(ref.current.firstElementChild)
            .append('svg')
            .attr('id', 'radar-chart')
            .style('position', 'absolute')
            .style('top', 0)
            .attr('width', radarW)
            .attr('height', radarW * 1.0194)
            .style('font-size', radarW * 0.0581)

        const padding = 0.155 * radarW
        const Rmax = radarW / 2 - padding
        const rayons = [Rmax / 8, Rmax / 4, Rmax / 2, Rmax * 0.75, Rmax]
        rayons.forEach((r) =>
            g
                .append('path')
                .attr('class', 'radar-line')
                .attr('fill', 'none')
                .attr('d', radarLine(r))
        )
    }

    return <div ref={ref} className="chart3 c-radar"></div>
}

export default RadarChart
