import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    type ChartOptions
} from 'chart.js';
import type React from 'react';
import { Bar, Doughnut, Pie } from 'react-chartjs-2';
import { useMemo } from 'react';
// import ChartDataLabels from 'chartjs-plugin-datalabels';


type TBarGraph = {
    datas: number[];
}


function generateRGBAColorArray(count: number, alpha = 0.5) {
    return Array.from({ length: count }, (_, i) => {
        const hue = Math.floor((360 / count) * i);
        return `hsla(${hue}, 70%, 50%, ${alpha})`;
    });
}

export const BarGraph:React.FC<TBarGraph> = ({datas}) => {

    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend,
        // ChartDataLabels
    );

    const options: ChartOptions<'bar'>  = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Survey Data Summary',
            },
        },
    };
    const labels: string[] = ["Population", "Baptized", "Confirmation", "Married", "Lumon"]
    const data = {
    labels,
    datasets: [
        {
            label: 'Survey Data Summary',
            data: datas,
            backgroundColor: useMemo(() => generateRGBAColorArray(labels.length), [labels.length]),
        },
    ],};
    return (
        <div className="w-full h-[30vh] md:h-full">
            <Bar options={options} data={data} />
        </div>
    )
}

type TPieGraph ={
    datas: number[]
}

export const CircleGraph: React.FC<TPieGraph> = ({datas}) =>{
    ChartJS.register(ArcElement, Tooltip, Legend, );

    const labels = ["---","Sick", "Single", "Living alone", "Widowed", "Widower"]

    const data = {
        labels: labels,
        datasets: [
        {
            label: 'Survey Life Status',
            data: datas,
            backgroundColor:  useMemo(() => generateRGBAColorArray(labels.length), [labels.length]),
            borderWidth: 0.5,
        },
    ],};
    
    const options: ChartOptions<'pie'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
                legend: {
                position: 'right',
            },
            title: {
                display: true,
                text: 'Survey Life Status',
            },
        },
    };  


    return (
        <div className="w-full h-[30vh] md:h-full">
            <Pie data={data} options={options} />
        </div>
    )
}


type TDoughnutGraph ={
    datas: number[]
}


export const CircleDoughnut: React.FC<TDoughnutGraph> = ({datas}) =>{
    ChartJS.register(ArcElement, Tooltip, Legend, );
    const labels = ["OFW","Pensioner"];

        const data = {
            labels: labels,
            datasets: [
            {
                label: 'Occupation OFW and Pensioner count',
                data: datas,
                backgroundColor:  useMemo(() => generateRGBAColorArray(labels.length), [labels.length]),
                borderWidth: 0.5,
            },
        ],};

        const options: ChartOptions<'doughnut'> = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                    legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Occupation OFW and Pensioner count',
                },
            },
        };  

    return(
         <div className="w-full h-[30vh] md:h-full">
            <Doughnut data={data} options={options} />
        </div>
    );
}
