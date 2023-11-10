import { TbAlarm } from "react-icons/tb";
import '../styles/IconHover.css';
import * as React from 'react';
import * as Toast from '@radix-ui/react-toast';
import { useState } from "react";

export function ReminderButton(){

  const [open, setOpen] = useState(false);
  const eventDateRef = React.useRef(new Date());
  const timerRef = React.useRef(0);
  const [status, setStatus] = useState('unassigned')

  React.useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  function oneDayAway() {
    const now = new Date();
    const inOneDay = now.setDate(now.getDate() + 1);
    return new Date(inOneDay);
  }
  
  function prettyDate(date: number | Date | undefined) {
    return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full', timeStyle: 'short' }).format(date);
  }

  return (
    <Toast.Provider swipeDirection="right">
      <button
        className="changeColorIcon bg-[#EDECFE] flex gap-2 hover:bg-[#5051F9] hover:text-white text-sm text-[#5051F9] font-bold items-center py-2 px-2 rounded"
        onClick={() => {
          setOpen(false);
          window.clearTimeout(timerRef.current);
          timerRef.current = window.setTimeout(() => {
            eventDateRef.current = oneDayAway();
            setOpen(true);
            setStatus('delayed')
          }, 10);
        }}
      >
        <TbAlarm size={24}/>
        Lembrete
      </button>

      <Toast.Root
        className="bg-white rounded-md shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] p-[15px] grid [grid-template-areas:_'title_action'_'description_action'] grid-cols-[auto_max-content] gap-x-[15px] items-center data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out] data-[swipe=end]:animate-swipeOut"
        open={open}
        onOpenChange={setOpen}
      >
        <Toast.Title className="[grid-area:_title] mb-[5px] font-semibold text-black text-[15px]">
          Agendado para amanhã
        </Toast.Title>
        <Toast.Description asChild>
          <time
            className="[grid-area:_description] m-0 text-black text-[13px] leading-[1.3]"
            dateTime={eventDateRef.current.toISOString()}
          >
            {prettyDate(eventDateRef.current)}
          </time>
        </Toast.Description>
        <Toast.Action className="[grid-area:_action]" asChild altText="Goto schedule to undo">
          <button className="inline-flex items-center justify-center rounded font-medium text-xs px-[10px] leading-[25px] h-[25px] bg-purple-light  text-white">
            OK
          </button>
        </Toast.Action>
      </Toast.Root>
      <Toast.Viewport className="[--viewport-padding:_25px] fixed bottom-0 right-0 flex flex-col p-[var(--viewport-padding)] gap-[10px] w-[390px] max-w-[100vw] m-0 list-none z-[2147483647] outline-none" />
    </Toast.Provider>
  );
};





