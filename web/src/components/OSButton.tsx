import { Transition } from "@headlessui/react"
import { useEffect, useState } from "react"
import { AvatarColab } from "../assets/AvatarColab";
import { api } from "../lib/axios";


interface OSProps {
  soNumber: number;
  soCostumer: string;
  soWorkersId: number[];
}

type WorkersData = {
  id: number;
  name: string;
  surname: string;
  role: string;
  photo: string
}


export function OSButton(props: OSProps){

  const [workers, setWorkers] = useState<WorkersData[]>([])
  const [workersData, setWorkersData] = useState<WorkersData[]>([])
  const [isShowing, setIsShowing] = useState(false)
  
  useEffect(() => {
    api.get('/workers').then(response => {
      setWorkers(response.data)
    })
  }, [])

  useEffect(() => {
    setWorkersData(props.soWorkersId
    .map((worker) => workers.find((w) => w.id === worker))
    .filter((worker): worker is WorkersData => worker != undefined))
  }, [workers])

  return (
    <div>
    <button type='button' onClick={() => setIsShowing(!isShowing)} title='Order details' className="flex w-80 h-16 bg-purple-light rounded-xl shadow-custom justify-between items-center px-4 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110">
      <div className=" text-white text-xl font-semibold">OS {props.soNumber} - {props.soCostumer}</div>
    </button>
    <Transition
      show={isShowing}
      enter="ease-out duration-[1000ms]"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="ease-in duration-[450ms]"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
        <div className="text-purple-xdark font-bold text-xl py-5" >
          Colaboradores
        </div>
        {workersData.map((worker) => (
        <div className="py-2 gap-2 flex" key={worker.id}>
          <AvatarColab width="w-[45px]" height="h-[45px]" img={worker.photo} name={worker.name} surname={worker.surname}/>
          <div className="grid grid-rows-2">
          <div className="text-purple-xdark text-base font-bold">{worker.name} {worker.surname}</div>
          <div className="text-[#768396] text-base font-semibold">{worker.role}</div>
          </div>
        </div>
        ))}
      </Transition>
    </div>
  )

}