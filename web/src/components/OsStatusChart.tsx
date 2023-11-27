import { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";

interface ChartProps {
  completedOrders: number,
  unassignedOrders: number,
  assignedOrders: number
}

export function OsStatusChart(props: ChartProps) {

  const chartData: ApexOptions = {
    chart: {
      toolbar: {
        show: false
      },
      fontFamily: 'DM - sans',
      foreColor: '#768396',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      },
    },
    series: [props.completedOrders, props.assignedOrders, props.unassignedOrders],
    labels: ['Completas', 'Planejadas', 'Sem Planejamento'],
    colors: ['#00e396', '#f7b000', '#fd3c30'],
    dataLabels: {
      enabled: false
    },
    legend: {
      position: 'right'
    },

    plotOptions: {
      pie: {
        customScale: 1,
        donut: {
          size: '80%',
          background: 'transparent',
          labels: {
            show: true,
            total: {
              show: true,
              showAlways: false,
              label: 'Total',
              fontSize: '16px',
              fontFamily: 'DM - sans, Arial, sans-serif',
              fontWeight: 600,
              color: '#768396',
              formatter: function (w) {
                return w.globals.seriesTotals.reduce((a: any, b: any) => {
                  return a + b
                }, 0)
              }
            }
          }
        }
      }
    }
  }
  return (<ReactApexChart key={chartData.series?.length} options={chartData} series={chartData.series} type='donut' height={250} width={350} />)

}