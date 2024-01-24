import { useState, useEffect } from "react";
import { api } from "../lib/axios";
import { Order } from "./OsStatus";
import { AvatarColab } from "../assets/AvatarColab";
import { PlannedKPIChart } from "./PlannedKPIChart";
import { TbArrowBackUp, TbChevronLeft, TbChevronRight, TbCirclePlus, TbTrash } from "react-icons/tb";
import { WorkersAssignHours } from "./WorkersHoursAssign";

interface FormProps {
  order?: Order
}

type Workers = {
  id: number;
  name: string;
  surname: string;
  photo: string;
  workedHours?: number;
  role?: string;
  email?: string;
  color?: string
}[]

export function EditOS(props: FormProps) {

  const orderDetails = props.order
  const orderId = orderDetails?.id
  const [workers, setWorkers] = useState<Workers>([])
  const [workersBckp, setWorkersBckp] = useState<Workers>([])
  const [allWorkers, setAllWorkers] = useState<Workers>([])
  const [workersIdToUpdate, setWorkersIdToUpdate] = useState<number[]>([])
  const [workersToDelete, setWorkersToDelete] = useState<number[]>([])
  const [showAddWorker, setShowAddWorker] = useState<boolean>(false)
  const [showSaveButton, setShowSaveBtn] = useState<boolean>(false)
  const [showUndoButton, setShowUndoBtn] = useState<boolean>(false)
  const [newWorkers, setNewWorkers] = useState<number[]>([])
  const [workersId, setWorkersId] = useState<number[]>([])
  const [formPage, setFormPage] = useState<number>(0)
  const [backButton, setBackButton] = useState(true)
  const totalWorkedHours: number[] = []

  useEffect(() => {
    api.get('/osWorkersConcludeForm', {
      params: {
        orderId: orderDetails?.id
      }
    }).then(response => {
      setWorkers(response.data)
      setWorkersBckp(response.data)
    })
  }, [orderDetails])

  useEffect(() => {
    api.get('/workers').then(response => {
      setAllWorkers(response.data)
    })
  }, [])

  workers.map((worker) => {
    if (worker.workedHours) {
      totalWorkedHours.push(Number(worker.workedHours))
    }
    if (!workersIdToUpdate.includes(worker.id)) {
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

  function getOrderId(): number {
    if (orderDetails?.id) {
      return orderDetails.id
    } else {
      return 0
    }
  }

  function deleteWorker(id: number) {
    const workersWithRemovedOne = workers.filter(workers => workers.id != id)
    const workersIdWithRemovedOne = workersIdToUpdate.filter(worker => worker != id)
    setWorkers(workersWithRemovedOne)
    setWorkersIdToUpdate(workersIdWithRemovedOne)
    if (!workersToDelete.includes(id)) {
      setWorkersToDelete(prevWorkers => [...prevWorkers, id])
    }
  }

  function undo(){
    setWorkers(workersBckp)
    setWorkersIdToUpdate([])
    setWorkersToDelete([])
  }

  function workersToAdd() {
    //const remainingWorkers = allWorkers.filter((worker) => !workers.some((w) => w.id === worker.id));
    //setAllWorkers(remainingWorkers)
  }

  function toogleAddWorker(id: number) {
    if (!newWorkers.includes(id)) {
      setNewWorkers(prevIds => [...prevIds, id])
    }
    if (newWorkers.includes(id)) {
      const newWorkersWithRemovedOne = newWorkers.filter(ids => ids != id)
      setNewWorkers(newWorkersWithRemovedOne)
    }
  }

  function fixNewWorkerId(){
    setWorkersId(newWorkers)
    const fixedArray : number[] = []
    newWorkers.map(worker => {
      const fixedId = worker - 1
      fixedArray.push(fixedId)
    })
    setNewWorkers(fixedArray)
  }

  function calcTotalExecHours(): string{
    const totalHours = totalWorkedHours.reduce((acc, currValue) => {
      return acc += currValue;
    }, 0)
    return totalHours.toFixed(2)
  }

  switch (formPage) {
    default :
    case 0:
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
              {!showAddWorker &&
                <>
                  <div className="text-purple-dark text-center text-sm font-semibold pb-8">
                    Tempo Planejado Atual
                  </div>
                  <div className='pb-5 max-h-[306px] h-[306px] overflow-auto scrollbar-hide pl-2.5'>
                    <div className='gap-4 grid'>
                      {workers.map((worker) => <div
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
                            onClick={() => { deleteWorker(worker.id); setShowSaveBtn(true); setShowUndoBtn(true) }}>
                            <TbTrash size={22} />
                          </button>
                        </div>
                      </div>
                      )}
                    </div>
                    <div className="pt-5 items-center justify-center pl-[160px]">
                      <button
                        type="button"
                        className="w-32 h-9 flex justify-center gap-3 items-center bg-[#EDECFE] text-base text-[#5051F9] hover:bg-[#5051F9] hover:text-white rounded-xl"
                        onClick={() => { setShowAddWorker(true); workersToAdd() }}
                      >
                        <TbCirclePlus size={24} />
                        Adicionar
                      </button>
                    </div>
                  </div>
                  <div className='pt-[20px] pb-[20px] flex justify-center items-center'>
                    <div className='pl-3.5'>
                      <div className='flex justify-between items-center gap-3'>
                        <div className='text-[15px] text-purple-dark font-bold'>
                          Executado
                        </div>
                        <div className="text-[#768396]">
                          {calcTotalExecHours()}h
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
                    <PlannedKPIChart planned_hours={orderDetails?.planned_hours} performed_hours={totalWorkedHours} label="Precisão" />
                  </div>
                </>
              }
              {showAddWorker &&
                <>
                  <div className="text-purple-dark text-center text-sm font-semibold pb-8">
                    Quem você deseja adicionar?
                  </div>
                  <div className='pb-5 max-h-[406px] h-[406px] overflow-auto scrollbar-hide pl-2.5'>
                    <div className='gap-4 grid'>
                      {allWorkers.map((worker) =>
                        <div
                          key={worker.id}
                          className='w-[450px] h-[40px] pt-2 text-purple-dark flex items-center justify-center'>
                          <div className={`w-[230px] h-[50px] rounded-xl pl-5 flex items-center gap-3 ${newWorkers.includes(worker.id) ? 'bg-purple-light' : 'bg-white'} ${newWorkers.includes(worker.id) ? 'text-white' : 'text-purple-dark'} ${newWorkers.includes(worker.id) ? 'border-none' : 'border-none border-[#E5E5ED]'}`}
                            role="button"
                            onClick={() => toogleAddWorker(worker.id)}>
                            <AvatarColab width='w-[35px]' height='h-[35px]' img={worker.photo} name={worker.name} surname={worker.surname} />
                            <div>{worker.name} {worker.surname}</div>
                          </div>

                        </div>
                      )}
                    </div>
                    <div className="pt-5 items-center justify-center pl-[160px]">
                      <button
                        type="button"
                        className={`w-24 h-9 flex justify-center gap-1 items-center bg-[#EDECFE] text-base text-[#5051F9] hover:bg-[#5051F9] hover:text-white rounded-xl ${newWorkers.length > 0 ? 'absolute right-40 bottom-7' : 'absolute right-12 bottom-7'} `}
                        onClick={() => { setShowAddWorker(false); setNewWorkers([]); setShowSaveBtn(false) }}
                      >
                        <TbChevronLeft size={15} />
                        Voltar
                      </button>
                      {newWorkers.length > 0 &&

                        <button
                          type="button"
                          className='w-24 h-9 flex justify-center gap-1 items-center bg-[#EDECFE] text-base text-[#5051F9] hover:bg-[#5051F9] hover:text-white rounded-xl absolute right-12 bottom-7'
                          onClick={() => {fixNewWorkerId(); setFormPage(1)}}
                        >
                          Avançar
                          <TbChevronRight size={15} />
                        </button>
                      }
                    </div>
                  </div>
                </>
              }

            </div>
            {!showAddWorker && showSaveButton &&
              <button type='submit' className='w-24 h-9 flex justify-center items-center bg-[#EDECFE] text-base text-[#5051F9] hover:bg-[#5051F9] hover:text-white rounded-xl absolute right-12 bottom-7'>
                Salvar
              </button>
            }
            {showUndoButton &&
              <button type='button' onClick={() => {undo(); setShowUndoBtn(!showUndoButton)}} className='w-24 h-9 flex justify-center items-center gap-1 bg-[#EDECFE] text-base text-[#5051F9] hover:bg-[#5051F9] hover:text-white rounded-xl absolute right-40 bottom-7'>
                <TbArrowBackUp size={15} />
                Desfazer
              </button>
            }
          </form>
        </>
      )
    case 1:
      return (
        <>
          <WorkersAssignHours orderId={getOrderId()} osWorker={newWorkers} osWorker1={workersId} osBu={orderDetails?.bu} osHours={orderDetails?.planned_hours} isEditingOS={true} cntrlBackButton={setBackButton} />
          {backButton &&
            <button type='button' onClick={() => { setFormPage(0); setNewWorkers([]) }} className='w-24 h-9 flex justify-center items-center bg-[#EDECFE] text-base text-[#5051F9] hover:bg-[#5051F9] hover:text-white rounded-xl absolute right-40 bottom-7'>
              <TbChevronLeft size={15} />
              Voltar
            </button>
          }
        </>
      )
  }
}