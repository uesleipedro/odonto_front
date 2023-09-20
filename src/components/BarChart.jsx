import React, { useState, useEffect, use } from "react"
import { Bar, Chart } from "react-chartjs-2"
import {
    Chart as ChartJs,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js"

ChartJs.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
)

const BarChart = () => {
    const [chartData, setChartData] = useState({
        dataset: [{}],
    })
    const [chartOptions, setChartOptions] = useState({})
    
    return (
        <>
            <div className="w-full md:col-span-2 relative lg:h[70vh] h-[50vh] m-auto p-4 border rounded-lg bg-white">
                {/* <Bar data={chartData} options={chartOptions} /> */}
            </div>
        </>
    )
}

export default BarChart
