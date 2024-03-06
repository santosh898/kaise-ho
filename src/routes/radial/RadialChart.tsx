// RadialChart.tsx

import { FunctionalComponent } from 'preact';
import Chart from 'chart.js/auto';
import { useEffect, useRef } from 'preact/hooks';

interface RadialChartProps {
  data: number[];
  labels: string[];
}

const RadialChart: FunctionalComponent<RadialChartProps> = ({ data, labels }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        new Chart(ctx, {
          type: 'polarArea',
          data: {
            labels: labels,
            datasets: [{
              label: 'Radial Chart',
              data: data,
              backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.5)',
                'rgba(255, 206, 86, 0.5)',
                'rgba(75, 192, 192, 0.5)',
                'rgba(153, 102, 255, 0.5)'
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)'
              ],
              borderWidth: 1
            }]
          }
        });
      }
    }
  }, [data, labels]);

  return <canvas ref={canvasRef}></canvas>;
};

export default RadialChart;
