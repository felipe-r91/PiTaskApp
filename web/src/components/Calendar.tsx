import { useState, useEffect, useRef } from 'react';
import { DayPilot, DayPilotCalendar, DayPilotNavigator } from "@daypilot/daypilot-lite-react";
import '../styles/daypilotcalendar.css';
import '../styles/daypilotnav.css';
import { Workers }from "./Schedule"
import { Orders }from "./Schedule"

interface CalendarProps{
  workers ?: Workers,
  orders ?: Orders
}

export function Calendar( props : CalendarProps) {

  const columnsData: {
    name: string, 
    id: string,
    
  }[] = []
  
  const [images, setImages] = useState<string[]>([])

  function buColor(orderBu: string) {
    switch (orderBu) {
      default:
      case 'ER':
        return '#1EA7FF';
      case 'MI':
        return '#41D37E';
      case 'MR':
        return '#F7B000';
      case 'SB':
        return '#e5e5ed'
    }
  }
  function buBackColor(orderBu: string) {
    switch (orderBu) {
      default:
      case 'ER':
        return '#9dc8e8';
      case 'MI':
        return '#b7eccd';
      case 'MR':
        return '#f4e3b9';
      case 'SB':
        return '#e5e5ed'
    }
  }

  function toolTip(orderBu: string, startDate: string, endDate: string){
    switch(orderBu){
      default:
        case 'ER':
          return 'Equip. Refrigeração'.concat('\n').concat('Início: ' + startDate.substring(11, 16)).concat('\n').concat('Final: ' + endDate.substring(11, 16))
        case 'MI':
          return 'Manut. Industrial'.concat('\n').concat('Início: ' + startDate.substring(11, 16)).concat('\n').concat('Final: ' + endDate.substring(11, 16))
        case 'MR':
          return 'Manut. Refrigeração'.concat('\n').concat('Início: ' + startDate.substring(11, 16)).concat('\n').concat('Final: ' + endDate.substring(11, 16))
        case 'SB':
          return 'Sem Bussiness Unit'.concat('\n').concat('Início: ' + startDate.substring(11, 16)).concat('\n').concat('Final: ' + endDate.substring(11, 16))
    }
  }

  props.workers?.map((worker) => {
    columnsData.push({name: worker.name, id: worker.id.toString()});
    images.push("./src/assets/uploads/"+ worker.photo)
  })

//Function to determine the image source for each header
const getImageForHeader = (args: any) => {
  const columnId = args.header.id;
  const column = columnsData.find((col) => col.id === columnId);
  if (column) {
    const columnIndex = columnsData.indexOf(column);
    const imageSrc = images[columnIndex];
    return imageSrc || ""; 
  }
  return "";
};


  const [config, setConfig] = useState<DayPilot.CalendarConfig>({
    locale: 'pt-br',
    viewType: "Resources",
    theme: 'daypilotcalendar',
    allowEventOverlap: false,
    startDate: new DayPilot.Date(),
    cellHeight: 27,
    headerHeight: 150,
    businessBeginsHour: 7,
    businessEndsHour: 18,
    columns: [],
    events: [],

    

    onEventResized: async () => {
      alert('event resized')
    },

    onEventClicked: async () => {
      alert('event clicked')
    },

    onEventMoved:async () => {
      alert('event moved')
    }

  });

  const calendarRef = useRef<DayPilotCalendar>(null);

  function handleTimeRangeSelected(args: DayPilot.NavigatorTimeRangeSelectedArgs) {
    calendarRef.current!.control.update({
      startDate: args.day
    });
  }

  useEffect(() => {
    // Mapping functions to fill arrays
    const newColumnsData = (props.workers || []).map((worker) => ({
      name: worker.name.concat(' ').concat(worker.surname),
      id: worker.id.toString(),
    }));

    const newImages = (props.workers || []).map((worker) => `./src/assets/uploads/${worker.photo}`);

    const newEventsData = (props.orders || []).map((order) => ({
      id: order.id,
      text: `OS - ${order.order_id}\n\n${order.costumer.substring(7, 50)}`,
      start: new DayPilot.Date(order.start_date).toString(),
      end: new DayPilot.Date(order.end_date).toString(),
      resource: order.worker_id.toString(),
      toolTip: toolTip(order.bu, order.start_date, order.end_date),
      barColor: buColor(order.bu),
      barBackColor: buBackColor(order.bu),
      moveDisabled: false,
    }));

    setImages(newImages);
    // Update the config object
    setConfig({
      ...config,
      columns: newColumnsData,
      events: newEventsData,
    });

  }, [props.workers, props.orders]);

  return (
    <div className='flex gap-5'>
      <DayPilotNavigator
        locale='pt-br'
        theme='daypilotnav'
        selectMode={"Day"}
        showMonths={3}
        skipMonths={1}
        onTimeRangeSelected={args => { handleTimeRangeSelected(args) }}
        showWeekNumbers= {true}
        startDate={new DayPilot.Date()}
      />
      <DayPilotCalendar
        {...config}
        onBeforeHeaderRender={(args: any) => {
          const header = args.header as any;
          header.verticalAlignment = " ";
          const imageSrc = getImageForHeader(args);
          args.header.areas = [
            {
              left: "calc(50% - 29px)",
              bottom: 55,
              height: 65,
              width: 65,
              image: imageSrc,
              style: 'border-radius: 40px; overflow: hidden; border: 3px solid #fff;',
            },
          ];
        }}
        ref={calendarRef}
      />
    </div>
  );
}
