import React, { useEffect, useState } from "react";
import { IconType } from "react-icons/lib";
import { PlannedKPIChart } from "./PlannedKPIChart";
import { TbDatabaseOff } from "react-icons/tb";

interface CardProps {
  icon: IconType;
  title: string;
  label: string;
  firstData?: number;
  secondData?: number;
}


export function DashCardGraph(props: CardProps) {

  const [showGraph, setShowGraph] = useState(true)

  let perfomedHours: number[] = []
  if (props.secondData) {
    perfomedHours.push(props.secondData)
  }
  useEffect(() => {
    if (props.secondData === 0 || props.firstData === 0) {
      setShowGraph(false)
    } else {
      setShowGraph(true)
    }
  }, [props.firstData, props.secondData])
  return (
    <div className="bg-white w-custom1 h-52 rounded-2xl">
      <div className="w-full h-14 flex items-center justify-start pl-5 pt-5 gap-6">
        <div className="bg-dashboard-icon w-9 h-9 rounded-full justify-center items-center">
          <div className="p-1.5">
            <div>{React.createElement(props.icon, { size: 24, color: '#8D98A9' })}</div>
          </div>
        </div>
        <div className="text-purple-dark text-base font-semibold pl-3">{props.title}</div>
      </div>
      <div className="pl-5 pt-3">
        <div className="bg-[#E8EDF1] h-line-h w-line-w "></div>
      </div>
      <div className="flex items-center justify-center">
        {showGraph ? (
          <PlannedKPIChart label={props.label} planned_hours={props.firstData} performed_hours={perfomedHours} />
        ) : (
          <div className="grid">
            <div className="flex justify-center pt-8">
              <TbDatabaseOff size={30} color="#8D98A9" />
            </div>
            <div className="pt-3 text-gray-light">Sem dados suficientes</div>
          </div>
        )
        }
      </div>
    </div>
  )
}