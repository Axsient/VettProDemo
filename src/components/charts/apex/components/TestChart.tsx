"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import ReactApexChart to avoid SSR issues
const ReactApexChart = dynamic(() => import('react-apexcharts'), { 
  ssr: false,
  loading: () => <div>Loading chart...</div>
});

export const TestChart: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  const options = {
    chart: {
      type: 'line' as const,
      height: 350,
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    },
    yaxis: {
      title: {
        text: 'Values'
      }
    },
    legend: {
      show: true,
      position: 'top' as const,
    },
  };

  const series = [{
    name: 'Test Data',
    data: [10, 20, 15, 25, 30]
  }];

  return (
    <div className="p-4 border rounded">
      <h3 className="mb-4">Simple Test Chart</h3>
      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height={350}
      />
    </div>
  );
}; 