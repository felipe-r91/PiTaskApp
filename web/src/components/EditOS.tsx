import { useState, useEffect, FormEvent } from "react";
import { api } from "../lib/axios";
import { Order } from "./OsStatus";
import { AvatarColab } from "../assets/AvatarColab";
import { PlannedKPIChart } from "./PlannedKPIChart";
import { TbCirclePlus, TbPencil, TbTrash } from "react-icons/tb";

interface FormProps {
  order?: Order
}

type Workers = {
  id: number;
  name: string;
  surname: string;
  photo: string;
  workedHours: number
}[]

export function EditOS(props: FormProps) {

  const orderDetails = props.order
  const orderId = orderDetails?.id
  const [workers, setWorkers] = useState<Workers>([])
  const [workersIdToUpdate, setWorkersIdToUpdate] = useState<number[]>([])
  const [workersToDelete, setWorkersToDelete] = useState<number[]>([])
  const totalWorkedHours: number[] = []

  useEffect(() => {
    api.get('/osWorkersConcludeForm', {
      params: {
        workerId: JSON.stringify(orderDetails?.assigned_workers_id),
        orderId: orderDetails?.id
      }
    }).then(response => {
      setWorkers(response.data)
    })
  }, [orderDetails])

  workers.map((worker) => {
    totalWorkedHours.push(worker.workedHours)
    if(!workersIdToUpdate.includes(worker.id)){
      setWorkersIdToUpdate(prevWorkers => [...prevWorkers, worker.id])
    }
  })

  function buColor() {
    switch (orderDetails?.bu) {
      case 'ER':
        return 'bg-[#1EA7FF] text-white';
      case 'MI':
        return 'bg-[#41D37E] text-white';
      case 'MR':
        return 'bg-[#F7B000] text-white';
      case 'SB':
        return 'bg-white border-[#e5e5ed] border-[1px] text-[#768396]'
    }
  }

  async function submitForm() {
    
    await api.post('/EditOrder', {
      orderId,
      workersToDelete,
      workersIdToUpdate
    }).then(() => alert('Ordem Atualizada'))

  }

  function deleteWorker(id: number){
    const workersWithRemovedOne = workers.filter(workers => workers.id != id)
    const workersIdWithRemovedOne = workersIdToUpdate.filter(worker => worker != id)
    setWorkers(workersWithRemovedOne)
    setWorkersIdToUpdate(workersIdWithRemovedOne)
    if(!workersToDelete.includes(id)){
      setWorkersToDelete(prevWorkers => [ ...prevWorkers, id])
    }
  }


  return (
    <>
      <div className='absolute left-[430px] top-8'>
        <div className={`flex items-center justify-center w-fit h-fit rounded-md ${buColor()}`}>
          <div className="text-[15px] leading-none pl-[7px] p-1.5 ">
            {orderDetails?.bu}
          </div>
        </div>
      </div>
      <form onSubmit={submitForm} className='w-full grid grid-cols-2 pt-1 p-5 pr-28 justify-center transition ease-in-out duration-150'>
        <div className='w-[308px] pt-5'>
          <div className="mb-[15px] grid justify-items-start gap-2">
            <div className="text-purple-dark text-right text-sm font-semibold">
              Número da OS
            </div>
            <div
              className="text-[#768396] shadow-[#E5E5ED] focus:shadow-purple-light inline-flex h-[40px] w-full flex-1 items-center justify-start rounded-[9px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px] cursor-not-allowed">
              {orderDetails?.id}
            </div>
          </div>
          <div className="mb-[15px] grid justify-items-start gap-2">
            <div className="text-purple-dark text-right text-sm font-semibold">
              Título
            </div>
            <div
              className="text-[#768396] shadow-[#E5E5ED] focus:shadow-purple-light inline-flex h-[35px] w-full flex-1 items-center justify-start rounded-[9px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px] cursor-not-allowed">
              {orderDetails?.title?.substring(0, 34)}
            </div>
          </div>
          <div className="mb-[15px] grid justify-items-start gap-2">
            <div className="text-purple-dark text-right text-sm font-semibold">
              Cliente
            </div>
            <div
              className="text-[#768396] shadow-[#E5E5ED] focus:shadow-purple-light inline-flex h-[35px] w-full flex-1 items-center justify-start rounded-[9px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px] cursor-not-allowed">
              {orderDetails?.costumer?.substring(7, 50)}
            </div>
          </div>
          <div className="mb-[15px] grid justify-items-start gap-2">
            <div className="text-purple-dark text-right text-sm font-semibold">
              Descrição da atividade
            </div>
            <div
              className="text-[#768396] shadow-[#E5E5ED] focus:shadow-purple-light inline-flex h-[145px] w-full flex-1 items-start justify-start rounded-[9px] px-[10px] py-2 text-[15px] leading-tight shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px] cursor-not-allowed resize-none">
              {orderDetails?.description}
            </div>
          </div>
        </div>
        <div className='w-[459px] pt-5 pl-[-30px] justify-center'>
          <div className="text-purple-dark text-center text-sm font-semibold pb-8">
            Tempo Planejado Atual
          </div>
          <div className='pb-5 max-h-[306px] h-[306px] overflow-auto scrollbar-hide pl-2.5'>
            <div className='gap-4 grid'>
              {workers.map((worker) =>
                <div
                  key={worker.id}
                  className='w-[450px] h-[40px] text-purple-dark flex items-center justify-between'>
                  <div className="w-[180px] flex items-center justify-start gap-3">
                    <AvatarColab width='w-[35px]' height='h-[35px]' img={worker.photo} name={worker.name} surname={worker.surname} />
                    <div>{worker.name} {worker.surname}</div>
                  </div>
                  <div>
                    <div className='pl-2 text-[#768396] font-medium'>{worker.workedHours}h</div>
                  </div>
                  <div className="flex gap-3 pr-2">
                  <button 
                  type="button" 
                  className="w-14 h-9 flex justify-center items-center bg-[#EDECFE] text-base text-[#5051F9] hover:bg-[#5051F9] hover:text-white rounded-xl"
                  onClick={() => deleteWorker(worker.id)}>
                    <TbTrash size={22} />
                  </button>
                  </div>
                </div>
              )}
            </div>
            <div className="pt-5 items-center justify-center pl-[160px]">
              <button type="button" className="w-32 h-9 flex justify-center gap-3 items-center bg-[#EDECFE] text-base text-[#5051F9] hover:bg-[#5051F9] hover:text-white rounded-xl">
                <TbCirclePlus size={24} />
                Adicionar
              </button>
            </div>
          </div>
          <div className='pt-[20px] flex justify-center items-center'>
            <div className='pl-3.5'>
              <div className='flex justify-between items-center gap-3'>
                <div className='text-[15px] text-purple-dark font-bold'>
                  Executado
                </div>
                <div className="text-[#768396]">
                  {totalWorkedHours.reduce((acc, currValue) => {
                    return acc += currValue;
                  }, 0)}h
                </div>
              </div>
              <div className='pt-[10px] flex justify-between items-center gap-3'>
                <div className='text-[15px] text-purple-dark font-bold'>
                  Planejado
                </div>
                <div className="text-[#768396]">
                  {orderDetails?.planned_hours}h
                </div>
              </div>
            </div>
            <PlannedKPIChart planned_hours={orderDetails?.planned_hours} performed_hours={totalWorkedHours} />
          </div>
        </div>
        <button type='submit' className='w-24 h-9 flex justify-center items-center bg-[#EDECFE] text-base text-[#5051F9] hover:bg-[#5051F9] hover:text-white rounded-xl absolute right-12 bottom-7'>
          Salvar
        </button>
      </form>
    </>
  )
}