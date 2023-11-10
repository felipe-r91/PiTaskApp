import { TbCalendarStats } from "react-icons/tb";
import { OSButton } from "./OSButton";

export function DashRightMenu(){

  return(
      <div className="bg-[#FBFAFF] w-96 flex flex-col px-10 gap-8">
          <div className="flex items-center justify-between pr-6">
          <div className="text-purple-xdark text-xl py-8 font-semibold">
            Agenda de hoje
          </div>
            <div className="h-9 w-9 bg-dashboard-icon rounded-full items-center justify-center">
              <div className="p-1.5">
              <TbCalendarStats size={24} color='#8D98A9'/>
              </div>
            </div>
          </div>
          <OSButton soNumber={3457} soCostumer={'Electrolux'} colabAvatar=""/>
          <OSButton soNumber={4659} soCostumer={'PD Plásticos'} soColab={['3', '1']} colabAvatar=""/>
         
          
      </div>
  )

}