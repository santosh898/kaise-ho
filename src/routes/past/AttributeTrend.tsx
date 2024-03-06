import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  BarController,
  BarElement,
  Filler,
} from "chart.js";
import { useEffect, useMemo, useRef } from "preact/hooks";
import { Update } from "../../utils/localStorage";
import { format, parseISO } from "date-fns";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  BarController,
  BarElement,
  Filler
);

const AttributeTrend = ({
  attribute,
  allWeeks,
}: {
  attribute: string;
  allWeeks: Update[];
}) => {
  const ref = useRef<HTMLCanvasElement>(null);

  const [labels, data] = useMemo(() => {
    const labels: string[] = [];
    const data: number[] = [];
    allWeeks.forEach(({ attributes, date }) => {
      labels.push(format(parseISO(date), "MMM dd"));
      data.push(attributes[attribute]);
    });
    return [labels, data];
  }, [allWeeks, attribute]);

  useEffect(() => {
    const ctx = ref.current;

    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            data,
            borderWidth: 1,
            fill: true,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            min: 0,
            max: 10,
          },
        },
        backgroundColor: "white",
        line: {},
      },
    });
    return () => chart.destroy();
  }, [labels, data]);

  return (
    <div
      style={{
        margin: "24px 0px",
      }}
    >
      <canvas ref={ref} width={400} height={250}></canvas>
    </div>
  );
};

export default AttributeTrend;
