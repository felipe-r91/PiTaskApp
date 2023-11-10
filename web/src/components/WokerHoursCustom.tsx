import { useState } from 'react'
import { AvatarColab } from '../assets/AvatarColab';

type Workers = {
  id: number;
  name: string;
  surname: string;
  photo: string;
}[]


interface FormProps {
  workers?: Workers,
  isIndividual : boolean
}

export function WorkerHoursCustom(props: FormProps) {
  {!props.isIndividual && <div>teste</div> }
  {props.isIndividual && <div>test2</div>}
  return (
    <div>
      {props.workers?.map((worker) => {
        return (
          <div className="flex gap-14 items-center min-h-[71px]"
            key={worker.id}>
            <div className='w-[215px] h-[50px] rounded-[10px] shadow-custom bg-purple-light text-white flex pl-5 pr-16 items-center justify-between'>
              <div className="flex items-center justify-around gap-6">
                <AvatarColab width='w-[35px]' height='h-[35px]' img={worker.photo} name={worker.name} surname={worker.surname} />
                <div>{worker.name}</div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}