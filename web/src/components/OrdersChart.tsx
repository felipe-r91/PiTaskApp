import { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";
import "@fontsource/dm-sans";
import dayjs from "dayjs";
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { api } from "../lib/axios";
import { useEffect, useState } from "react";

type Order = {
  id: number;
  created_at: number;
  completed_at: number;
}


export function OrdersChart() {
  //Intialize arrays
  //Array with week number + "S" letter
  const weeks: string[] = []
  //Array to store week numbers
  const weekNumbers: number[] = []
  //Array to store new orders
  const [newOrdersCount, setNewOrdersCount] = useState<number[]>([]);
  //Array to store completed orders
  const [completedOrdersCount, setCompletedOrdersCount] = useState<number[]>([])

  //Loop to get 10 week numbers on the past
  for (var i = 9; i >= 0; i--) {
    const date = dayjs().subtract(i, 'week')
    dayjs.extend(weekOfYear)
    const weekNumber = dayjs(date).week()
    weekNumbers.push(weekNumber);
  }
  //Loop do add "S" letter to week numbers
  for (var index = 0; index < weekNumbers.length; index++) {
    var weekString = weekNumbers[index].toString()
    const text = 'S'
    var result = text.concat(weekString)
    weeks.push(result)
  }

  useEffect(() => {
    api.get('/NewOrders').then(response => {
      const countArray = calculateOrdersCount(response.data, weekNumbers, true);
      setNewOrdersCount(countArray);
    })
  }, [])

  useEffect(() => {
    api.get('/CompletedOrders').then(response => {
      const countArray = calculateOrdersCount(response.data, weekNumbers, false);
      setCompletedOrdersCount(countArray);
    })
  }, [])

  function calculateOrdersCount(orders: Order[], weeks: number[], isNew: boolean): number[] {
    const ordersCount: number[] = Array(weeks.length).fill(0);

    orders.forEach((order) => {
      if (isNew) {
        const weekIndex = weeks.findIndex((week) => order.created_at === week);
        if (weekIndex !== -1) {
          ordersCount[weekIndex]++;
        }
      } else {
        const weekIndex = weeks.findIndex((week) => order.completed_at === week);
        if (weekIndex !== -1) {
          ordersCount[weekIndex]++;
        }
      }
    });
    return ordersCount;
  };

  //Chart options, documentation on apexcharts
  const chartData: ApexOptions = {
    chart: {
      height: 244,
      type: 'area',
      toolbar: {
        show: false
      },

    },
    series: [{
      name: 'Ordens Criadas',
      data: newOrdersCount
    },
    {
      name: 'Ordens Completas',
      data: completedOrdersCount,
    },
    ],

    dataLabels: {
      enabled: false,

    },
    stroke: {
      curve: 'smooth',
      width: 1

    },
    markers: {
      size: 3.5,
      colors: undefined,
      strokeColors: '#fff',
      strokeWidth: 3,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
      discrete: [],
      shape: "circle",
      radius: 2,
      offsetX: 0,
      offsetY: 0,
      onClick: undefined,
      onDblClick: undefined,
      showNullDataPoints: true,
      hover: {
        size: undefined,
        sizeOffset: 1
      }
    },
    xaxis: {
      labels: {
        style: {
          fontFamily: 'DM sans',
          colors: '#768396',
          fontSize: '12px'
        }
      },
      type: 'category',
      categories: weeks

    },
    tooltip: {
      x: {
        format: 'Month'
      },
    },
    yaxis: {
      labels: {
        style: {
          fontFamily: 'DM sans',
          colors: '#768396',
          fontSize: '12px'
        }
      }
    },
    grid: {
      xaxis: {
        lines: {
          show: false
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      }
    },
    legend: {
      show: true,
      fontFamily: 'DM sans',
      fontSize: '10px'

    },
  };
  //return chart object
  return (
  <ReactApexChart key={chartData.series?.length} options={chartData} series={chartData.series} type='area' height={244} width={771} />)

}



