import React, { useState, useEffect } from 'react'
import * as d3 from 'd3'
import '../assets/ScoreChart.css'
import PropTypes from 'prop-types'

/**
 * The React component displaying the score chart
 * @function RadarChart
 * @param { number } data The score value passed to the component as a property
 * @return { jsx } Returns the jsx component
 */
const ScoreChart = ({ data: score }) => {
    const ref = React.useRef()
    const [scoreW, setScoreW] = useState(0)

    const resizeChart = () => {
        const chart = document.querySelector('.c-score')
        const brect = chart.getBoundingClientRect()
        chart.style.height = `${1.0194 * brect.width}px`
        setScoreW(brect.width)
    }

    useEffect(() => {
        window.addEventListener('resize', resizeChart)
        resizeChart()
        return () => window.removeEventListener('resize', resizeChart)
    }, [])

    useEffect(() => {
        if (ref.current.firstElementChild)
            ref.current.firstElementChild.remove()
        draw()
    }, [scoreW, score])

    const draw = () => {
        var svg = d3
            .select(ref.current)
            .append('svg')
            .style('position', 'absolute')
            .attr('top', 0)
            .attr('left', 0)
            .attr('width', scoreW)
            .attr('height', scoreW * 1.0194)
            .append('g')
            .attr(
                'transform',
                'translate(' + scoreW / 2 + ',' + scoreW / 2 + ')'
            )

        var arc_glob = d3
            .arc()
            .innerRadius(scoreW * 0.3)
            .outerRadius(scoreW * 0.3 + scoreW * 0.05)
            .startAngle(0)
            .endAngle(2 * Math.PI)
        svg.append('path')
            .attr('d', arc_glob)
            .attr('fill', '#e0e0e0')
            .attr('stroke', '#d5d5d5')

        var arc = d3
            .arc()
            .cornerRadius(scoreW * 0.022)
            .innerRadius(scoreW * 0.3)
            .outerRadius(scoreW * 0.3 + scoreW * 0.05)
            .startAngle(0)
            .endAngle(-(2 * score) * Math.PI)
        svg.append('path').attr('d', arc).attr('fill', '#f60000')
    }

    return (
        <>
            <div className="chart3 c-score">
                <div>
                    <div className="c-score-title">Score</div>
                    <div className="center">
                        <div>{score * 100}%</div>
                        <div>de votre</div>
                        <div>objectif</div>
                    </div>
                </div>
                <div ref={ref}></div>
            </div>
        </>
    )
}

ScoreChart.propTypes = {
    data: PropTypes.number.isRequired,
}

export default ScoreChart
