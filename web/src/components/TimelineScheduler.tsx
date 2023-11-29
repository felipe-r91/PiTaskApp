import { useState, useEffect, useRef } from "react";
import { DayPilot, DayPilotCalendar } from "@daypilot/daypilot-lite-react";
import '../styles/timeline.css';
import { Orders, Workers } from "./Schedule";
import { AvatarColab } from "../assets/AvatarColab";


interface TimetableEvent {
  id: number;
  start: DayPilot.Date;
  end: DayPilot.Date;
  text: string;
  resource?: string;
}

interface Props {
  workers?: Workers
  orders?: Orders
}

export function TimelineScheduler(props: Props) {
  const timetableRef = useRef<DayPilotCalendar>(null);
  const [events, setEvents] = useState<TimetableEvent[]>([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [days, setDays] = useState<string[]>([]);

  function availableWorkers(): number {
    if (props.workers?.length === undefined) {
      return 10
    } else if (props.workers.length % 2 != 0) {
      return props.workers.length + 1
    } else {
      return props.workers?.length
    }
  }

  const config: DayPilot.CalendarConfig = {
    locale: 'pt-br',
    viewType: "Week",
    theme: 'timeline',
    businessBeginsHour: 0,
    businessEndsHour: (availableWorkers() / 2),
    heightSpec: 'BusinessHoursNoScroll',
    headerHeight: 60,
    hourWidth: 0,
    cellDuration: 120,
    cellHeight: 60,
    durationBarVisible: true,
    headerDateFormat: "dddd d/M/yyyy",

    onBeforeHeaderRender: (args: any) => {
      const dayName = args.header.name
      if (!days.includes(dayName)) {
        setDays(prevDays => [...prevDays, dayName])
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {

      try {
        // Simulating an HTTP request
        const result = await new Promise<TimetableEvent[]>((resolve) => {
          setTimeout(() => {
            resolve([
              {
                id: 1,
                start: DayPilot.Date.today().addHours(0),
                end: DayPilot.Date.today().addMinutes(30),
                text: "OS 6432 - Faurecia",
                resource: 'test'
              },
              {
                id: 2,
                start: DayPilot.Date.today().addDays(1).addHours(0),
                end: DayPilot.Date.today().addDays(1).addMinutes(30),
                text: "OS 6783 - Electrolux "
              },
              {
                id: 3,
                start: DayPilot.Date.today().addHours(1),
                end: DayPilot.Date.today().addHours(1).addMinutes(30),
                text: "OS 6523 - Fundacao"
              }
            ]);
          }, 200);
        });

        setEvents(result);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchData();
  }, []);

  const handleScroll: React.UIEventHandler<HTMLDivElement> = (e) => {
    const target = e.currentTarget;
    setScrollPosition(target.scrollTop);

  }


  return (
    <>
      {scrollPosition > 50 &&
        <div className="z-10 flex pl-[255px] w-[100%] pr-[55px] gap-2">
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
          <div className="max-h-[800px] overflow-auto" onScroll={handleScroll}>
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