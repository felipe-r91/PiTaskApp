import { useEffect, useState } from "react";
import { TbCloudOff, TbPlus, TbScreenShare, TbVideo } from "react-icons/tb";
import { api } from "../lib/axios";
import { TimelineScheduler } from "./TimelineScheduler";
import { Workers } from "./Schedule"
import { Orders } from "./Schedule"
import * as Dialog from "@radix-ui/react-dialog";
import { FiX } from "react-icons/fi";
import { SelectOrderForm } from "./SelectOrderForm";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

export function Timeline() {

  const [availableWorkers, setAvailableWorkers] = useState<Workers>()
  const [assignedOrders, setAssignedOrders] = useState<Orders>()
  const [update, setUpdate] = useState<boolean>(false)
  const autoSyncBroadcastDate = isSyncTime()
  const [syncHelper, setSyncHelper] = useState<boolean>(false)

  useEffect(() => {
    api.get('/workers').then(response => {
      setAvailableWorkers(response.data)

    })
  }, [])

  function fetchAssignedOrders() {
    api.get('/AssignedOrders').then(response => {
      setAssignedOrders(response.data)

    })
  }

  useEffect(() => {
    fetchAssignedOrders()
  }, [])

  function updateBroadcast() {
    setUpdate(!update)
  }

  function sleep(ms: number | undefined) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  sleep(700).then(() => {
    api.post('/updateBroadcast', {
      update
    })
  })

  function isSyncTime(){
    const today = dayjs()
    if(today.day() === 5 && today.hour() === 12 && today.minute() === 0){
      return true
    }
    if(today.day() === 5 && today.hour() === 12 && today.minute() === 1 && today.second() === 1){
      setUpdate(false)
    }
    else {
      return false
    }
  }

  if(autoSyncBroadcastDate){
    setUpdate(true)
  }

  
    useEffect(() => {
      if(update){
        setSyncHelper(true)
        sleep(50000).then(() => {
          setSyncHelper(false);
        })
      }    
    }, [update])
  

  return (
    <div className="flex">
      <section className="w-full">
        <div className="bg-off-white flex flex-col h-screen">
          <div className="w-full h-fit flex items-center">
            <div className=" w-fit h-fit text-purple-xdark text-2xl font-bold p-8">
              Linha do Tempo
            </div>
            <div className="absolute right-[330px] top-[85px] flex gap-3 items-center">
              <div className="text-purple-dark">Transmissão:</div>
              {syncHelper && 
                <div className="flex gap-3">
                  <div className="text-purple-light">
                    Atualizando...
                  </div>
                  <img src="/src/assets/ring-resize.svg" alt="..." width={20} />
                </div>
              }
              {!syncHelper &&
              <button onClick={updateBroadcast} className={`w-[120px] h-[30px] flex justify-center items-center bg-[#EDECFE] text-base text-[#5051F9] hover:bg-[#5051F9] hover:text-white rounded-xl gap-3 ${autoSyncBroadcastDate ? 'cursor-not-allowed' : ''}`}>
                {!update &&
                  <>
                    <TbCloudOff size={22} />
                    <div>
                      Offline
                    </div>
                  </>
                }
                {update &&
                  <>
                    <TbVideo size={22} />
                    <div>
                      Ao vivo
                    </div>
                  </>
                }

              </button>
              }
            </div>
            <Link type='button' title="broadcast" className="h-8 w-10 rounded-full bg-purple-light py-1 px-2 shadow-custom absolute right-12 top-20 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110" to={"/Broadcast"}>
              <TbScreenShare size={22} color='white' />
            </Link>
          </div>
          <Dialog.Root>
            <Dialog.Trigger>
              <div className="absolute right-[130px] top-[85px]">
                <div className="w-fit h-fit bg-purple-light rounded-md">
                  <div className="px-2 py-1 flex items-center">
                    <TbPlus size={15} color='white' />
                    <div className="text-white text-sm">Atribuir</div>
                  </div>
                </div>
              </div>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="bg-black opacity-60 data-[state=open]:animate-overlayShow fixed inset-0 z-20" />
              <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[1090px] translate-x-[-50%] translate-y-[-50%] rounded-[12px] p-6 bg-white shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none z-30">
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
          <TimelineScheduler workers={availableWorkers} orders={assignedOrders} fetchAssignedOrders={fetchAssignedOrders} />
        </div>
      </section>
    </div>
  )
}