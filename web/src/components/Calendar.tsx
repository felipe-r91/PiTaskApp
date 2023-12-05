import { useState, useEffect, useRef } from 'react';
import { DayPilot, DayPilotCalendar, DayPilotNavigator } from "@daypilot/daypilot-lite-react";
import { Dialog, DialogClose, DialogContent, DialogOverlay, DialogPortal, DialogTitle } from "@radix-ui/react-dialog";
import '../styles/daypilotcalendar.css';
import '../styles/daypilotnav.css';
import { Workers } from "./Schedule"
import { Orders } from "./Schedule"
import { FiX } from 'react-icons/fi';
import { ConcludeOSForm } from './ConcludeOSForm';

interface CalendarProps {
  workers?: Workers,
  orders?: Orders
}

type Order = {
  id: number;
  order_id: number;
  worker_name: string;
  worker_id: number;
  worker_hours: number;
  start_date: string;
  end_date: string;
  status: string;
  costumer: string;
  bu: string;
  description: string;
  assigned_workers_id: JSON;
  title: string;
}

export function Calendar(props: CalendarProps) {

  const columnsData: {
    name: string,
    id: string,

  }[] = []

  const [images, setImages] = useState<string[]>([])
  const [isConcludeDialogOpen, setConcludeDialogOpen] = useState(false)
  const [isVisualizeDialogOpen, setVisualizeDialogOpen] = useState(false)
  const [isEditDialogOpen, setEditDialogOpen] = useState(false)
  const [dialogControl, setDialogControl] = useState('')
  const [orderNumber, setOrderNumber] = useState(0)
  const [orderToDisplay, setOrderToDisplay] = useState<Order>()
  const [startDateCalendar, setStartDateCalendar] = useState<DayPilot.Date>(new DayPilot.Date())

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

  function toolTip(orderBu: string, startDate: string, endDate: string) {
    switch (orderBu) {
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

  function textColor(orderStatus: string) {
    switch (orderStatus) {
      default:
        return ''
      case 'completed':
        return '#bfbfbf'
    }
  }
  function textAnnotation(orderStatus: string) {
    switch (orderStatus) {
      default:
        return ''
      case 'completed':
        return '\n\n\n\nCONCLUÍDA'
    }
  }

  function filterOrder(orderId: number) {
    const foundOrder = props.orders?.find((order) => order.order_id === orderId);
    if (foundOrder && foundOrder.order_id !== orderToDisplay?.order_id) {
      setOrderToDisplay(foundOrder);
    }
  }

  props.workers?.map((worker) => {
    columnsData.push({ name: worker.name, id: worker.id.toString() });
    images.push("./src/assets/uploads/" + worker.photo)
  })

  filterOrder(orderNumber)

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

  const advanced = [{
    text: 'Editar',
    onClick: (args: any) => {
      const textSource = args.source.text().substring(5, 15)
      const orderNumber = Number(textSource.split('\n')[0])
      setOrderNumber(orderNumber)
      setEditDialogOpen(true)
      setStartDateCalendar(new DayPilot.Date(args.source.start()))
    }
  },
  {
    text: 'Visualizar',
    onClick: (args: any) => {
      const textSource = args.source.text().substring(5, 15)
      const orderNumber = Number(textSource.split('\n')[0])
      setOrderNumber(orderNumber)
      setVisualizeDialogOpen(true)
      setStartDateCalendar(new DayPilot.Date(args.source.start()))
    }
  },
  {
    text: 'Concluir OS',
    onClick: (args: any) => {
      const textSource = args.source.text().substring(5, 15)
      const orderNumber = Number(textSource.split('\n')[0])
      setOrderNumber(orderNumber)
      setConcludeDialogOpen(true)
      setStartDateCalendar(new DayPilot.Date(args.source.start()))
    }
  }
  ]

  const basic = [
    {
      text: 'Visualizar',
      onClick: (args: any) => {
        const textSource = args.source.text().substring(5, 15)
        const orderNumber = Number(textSource.split('\n')[0])
        setOrderNumber(orderNumber)
        setVisualizeDialogOpen(true)
        setStartDateCalendar(new DayPilot.Date(args.source.start()))
      }
    },
  ]

  const CalendarMenu = new DayPilot.Menu({
    onShow: args => {
      const event = args.source
      args.menu.items = event.data.tags === 'completed' ? basic : advanced
    },
    hideOnMouseOut: true
  })

  const [configNav, setConfigNav] = useState<DayPilot.NavigatorConfig>({
    locale: 'pt-br',
    theme: 'daypilotnav',
    selectMode: "Day",
    showMonths: 2,
    skipMonths: 1,
    showWeekNumbers: true,
    startDate: startDateCalendar
  })

  const [configCal, setConfigCal] = useState<DayPilot.CalendarConfig>({
    locale: 'pt-br',
    viewType: "Resources",
    theme: 'daypilotcalendar',
    allowEventOverlap: false,
    startDate: startDateCalendar,
    cellHeight: 24.5,
    headerHeight: 150,
    businessBeginsHour: 7,
    businessEndsHour: 18,
    columns: [],
    events: [],
    contextMenu: CalendarMenu,


    onEventResized: async () => {
      alert('event resized')
    },

    onEventClicked: async () => {
      alert('event clicked')
    },

    onEventMoved: async () => {
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
      fontColor: textColor(order.status),
      backColor: '',
      text: `OS - ${order.order_id}\n\n${order.costumer.substring(7, 50)} ${textAnnotation(order.status)}`,
      start: new DayPilot.Date(order.start_date).toString(),
      end: new DayPilot.Date(order.end_date).toString(),
      resource: order.worker_id.toString(),
      toolTip: toolTip(order.bu, order.start_date, order.end_date),
      barColor: buColor(order.bu),
      barBackColor: buBackColor(order.bu),
      moveDisabled: false,
      tags: order.status
    }));

    setImages(newImages);
    // Update the config object
    setConfigCal({
      ...configCal,
      startDate: startDateCalendar,
      columns: newColumnsData,
      events: newEventsData,
    });

    setConfigNav({
      ...configNav,
      startDate: startDateCalendar
    })

  }, [props.workers, props.orders, isConcludeDialogOpen, isEditDialogOpen, isVisualizeDialogOpen]);

  return (
    <>
      <div className='flex gap-5'>
        <div className='pt-24'>
          <DayPilotNavigator
            {...configNav}
            onTimeRangeSelected={args => { handleTimeRangeSelected(args); }}
          />
        </div>
        <DayPilotCalendar
          {...configCal}
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
          ref={calendarRef} />
      </div>
      <Dialog open={isConcludeDialogOpen}>
        <DialogPortal>
          <DialogOverlay className="bg-black opacity-60 data-[state=open]:animate-overlayShow fixed inset-0" />
          <DialogContent className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[1090px] translate-x-[-50%] translate-y-[-50%] rounded-[12px] p-6 bg-white shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
            <DialogTitle className="m-0 text-[30px] font-medium flex items-center gap-7">
              Concluir Ordem de Serviço
            </DialogTitle>
            <DialogClose
              onClick={() => { setConcludeDialogOpen(false) }}
              className="absolute right-6 top-6 hover:bg-purple-100 rounded-full">
              <FiX size={24} color='#5051F9' />
            </DialogClose>
            <ConcludeOSForm order={{ id: orderToDisplay?.order_id, bu: orderToDisplay?.bu, title: orderToDisplay?.title, description: orderToDisplay?.description, assigned_workers_id: orderToDisplay?.assigned_workers_id, costumer: orderToDisplay?.costumer }} />
          </DialogContent>
        </DialogPortal>
      </Dialog>
      <Dialog open={isVisualizeDialogOpen}>
        <DialogPortal>
          <DialogOverlay className="bg-black opacity-60 data-[state=open]:animate-overlayShow fixed inset-0" />
          <DialogContent className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[1090px] translate-x-[-50%] translate-y-[-50%] rounded-[12px] p-6 bg-white shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
            <DialogTitle className="m-0 text-[30px] font-medium flex items-center gap-7">
              Visualizar Ordem de Serviço
            </DialogTitle>
            <DialogClose
              onClick={() => { setVisualizeDialogOpen(false) }}
              className="absolute right-6 top-6 hover:bg-purple-100 rounded-full">
              <FiX size={24} color='#5051F9' />
            </DialogClose>
            <div>To-do</div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
      <Dialog open={isEditDialogOpen}>
        <DialogPortal>
          <DialogOverlay className="bg-black opacity-60 data-[state=open]:animate-overlayShow fixed inset-0" />
          <DialogContent className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[1090px] translate-x-[-50%] translate-y-[-50%] rounded-[12px] p-6 bg-white shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
            <DialogTitle className="m-0 text-[30px] font-medium flex items-center gap-7">
              Editar Ordem de Serviço
            </DialogTitle>
            <DialogClose
              onClick={() => { setEditDialogOpen(false) }}
              className="absolute right-6 top-6 hover:bg-purple-100 rounded-full">
              <FiX size={24} color='#5051F9' />
            </DialogClose>
            <div>To-do</div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  );
}
