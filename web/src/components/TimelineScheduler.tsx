import { useState, useEffect, useRef, SetStateAction } from "react";
import { DayPilot, DayPilotCalendar } from "@daypilot/daypilot-lite-react";
import { Dialog, DialogClose, DialogContent, DialogOverlay, DialogPortal, DialogTitle } from "@radix-ui/react-dialog";
import '../styles/timeline.css';
import { Orders, Workers } from "./Schedule";
import { Order } from "./Calendar";
import { AvatarColab } from "../assets/AvatarColab";
import { FiX } from 'react-icons/fi';
import { TbChevronLeft, TbChevronRight } from "react-icons/tb";
import { ConcludeOSForm } from "./ConcludeOSForm";
import { VisualizeOS } from "./VisualizeOS";
import { EditOS } from "./EditOS";
import { api } from "../lib/axios";


interface TimetableEvent {
  id: number,
  fontColor: string,
  backColor: string,
  text: string,
  start: string,
  end: string,
  toolTip: string,
  barColor: string,
  barBackColor: string,
  moveDisabled: boolean,
  resizeDisabled: boolean,
  tags: string[]
}

interface CustomDateRange {
  startDate: string;
  endDate: string;
}

interface Props {
  workers?: Workers
  orders?: Orders
  fetchAssignedOrders: () => void
}

