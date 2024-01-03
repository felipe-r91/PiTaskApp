import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { Order } from './OsStatus'
import { api } from '../lib/axios';
import { AvatarColab } from '../assets/AvatarColab';
import { TbCircleMinus, TbCirclePlus, TbUser } from 'react-icons/tb';
import dayjs from 'dayjs';
import { PlannedKPIChart } from './PlannedKPIChart';


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

export function ConcludeOSForm(props: FormProps) {

  const orderDetails = props.order
  const [orderId] = useState(props.order?.id)
  const dateTimeNow = dayjs().format('YYYY-MM-DD HH:mm:ss.SSS')
  const [workers, setWorkers] = useState<Workers>([])
  const totalWorkedHours: number[] = []
  const [lms, setLms] = useState<number[]>([0])

  useEffect(() => {
    api.get('/osWorkersConcludeForm', {
      params: {
        orderId: orderDetails?.id
      }
    }).then(response => {
      setWorkers(response.data)
    })
  }, [orderDetails])

  workers.map((worker) => {
    totalWorkedHours.push(Number(worker.workedHours))
  })

  function submitForm(e: FormEvent) {
    //e.preventDefault()
    api.post('/ConcludeForm', {
      orderId,
      lms,
      dateTimeNow,
      totalWorkedHours
    }).then(() => alert('Ordem concluída'))
  }

  function updateLmsValue(event: ChangeEvent<HTMLInputElement>, index: number) {
    const newValue = Number(event.target.value)
    const updateLms = lms.map((oldValue, currentIndex) =>
      index === currentIndex ? newValue : oldValue
    )
    setLms(updateLms)
  }

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

  function calcTotalExecHours(): string{
    const totalHours = totalWorkedHours.reduce((acc, currValue) => {
      return acc += currValue;
    }, 0)
    return totalHours.toFixed(2)
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
      <form onSubmit={submitForm} className='w-full grid grid-cols-3 pt-1 p-5 justify-center gap-[120px] transition ease-in-out duration-150'>
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
        <div className='w-[280px] pt-5 justify-center'>
          <div className="text-purple-dark text-center text-sm font-semibold pb-8">
            Tempo real de execução
          </div>
          <div className='pb-9 max-h-[266px] h-[266px] overflow-auto scrollbar-hide pl-2.5'>
            <div className='gap-2 grid'>
              {workers.map((worker) => <div
                key={worker.id}
                className='w-[235px] h-[40px] text-purple-dark flex items-center justify-between'>
                <div className="flex items-center justify-around gap-3">
                  <AvatarColab width='w-[35px]' height='h-[35px]' img={worker.photo} name={worker.name} surname={worker.surname} />
                  <div>{worker.name} {worker.surname}</div>
                </div>
                <div className='pl-2 text-[#768396] font-medium'>{worker.workedHours}h</div>
              </div>
              )}
            </div>
          </div>
          <div className='pt-[40px] flex justify-between items-center'>
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
            <PlannedKPIChart planned_hours={orderDetails?.planned_hours} performed_hours={totalWorkedHours} label="Precisão"/>
          </div>
        </div>
        <div className='w-[204px] pt-5 justify-center'>
          <div className='text-purple-dark text-center text-sm font-semibold pb-2'>
            N° de colaboradores
          </div>
          <div className='flex justify-center items-center gap-3 px-4'>
            <TbUser size={24} color='#8D98A9' />
            <div className="text-[#768396] shadow-[#E5E5ED]  inline-flex h-[35px] w-[10px] flex-1 items-center justify-center rounded-[9px] px-[10px] text-[15px]  shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]">
              {workers.length}
            </div>
            <div className='bg-white w-6'>
            </div>
          </div>
          <div className='text-purple-dark text-center text-sm font-semibold pb-2 pt-10'>
            LMS
          </div>
          <div className='grid gap-3 max-h-[200px] overflow-auto scrollbar-hide py-1'>
            {lms.map((_input, index) => {
              return (
                <div key={index}>
                  <div className='flex justify-center items-center gap-3' >
                    {index === 0 &&
                      <TbCirclePlus
                        size={24} color='#8D98A9'
                        role='button'
                        onClick={() => setLms(prevData => [...prevData, 0])} />}
                    <input
                      className="text-[#768396] shadow-[#E5E5ED] inline-flex h-[35px] max-w-[90px] flex-1 items-center pl-3 rounded-[9px] px-[10px] text-[15px]  shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px] focus:shadow-purple-light"
                      required
                      type='number'
                      min={1}
                      onChange={e => updateLmsValue(e, index)}
                    >
                    </input>
                    {lms.length > 1 && index === 0 &&
                      <TbCircleMinus
                        size={24} color='#8D98A9'
                        role='button'
                        onClick={() => setLms(prevData => {
                          const newLms = [...prevData];
                          newLms.pop();
                          return newLms;
                        })} />}
                    {lms.length === 1 &&
                      <div className='bg-white w-6'></div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <button type='submit' className='w-24 h-9 flex justify-center items-center bg-[#EDECFE] text-base text-[#5051F9] hover:bg-[#5051F9] hover:text-white rounded-xl absolute right-12 bottom-7'>
          Salvar
        </button>
      </form>
    </>
  )


}