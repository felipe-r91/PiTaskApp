import { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

interface ChartProps{
  planned_hours?: number,
  performed_hours?: number[],
}

export function PlannedKPIChart(props : ChartProps){
  
  const [color1, setColor1] = useState<string>('')
  const [color2, setColor2] = useState<string>('')
  const [acurrancy, setAcurrancy] = useState<number>(0)

  const perfomedHours = props.performed_hours?.reduce((acc, currValue) => {
    return acc += currValue;
  }, 0)

  function calculatePlannnedAccurancy(planned?: number, performed?: number){
    if(planned && performed){
      const accuracy = (planned / performed) * 100;
      setAcurrancy(Number(accuracy.toFixed(0)));
    }
  }

  function setGradientColors(acurrancy: number) {
    if (90 <= acurrancy) {
      setColor1('#15eb4a') 
      setColor2('#0bebce')
    }
    if (80 <= acurrancy && acurrancy <= 89) {
      setColor1('#20E647')
      setColor2('#87D4F9')
    }
    if (70 <= acurrancy && acurrancy <= 79) {
      setColor1('#ebe815') 
      setColor2('#eb770b')
    }
    if (60 <= acurrancy && acurrancy <= 69) {
      setColor1('#eb3515') 
      setColor2('#eba50b')
    }
    if (50 <= acurrancy && acurrancy <= 59) {
      setColor1('#f02a08') 
      setColor2('#eb830b')
    }
    if (40 <= acurrancy && acurrancy <= 49) {
      setColor1('#f00808') 
      setColor2('#eb0b66')
    }
    if (39 >= acurrancy) {
      setColor1('#f00808') 
      setColor2('#eb0b2e')
    }
    
  }

  useEffect(() => {
    calculatePlannnedAccurancy(props.planned_hours, perfomedHours);
  }, [props.planned_hours, perfomedHours]);
  
  useEffect(() => {
    setGradientColors(acurrancy);
  }, [acurrancy]);

  const chartData : ApexOptions = {
    chart:{
      type: 'radialBar',
      toolbar: {
        show: false
      },
    },
    series:[acurrancy],
    colors: [color1],
    plotOptions: {
      radialBar:{
        hollow:{
          margin: 0,
          size: '64%',
          background: '#ffffff'
        },
        track: {
          dropShadow:{
            enabled: true,
            top: 2,
            left: 0,
            blur: 4,
            opacity: 0.15
          }
        },
        dataLabels:{
          name:{
            offsetY: -10,
            color: '#232360',
            fontFamily: 'DM sans',
            fontSize: '13px'
          },
          value:{
            offsetY: 2,
            color: '#232360',
            fontSize: '25px',
            show: true
          }
        },
        
      }
    },
    fill:{
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'vertical',
        gradientToColors: [color2], stops: [0, 100]
      }
    },
    stroke:{
      lineCap: 'round',
    },
    labels: ['Precisão']
  }
  
  
  return (<ReactApexChart options={chartData} series={chartData.series} type="radialBar" height={150} width={150} /> )
}