import React, { useEffect, useState } from 'react'
import * as d3 from 'd3'
import '../assets/RadarChart.css'
import { getRange } from '../utils/utils'
import PropTypes from 'prop-types'

/**
 * The React component displaying the radar chart of performances
 * @function RadarChart
 * @param { array } data  The array of objects with value { number } and kind { number } fields passed to the component as a property for displaying the radar chart
 * @param { object } kind    The object whose fields are integers that encode the performance type passed to the component as a property
 * @return { jsx } Returns the jsx component
 */
const RadarChart = ({ data: performances, kind }) => {
    const toFrench = {
        cardio: 'Cardio',
        speed: 'Vitesse',
        intensity: 'Intensité',
        energy: 'Énergie',
        strength: 'Force',
        endurance: 'Endurance',
    }
    const ref = React.useRef()
    const [radarW, setRadarW] = useState(0)
    const performancesRange = getRange(performances, 'value')

    const N = performances.length
    const starting_index = 4 // speed

    const resizeChart = () => {
        const chart = document.querySelector('.c-radar')
        const brect = chart.getBoundingClientRect()
        chart.style.height = `${1.0194 * brect.width}px`
        setRadarW(brect.width)
    }

    useEffect(() => {
        window.addEventListener('resize', resizeChart)
        resizeChart()
        RadarChart.radarGridPointsRef = []
        RadarChart.radarLablels = []
        RadarChart.radarLablels = performances.map(
            (p, i) => kind[((p.kind - 1 + starting_index) % N) + 1]
        )
        for (let i = 0; i < N; i++) {
            // Calculate the coordinates of the vertices of the polygon on the trigonometric circle
            const ang = Math.PI / N
            RadarChart.radarGridPointsRef.push({
                x: Math.cos((i * Math.PI * 2) / N + ang),
                y: Math.sin((i * Math.PI * 2) / N + ang),
            })
        }
        return () => window.removeEventListener('resize', resizeChart)
    }, [])

    useEffect(() => {
        if (ref.current.firstElementChild) {
            ref.current.firstElementChild.remove()
        }
        d3.select(ref.current).append('g')
        draw()
    }, [radarW, performances])

    const radarGridLine = (w) => {
        return `
            ${RadarChart.radarGridPointsRef.reduce(
                (prev, curr, idx) =>
                    `${prev + (idx === 0 ? 'M' : 'L')}${
                        radarW / 2 + w * curr.x
                    },${radarW / 2 - w * curr.y}`,
                ''
            )}Z`
    }

    const padding = 0.19 * radarW
    const Rmax = radarW / 2 - padding

    const draw = () => {
        const g = d3.select(ref.current.firstElementChild)
        const grid = g
            .append('svg')
            .attr('class', 'radar-grid')
            .style('position', 'absolute')
            .style('top', 0)
            .attr('width', radarW)
            .attr('height', radarW * 1.0194)

        const rayons = [Rmax / 8, Rmax / 4, Rmax / 2, Rmax * 0.75, Rmax]
        rayons.forEach((r) =>
            grid
                .append('path')
                .attr('class', 'radar-grid-line')
                .attr('fill', 'none')
                .attr('d', radarGridLine(r))
        )

        let radarLinePointsRef = []
        const coeff_scale = 0.9 * (Rmax / performancesRange.max)
        for (let i = 0; i < N; i++) {
            const index = (i + starting_index) % N
            const val = coeff_scale * performances[index].value
            radarLinePointsRef.push({
                x: val * RadarChart.radarGridPointsRef[i].x,
                y: val * RadarChart.radarGridPointsRef[i].y,
            })
        }

        const radarLine = () => {
            return `${radarLinePointsRef.reduce(
                (prev, curr, idx) =>
                    `${prev + (idx === 0 ? 'M' : 'L')}${radarW / 2 + curr.x},${
                        radarW / 2 - curr.y
                    }`,
                ''
            )}Z`
        }

        const perf = g
            .append('svg')
            .attr('class', 'radar-chart')
            .style('position', 'absolute')
            .style('top', 0)
            .attr('width', radarW)
            .attr('height', radarW * 1.0194)

        perf.append('path')
            .attr('class', 'radar-line')
            .attr('fill', 'none')
            .attr('d', radarLine())

        const labels = g
            .append('svg')
            .attr('class', 'radar-labels')
            .style('position', 'absolute')
            .style('top', 0)
            .attr('width', radarW)
            .attr('height', radarW * 1.0194)

        RadarChart.radarGridPointsRef.forEach((ref, i) => {
            // Get the width and height of the label in pixels
            const fontSize = radarW * 0.045
            const canvas = document.createElement('canvas')
            const context = canvas.getContext('2d')
            context.font = fontSize + 'px ' + 'Roboto'
            const text = toFrench[RadarChart.radarLablels[i]]
                ? toFrench[RadarChart.radarLablels[i]]
                : RadarChart.radarLablels[i]
            const lbl_width = context.measureText(text).width
            const lbl_height = fontSize
            // compute current vertex coordinates in px in the svg frame
            // (origin = upper-left corner of the component)
            const sx = radarW / 2 + Rmax * 1.1 * ref.x
            const sy = radarW / 2 - Rmax * 1.1 * ref.y

            let lbl_x =
                sx - (lbl_width * (1 - RadarChart.radarGridPointsRef[i].x)) / 2
            let lbl_y =
                sy + (lbl_height * (1 - RadarChart.radarGridPointsRef[i].y)) / 2

            labels
                .append('text')
                .attr('x', lbl_x)
                .attr('y', lbl_y)
                .style('font-size', fontSize)
                .text(text)
        })
    } // fin draw()

    return <div ref={ref} className="chart3 c-radar"></div>
}

RadarChart.propTypes = {
    data: PropTypes.array.isRequired,
    kind: PropTypes.object.isRequired,
}

export default RadarChart
