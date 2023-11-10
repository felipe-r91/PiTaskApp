import React from "react";
import { TbAlertCircle, TbBell, TbTool } from "react-icons/tb";
import { ReminderButton } from "./ReminderButton";
import '../styles/reminderIconHover.css';
import { ReminderAssignButton } from "./ReminderAssignButton";

interface ReminderProps {
  soNumber: number;
  soTitle: string;
  soCostumer: string;

}



export function Reminder(props: ReminderProps) {

  return (
    <div className="bg-white w-graphic-w h-20 rounded-2xl grid grid-cols-6 items-center">
      <div className="items-center flex  gap-4 justify-center">
        <div className="bg-purple-light h-9 w-9 rounded-full justify-center items-center shadow-custom">
          <div className="p-1.5">
            <div>{React.createElement(TbBell, { size: 24, color: '#FFFFFF' })}</div>
          </div>
        </div>
        <ReminderAssignButton orderId={props.soNumber}/>
      </div>
      <div className="justify-center items-center gap-1 grid">
        <div className="justify-center flex">
          <TbAlertCircle color="#8D98A9" size={24}/>
        </div>
        <div className="text-black font-semibold text-sm">
          Atribuir OS {props.soNumber}
        </div >

      </div>
      <div className="grid col-span-2 justify-center items-center gap-2 overflow-hidden">
        
        <div className="flex justify-center">
          <div  className="justify-center items-center pr-2 flex">
        <TbTool color="#8D98A9" size={24}/>
        </div>
          <div className="text-purple-light text-sm text-center font-semibold w-[190px]">
          {props.soTitle}
          </div>
          
        </div>

      </div>
      <div className="text-purple-xdark justify-center items-center grid font-semibold text-base text-center overflow-auto">
        {props.soCostumer}
      </div>
      <div className="grid items-center justify-center">
        <ReminderButton />
      </div>
    </div>


  )

}