import { useEffect, useState } from "react";
import { TbScreenShare } from "react-icons/tb";
import { api } from "../lib/axios";
import { TimelineScheduler } from "./TimelineScheduler";
import { Workers } from "./Schedule"
import { Orders } from "./Schedule"



export function Timeline() {

  const [availableWorkers, setAvailableWorkers] = useState<Workers>()
  const [assignedOrders, setAssignedOrders] = useState<Orders>()

  useEffect(() => {
    api.get('/workers').then(response => {
      setAvailableWorkers(response.data)

    })
  }, [])

  useEffect(() => {
    api.get('/AssignedOrders').then(response => {
      setAssignedOrders(response.data)

    })
  }, [])

  return (
    <div className="flex">
      <section className="w-full">
        <div className="bg-off-white flex flex-col h-screen">
          <div className="w-full h-fit flex items-center">
            <div className=" w-fit h-fit text-purple-xdark text-2xl font-bold p-8">
              Linha do Tempo
            </div>
            <button type='button' title="broadcast" className="h-8 w-10 rounded-full bg-purple-light py-1 px-2 shadow-custom absolute right-12 top-24 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110">
              <TbScreenShare size={22} color='white' />
            </button>
          </div>
          <TimelineScheduler workers={availableWorkers} orders={assignedOrders} />
        </div>
      </section>
    </div>
  )
}