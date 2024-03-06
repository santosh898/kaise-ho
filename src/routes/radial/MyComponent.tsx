// RadialChart.tsx


import { FunctionalComponent } from 'preact';
import RadialChart from './RadialChart';



const MyComponent: FunctionalComponent = () => {
  const chartData = [10, 20, 30, 40, 50];
  const chartLabels = ['A', 'B', 'C', 'D', 'E'];

  return (
    <div>
      <h2>Interactive Radial Chart</h2>
      <RadialChart data={chartData} labels={chartLabels} />
    </div>
  );
};

export default MyComponent;
