import { useEffect, useState } from "react";
import { api } from "../lib/axios";
import { OsCard } from "./OsCard";

type Orders = {
  id: number,
  status: string,
  title: string,
  costumer: string,
  description: string,
  start_date: string,
  end_date: string,
  workers_qnt: number,
  bu: string,
  created_at: number,
  completed_at: number,
  annotation: number,
  performed_hours: number,
  assigned_workers_id: JSON
}[]

export type Order = {
  id?: number,
  status?: string,
  title?: string,
  costumer?: string,
  description?: string,
  start_date?: string,
  end_date?: string,
  workers_qnt?: number,
  bu?: string,
  created_at?: number,
  completed_at?: number,
  annotation?: number,
  performed_hours?: number,
  assigned_workers_id?: JSON
}

export function OsStatus() {
  const [orders, setOrders] = useState<Orders>([]);
  const unassignedCount = ordersUnassigned(orders);

  useEffect(() => {
    api.get('/AllOrders').then(response => {
      setOrders(response.data)
    })

  }, [])

  function ordersUnassigned(orders: Orders): number {
    var total = 0
    orders.map((order) => {
      if (order.status === 'new') {
        total++
      }
    })
    return total
  }

  return (
    <div className="flex">
      <section className="w-full">
        <div className="bg-off-white flex flex-col h-screen">
          <div className="w-full h-fit flex items-center">
            <div className="text-purple-xdark text-2xl font-bold pl-8 pr-1 py-8">
              Status das Ordens de Serviço
            </div>
            {unassignedCount > 0 &&
              <div className="pb-6">
                <div className="w-5 h-5 bg-[#fd3c30] rounded-full text-sm font-semibold text-white flex items-center justify-center p-1">
                  {unassignedCount}
                </div>
              </div>
            }
          </div>
          <div className="flex pt-8">
            <div className="flex h-fit w-fit">
              <div className="grid grid-rows-2 grid-flow-col auto-cols-min pl-7 mr-4 gap-4 w-[260px]">
                {orders.map((order) => (
                  <div key={order.id}>
                    <OsCard soNumber={order.id} soTitle={order.title.substring(0, 25)} soCostumer={order.costumer.substring(7, 50)} backgColor={"bg-white"} isEditable={true} osBu={order.bu} width={"w-[233px]"} height={"h-[250px]"} osStatus={order.status} fromBacklog={true} createdAt={order.created_at} order={order} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}