import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { api } from "../lib/axios";
import { AvatarColab } from "../assets/AvatarColab";
import { TbArrowBackUp, TbCirclePlus } from "react-icons/tb";


interface WorkerHoursProps {
  orderId: number,
  osWorker?: number[],
  osHours: number,
  osBu?: string,
  osDate?: string
}

type Workers = {
  id: number;
  name: string;
  surname: string;
  photo: string;
}[]


export function WorkersAssignHours(props: WorkerHoursProps) {

  //Initialize variables and states
  const [assingMode, setAssignMode] = useState<boolean>(false);
  const [formPage, setFormPage] = useState<number>(0);
  const [addDays, setAddDays] = useState<boolean[]>([]);
  const [showAddSequential, setShowAddSequential] = useState<boolean[]>([]);
  const [workers, setWorkers] = useState<Workers>([]);
  const [hours, setHours] = useState<number[]>([]);
  const [availableHours, setAvailableHours] = useState(props.osHours)
  const [date, setDate] = useState<string[]>([]);
  const [startHour, setStartHour] = useState<string[]>([]);
  const [endHour, setEndHour] = useState<string[]>([]);
  const [sequentialDays, setSequentialDays] = useState<number[]>([]);
  const [customDays] = useState<number[]>([1, 2]);
  const [customFormControl, setCustomFormControl] = useState<boolean>(false);
  const customDaysRef = useRef(2);
  const customWorkersRef = useRef(0);
  const [workerIndexCustomDays, setWorkerIndexCustomDays] = useState<number>(0)
  var totalAssignedHours = 0;
  const [workersOSid, setWorkersOSid] = useState<number[]>([]);
  const [workerOSname, setWorkerOSname] = useState<string[]>([]);
  var orderDetails: { id: number; workerName: string; workerOsDate: string; workerOsHours: number; startHour: string; endHour: string; sequentialDays: number; osStatus: string; orderId: number; }[] = []
  var assignLabel = 'Individual'

  //Get workers for this Worker Order
  useEffect(() => {
    api.get('/osWorkers', {
      params: {
        workerId: props.osWorker?.toString(),
      }
    }).then(response => {
      setWorkers(response.data)
    })
  }, [])
  //Render right color for Bussines Unit
  function buColor() {
    switch (props.osBu) {
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
  //Render name for Bussines Unit
  function buName() {
    switch (props.osBu) {
      case 'ER':
        return 'Equipamentos Refrigeração';
      case 'MI':
        return 'Manutenção Industrial';
      case 'MR':
        return 'Manutenção Refrigeração';
      case 'SB':
        return 'Sem Unidade de Negócios'
    }
  }
  //Fill arrays of data with workers details
  useEffect(() => {
    workers.forEach((worker) => {
      setWorkersOSid(prevIds => [...prevIds, worker.id]);
      setWorkerOSname(prevNames => [...prevNames, worker.name]);
    });
  }, [workers]);


  //Fill states of data with workers details
  useEffect(() => {
    workers.map(() => {
      hours.push(0)
      date.push('1900-01-01')
      startHour.push('00:00')
      endHour.push('00:00')
      sequentialDays.push(0)
      addDays.push(false)
      showAddSequential.push(true)

    })
    setHours(hours)
    setDate(date)
    setStartHour(startHour)
    setEndHour(endHour)
    setSequentialDays(sequentialDays)
    setAddDays(addDays)
    setShowAddSequential(showAddSequential)
  }, [workers, assingMode])


  //Submit Form with workers atribuittion
  function SubmitForm(event: FormEvent) {
    event.preventDefault()
    //Validate total hours assigned for this Worker Order
    var sum = hours.reduce((acc, currentValue) => {
      return acc + currentValue
    }, 0)
    //Structure to post data
    if ((props.osHours - sum) >= 0) {
      orderDetails = workersOSid.map((id, index) => {
        return {
          id: id,
          workerName: workerOSname[index],
          workerOsDate: date[index],
          workerOsHours: hours[index],
          startHour: startHour[index],
          endHour: endHour[index],
          sequentialDays: sequentialDays[index],
          osStatus: 'assigned',
          orderId: props.orderId
        }
      })
      console.log(orderDetails)
      //Post and feedback alert
      api.post('/AssignOrderStep2', {
        orderDetails
      }).then(() => alert("Ordem atribuída com sucesso!"))

    }
    //Alert user for error on total hours assigned
    if ((props.osHours - sum) < 0) {
      event.preventDefault()
      alert("As horas alocadas diferem do total de horas disponíveis para essa OS, por favor revise")
    }
  }
  //Submit Form with workers atribuittion
  function SubmitFormCustom(event: FormEvent) {
    event.preventDefault()
    //Validate total hours assigned for this Worker Order
    var sum = hours.reduce((acc, currentValue) => {
      return acc + currentValue
    }, 0)
    //Structure to post data
    if ((props.osHours - sum) >= 0) {
      orderDetails = workersOSid.map((id, index) => {
        return {
          id: id,
          workerName: workerOSname[index],
          workerOsDate: date[index],
          workerOsHours: hours[index],
          startHour: startHour[index],
          endHour: endHour[index],
          sequentialDays: sequentialDays[index],
          osStatus: 'assigned',
          orderId: props.orderId
        }
      })
      //Post and feedback alert
      alert('Dados salvos!')
      setCustomFormControl(true)
      setFormPage(0)

    }
    //Alert user for error on total hours assigned
    if ((props.osHours - sum) < 0) {
      event.preventDefault()
      alert("As horas alocadas diferem do total de horas disponíveis para essa OS, por favor revise")
    }
  }
  //Manage states when atribuittion mode is changed
  function handleAssignModeSelection() {
    setAssignMode(!assingMode)
    setDate([])
    setStartHour([])
    setEndHour([])
    setHours([])
    setSequentialDays([])
    setAddDays([])
    setShowAddSequential([])
  }
  //Change label for assignMode
  if (assingMode) {
    assignLabel = 'Individual'
  } else {
    assignLabel = 'Equipe'
  }
  //Team atribuittion functions
  function handleAddDaysEv() {
    addDays[0] = !addDays[0]
  }
  //Update sequential days selection
  function handleAddSequentialDayEv(event: ChangeEvent<HTMLInputElement>) {
    const selectedSeqDay = event.target.value
    for (var i = 0; i < sequentialDays.length; i++) {
      sequentialDays[i] = Number(selectedSeqDay)
    }

  }
  function handleCancelSequentiaDaysEv() {
    for (var i = 0; i < sequentialDays.length; i++) {
      sequentialDays[i] = 0
    }
  }

  //Update intial data for worker activity
  function handleDateSelectionEv(event: ChangeEvent<HTMLInputElement>) {
    const selectedDate = event.target.value
    for (var i = 0; i < date.length; i++) {
      date[i] = selectedDate
    }
  }
  //Update start hour for worker activity
  function handleStartHourSelectionEv(event: ChangeEvent<HTMLInputElement>) {
    const selectedStartHour = event.target.value
    for (var i = 0; i < startHour.length; i++) {
      startHour[i] = selectedStartHour
    }

  }
  //Update end hour for worker activity
  function handleEndHourSelectionEv(event: ChangeEvent<HTMLInputElement>) {
    const selectedEndHour = event.target.value
    for (var i = 0; i < endHour.length; i++) {
      endHour[i] = selectedEndHour
    }
  }
  //Function to validate and render availible hours to allocate base on user inputs
  function handleHourSumEv(factor: number, isSeqDay: boolean, event?: ChangeEvent<HTMLInputElement>) {

    var selectedSeqDay = 1
    if (isSeqDay) {
      selectedSeqDay = Number(event?.target.value)
    }
    //Update worker Hours for each worker with the same value
    const workerHours = ((Number(endHour[0].substring(0, 2)) - Number(startHour[0].substring(0, 2))))
    for (var i = 0; i < workers.length; i++) {
      hours[i] = workerHours * selectedSeqDay
    }
    //Calculate total available hours for allocation based on user input fields 
    var diff = ((Number(endHour[0].substring(0, 2)) - Number(startHour[0].substring(0, 2))) * factor * selectedSeqDay)
    if (diff < 0) {
      hours[0] = 0
    } else {
      totalAssignedHours = diff
      setAvailableHours(props.osHours - totalAssignedHours)
    }
  }

  //Individual atribuittion functions, the same logic than the Team atribuittion but updating info indivudually
  function handleAddDays(index: number) {
    addDays[index] = !addDays[index]
    console.log('fsdf')
    console.log(addDays[index])
    

  }
  function handleShowSequentialDay(index: number) {
    showAddSequential[index] = !showAddSequential[index]
  }

  function handleAddSequentialDay(event: ChangeEvent<HTMLInputElement>, index: number, id: number, isBackFromCustom?: boolean) {
    const selectedSeqDay = event.target.value
    var indexOfWorker = workersOSid.indexOf(id)
    if (isBackFromCustom) {
      sequentialDays[indexOfWorker] = Number(selectedSeqDay)
    } else {
      sequentialDays[index] = Number(selectedSeqDay)
    }

  }
  function handleCancelSequentiaDays(index: number, id: number, isBackFromCustom?: boolean) {
    var indexOfWorker = workersOSid.indexOf(id)
    if (isBackFromCustom) {
      sequentialDays[indexOfWorker] = 0
    } else {
      sequentialDays[index] = 0
    }
  }

  function handleDateSelection(event: ChangeEvent<HTMLInputElement>, index: number, id: number, isBackFromCustom?: boolean) {
    console.log(id)
    console.log(index)
    console.log(date)
    const selectedDate = event.target.value
    var indexOfWorker = workersOSid.indexOf(id)
    if (isBackFromCustom) {
      date[indexOfWorker] = selectedDate
    } else {
      date[index] = selectedDate
    }
  }
  function handleStartHourSelection(event: ChangeEvent<HTMLInputElement>, index: number, id: number, isBackFromCustom?: boolean) {
    const selectedStartHour = event.target.value
    var indexOfWorker = workersOSid.indexOf(id)
    if (isBackFromCustom) {
      startHour[indexOfWorker] = selectedStartHour
    } else {
      startHour[index] = selectedStartHour
    }
  }

  function handleEndHourSelection(event: ChangeEvent<HTMLInputElement>, index: number, id: number, isBackFromCustom?: boolean) {
    const selectEndHour = event.target.value
    var indexOfWorker = workersOSid.indexOf(id)
    if (isBackFromCustom) {
      endHour[indexOfWorker] = selectEndHour
    } else {
      endHour[index] = selectEndHour
    }
  }

  function handleHourSum(index: number, isSeqDay: boolean, id: number, isBackFromCustom?: boolean, event?: ChangeEvent<HTMLInputElement>) {
    
    console.log(startHour)
    console.log(endHour)
    var selectedSeqDay = 1
    if (isSeqDay) {
      selectedSeqDay = Number(event?.target.value)
    }
    var indexOfWorker = workersOSid.indexOf(id)
    if (isBackFromCustom) {
      index = indexOfWorker
    }

    var diff = ((Number(endHour[index].substring(0, 2)) - Number(startHour[index].substring(0, 2))) * selectedSeqDay)
    hours[index] = diff
    if (diff < 0) {
      hours[index] = 0
    } else {
      totalAssignedHours = hours.reduce((acc, currentValue) => {
        return acc + currentValue
      }, 0)
      setAvailableHours(props.osHours - totalAssignedHours)
    }
  }

  //Functions to manage arrays of data in customWorkerForm
  const removeWorkerByIndex = (indexToRemove: number): void => {
    setWorkersOSid((prevIds: number[]) => prevIds.filter((_, index) => index !== indexToRemove));
  };
  const removeNameByIndex = (indexToRemove: number): void => {
    setWorkerOSname((prevIds: string[]) => prevIds.filter((_, index) => index !== indexToRemove));
  };
  const removeDateByIndex = (indexToRemove: number): void => {
    setDate((prevIds: string[]) => prevIds.filter((_, index) => index !== indexToRemove));
  };
  const removeHoursByIndex = (indexToRemove: number): void => {
    setHours((prevIds: number[]) => prevIds.filter((_, index) => index !== indexToRemove));
  };
  const removeStartHourByIndex = (indexToRemove: number): void => {
    setStartHour((prevIds: string[]) => prevIds.filter((_, index) => index !== indexToRemove));
  };
  const removeEndHourByIndex = (indexToRemove: number): void => {
    setEndHour((prevIds: string[]) => prevIds.filter((_, index) => index !== indexToRemove));
  };
  const removeSeqDaysByIndex = (indexToRemove: number): void => {
    setSequentialDays((prevIds: number[]) => prevIds.filter((_, index) => index !== indexToRemove));
  };
  //Update array of data and render individual inputs for one worker
  function handleCustomDays(event: ChangeEvent<HTMLInputElement>, index: number) {
    var updatedValue = Number(event.target.value)

    if (updatedValue > customDaysRef.current) {
      customDays.push(updatedValue)
      //console.log(startHour)
      date.forEach((_v, index) => {
        date[index] = '1900-01-01'
        startHour[index] = '00:00'
        endHour[index] = '00:00'
      })
      setWorkersOSid(prevIds => [workers[index].id, ...prevIds])
      setWorkerOSname(prevNames => [workers[index].name, ...prevNames])
      setHours(prevHours => [hours[index], ...prevHours])
      setDate(prevDates => ['1900-01-01', ...prevDates])
      setStartHour(prevStHr => [startHour[index], ...prevStHr])
      setEndHour(prevEndhr => [endHour[index], ...prevEndhr])
      setSequentialDays(prevSqD => [sequentialDays[index], ...prevSqD])

    } else {
      customDays.pop()
      removeWorkerByIndex(index)
      removeNameByIndex(index)
      removeHoursByIndex(index)
      removeDateByIndex(index)
      removeStartHourByIndex(index)
      removeEndHourByIndex(index)
      removeSeqDaysByIndex(index)

    }
    customDaysRef.current = updatedValue
    setWorkersOSid((prevArray) => reorganizeIDArray(prevArray))
    setWorkerOSname((prevArray) => reorganizeNameArray(prevArray))

  }
  //Reset hours and date when select Custom attribuition
  function resetDateHours(index: number) {
    date[index] = '1900-01-01'
    startHour[index] = '00:00'
    endHour[index] = '00:00'
  }
  //Reorganize id an Name arrays to get data sctructure organized
  function reorganizeIDArray(prevArray: number[]): number[] {
    const uniqueNumbers: number[] = Array.from(new Set(prevArray));
    const organizedArray: number[] = [];

    uniqueNumbers.forEach((num) => {
      const occurrences: number[] = prevArray.filter((item) => item === num);
      organizedArray.push(...occurrences);
    });

    return organizedArray;
  };

  function reorganizeNameArray(prevArray: string[]): string[] {
    const uniqueStrings: string[] = Array.from(new Set(prevArray));
    const organizedArray: string[] = [];

    uniqueStrings.forEach((str) => {
      const occurrences: string[] = prevArray.filter((item) => item === str);
      organizedArray.push(...occurrences);
    });

    return organizedArray;
  };


  //Create a new position on arrays of data when the number of Custom Days attrituition increases
  function updateDataArrays(index: number) {
    setWorkersOSid(prevIds => [workers[index].id, ...prevIds]);
    setWorkerOSname(prevNames => [workers[index].name, ...prevNames]);
    setHours(prevHours => [hours[index], ...prevHours])
    setDate(prevDates => [date[index], ...prevDates])
    setStartHour(prevStHr => [startHour[index], ...prevStHr])
    setEndHour(prevEndhr => [endHour[index], ...prevEndhr])
    setSequentialDays(prevSqD => [sequentialDays[index], ...prevSqD])

  }

  switch (formPage) {
    case 0:
      return (
        <>
          <div className="pt-6 flex gap-20 pl-16 items-center">
            <div className={`flex items-center justify-center w-fit h-fit rounded-md ${buColor()}`}>
              <div className="text-[15px] leading-none pl-[10px] p-1.5 ">
                {buName()}
              </div>
            </div>
            <div className="text-purple-dark font-bold">
              OS {props.orderId}
            </div>
            <div className="text-purple-dark font-bold flex items-center gap-3">
              Atribuição
              <div className="w-[120px]">
                <button type="button" onClick={() => { handleAssignModeSelection(); setAvailableHours(props.osHours) }} className="w-fit h-[27px] px-3 flex justify-center items-center bg-[#edecfe] text-base text-purple-dark border border-[#E5E5ED] font-thin rounded-xl">
                  {assignLabel}
                </button>
              </div>
            </div>
            <div className="text-purple-dark font-bold flex items-center gap-3">
              Horas para alocar
              <div className={`text-[#768396] shadow-[#E5E5ED] focus:shadow-purple-light inline-flex h-[30px] w-[10px] flex-1 items-center justify-center rounded-[4px] px-[20px] text-[15px] leading-tight shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px] ${availableHours < 0 ? 'bg-[#fd3c30] text-white' : ''} ${availableHours === 0 ? 'bg-[#41D37E] text-white' : ''}`}>
                {availableHours}
              </div>
            </div>
          </div>
          <form onSubmit={SubmitForm} id="workersHours" className="py-14 pl-8">
            <div className='overflow-auto max-h-80 gap-3 grid pb-10 scrollbar-hide'>
              {!assingMode &&
                <div className="flex gap-14 items-center min-h-[71px]">
                  <div className="bg-purple-light w-[215px] rounded-[10px]">
                    <div className="flex pt-5 pl-8 max-w-[190px] overflow-x-auto scrollbar-hide">
                      {workers.map((worker) => {
                        return (

                          <div className="ml-[-8px]" key={worker.id}>
                            <AvatarColab width='w-[35px]' height='h-[35px]' img={worker.photo} name={worker.name} surname={worker.surname} />
                          </div>

                        );
                      })}

                    </div>
                    <div className="pb-5">
                      {workers.map((worker) => {
                        return (
                          <div className="grid justify-start pt-[14px] pl-[46px]" key={worker.id}>
                            <div className="text-white">
                              {worker.name} {worker.surname}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex gap-14 items-center min-h-[71px]">
                    <fieldset className="pb-2 gap-5 w-[150px]">
                      <label className=" pl-10 text-purple-dark text-right text-sm font-semibold flex">
                        Data início
                      </label>
                      <div className='flex px-1 pt-1'>
                        <input
                          type='date'
                          min={props.osDate}
                          className="text-[#768396] shadow-[#E5E5ED] focus:shadow-purple-light inline-flex h-[35px] w-[54px] flex-1 items-center justify-center rounded-[9px] px-[10px] py-2 text-[15px] leading-tight shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                          required
                          onChange={e => handleDateSelectionEv(e)}
                        />
                      </div>
                    </fieldset>
                    <fieldset className="pb-2 gap-5 w-fit">
                      <label className=" text-purple-dark text-right text-sm font-semibold pb-1 flex">
                        Hora início
                      </label>
                      <input
                        type="time"
                        min={props.osDate}
                        className="text-[#768396] shadow-[#E5E5ED] focus:shadow-purple-light inline-flex h-[35px] w-[100px] flex-1 items-center justify-center rounded-[9px] px-[10px] py-2 text-[15px] leading-tight shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                        required
                        onChange={e => { handleStartHourSelectionEv(e); handleHourSumEv(workers.length, false) }}

                      />
                    </fieldset>
                    <fieldset className="pb-2 gap-5 w-fit">
                      <label className=" text-purple-dark text-right text-sm font-semibold pb-1 flex">
                        Hora fim
                      </label>
                      <input
                        type="time"
                        min={props.osDate}
                        className="text-[#768396] shadow-[#E5E5ED] focus:shadow-purple-light inline-flex h-[35px] w-[100px] flex-1 items-center justify-center rounded-[9px] px-[10px] py-2 text-[15px] leading-tight shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                        required
                        onChange={e => { handleEndHourSelectionEv(e); handleHourSumEv(workers.length, false) }}
                      />
                    </fieldset>
                    <div>
                      {!addDays[0] &&
                        <div>
                          <div className="text-purple-dark text-right text-sm font-semibold pb-2">
                            Adicionar dias
                          </div>
                          <button type="button" onClick={() => handleAddDaysEv()} className="pl-9">
                            <TbCirclePlus size={24} color="#8D98A9" />
                          </button>
                        </div>
                      }
                      {addDays[0] &&
                        <div className="gap-2 grid pb-2">
                          <div className='w-fit h-[20px] rounded-xl px-3 bg-purple-light text-white text-[12px] flex items-center justify-between'>
                            Sequencial
                          </div>
                          {showAddSequential[0] &&
                            <div className="pl-5 flex gap-4 items-center">
                              <input
                                type="number"
                                min={2}
                                defaultValue={0}
                                onChange={e => { handleAddSequentialDayEv(e); handleHourSumEv(workers.length, true, e) }}
                                className="text-[#768396] shadow-[#E5E5ED] focus:shadow-purple-light inline-flex h-[35px] max-w-[50px] flex-1 items-center justify-center rounded-[9px] px-[10px] py-2 text-[15px] leading-tight shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]">
                              </input>
                              <button type="button" onClick={() => { handleAddDaysEv(); handleHourSumEv(workers.length, false); handleCancelSequentiaDaysEv() }}>
                                <TbArrowBackUp size={24} color="#8D98A9" />
                              </button>
                            </div>
                          }
                        </div>
                      }
                    </div>
                  </div>
                </div>
              }
              {assingMode &&
                workers.map((worker, index) => {
                  return (
                    <div className="flex gap-14 items-center min-h-[71px]"
                      key={worker.id}
                    >
                      <div className='w-[215px] h-[50px] rounded-[10px] shadow-custom bg-purple-light text-white flex pl-5 pr-16 items-center justify-between'>
                        <div className="flex items-center justify-around gap-6">
                          <AvatarColab width='w-[35px]' height='h-[35px]' img={worker.photo} name={worker.name} surname={worker.surname} />
                          <div>{worker.name}</div>
                        </div>
                      </div>
                      <fieldset className="pb-2 gap-5 w-[150px]">
                        <label className=" pl-10 text-purple-dark text-right text-sm font-semibold flex">
                          Data início
                        </label>
                        <div className='flex px-1 pt-1'>
                          <input
                            type='date'
                            min={props.osDate}
                            className="text-[#768396] shadow-[#E5E5ED] focus:shadow-purple-light inline-flex h-[35px] w-[54px] flex-1 items-center justify-center rounded-[9px] px-[10px] py-2 text-[15px] leading-tight shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                            //required
                            onChange={e => handleDateSelection(e, index, worker.id, customFormControl)}
                          />
                        </div>
                      </fieldset>
                      <fieldset className="pb-2 gap-5 w-fit">
                        <label className=" text-purple-dark text-right text-sm font-semibold pb-1 flex">
                          Hora início
                        </label>
                        <input
                          type="time"
                          min={props.osDate}
                          className="text-[#768396] shadow-[#E5E5ED] focus:shadow-purple-light inline-flex h-[35px] w-[100px] flex-1 items-center justify-center rounded-[9px] px-[10px] py-2 text-[15px] leading-tight shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                          //required
                          onChange={e => { handleStartHourSelection(e, index, worker.id, customFormControl); handleHourSum(index, false, worker.id, customFormControl) }}

                        />
                      </fieldset>
                      <fieldset className="pb-2 gap-5 w-fit">
                        <label className=" text-purple-dark text-right text-sm font-semibold pb-1 flex">
                          Hora fim
                        </label>
                        <input
                          type="time"
                          min={props.osDate}
                          className="text-[#768396] shadow-[#E5E5ED] focus:shadow-purple-light inline-flex h-[35px] w-[100px] flex-1 items-center justify-center rounded-[9px] px-[10px] py-2 text-[15px] leading-tight shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                          //required
                          onChange={e => { handleEndHourSelection(e, index, worker.id, customFormControl); handleHourSum(index, false, worker.id, customFormControl) }}
                        />
                      </fieldset>
                      <div>
                        {!addDays[index] &&
                          <div>
                            <div className="text-purple-dark text-right text-sm font-semibold pb-2">
                              Adicionar dias
                            </div>
                            <button type="button" onClick={() => handleAddDays(index)} className="pl-9">
                              <TbCirclePlus size={24} color="#8D98A9" />
                            </button>
                          </div>
                        }
                        {addDays[index] &&
                          <div className="gap-2 grid pb-2">
                            <div className="flex gap-2 bg-[#edecfe] border border-[#E5E5ED] rounded-xl">
                              <button type="button" onClick={() => handleShowSequentialDay(index)} className={`w-fit h-[20px] rounded-xl px-3  ${showAddSequential[index] ? 'bg-purple-light' : 'bg-[#edecfe]'} ${showAddSequential[index] ? 'text-white' : 'text-purple-dark'}  text-[12px] flex items-center justify-between`}>
                                Sequencial
                              </button>
                              <button type="button" onClick={() => handleShowSequentialDay(index)} className={`w-fit h-[20px] rounded-xl px-3  ${!showAddSequential[index] ? 'bg-purple-light' : 'bg-[#edecfe]'} ${!showAddSequential[index] ? 'text-white' : 'text-purple-dark'} ${!showAddSequential[index] ? 'border-none' : 'border border-[#E5E5ED]'} text-[12px] flex items-center justify-between`}>
                                Personalizar
                              </button>
                            </div>
                            {showAddSequential[index] &&
                              <div className="pl-12 flex gap-4 items-center">
                                <input
                                  type="number"
                                  min={2}
                                  defaultValue={0}
                                  onChange={e => { handleAddSequentialDay(e, index, worker.id, customFormControl); handleHourSum(index, true, worker.id, customFormControl, e) }}
                                  className="text-[#768396] shadow-[#E5E5ED] focus:shadow-purple-light inline-flex h-[35px] max-w-[50px] flex-1 items-center justify-center rounded-[9px] px-[10px] py-2 text-[15px] leading-tight shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]">
                                </input>
                                <button type="button" onClick={() => { handleAddDays(index); handleHourSum(index, false, worker.id, customFormControl); handleCancelSequentiaDays(index, worker.id, customFormControl) }}>
                                  <TbArrowBackUp size={24} color="#8D98A9" />
                                </button>
                              </div>
                            }
                            {!showAddSequential[index] &&
                              <div className="pl-5 h-[35px] flex items-center">
                                <div className="text-purple-dark text-right text-sm font-semibold">
                                  Escolher Datas
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFormPage(1);
                                    setWorkerIndexCustomDays(index);
                                    updateDataArrays(index);
                                    resetDateHours(index);
                                    handleHourSum(index, false, worker.id, customFormControl);
                                    customWorkersRef.current = index;
                                    setWorkersOSid((prevArray) => reorganizeIDArray(prevArray));
                                    setWorkerOSname((prevArray) => reorganizeNameArray(prevArray))
                                  }}
                                  className="pl-3">
                                  <TbCirclePlus size={24} color="#8D98A9" />
                                </button>
                              </div>
                            }
                          </div>
                        }
                      </div>
                    </div>
                  )
                })
              }
            </div>
            <button type='submit' className='w-24 h-9 flex justify-center items-center bg-purple-light text-base text-white rounded-xl absolute right-12 bottom-7'>
              Salvar
            </button>
          </form>
        </>
      )
    case 1:
      return (
        <>
          <div className="pt-6 flex gap-20 pl-16 items-center">
            <div className={`flex items-center justify-center w-fit h-fit rounded-md ${buColor()}`}>
              <div className="text-[15px] leading-none pl-[10px] p-1.5 ">
                {buName()}
              </div>
            </div>
            <div className="text-purple-dark font-bold">
              OS {props.orderId}
            </div>
            <div className="pl-60">
              <div className="text-purple-dark font-bold flex items-center gap-3">
                Horas para alocar
                <div className={`text-[#768396] shadow-[#E5E5ED] focus:shadow-purple-light inline-flex h-[30px] w-[10px] flex-1 items-center justify-center rounded-[4px] px-[20px] text-[15px] leading-tight shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px] ${availableHours < 0 ? 'bg-[#fd3c30] text-white' : ''} ${availableHours === 0 ? 'bg-[#41D37E] text-white' : ''}`}>
                  {availableHours}
                </div>
              </div>
            </div>
          </div>
          <form onSubmit={SubmitFormCustom} id="customWorkersHours" className="py-14 pl-8">
            <div className='overflow-auto max-h-80 gap-3 pb-10 scrollbar-hide'>
              <div className="flex gap-16 items-start min-h-[233px] max-h-[233px]">
                <div className="flex pt-5 max-w-[215px] overflow-x-auto scrollbar-hide">
                  <div className='w-[215px] h-[50px] rounded-[10px] shadow-custom bg-purple-light text-white flex pl-5 pr-16 items-center justify-between'>
                    <div className="flex items-center justify-around gap-6">
                      <AvatarColab width='w-[35px]' height='h-[35px]' img={workers[workerIndexCustomDays].photo} name={workers[workerIndexCustomDays].name} surname={workers[workerIndexCustomDays].surname} />
                      <div>{workers[workerIndexCustomDays].name}</div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-rows gap-4 items-center">
                  {customDays.map((number, index) => {
                    return (
                      <div className="flex" key={number}>
                        <fieldset className="pb-2 pr-12 w-[198px]">
                          <label className=" pl-10 text-purple-dark text-right text-sm font-semibold flex">
                            Data início
                          </label>
                          <div className='flex px-1 pt-1'>
                            <input
                              type='date'
                              min={props.osDate}
                              className="text-[#768396] shadow-[#E5E5ED] focus:shadow-purple-light inline-flex h-[35px] w-[54px] flex-1 items-center justify-center rounded-[9px] px-[10px] py-2 text-[15px] leading-tight shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                              required
                              value={date[index]}
                              onChange={e => { handleDateSelection(e, index, workers[workerIndexCustomDays].id) }} />
                          </div>
                        </fieldset>
                        <fieldset className="pb-2 gap-5 w-[150px]">
                          <label className=" text-purple-dark text-right text-sm font-semibold pb-1 flex">
                            Hora início
                          </label>
                          <input
                            type="time"
                            className="text-[#768396] shadow-[#E5E5ED] focus:shadow-purple-light inline-flex h-[35px] w-[100px] flex-1 items-center justify-center rounded-[9px] px-[10px] py-2 text-[15px] leading-tight shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                            required
                            //value={startHour[index]}
                            onChange={e => { handleStartHourSelection(e, index, workers[workerIndexCustomDays].id); handleHourSum(index, false, workers[workerIndexCustomDays].id, customFormControl) }} />
                        </fieldset>
                        <fieldset className="pb-2 gap-5 w-fit">
                          <label className=" text-purple-dark text-right text-sm font-semibold pb-1 flex">
                            Hora fim
                          </label>
                          <input
                            type="time"
                            className="text-[#768396] shadow-[#E5E5ED] focus:shadow-purple-light inline-flex h-[35px] w-[100px] flex-1 items-center justify-center rounded-[9px] px-[10px] py-2 text-[15px] leading-tight shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                            required
                            //value={endHour[index]}
                            onChange={e => { handleEndHourSelection(e, index, workers[workerIndexCustomDays].id); handleHourSum(index, false, workers[workerIndexCustomDays].id, customFormControl) }} />
                        </fieldset>
                      </div>
                    )
                  })}
                </div>
                <fieldset className="pb-2 pl-6 gap-5 w-fit">
                  <label className="text-purple-dark text-right text-sm font-semibold pb-1 flex">
                    Número de Dias
                  </label>
                  <div className="pl-4">
                    <input
                      type="number"
                      min={2}
                      defaultValue={2}
                      className="text-[#768396] shadow-[#E5E5ED] focus:shadow-purple-light inline-flex h-[35px] w-[64px] flex-1 items-center justify-center rounded-[9px] px-[10px] py-2 text-[15px] leading-tight shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                      required
                      onChange={e => handleCustomDays(e, customWorkersRef.current)}
                    />
                  </div>
                </fieldset>
              </div>
            </div>
            <button type='submit' className='w-24 h-9 flex justify-center items-center bg-purple-light text-base text-white rounded-xl absolute right-12 bottom-7'>
              Salvar
            </button>
          </form>
        </>

      )
  }
}