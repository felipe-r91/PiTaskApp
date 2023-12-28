import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { TbPlus } from "react-icons/tb";
import { FiX } from "react-icons/fi";
import { api } from "../lib/axios";
import { Calendar } from "./Calendar";
import { SelectOrderForm } from "./SelectOrderForm";

export type Workers = {
  id: string;
  name: string;
  surname: string;
  email: string;
  photo: string;
  color: string;
}[]

export type Orders = {
  id: number;
  order_id: number;
  worker_name: string;
  worker_id: number;
  worker_hours: string;
  start_date: string;
  end_date: string;
  status: string;
  costumer: string;
  bu: string;
  description: string;
  assigned_workers_id: JSON;
  title: string;
  planned_hours: number;
  performed_hours: number;
  lms: number [];
  created_at: number;
  completed_at: number;
}[]


export function Schedule() {

  const [availableWorkers, setAvailableWorkers] = useState<Workers>()
  const [assignedOrders, setAssignedOrders] = useState<Orders>()

  useEffect(() => {
    api.get('/workers').then(response => {
      setAvailableWorkers(response.data)
      
    })
  }, [])

  function fetchAssignedOrders(){
    api.get('/AssignedOrders').then(response => {
      setAssignedOrders(response.data)

    })
  }

  useEffect(() => {
    fetchAssignedOrders()
  }, [])
  
  return (
    <div className="flex">
      <section className="w-full">
        <div className=" bg-off-white flex flex-col m-0 h-screen">
          <div className="w-full h-fit flex items-center">
            <div className="w-fit h-fit text-purple-xdark text-2xl font-bold px-8 py-8">
              Cronograma de atividades
            </div>
            <Dialog.Root>
              <Dialog.Trigger>
                <div className="absolute right-12 top-24">
                  <div className="w-fit h-fit bg-purple-light rounded-md">
                    <div className="px-2 py-1 flex items-center">
                      <TbPlus size={15} color='white' />
                      <div className="text-white text-sm">Atribuir</div>
                    </div>
                  </div>
                </div>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="bg-black opacity-60 data-[state=open]:animate-overlayShow fixed inset-0" />
                <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[1090px] translate-x-[-50%] translate-y-[-50%] rounded-[12px] p-6 bg-white shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
                  <Dialog.Title className="m-0 text-[30px] font-medium flex items-center gap-7">
                    Atribuir Ordem de Serviço
                  </Dialog.Title>
                  <Dialog.Close className="absolute right-6 top-6 hover:bg-purple-100 rounded-full">
                      <FiX size={24} color='#5051F9' />
                  </Dialog.Close>
                  <SelectOrderForm />
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
          <div className="px-5 pt-2 min-w-fit">
            <Calendar workers={availableWorkers} orders={assignedOrders} fetchAssignedOrders={fetchAssignedOrders}/>
          </div>
        </div>
      </section>
    </div>
  )
}


