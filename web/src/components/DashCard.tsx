import React from "react";
import { IconType } from "react-icons/lib";
import { Link } from "react-router-dom";

interface CardProps {
  icon: IconType;
  mainValue: number;
  title: string;
  svgStroke: string;
  kpiValue: number;
  kpiColor: string;
  link: string;
}


export function DashCard(props: CardProps) {


  return (
    <div className="bg-white w-custom1 h-52 rounded-2xl">
      <Link
        to={props.link}>
        <div className="w-full h-14 flex items-center justify-between pl-5 pt-5 pr-5">
          <div className="bg-dashboard-icon w-9 h-9 rounded-full justify-center items-center">
            <div className="p-1.5">
              <div>{React.createElement(props.icon, { size: 24, color: '#8D98A9' })}</div>
            </div>
          </div>
          <div className="text-purple-dark text-base font-semibold pl-3">{props.title}</div>
          <div className="text-dashboard-value text-xl font-bold pl-4">{props.mainValue}</div>
        </div>
        <div className="pl-5 pt-8">
          <div className="bg-[#E8EDF1] h-line-h w-line-w "></div>
        </div>
        <div className="flex">
          <div className="pt-8 pl-5 relative">
            <svg width="117" height="53" viewBox="0 0 117 53" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 45.7573C1.43233 45.9655 2.25247 46.3237 7.26238 41.7925C13.5248 36.1285 19.2178 32.1638 25.4802 37.2613C31.7426 42.3589 35.7277 54.8196 43.698 51.4213C51.6683 48.0229 54.5149 22.535 64.1931 19.1367C73.8713 15.7383 80.1337 35.5622 86.9653 24.8006C93.797 14.0391 101.198 0.445683 106.322 2.14487C110.421 3.50422 114.482 9.13046 116 11.7737" stroke={props.svgStroke} strokeWidth="2" />
            </svg>
          </div>
          <div className="pt-8 pl-5 absolute blur-sm mt-1">
            <svg width="117" height="53" viewBox="0 0 117 53" fill='none' xmlns="http://www.w3.org/2000/svg">
              <path d="M1 45.7573C1.43233 45.9655 2.25247 46.3237 7.26238 41.7925C13.5248 36.1285 19.2178 32.1638 25.4802 37.2613C31.7426 42.3589 35.7277 54.8196 43.698 51.4213C51.6683 48.0229 54.5149 22.535 64.1931 19.1367C73.8713 15.7383 80.1337 35.5622 86.9653 24.8006C93.797 14.0391 101.198 0.445683 106.322 2.14487C110.421 3.50422 114.482 9.13046 116 11.7737" stroke={props.svgStroke} strokeWidth="2" />
            </svg>
          </div>
          <div className="grid grid-rows-2">
            <div className={`${props.kpiColor} pl-20 pt-5 text-base font-semibold`}>+{props.kpiValue}</div>
            <div className="pl-4 text-gray-light text-center">na última semana</div>
          </div>
        </div>
      </Link>
    </div>
  )
}