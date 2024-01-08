import { useEffect, useState } from "react"
import { api } from "../lib/axios";
import { AvatarColab } from "../assets/AvatarColab";

type Workers = {
  id: number;
  name: string;
  surname: string;
  photo: string;
}

type Events = {
  order_id: number;
  worker_id: number;
  costumer: string;
  bu: string;
  start_date: string;
  status: string;
}

type Card = {
  workerName: string;
  workerSurname: string;
  workerPhoto: string;
  orders: {
    orderId: number;
    orderCostumer: string;
    orderStartDate: string;
    orderBu: string
  }[]
}

export function Broadcast() {

  const [workers, setWorkers] = useState<Workers[]>([])
  const [events, setEvents] = useState<Events[]>([])
  const [cards, setCards] = useState<Card[]>([])

  useEffect(() => {
    api.get('/workers').then(response => {
      setWorkers(response.data)
    })
  }, [])

  useEffect(() => {
    api.get('/AllEvents').then(response => {
      setEvents(response.data)
    })
  }, [])

  

  return (
    <>
      <div className="flex h-[100dvh] mt-[-80px]">
        <section className="w-full bg-off-white">
          <div className="text-purple-xdark text-2xl font-bold px-10 py-8">Cronograma da Semana</div>
          <div className="px-10 pt-10">
            <div className="w-[535px] h-[305px] bg-[#d2d3f8] rounded-xl flex items-center gap-4">
              <div className="bg-white w-[235px] h-[297px] rounded-xl ml-1 flex justify-center">
                  <div className="pt-5 pl-5">
                    <AvatarColab width="w-[100px]" height="h-[100px]" name="Test" img="felipe.png"/>
                    <div className="ml-[-30px] pt-10 justify-center items-center flex flex-col">
                    <div className="text-purple-dark text-[24px]">Felipe Rapachi</div>
                    <div className="text-[#768396] font-medium">CTO</div>
                    </div>
                </div>
              </div>
              <div className="h-[297px] py-5 flex flex-col gap-2">
              <div className="bg-white w-[264px] h-[58px] rounded-xl flex items-center justify-center gap-4">
                <div className="text-purple-dark font-semibold">OS 6332</div>
                <div className="text-[#768396]">Renault</div>
                <div className="text-[#41D37E] font-bold text-base">Início: 08/01</div>
              </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}