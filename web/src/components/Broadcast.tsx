import { useEffect, useState } from "react"
import { api } from "../lib/axios";
import { AvatarColab } from "../assets/AvatarColab";
import dayjs from "dayjs";
import isBetween from 'dayjs/plugin/isBetween';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { Transition } from "@headlessui/react";
import { TbCalendarCancel } from "react-icons/tb";

type Worker = {
  id: number;
  name: string;
  surname: string;
  photo: string;
  role: string;
}

type Event = {
  order_id: number;
  worker_id: number;
  costumer: string;
  bu: string;
  start_date: string;
  end_date: string;
  status: string;
}

type Card = {
  workerId: number;
  workerName: string;
  workerSurname: string;
  workerPhoto: string;
  workerRole: string;
  orders: {
    orderId: number;
    orderCostumer: string;
    orderStartEarliestDate: string;
    orderEndLatestDate: string;
    orderBu: string
  }[]
}

export function Broadcast() {

  const [workers, setWorkers] = useState<Worker[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [cards, setCards] = useState<Card[]>([])
  const [weekToShow, setWeekToShow] = useState<number>(0);
  const [todayWeek, setTodayWeek] = useState<number>(0)
  const [show, setShow] = useState<boolean>(true)
  const [refresh, setRefresh] = useState<boolean>(true)
  const [emptyAgenda, setEmptyAgenda] = useState<boolean>(false)
  let eventsOnThisWeek: Event[]

  function sleep(ms: number | undefined) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  useEffect(() => {
    api.get('/workers').then(response => {
      setWorkers(response.data)
    })
  }, [refresh])

  useEffect(() => {
    api.get('/AllEvents').then(response => {
      setEvents(response.data)
    })
  }, [refresh])

  useEffect(() => {
    sleep(700).then(() => setShow(true))
  }, [weekToShow])

  useEffect(() => {
    const assignedEvents = events.filter(event => event.status === 'assigned')
    const currentDate = dayjs()
    const daysUntilSunday = (currentDate.day() + 7) % 7
    const firstDayOfWeek = currentDate.subtract(daysUntilSunday, 'day').startOf('day')
    const firstDayOfNextWeek = firstDayOfWeek.add(7, 'day')
    const firstDayOfNextNextWeek = firstDayOfWeek.add(14, 'day')
    const lastDayOfWeek = firstDayOfWeek.add(6, 'days')
    const lastDayOfNextWeek = lastDayOfWeek.add(7, 'day')
    const lastDayOfNextNextWeek = lastDayOfWeek.add(14, 'day')
    dayjs.extend(weekOfYear)
    dayjs.extend(isBetween)


      if(weekToShow === 0){
        setTodayWeek(dayjs(firstDayOfWeek).week())
        eventsOnThisWeek = assignedEvents.filter(event => dayjs(event.start_date).isBetween(firstDayOfWeek, lastDayOfWeek, 'day', '[]'))
        
      }
      if(weekToShow === 1){
        setTodayWeek(dayjs(firstDayOfNextWeek).week())
        eventsOnThisWeek = assignedEvents.filter(event => dayjs(event.start_date).isBetween(firstDayOfNextWeek, lastDayOfNextWeek, 'day', '[]'))
        
      }
      if(weekToShow === 2){
        setTodayWeek(dayjs(firstDayOfNextNextWeek).week())
       eventsOnThisWeek = assignedEvents.filter(event => dayjs(event.start_date).isBetween(firstDayOfNextNextWeek, lastDayOfNextNextWeek, 'day', '[]'))
        
      }
    
    const eventsToUse = getEarliestAndLatestEvents(eventsOnThisWeek);
    
    setShow(false)
    setCards(createCards(eventsToUse));

  }, [events, weekToShow])

  useEffect(() => {
    const interval = setInterval(() => {
      setWeekToShow(prevWeek => (prevWeek + 1) % 3); // Update weekToShow every 15 seconds
      setRefresh(prevRefresh => !prevRefresh); // Toggle refresh status every 15 seconds
    }, 15000);
  
    return () => clearInterval(interval);
  }, []);
  
  function buColor(bu: string) {
    switch (bu) {
      case 'ER':
        return 'bg-[#1EA7FF] text-white';
      case 'MI':
        return 'bg-[#41D37E] text-white';
      case 'MR':
        return 'bg-[#F7B000] text-white';
      case 'SB':
        return 'bg-white border-[#e5e5ed] border-[1px] text-[#768396]'
    }
  }

  function getWorkerName(id: number): string {
    let name: string = ''
    workers.map((worker) => {
      if (worker.id === id) {
        name = worker.name
      }
    })
    return name;
  }

  function getWorkerSurname(id: number): string {
    let surname: string = ''
    workers.map((worker) => {
      if (worker.id === id) {
        surname = worker.surname
      }
    })
    return surname;
  }
  function getWorkerPhoto(id: number): string {
    let photo: string = ''
    workers.map((worker) => {
      if (worker.id === id) {
        photo = worker.photo
      }
    })
    return photo;
  }

  function getWorkerRole(id: number): string {
    let role: string = ''
    workers.map((worker) => {
      if (worker.id === id) {
        role = worker.role
      }
    })
    return role;
  }

  function getEarliestAndLatestEvents(events: Event[]): Event[] {
    const groupedEvents: Record<string, Event[]> = {};
    const groupedEvents1: Record<string, Event[]> = {};

    // Group events by worker_id and order_id
    events.forEach((event) => {
        const key = `${event.worker_id}_${event.order_id}`;
        if (!groupedEvents[key] || dayjs(event.start_date).isBefore(dayjs(groupedEvents[key][0].start_date))) {
            groupedEvents[key] = [event];
        }
        if(!groupedEvents1[key] || dayjs(event.end_date).isAfter(dayjs(groupedEvents1[key][0].end_date))){
            groupedEvents1[key] = [event]
        }
    });

    // Flatten the groups
    //console.log(groupedEvents)
    const eventsList: Event[] = Object.values(groupedEvents).flatMap((group) => group);
    
    eventsList.forEach((event, index) => {
      const key = `${event.worker_id}_${event.order_id}`;
      eventsList[index].end_date = groupedEvents1[key][0].end_date;
    });

    return eventsList;
  };



function createCards(events: Event[]): Card[] {
  const groupedData: Record<string, Card[]> = {};

  events.forEach((event) => {
      const key = `${event.worker_id}`;
      if (!groupedData[key]) {
          // If the worker_id doesn't exist in groupedData, create a new entry
          groupedData[key] = [{
              workerId: event.worker_id,
              workerName: getWorkerName(event.worker_id),
              workerSurname: getWorkerSurname(event.worker_id),
              workerPhoto: getWorkerPhoto(event.worker_id),
              workerRole: getWorkerRole(event.worker_id),
              orders: [{
                  orderId: event.order_id,
                  orderBu: event.bu,
                  orderCostumer: event.costumer,
                  orderStartEarliestDate: dayjs(event.start_date).format('DD/MM'),
                  orderEndLatestDate: dayjs(event.end_date).format('DD/MM')
              }]
          }];
      } else {
          // If the worker_id already exists, append the order to the existing data
          groupedData[key][0].orders.push({
              orderId: event.order_id,
              orderBu: event.bu,
              orderCostumer: event.costumer,
              orderStartEarliestDate: dayjs(event.start_date).format('DD/MM'),
              orderEndLatestDate: dayjs(event.end_date).format('DD/MM')
          });
      }
  });

  const cardCreated: Card[] = Object.values(groupedData).flatMap((group) => group);
  return cardCreated;
}


  useEffect(() => {
    if (cards.length === 0) {
      setEmptyAgenda(true)
    } else {
      setEmptyAgenda(false)
    }
  }, [events, weekToShow])


  return (
    <>
      <div className="flex h-[100vh] overflow-hidden scrollbar-hide">
        <section className="w-full bg-off-white">
          <div className="text-purple-xdark text-5xl justify-center items-center flex bg-white h-[90px] font-bold px-10 py-8">Cronograma da Semana {todayWeek}</div>
          {emptyAgenda ?
          <div className="flex flex-col justify-center items-center pt-[250px]">
            <TbCalendarCancel size={100} color="#8D98A9" opacity={80} />
            <div className="text-[#8D98A9] text-2xl pt-4">
              Sem agenda para a semana
            </div>
          </div>
            :
            <>
              <div className="px-10 pt-7 grid grid-rows-3 grid-flow-col gap-2.5">
                {cards.map((card, i) => {
                  return (
                    <div key={i}>
                      <Transition
                        appear={true}
                        show={show}
                        enter="transform transition duration-[1000ms]"
                        enterFrom="opacity-0 translate-x-[153px]"
                        enterTo="opacity-100 translate-x-[0px]"
                        leave="transform duration-[1000ms] transition ease-in-out"
                        leaveFrom="opacity-100 translate-x-[0px]"
                        leaveTo="opacity-0 translate-x-[153px]"
                      >
                        {show &&

                          <div className="w-[635px] h-[305px] bg-[#d2d3f8] rounded-xl flex items-center gap-4">
                            <div className="bg-white w-[235px] h-[297px] rounded-xl ml-1 flex justify-center">
                              <div className="pt-10 pl-5">
                                <AvatarColab width="w-[100px]" height="h-[100px]" name={card.workerName} surname={card.workerSurname} img={card.workerPhoto} />
                                <div className="ml-[-30px] pt-10 justify-center items-center flex flex-col">
                                  <div className="text-purple-dark text-[24px]">{card.workerName} {card.workerSurname}</div>
                                  <div className="text-[#768396] font-medium">{card.workerRole}</div>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col h-[297px] py-5 gap-3">
                              {card.orders.map((order, i) => {
                                return (
                                  <div key={i}>
                                    <div className="bg-white w-[364px] h-[58px] rounded-xl flex items-center justify-between gap-1 px-3">
                                      <div className={`${buColor(order.orderBu)} rounded-md w-[45px] flex justify-center font-semibold`}>{order.orderId}</div>
                                      <div className="text-[#768396]">{order.orderCostumer.split(' ')[2] + ' ' + order.orderCostumer.split(' ')[3]}</div>
                                      <div className="flex gap-2">

                                      <div className="text-purple-dark font-bold text-base">{order.orderStartEarliestDate}</div>
                                      <div>-</div>
                                      <div className="text-purple-dark font-bold text-base">{order.orderEndLatestDate}</div>
                                      </div>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        }
                      </Transition>
                    </div>
                  )
                })}
              </div>
            </>
          }
        </section>
      </div>
    </>
  )
}
