import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { motion } from 'framer-motion';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface MoodInsightChartProps {
  data: {
    labels: string[];
    values: number[];
  };
  type?: 'line' | 'bar';
  title?: string;
  subtitle?: string;
}

export function MoodInsightChart({
  data,
  type = 'line',
  title = 'Your Mood Trends',
  subtitle = 'Last 7 days',
}: MoodInsightChartProps) {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Mood Score',
        data: data.values,
        borderColor: 'rgb(20, 184, 166)',
        backgroundColor: type === 'line' 
          ? 'rgba(20, 184, 166, 0.1)'
          : 'rgba(20, 184, 166, 0.8)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: 'rgb(20, 184, 166)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        borderRadius: 8,
        titleFont: {
          size: 14,
          weight: 'bold' as const,
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: (context: any) => {
            const labels = ['Struggling', 'Difficult', 'Okay', 'Good', 'Excellent'];
            return `Mood: ${labels[context.parsed.y - 1] || 'Unknown'}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 1,
          callback: (value: string | number) => {
            const labels = ['', 'Struggling', 'Difficult', 'Okay', 'Good', 'Excellent'];
            return labels[Number(value)] || '';
          },
          font: {
            size: 11,
          },
          color: '#64748B',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false,
        },
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 12,
          },
          color: '#64748B',
        },
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="
        relative overflow-hidden rounded-2xl 
        bg-white
        border border-gray-200
        p-6
        shadow-md
      "
    >
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-[#1A1A1A] mb-1">
          {title}
        </h3>
        <p className="text-sm text-gray-600 font-medium">
          {subtitle}
        </p>
      </div>

      {/* Chart */}
      <div className="h-64">
        {type === 'line' ? (
          <Line data={chartData} options={options} />
        ) : (
          <Bar data={chartData} options={options} />
        )}
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
        <div className="text-center">
          <p className="text-xs text-gray-600 font-semibold mb-1">Average</p>
          <p className="text-lg font-bold text-[#006341]">
            {(data.values.reduce((a, b) => a + b, 0) / data.values.length).toFixed(1)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-600 font-semibold mb-1">Best Day</p>
          <p className="text-lg font-bold text-emerald-600">
            {data.labels[data.values.indexOf(Math.max(...data.values))]}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-600 font-semibold mb-1">Trend</p>
          <p className="text-lg font-bold text-blue-600">
            {data.values[data.values.length - 1] > data.values[0] ? '↑ Up' : '↓ Down'}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// Simple mock chart component for when chart.js isn't available
export function SimpleMoodChart({ data }: { data: { labels: string[]; values: number[] } }) {
  const maxValue = 5;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        relative overflow-hidden rounded-2xl 
        bg-white
        border border-gray-200
        p-6
        shadow-md
      "
    >
      <h3 className="text-lg font-bold text-[#1A1A1A] mb-6">
        Your Mood Trends
      </h3>
      
      <div className="flex items-end justify-between gap-2 h-48 mb-4">
        {data.values.map((value, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-2">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(value / maxValue) * 100}%` }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="w-full bg-linear-to-t from-[#006341] to-[#007A52] rounded-t-lg min-h-5"
            />
            <span className="text-xs text-gray-600 font-semibold">
              {data.labels[index]}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
