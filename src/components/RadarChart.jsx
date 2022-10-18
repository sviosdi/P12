import React, { useEffect, useState } from 'react'
import * as d3 from 'd3'
import '../assets/RadarChart.css'

const RadarChart = ({ data }) => {
    const ref = React.useRef()
    const [radarW, setRadarW] = useState(0)

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
        //console.log('useEffect() resizing...')
        /*if (ref.current.lastElementChild) ref.current.lastElementChild.remove()
        draw(ref.current)*/
    }, [radarW])

    return <div ref={ref} className="chart3 c-radar"></div>
}

export default RadarChart
