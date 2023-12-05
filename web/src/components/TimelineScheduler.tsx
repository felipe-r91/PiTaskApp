import { useState, useEffect, useRef } from "react";
import { DayPilot, DayPilotCalendar, DayPilotNavigator } from "@daypilot/daypilot-lite-react";
import '../styles/timeline.css';
import { Orders, Workers } from "./Schedule";
import { AvatarColab } from "../assets/AvatarColab";
import { TbChevronLeft, TbChevronRight } from "react-icons/tb";


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
  resizeDisabled: boolean
}

interface CustomDateRange {
  startDate: string;
  endDate: string;
}

interface Props {
  workers?: Workers
  orders?: Orders
}

export function TimelineScheduler(props: Props) {
  const timetableRef = useRef<DayPilotCalendar>(null);
  const [events, setEvents] = useState<TimetableEvent[] | undefined>([]);
  const [startDate, setStartDate] = useState<DayPilot.Date>(new DayPilot.Date())
  const [scrollPosition, setScrollPosition] = useState(0);
  const [days, setDays] = useState<string[]>([]);
  const [viewType, setViewType] = useState('Week')
  const [headerDateFormat, setHeaderDateFormat] = useState('dddd d/M/yyyy')

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
        moveDisabled: false,
        resizeDisabled: true,
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
  
    // Adjust start and end times based on orderStartDate and orderEndDate if needed
    // ...
  
    return { startDate: startTime, endDate: endTime };
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

  const config: DayPilot.CalendarConfig = {
    locale: 'pt-br',
    viewType: viewType,
    days: 15,
    theme: 'timeline',
    startDate: startDate,
    businessBeginsHour: 0,
    businessEndsHour: (availableWorkers() / 2),
    heightSpec: 'BusinessHoursNoScroll',
    headerHeight: 60,
    hourWidth: 0,
    cellDuration: 120,
    cellHeight: 60,
    durationBarVisible: true,
    headerDateFormat: headerDateFormat,
    events: [],

    onBeforeHeaderRender: (args: any) => {
      const dayName = args.header.name
      if (!days.includes(dayName)) {
        setDays(prevDays => [...prevDays, dayName])
      }
    },
  };

  const handleScroll: React.UIEventHandler<HTMLDivElement> = (e) => {
    const target = e.currentTarget;
    setScrollPosition(target.scrollTop);
  }
  
  function previousDate() {
    if(viewType === 'Week'){
      setStartDate(startDate.addDays(-7))
      setDays([])
    } else {
      setStartDate(startDate.addDays(-15))
      setDays([])
    }
    
  }

  function nextDate() {
    if(viewType === 'Week'){
      setStartDate(startDate.addDays(7))
      setDays([])
    } else {
      setStartDate(startDate.addDays(15))
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
                  {startDate.weekNumber()}
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
                  {startDate.getMonth() + 1}
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
          <button type="button" onClick={() => {setViewType('Days'); setHeaderDateFormat('d/M/yyyy'); setStartDate(startDate.firstDayOfMonth())}} className={`w-fit h-[30px] rounded-2xl px-3  ${viewType === 'Days' ? 'bg-purple-light' : 'bg-[#edecfe]'} ${viewType === 'Days' ? 'text-white' : 'text-purple-dark'}  text-[14px] flex items-center justify-between`}>
            Quinzenal
          </button>
          <button type="button" onClick={() => {setViewType('Week'); setHeaderDateFormat('dddd d/M/yyyy')}} className={`w-fit h-[30px] rounded-2xl px-3  ${viewType === 'Week' ? 'bg-purple-light' : 'bg-[#edecfe]'} ${viewType === 'Week' ? 'text-white' : 'text-purple-dark'} text-[14px] flex items-center justify-between`}>
            Semanal
          </button>
        </div>
        {startDate.getDatePart() !== new DayPilot.Date().getDatePart() &&
          <button
            className="w-16 h-9 flex justify-center items-center bg-[#EDECFE] text-base text-[#5051F9] hover:bg-[#5051F9] hover:text-white rounded-xl"
            type='button'
            onClick={() => setStartDate(new DayPilot.Date())}>
            Hoje
          </button>
        }
      </div>
      {scrollPosition > 60 &&
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
          <div className="max-h-[900px] overflow-auto scrollbar-hide" onScroll={handleScroll}>
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
          </div>
        </div>
      </div>
    </>
  );
};