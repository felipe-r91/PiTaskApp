import { TbCalendarStats } from "react-icons/tb";
import { OSButton } from "./OSButton";
import { useEffect, useState } from "react";
import { api } from "../lib/axios";

type OrdersToday = {
  orderId: number;
  costumer: string;
  workersId: number[];
}[]

export function DashRightMenu() {

  const [todayOrders, setTodayOrders] = useState<OrdersToday>([])

  useEffect(() => {
    api.get('/TodayAgenda').then(response => {
      setTodayOrders(response.data)
    })
  }, [])


  return (
    <div className="bg-[#FBFAFF] w-96 flex flex-col gap-5">
      <div className="flex items-center justify-center gap-24">
        <div className="text-purple-xdark text-xl py-8 font-semibold">
          Agenda de hoje
        </div>
        <div className="h-9 w-9 bg-dashboard-icon rounded-full items-center justify-center">
          <div className="p-1.5">
            <TbCalendarStats size={24} color='#8D98A9' />
          </div>
        </div>
      </div>
      <div className="grid gap-5 w-[384px] justify-center overflow-auto max-h-[550px] scrollbar-hide pb-6 pt-2">
        {todayOrders.map(order =>
          <div key={order.orderId} className="">
            <OSButton soNumber={order.orderId} soCostumer={order.costumer.substring(7, 20)} soWorkersId={order.workersId} />
          </div>
        )}
      </div>
    </div>
  )

}