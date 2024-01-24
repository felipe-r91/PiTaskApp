import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { MdQueryBuilder } from 'react-icons/md'
import { TbCalendar, TbChevronLeft, TbChevronRight } from 'react-icons/tb'
import * as Checkbox from "@radix-ui/react-checkbox";
import { AvatarColab } from '../assets/AvatarColab';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { api } from '../lib/axios';
import { WorkersAssignHours } from './WorkersHoursAssign';
import { SelectOrderForm } from './SelectOrderForm';

type Order = {
  id: number;
  title: string;
  costumer: string;
  description: string;
  annotation: string;
  planned_hours: number;
}[]

type Workers = {
  id: number;
  name: string;
  surname: string;
  photo: string;
}[]

interface FormProps {
  orderId: number,
  isFirstStep?: boolean,
}



export function AssignOneOrderForm(props: FormProps) {

  const [workers, setWorkers] = useState<Workers>();
  const [orderUnassigned, setOrderUnassigned] = useState<Order>();
  const [osWorker, setOsWorker] = useState<number[]>([]);
  const availableWorkers: (string | undefined)[] = [];
  const [osId] = useState<number>(props.orderId);
  const [osBu, setOsBu] = useState<string>('SB');
  const [osDate, setOsDate] = useState<string>('');
  const [osHours, setOsHours] = useState<number>(0);
  const [osAnnotation, setOsAnnotation] = useState<string>('');
  const [formPage, setFormPage] = useState(1);
  const [backButton, setBackButton] = useState(true)

  useEffect(() => {
    api.get('/GetUnassignedOrder', {
      params: {
        orderId: props.orderId
      }
    }).then(response => {
      setOrderUnassigned(response.data)
    })
  }, [])

  useEffect(() => {
    api.get('/workers').then(response => {
      setWorkers(response.data)
    })
  },[])


  const date = new Date();

  let currentDay = String(date.getDate()).padStart(2, '0');
  let currentMonth = String(date.getMonth() + 1).padStart(2, "0");
  let currentYear = date.getFullYear();
  let currentDate = `${currentYear}-${currentMonth}-${currentDay}`;

  function getWorkerName() {
    workers?.forEach(worker => {
      availableWorkers.push(worker.name)
    });

  }
  getWorkerName()
  function handleToogleWorker(worker: number) {
    if (osWorker?.includes(worker)) {
      const workersWithRemovedOne = osWorker.filter(index => index != worker)
      setOsWorker(workersWithRemovedOne)
    } else {
      const workersWithAddedOne = [...osWorker, worker]
      setOsWorker(workersWithAddedOne)
    }
  }

  function handleDateSelection(event: ChangeEvent<HTMLInputElement>) {
    const selectedDate = event.target.value
    setOsDate(selectedDate)
  }

  function handleHoursChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedHours = Number(event.target.value)
    setOsHours(selectedHours)
  }

  function handleAnnotationChange(event: ChangeEvent<HTMLTextAreaElement>) {
    const annotation = event.target.value
    setOsAnnotation(annotation)
  }

  async function assignOrder(event: FormEvent) {
    event.preventDefault()
    if (osWorker.length === 0) {
      alert('Selecione ao menos um colaborador para executar essa OS')
    } else {
      await api.post('/AssignOrderStep1', {
        osWorker,
        osId,
        osBu,
        osDate,
        osHours,
        osAnnotation,
      }).then(() => setFormPage(formPage + 1))


    }

  }
  
  switch (formPage) {
    default:
    case 0:
      return (
        <SelectOrderForm/>
      )
    case 1:
      return (
        <form onSubmit={assignOrder} className='w-full grid grid-cols-3 justify-center  p-5 transition ease-in-out duration-150'>
          <div className='w-[308px] pt-5'>
            <fieldset className="mb-[15px] grid justify-items-start gap-2">
              <label className="text-purple-dark text-right text-sm font-semibold" htmlFor="soNumber">
                Número da OS
              </label>
              <input
                className="text-[#768396] shadow-[#E5E5ED] focus:shadow-purple-light inline-flex h-[40px] w-full flex-1 items-center justify-center rounded-[9px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px] cursor-not-allowed"
                id="soNumber"
                required
                readOnly
                value={props.orderId}
              >

              </input>
            </fieldset>
            <fieldset className="mb-[15px] grid justify-items-start gap-2">
              <label className="text-purple-dark text-right text-sm font-semibold" htmlFor="soTitle">
                Título
              </label>
              <input
                className="text-[#768396] shadow-[#E5E5ED] focus:shadow-purple-light inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[9px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px] cursor-not-allowed"
                id="soTitle"
                required
                value={orderUnassigned?.[0].title ?? ''}
                readOnly
              />
            </fieldset>
            <fieldset className="mb-[15px] grid justify-items-start gap-2">
              <label className="text-purple-dark text-right text-sm font-semibold" htmlFor="soCostumer">
                Cliente
              </label>
              <input
                className="text-[#768396] shadow-[#E5E5ED] focus:shadow-purple-light inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[9px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px] cursor-not-allowed"
                id="soCostumer"
                required
                value={orderUnassigned?.[0].costumer?.substring(7, 50) ?? ''}
                readOnly
              />
            </fieldset>
            <fieldset className="mb-[15px] grid justify-items-start gap-2">
              <label className="text-purple-dark text-right text-sm font-semibold" htmlFor="soDescription">
                Descrição da atividade
              </label>
              <textarea
                className="text-[#768396] shadow-[#E5E5ED] focus:shadow-purple-light inline-flex h-[145px] w-full flex-1 items-center justify-center rounded-[9px] px-[10px] py-2 text-[15px] leading-tight shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px] cursor-not-allowed resize-none"
                id="soDescription"
                required
                value={orderUnassigned?.[0].description ?? ''}
                readOnly
              />
            </fieldset>
          </div>

          <div className='w-fit pt-3 grid mx-auto'>
            <fieldset>
              <label className='text-purple-dark text-xs font-semibold'>
                Business Unit
              </label>
              <div>
                <RadioGroup.Root
                  className="flex flex-row gap-4 py-2"
                  aria-label="View density"
                  value={osBu}
                  onValueChange={e => setOsBu(e)}
                >

                  <div className="flex items-center">
                    <RadioGroup.Item
                      className="bg-white w-[25px] h-[25px] rounded-full shadow-[0_2px_10px] shadow-[#768396] hover:bg-gray-200 focus:shadow-[0_0_0_2px] focus:shadow-purple-200 outline-none cursor-default"
                      value="SB"
                      id="r1"
                    >
                      <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-[11px] after:h-[11px] after:rounded-[50%] after:bg-purple-light" />
                    </RadioGroup.Item>
                    <label className="text-[#768396] text-[15px] leading-none pl-[10px]" htmlFor="r1">
                      <div className='w-fit h-fit bg-white p-1.5 rounded-lg border-[#e5e5ed] border-[1px]'>SB</div>

                    </label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroup.Item
                      className="bg-white w-[25px] h-[25px] rounded-full shadow-[0_2px_10px] shadow-[#768396] hover:bg-gray-200 focus:shadow-[0_0_0_2px] focus:shadow-purple-200 outline-none cursor-default"
                      value="MI"
                      id="r2"
                    >
                      <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-[11px] after:h-[11px] after:rounded-[50%] after:bg-purple-light" />
                    </RadioGroup.Item>
                    <label className="text-white text-[15px] leading-none pl-[10px]" htmlFor="r2">
                      <div className='w-fit h-fit bg-[#41D37E] p-1.5 rounded-lg'>MI</div>

                    </label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroup.Item
                      className="bg-white w-[25px] h-[25px] rounded-full shadow-[0_2px_10px] shadow-[#768396] hover:bg-gray-200 focus:shadow-[0_0_0_2px] focus:shadow-purple-200 outline-none cursor-default"
                      value="ER"
                      id="r3"
                    >
                      <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-[11px] after:h-[11px] after:rounded-[50%] after:bg-purple-light" />
                    </RadioGroup.Item>
                    <label className="text-white text-[15px] leading-none pl-[10px]" htmlFor="r3">
                      <div className='w-fit h-fit bg-[#1EA7FF] p-1.5 rounded-lg'>ER</div>
                    </label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroup.Item
                      className="bg-white w-[25px] h-[25px] rounded-full shadow-[0_2px_10px] shadow-[#768396] hover:bg-gray-200 focus:shadow-[0_0_0_2px] focus:shadow-purple-200 outline-none cursor-default"
                      value="MR"
                      id="r4"
                    >
                      <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-[11px] after:h-[11px] after:rounded-[50%] after:bg-purple-light" />
                    </RadioGroup.Item>
                    <label className="text-white text-[15px] leading-none pl-[10px]" htmlFor="r4">
                      <div className='w-fit h-fit bg-[#F7B000] p-1.5 rounded-lg'>MR</div>
                    </label>
                  </div>
                </RadioGroup.Root>
              </div>
            </fieldset>
            <fieldset className="mb-[15px] w-[200px]">
              <label className="text-purple-dark text-right text-sm font-semibold flex pt-3" htmlFor="soStartDate">
                Data início
              </label>
              <div className='flex px-1 pt-2'>
                <div className='px-3 pt-1.5'>
                  <TbCalendar size={24} color='#8D98A9' />
                </div>
                <input
                  type='date'
                  min={currentDate}
                  className="text-[#768396] shadow-[#E5E5ED] focus:shadow-purple-light inline-flex h-[35px] w-[74px] flex-1 items-center justify-center rounded-[9px] px-[10px] py-2 text-[15px] leading-tight shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                  id="soStartDate"
                  defaultValue=" "
                  required
                  onChange={e => handleDateSelection(e)}

                />
              </div>
            </fieldset>
            <fieldset className="mb-[0px] gap-5 w-[200px]">
              <label className="text-purple-dark text-right text-sm font-semibold" htmlFor="soPlannedHours">
                Tempo estimado de execução
              </label>
              <div className='flex px-1 pt-2'>
                <div className='px-3 pt-1.5'>
                  <MdQueryBuilder size={24} color='#8D98A9' />
                </div>
                <input
                  type='number'
                  min={1}
                  step={.1}
                  className="text-[#768396] shadow-[#E5E5ED] focus:shadow-purple-light inline-flex h-[35px] w-[10px] flex-1 items-center justify-center rounded-[9px] px-[10px] text-[15px] leading-tight shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                  id="soPlannedHours"
                  required
                  autoComplete='off'
                  value={osHours}
                  onChange={e => handleHoursChange(e)}
                />
                <div className='text-[#768396] text-sm p-3'>
                  Horas
                </div>
              </div>
            </fieldset>
            <fieldset className="mb-[15px] grid justify-items-start gap-2">
              <label className="text-purple-dark text-right text-sm font-semibold" htmlFor="soObs">
                Gestor da Atividade
              </label>
              <textarea
                className="text-[#768396] shadow-[#E5E5ED] focus:shadow-purple-light inline-flex h-[145px] w-full flex-1 items-center justify-center rounded-[9px] px-[10px] py-2 text-[15px] leading-tight shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px] resize-none"
                id="soObs"
                required
                value={osAnnotation}
                onChange={e => handleAnnotationChange(e)}
              />
            </fieldset>
          </div>
          <fieldset>
            <div className='h-6'></div>
            <div className='overflow-auto max-h-80 gap-3 grid py-5 pl-6 scrollbar-hide justify-center'>
              {workers?.map((worker, index) => (
                <Checkbox.Root
                  className='flex items-center gap-5'
                  key={worker.id}
                  checked={osWorker.includes(worker.id)}
                  onCheckedChange={() => handleToogleWorker(worker.id)}
                >
                  <div className={`w-[215px] h-[50px] rounded-[10px]  ${osWorker.includes(worker.id) ? 'bg-purple-light' : 'bg-white'} ${osWorker.includes(worker.id) ? 'text-white' : 'text-purple-dark'} ${osWorker.includes(worker.id) ? 'border-none' : 'border-none border-[#E5E5ED]'}  flex pl-5 pr-16 items-center justify-between`}>
                    <div
                      title={worker.surname}
                      className='flex items-center justify-around gap-6'>
                      <AvatarColab width='w-[35px]' height='h-[35px]' img={worker.photo} name={worker.name} surname={worker.surname} />
                      <div className='flex gap-2 font-medium'>
                      <div>{worker.name}</div>
                      <div>{worker.surname}</div>

                      </div>
                    </div>
                  </div>
                </Checkbox.Root>
              ))}
            </div>
          </fieldset>

          <button type='submit' className='w-24 h-9 flex justify-center items-center bg-[#EDECFE] text-base text-[#5051F9] hover:bg-[#5051F9] hover:text-white rounded-xl absolute right-12 bottom-7'>
            Avançar
            <TbChevronRight size={15} />
          </button>
          {!props.isFirstStep &&
            <button type='button' onClick={() => setFormPage(0)} className='w-24 h-9 flex justify-center items-center bg-[#EDECFE] text-base text-[#5051F9] hover:bg-[#5051F9] hover:text-white rounded-xl absolute right-40 bottom-7'>
              <TbChevronLeft size={15} />
              Voltar
            </button>
          }
        </form>
      )

    case 2:
      return (
        <>
        
          <WorkersAssignHours orderId={osId} osWorker={osWorker} osBu={osBu} osHours={osHours} osDate={osDate} cntrlBackButton={setBackButton}/>
          {backButton &&
            <button type='button' onClick={() => setFormPage(1)} className='w-24 h-9 flex justify-center items-center bg-[#EDECFE] text-base text-[#5051F9] hover:bg-[#5051F9] hover:text-white rounded-xl absolute right-40 bottom-7'>
              <TbChevronLeft size={15} />
              Voltar
            </button>
          }

        </>
      )
  }
}