export function TimelineScheduler(props: Props) {
  const timetableRef = useRef<DayPilotCalendar>(null);
  const [events, setEvents] = useState<TimetableEvent[] | undefined>([]);
  const [startDateCalendar, setStartDateCalendar] = useState<DayPilot.Date>(new DayPilot.Date())
  const [scrollPosition, setScrollPosition] = useState(0);
  const [days, setDays] = useState<string[]>([]);
  const [viewType, setViewType] = useState('Week')
  const [headerDateFormat, setHeaderDateFormat] = useState('dddd d/M/yyyy')
  const [isConcludeDialogOpen, setConcludeDialogOpen] = useState(false)
  const [isVisualizeDialogOpen, setVisualizeDialogOpen] = useState(false)
  const [isEditDialogOpen, setEditDialogOpen] = useState(false)
  const [orderNumber, setOrderNumber] = useState(0)
  const [orderToDisplay, setOrderToDisplay] = useState<Order>()
  let orderId: number
  let idToUpdate : number
  let nameToUpdate : string

  useEffect(() => {
    const newEventsData = (props.orders || []).map((order) => {
      const dateRange = CalcCustomStartEndEvent(order.worker_id, order.start_date);
  
      const defaultEvent: TimetableEvent = {
        id: order.id,
        fontColor: textColor(order.status),
        backColor: '',
        text: `OS - ${order.order_id} ${order.costumer.substring(7, 50)} ${textAnnotation(order.status)}`,
        start: "2023-12-01T09:00:00",
        end: "2023-12-01T09:00:00",
        toolTip: toolTip(order.bu, order.start_date, order.end_date),
        barColor: buColor(order.bu),
        barBackColor: buBackColor(order.bu),
        moveDisabled: checkMovePermission(order.status),
        resizeDisabled: true,
        tags: [order.order_id.toString(), order.status]
      };
  
      if (dateRange) {
        const { startDate, endDate } = dateRange;
        return {
          ...defaultEvent,
          text: textEvent(order.order_id, order.costumer),
          start: startDate,
          end: endDate,
        };
      } else {
        return null; // Use null instead of undefined
      }
    });
  
    // Filter out null values and ensure that the result is of type TimetableEvent[]
    const filteredEventsData = newEventsData.filter((event): event is TimetableEvent => event !== null);
  
    setEvents(filteredEventsData);
  }, [props.orders, viewType]);
  
  
  
  function CalcCustomStartEndEvent(id: number, orderStartDate: string): CustomDateRange {
    const orderDate = new DayPilot.Date(orderStartDate);
    const baseDate = orderDate.getDatePart()
    const timeSlotDuration = 30; // Duration of each time slot in minutes
    const startTime = baseDate.addMinutes((id - 1) * timeSlotDuration).toString();
    const endTime = baseDate.addMinutes(id * timeSlotDuration).toString();  
    return { startDate: startTime, endDate: endTime };
  }

  function calcCustomWorkerId(customTime: string){
    let id: string | SetStateAction<number>
    const orderDate = new DayPilot.Date(customTime)
    const baseDate = orderDate.getTimePart()
    const baseMilliseconds = 1800000
    if(baseDate === 0){
      id = 1
    } else {
      id = (baseDate / baseMilliseconds) + 1
    }
    idToUpdate = id
    const worker = props.workers?.filter(worker => worker.id === id)
    worker?.map(worker=> {
      nameToUpdate = worker.name
    })
  } 

  function availableWorkers(): number {
    if (props.workers?.length === undefined) {
      return 10
    } else if (props.workers.length % 2 != 0) {
      return props.workers.length + 1
    } else {
      return props.workers?.length
    }
  }

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

  function textEvent(orderId: number, costumer: string): string{
    switch(viewType){
      default:
      case 'Week':
        return `OS - ${orderId}\u00A0\u00A0\u00A0\u00A0${costumer.substring(7, 15)}`
      case 'Days':
        return `OS ${orderId}`
    }
  }

  function filterOrder(orderId: number) {
    const foundOrder = props.orders?.find((order) => order.order_id === orderId);
    if (foundOrder && foundOrder.order_id !== orderToDisplay?.order_id) {
      setOrderToDisplay(foundOrder);
    }
  }

  filterOrder(orderNumber)
  
  function checkMovePermission(status: string){
    if (status === 'completed'){
      return true
    } else {
      return false
    }
  }

  const advanced = [{
    text: 'Editar',
    onClick: (args: any) => {
      if (viewType === 'Week'){
        const textSource = args.source.text().substring(5, 15)
        const orderNumber = Number(textSource.split('\u00A0')[0])
        setOrderNumber(orderNumber)
      }
      if (viewType === 'Days'){
        const textSource = args.source.text().substring(3, 15)
        const orderNumber = Number(textSource.split('\u00A0')[0])
        setOrderNumber(orderNumber)
      }
      setEditDialogOpen(true)
      setStartDateCalendar(new DayPilot.Date(args.source.start()))
    }
  },
  {
    text: 'Visualizar',
    onClick: (args: any) => {
      if (viewType === 'Week'){
        const textSource = args.source.text().substring(5, 15)
        const orderNumber = Number(textSource.split('\u00A0')[0])
        setOrderNumber(orderNumber)
      }
      if (viewType === 'Days'){
        const textSource = args.source.text().substring(3, 15)
        const orderNumber = Number(textSource.split('\u00A0')[0])
        setOrderNumber(orderNumber)
      }
      setVisualizeDialogOpen(true)
      setStartDateCalendar(new DayPilot.Date(args.source.start()))
    }
  },
  {
    text: 'Concluir OS',
    onClick: (args: any) => {
      if (viewType === 'Week'){
        const textSource = args.source.text().substring(5, 15)
        const orderNumber = Number(textSource.split('\u00A0')[0])
        setOrderNumber(orderNumber)
      }
      if (viewType === 'Days'){
        const textSource = args.source.text().substring(3, 15)
        const orderNumber = Number(textSource.split('\u00A0')[0])
        setOrderNumber(orderNumber)
      }
      setConcludeDialogOpen(true)
      setStartDateCalendar(new DayPilot.Date(args.source.start()))
    }
  }
  ]

  const basic = [
    {
      text: 'Visualizar',
      onClick: (args: any) => {
        if (viewType === 'Week'){
          const textSource = args.source.text().substring(5, 15)
          const orderNumber = Number(textSource.split('\u00A0')[0])
          setOrderNumber(orderNumber)
        }
        if (viewType === 'Days'){
          const textSource = args.source.text().substring(3, 15)
          const orderNumber = Number(textSource.split('\u00A0')[0])
          setOrderNumber(orderNumber)
        }
        setVisualizeDialogOpen(true)
        setStartDateCalendar(new DayPilot.Date(args.source.start()))
      }
    },
  ]

  const CalendarMenu = new DayPilot.Menu({
    onShow: args => {
      const event = args.source
      args.menu.items = event.data.tags[1] === 'completed' ? basic : advanced
    },
    hideOnMouseOut: true
  })

  const config: DayPilot.CalendarConfig = {
    locale: 'pt-br',
    viewType: viewType,
    days: 15,
    theme: 'timeline',
    startDate: startDateCalendar,
    businessBeginsHour: 0,
    businessEndsHour: ((availableWorkers() / 2) + 1),
    heightSpec: 'BusinessHoursNoScroll',
    headerHeight: 60,
    hourWidth: 0,
    cellDuration: 120,
    cellHeight: 60,
    durationBarVisible: true,
    headerDateFormat: headerDateFormat,
    events: [],
    contextMenu: CalendarMenu,

    onBeforeHeaderRender: (args: any) => {
      const dayName = args.header.name
      if (!days.includes(dayName)) {
        setDays(prevDays => [...prevDays, dayName])
      }
    },
    onEventMove: (args: any) =>{
     const eventDataTag = args.e.data.tags[0]
     orderId = Number(eventDataTag)
    },
    
    onEventMoved: (args: any) => {
      const eventId = args.e.data.id.toString()
      const newEventDate = args.newStart.value
      calcCustomWorkerId(args.newStart.value.toString())
      api.post('/TimelineUpdateEventDate', {
        eventId,
        newEventDate,
        idToUpdate,
        nameToUpdate,
        orderId
      }).then(() => alert('Atribuição atualizada!'))
    }
  };

  const handleScroll: React.UIEventHandler<HTMLDivElement> = (e) => {
    const target = e.currentTarget;
    setScrollPosition(target.scrollTop);
  }
  
  function previousDate() {
    if(viewType === 'Week'){
      setStartDateCalendar(startDateCalendar.addDays(-7))
      setDays([])
    } else {
      setStartDateCalendar(startDateCalendar.addDays(-15))
      setDays([])
    }
    
  }

  function nextDate() {
    if(viewType === 'Week'){
      setStartDateCalendar(startDateCalendar.addDays(7))
      setDays([])
    } else {
      setStartDateCalendar(startDateCalendar.addDays(15))
      setDays([])
    }
  }

  return (
    <>
      <div className="flex pl-[250px] gap-10 mt-[-15px] items-center pb-6">
        <div className="flex gap-3 items-center">
          {viewType === 'Week' &&
            <>
              <div className="w-[112px] flex gap-3 items-center">
                <div className="font-semibold text-purple-dark text-base w-[60px]">
                  Semana
                </div><div className="text-[#768396] shadow-[#E5E5ED]  inline-flex h-[35px] w-[20px] flex-1 items-center justify-center rounded-[9px] px-[20px] text-[15px]  shadow-[0_0_0_1px] outline-none">
                  {startDateCalendar.weekNumber()}
                </div>
              </div>
            </>
          }
          {viewType === 'Days' &&
            <>
              <div className="w-[112px] flex gap-3 items-center">
                <div className="font-semibold text-purple-dark text-base w-[60px] justify-center flex">
                  Mês
                </div>
                <div className="text-[#768396] shadow-[#E5E5ED]  inline-flex h-[35px] w-[20px] flex-1 items-center justify-center rounded-[9px] px-[20px] text-[15px]  shadow-[0_0_0_1px] outline-none">
                  {startDateCalendar.getMonth() + 1}
                </div>
              </div>
            </>
          }
        </div>
        <div className="flex gap-2">
          <button
            className="w-9 h-9 flex justify-center items-center bg-[#EDECFE] text-base text-[#5051F9] hover:bg-[#5051F9] hover:text-white rounded-xl"
            type='button'
            onClick={() => previousDate()}>
            <TbChevronLeft size={15} />
          </button>
          <button
            className="w-9 h-9 flex justify-center items-center bg-[#EDECFE] text-base text-[#5051F9] hover:bg-[#5051F9] hover:text-white rounded-xl"
            type="button"
            onClick={() => nextDate()}>
            <TbChevronRight size={15} />
          </button>
        </div>
        <div className="flex gap-2 bg-[#edecfe] border border-[#E5E5ED] rounded-2xl">
          <button type="button" onClick={() => {setViewType('Days'); setHeaderDateFormat('d/M/yyyy'); props.fetchAssignedOrders(); setStartDateCalendar(startDateCalendar.firstDayOfMonth())}} className={`w-fit h-[30px] rounded-2xl px-3  ${viewType === 'Days' ? 'bg-purple-light' : 'bg-[#edecfe]'} ${viewType === 'Days' ? 'text-white' : 'text-purple-dark'}  text-[14px] flex items-center justify-between`}>
            Quinzenal
          </button>
          <button type="button" onClick={() => {setViewType('Week'); setHeaderDateFormat('dddd d/M/yyyy'); props.fetchAssignedOrders()}} className={`w-fit h-[30px] rounded-2xl px-3  ${viewType === 'Week' ? 'bg-purple-light' : 'bg-[#edecfe]'} ${viewType === 'Week' ? 'text-white' : 'text-purple-dark'} text-[14px] flex items-center justify-between`}>
            Semanal
          </button>
        </div>
        {startDateCalendar.getDatePart() !== new DayPilot.Date().getDatePart() &&
          <button
            className="w-16 h-9 flex justify-center items-center bg-[#EDECFE] text-base text-[#5051F9] hover:bg-[#5051F9] hover:text-white rounded-xl"
            type='button'
            onClick={() => setStartDateCalendar(new DayPilot.Date())}>
            Hoje
          </button>
        }
      </div>
      {scrollPosition > 50 &&
        <div className="z-10 flex pl-[255px] w-[100%] pr-[22px] gap-2">
          {days.map((day, index) =>
            <div
              key={index}
              className="bg-white text-[#23235F] font-semibold h-[50px] flex flex-1 justify-center items-center rounded-md"
            >
              {day}
            </div>
          )}
        </div>
      }
      <div className="px-5 pt-2 min-w-fit">
        <div className="flex">
          <div className="max-h-[730px] overflow-auto scrollbar-hide" onScroll={handleScroll}>
            <div className="grid">
            <div className="flex">
              <div className="pt-[60px] gap-2">
                {props.workers?.map(worker =>
                (
                  <div key={worker.id} className="w-[230px] h-[60px] grid grid-flow-row rounded-md border border-bottom-[#c0c0c0] bg-white text-purple-dark font-semibold">
                    <div className="pl-6 flex items-center gap-6">
                      <AvatarColab width="w-[45px]" height="h-[45px]" img={worker.photo} name={worker.name} surname={worker.surname} />
                      <div>{worker.name} {worker.surname}</div>
                    </div>
                  </div>
                )
                )}
              </div>
              <DayPilotCalendar
                {...config}
                ref={timetableRef}
                events={events}
              />
            </div>
            <div className="bg-off-white h-32 w-full mt-[-120px] z-10"></div>
            </div>
          </div>
        </div>
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
            <ConcludeOSForm order={{ id: orderToDisplay?.order_id, bu: orderToDisplay?.bu, title: orderToDisplay?.title, description: orderToDisplay?.description, costumer: orderToDisplay?.costumer, planned_hours: orderToDisplay?.planned_hours }} />
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
            <VisualizeOS order={{id: orderToDisplay?.order_id, bu: orderToDisplay?.bu, title: orderToDisplay?.title, description: orderToDisplay?.description, costumer: orderToDisplay?.costumer, planned_hours:orderToDisplay?.planned_hours, lms: orderToDisplay?.lms, created_at: orderToDisplay?.created_at, completed_at: orderToDisplay?.completed_at, status: orderToDisplay?.status}}/>
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
            <EditOS order={{ id: orderToDisplay?.order_id, bu: orderToDisplay?.bu, title: orderToDisplay?.title, description: orderToDisplay?.description, costumer: orderToDisplay?.costumer, planned_hours:orderToDisplay?.planned_hours }}/>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  );
};