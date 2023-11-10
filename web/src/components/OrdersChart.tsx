import { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";
import "@fontsource/dm-sans";
import dayjs from "dayjs";
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { api } from "../lib/axios";
import { useEffect, useState } from "react";



export function OrdersChart(){
  //Intialize arrays
  //Array with week number + "S" letter
  const weeks: string [] = []
  //Array to store week numbers
  const weekNumbers: number [] = []
  //Array to store new orders created on the actual week
  const newOrdersByWeek : number [] = []
  //Array to store completed orders on the actual week
  const completedOrdersByWeek : number [] = []
  //States to render chart
  const [chartSeries1, setChartSeries1] = useState<number[]>([])
  const [chartSeries2, setChartSeries2] = useState<number[]>([])
  //Plugin dayjs to get actual week number
  dayjs.extend(weekOfYear)
  const todayWeek = dayjs().week()
  //Loop to get 10 week numbers on the past
  for (var index = 10; index > 0 ; index--) {
    var weekNumber = (todayWeek+1) - index
    weekNumbers.push(weekNumber);
  }
  //Loop do add "S" letter to week numbers
  for (var index = 0; index < weekNumbers.length ; index++){
    var weekString = weekNumbers[index].toString()
    const text = 'S'
    var result = text.concat(weekString)
    weeks.push(result)
  }
 //Loop to get new orders and completed orders on the 10 weeks
  for(var index = 0; index < weekNumbers.length; index++){
      api.get('/WeeklyNewOrders', {
        params:{
          weekNumber: weekNumbers[index]
        }
      }).then(response => {
        newOrdersByWeek.push(response.data)
      })

      api.get('/WeeklyCompletedOrders', {
        params:{
          weekNumber : weekNumbers[index]
        }
      }).then(response => {
        completedOrdersByWeek.push(response.data)
      })
    }
    //Set states to render chart
    useEffect(() =>{
      setChartSeries1(newOrdersByWeek)
      setChartSeries2(completedOrdersByWeek)
    }, [])

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
      data: chartSeries1},
      {
        name:'Ordens Completas',
        data: chartSeries2,
      },
    ],
    
    dataLabels: {
      enabled: false,
      
    },
    stroke: {
      curve: 'smooth',
      width:1
      
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
      labels:{
        style:{
          fontFamily: 'DM sans',
          colors: '#768396',
          fontSize:'12px'
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
    yaxis:{
      labels: {
        style:{
          fontFamily: 'DM sans',
          colors:'#768396',
          fontSize: '12px'
        }
      }
    },
    grid:{
      xaxis:{
        lines:{
          show: false
        }
      },
      yaxis:{
        lines:{
          show:true
        }
      }
    },
    legend:{
      show:true,
      fontFamily: 'DM sans',
      fontSize: '10px'
      
    },
  };
    //return chart object
    return (<ReactApexChart key={chartData.series?.length} options={chartData} series={chartData.series} type='area' height={244} width={771} />)
  
  }

  

