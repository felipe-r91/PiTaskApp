import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { api } from "../lib/axios";
import { AvatarColab } from "../assets/AvatarColab";
import { TbArrowBackUp, TbCirclePlus } from "react-icons/tb";



interface WorkerHoursProps {
  orderId: number,
  osWorker: number[],
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

interface FormVariables {
  assignMode: boolean;
  formPage: number;
  workers: Workers;
  availableHours: number;
  customWorkerIndex: number;
  numberOfCustomDays: number[];
}

interface WorkerData {
  id: number,
  name: string,
  surname: string,
  photo: string,
  osDate: string,
  workerOsHours: number,
  startHour: string,
  endHour: string,
  showAddSequential: boolean,
  sequentialDays: number,
  addDays: boolean,
}

interface GroupedWorkers {
  [id: number]: Workers
}

export function WorkersAssignHours(props: WorkerHoursProps) {

  //Initialize variables and states
  const [formState, setFormState] = useState<FormVariables>({
    assignMode: true,
    formPage: 0,
    workers: [],
    availableHours: props.osHours,
    customWorkerIndex: 0,
    numberOfCustomDays: [1, 2]
  })
  const [workersData, setWorkersData] = useState<WorkerData[]>([])
  const [customWorkerData, setCustomWorkerData] = useState<WorkerData>({
    id: 0,
    name: 'Azul',
    surname: 'string',
    photo: 'string',
    osDate: '1900-00-00',
    workerOsHours: 0,
    startHour: '00:00',
    endHour: '00:00',
    showAddSequential: false,
    sequentialDays: 0,
    addDays: false,
  })
  const customDaysRef = useRef(2);
  var totalAssignedHours = 0;
  var assignLabel = 'Equipe'
  const [showAvailableHours, setShowAvailableHours] = useState(true)
  //Get workers for this Worker Order
  useEffect(() => {
    api.get('/osWorkers', {
      params: {
        workerId: props.osWorker?.toString(),
      },
    }).then(response => {
      setFormState({ ...formState, workers: response.data });
  
      // Update workersData using the response data
      const updatedWorkersData = response.data.map((worker: { id: any; name: any; surname: any; photo: any; }) => ({
        id: worker.id,
        name: worker.name,
        surname: worker.surname,
        photo: worker.photo,
        osDate: '1900-00-00',
        workerOsHours: 0,
        startHour: '00:00',
        endHour: '00:00',
        showAddSequential: false,
        sequentialDays: 0,
        addDays: false,
      }));
      
      setWorkersData(updatedWorkersData);

    });
  }, [props.osWorker]);

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
  

  //Submit Form with workers atribuittion
  function SubmitForm(event: FormEvent) {
    // event.preventDefault()
    //Structure to post data
    if (formState.availableHours >= 0) {
      const orderDetails = workersData.map(worker => ({
        id: worker.id,
        workerName: worker.name,
        workerOsHours: worker.workerOsHours,
        workerOsDate: worker.osDate,
        startHour: worker.startHour,
        endHour: worker.endHour,
        sequentialDays: worker.sequentialDays,
        osStatus: 'assigned',
        orderId: props.orderId,
        assignMode: formState.assignMode 
      }));
      //Post and feedback alert
      api.post('/AssignOrderStep2', {
        orderDetails
      }).then(() => alert("Ordem atribuída com sucesso!"))
      

    }
    //Alert user for error on total hours assigned
    if (formState.availableHours < 0) {
      event.preventDefault()
      alert("As horas alocadas diferem do total de horas disponíveis para essa OS, por favor revise")
    }
  }
  //Submit Form with workers atribuittion
  function SubmitFormCustom(event: FormEvent) {
    event.preventDefault()
    //Structure to post data
    if (formState.availableHours >= 0) {
      
      /*Post and feedback alert
      alert('Dados salvos!')
      */

    }
    //Alert user for error on total hours assigned
    if (formState.availableHours < 0) {
      event.preventDefault()
      alert("As horas alocadas diferem do total de horas disponíveis para essa OS, por favor revise")
    }
  }
  //Manage states when atribuittion mode is changed
  function handleAssignModeSelection() {
    if(props.osWorker.length > 1){
      setFormState({
        ...formState,
        assignMode: !formState.assignMode, availableHours: props.osHours
      })
      setWorkersData((prevWorkersData)=>
      prevWorkersData.map((worker) => ({ ... worker, addDays: false, showAddSequential: false, osDate:'1900-00-00', startHour:'00:00', endHour: '00:00'}))
      )
    }
  }
  //Change label for assignMode
  if (formState.assignMode) {
    assignLabel = 'Individual'
  } else {
    assignLabel = 'Equipe'
  }
  //Team atribuittion functions
  function handleAddDaysEv() {
    setWorkersData((prevWorkersData) =>
      prevWorkersData.map((worker) =>
        ({ ...worker, addDays: !worker.addDays }))
    )
  }
  //Update sequential days selection
  function handleAddSequentialDayEv(event: ChangeEvent<HTMLInputElement>) {
    const selectedSeqDay = event.target.value
    setWorkersData((prevWorkersData) =>
      prevWorkersData.map((worker) => ({ ...worker, sequentialDays: Number(selectedSeqDay) }))
    )
  }
  function handleCancelSequentiaDaysEv() {
    setWorkersData((prevWorkersData) =>
      prevWorkersData.map((worker) => ({ ...worker, sequentialDays: 0 }))
    )
  }

  //Update intial data for worker activity
  function handleDateSelectionEv(event: ChangeEvent<HTMLInputElement>) {
    const selectedDate = event.target.value
    setWorkersData((prevWorkersData) =>
      prevWorkersData.map((worker) => ({ ...worker, osDate: selectedDate }))
    )
  }
  //Update start hour for worker activity
  function handleStartHourSelectionEv(event: ChangeEvent<HTMLInputElement>) {
    const selectedStartHour = event.target.value
    setWorkersData((prevWorkersData) =>
      prevWorkersData.map((worker) => ({ ...worker, startHour: selectedStartHour }))
    )


  }
  //Update end hour for worker activity
  function handleEndHourSelectionEv(event: ChangeEvent<HTMLInputElement>) {
    const selectedEndHour = event.target.value
    setWorkersData((prevWorkersData) =>
      prevWorkersData.map((worker) => ({ ...worker, endHour: selectedEndHour }))
    )
  }
  //Function to validate and render availible hours to allocate base on user inputs
  function handleHourSumEv(factor: number, isSeqDay: boolean, event?: ChangeEvent<HTMLInputElement>) {
   
    var selectedSeqDay = 1;
    if (isSeqDay) {
      selectedSeqDay = Number(event?.target.value);
    }
  
    setWorkersData((prevWorkersData) =>
      prevWorkersData.map((worker) => ({
        ...worker,
        workerOsHours: ((Number(worker.endHour.substring(0, 2))) - (Number(worker.startHour.substring(0, 2)))),
      }))
    );
  
    setWorkersData((prevWorkersData) => {
      const updatedWorkersData = prevWorkersData;
      const worker = updatedWorkersData[0];
  
      // Calculate total available hours for allocation based on user input fields
      var diff = ((Number(worker.endHour.substring(0, 2)) - Number(worker.startHour.substring(0, 2))) * factor * selectedSeqDay);
  
      totalAssignedHours = diff;
        setFormState({ ...formState, availableHours: (props.osHours - totalAssignedHours) });
      return updatedWorkersData;

    });
  }

  //Individual atribuittion functions, the same logic than the Team atribuittion but updating info indivudually
  function handleAddDays(index: number) {
    setWorkersData((prevWorkersData) =>
      prevWorkersData.map((worker, i) =>
        i === index ? { ...worker, addDays: !worker.addDays } : worker
      )
    );
  }
  function handleShowSequentialDay(index: number) {
    setWorkersData((prevWorkersData) =>
      prevWorkersData.map((worker, i) =>
        i === index ? { ...worker, showAddSequential: !worker.showAddSequential } : worker
      )
    );
  }

  function handleAddSequentialDay(event: ChangeEvent<HTMLInputElement>, index: number) {
    const selectedSeqDay = event.target.value
    setWorkersData((prevWorkerData) =>
      prevWorkerData.map((worker, i) =>
        i === index ? { ...worker, sequentialDays: Number(selectedSeqDay) } : worker
      )
    )

  }
  function handleCancelSequentiaDays(index: number) {
    setWorkersData((prevWorkerData) =>
      prevWorkerData.map((worker, i) =>
        i === index ? { ...worker, sequentialDays: 0 } : worker
      )
    )
  }

  function handleDateSelection(event: ChangeEvent<HTMLInputElement>, index: number) {
    const selectedDate = event.target.value
    setWorkersData((prevWorkerData) =>
      prevWorkerData.map((worker, i) =>
        i === index ? { ...worker, osDate: selectedDate } : worker
      )
    )
  }
  function handleStartHourSelection(event: ChangeEvent<HTMLInputElement>, index: number) {
    const selectedStartHour = event.target.value
    setWorkersData((prevWorkerData) =>
      prevWorkerData.map((worker, i) =>
        i === index ? { ...worker, startHour: selectedStartHour } : worker
      )
    )
  }

  function handleEndHourSelection(event: ChangeEvent<HTMLInputElement>, index: number) {
    const selectedEndHour = event.target.value
    setWorkersData((prevWorkerData) =>
      prevWorkerData.map((worker, i) =>
        i === index ? { ...worker, endHour: selectedEndHour } : worker
      )
    )
  }

  function handleHourSum(index: number, isSeqDay: boolean, event?: ChangeEvent<HTMLInputElement>) {
    var selectedSeqDay = 1;
    if (isSeqDay) {
      selectedSeqDay = Number(event?.target.value);
    }
  
    setWorkersData((prevWorkerData) => {
      const updatedWorkersData = prevWorkerData.map((worker, i) =>
        i === index ? { ...worker, workerOsHours: ((Number(worker.endHour.substring(0, 2))) - (Number(worker.startHour.substring(0, 2)))) * selectedSeqDay } : worker
      );
  
      const totalAssignedHours = updatedWorkersData.reduce((total, worker) => total + worker.workerOsHours, 0);
  
      setFormState((prevFormState) => ({
        ...prevFormState,
        availableHours: props.osHours - totalAssignedHours,
      }));
  
      return updatedWorkersData; // Return the updated state
    });
  }

  
  //Update array of data and render individual inputs for one worker
  function handleCustomDays(event: ChangeEvent<HTMLInputElement>,) {
    var updatedValue = Number(event.target.value)
    if (updatedValue > customDaysRef.current) {
      setFormState(prevState => ({ ...prevState, numberOfCustomDays: [...prevState.numberOfCustomDays, updatedValue] }))
      setWorkersData(prevWorkers => [...prevWorkers, customWorkerData]);
      console.log(workersData)
    } else {
      setFormState(prevState => ({ ...prevState, numberOfCustomDays: prevState.numberOfCustomDays.slice(0, -1) }))
      setWorkersData(prevWorkersData => {
        // Create a new array excluding the last element
        const updatedWorkersData = [...prevWorkersData];
        updatedWorkersData.pop();
        return updatedWorkersData;
      });
      console.log(workersData)
    }
    customDaysRef.current = updatedValue
  }
  
  function fixWorker(){
    setWorkersData((prevWorkerData) =>
      prevWorkerData.map((worker, i) =>
        worker.id === 0 ? { ...worker, id: workersData[formState.customWorkerIndex].id, name: workersData[formState.customWorkerIndex].name, surname: workersData[formState.customWorkerIndex].surname } : worker
      )
    )
  }

  switch (formState.formPage) {
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
                <button type="button" onClick={() => handleAssignModeSelection()} className="w-fit h-[27px] px-3 flex justify-center items-center bg-[#edecfe] text-base text-purple-dark border border-[#E5E5ED] font-thin rounded-xl">
                  {assignLabel}
                </button>
              </div>
            </div>
            <div className="text-purple-dark font-bold flex items-center gap-3">
              Horas para alocar
              {showAvailableHours ?
                <div className={`text-[#768396] shadow-[#E5E5ED] focus:shadow-purple-light inline-flex h-[30px] w-[10px] flex-1 items-center justify-center rounded-[4px] px-[20px] text-[15px] leading-tight shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px] ${formState.availableHours < 0 ? 'bg-[#fd3c30] text-white' : ''} ${formState.availableHours === 0 ? 'bg-[#41D37E] text-white' : ''}`}>
                  {formState.availableHours}
                </div>
                : <div className="flex"><img src="/src/assets/ring-resize.svg" alt="..." width={20} /></div>}
            </div>
          </div>
          <form onSubmit={SubmitForm} id="workersHours" className="py-14 pl-8">
            <div className='overflow-auto max-h-80 gap-3 grid pb-10 scrollbar-hide'>
              {!formState.assignMode &&  
                <div className="flex gap-14 items-center min-h-[71px]">
                  <div className="bg-purple-light w-[215px] rounded-[10px]">
                    <div className="flex pt-5 pl-8 max-w-[190px] overflow-x-auto scrollbar-hide">
                      {formState.workers.map((worker) => (
                        <div className="ml-[-8px]" key={worker.id}>
                          <AvatarColab
                            width="w-[35px]"
                            height="h-[35px]"
                            img={worker.photo}
                            name={worker.name}
                            surname={worker.surname}
                          />
                        </div>
                      ))}

                    </div>
                    <div className="pb-5">
                      {formState.workers.map((worker) =>  (
                          <div className="grid justify-start pt-[14px] pl-[46px]" key={worker.id}>
                            <div className="text-white">
                              {worker.name} {worker.surname}
                            </div>
                          </div>
                        
                      ))}
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
                        onChange={e => { handleStartHourSelectionEv(e); handleHourSumEv(workersData.length, false) ; setShowAvailableHours(false) }}

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
                        onChange={e => { handleEndHourSelectionEv(e); handleHourSumEv(workersData.length, false); setShowAvailableHours(true)  }}
                      />
                    </fieldset>
                  
                    <div>
                      {workersData.length > 0 && !workersData[0].addDays &&
                        <><div>
                          <div className="text-purple-dark text-right text-sm font-semibold pb-2">
                            Adicionar dias
                          </div>
                          <button type="button" onClick={() => handleAddDaysEv()} className="pl-9">
                            <TbCirclePlus size={24} color="#8D98A9" />
                          </button>
                        </div></>
                      }
                      {workersData.length > 0 && workersData[0].addDays &&
                        <div className="gap-2 grid pb-2">
                          <div className='w-fit h-[20px] rounded-xl px-3 bg-purple-light text-white text-[12px] flex items-center justify-between'>
                            Sequencial
                          </div>
                          
                            <div className="pl-5 flex gap-4 items-center">
                              <input
                                type="number"
                                min={2}
                                defaultValue={0}
                                onChange={e => { handleAddSequentialDayEv(e); handleHourSumEv(workersData.length, true, e) }}
                                className="text-[#768396] shadow-[#E5E5ED] focus:shadow-purple-light inline-flex h-[35px] max-w-[50px] flex-1 items-center justify-center rounded-[9px] px-[10px] py-2 text-[15px] leading-tight shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]">
                              </input>
                              <button type="button" onClick={() => { handleAddDaysEv(); handleHourSumEv(workersData.length, false); handleCancelSequentiaDaysEv() }}>
                                <TbArrowBackUp size={24} color="#8D98A9" />
                              </button>
                            </div>
                          
                        </div>
                      }
                    </div>
                  </div>
                </div>
              }
              {formState.assignMode &&
                workersData.map((worker, index) =>  (
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
                            required
                            onChange={e =>{ handleDateSelection(e, index); console.log(index)}}
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
                          onChange={e => { handleStartHourSelection(e, index); handleHourSum(index, false); setShowAvailableHours(false) }}
                          value={worker.startHour}
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
                          onChange={e => { handleEndHourSelection(e, index); handleHourSum(index, false); setShowAvailableHours(true) }}
                          value={worker.endHour}
                        />
                      </fieldset>
                      <div>
                        {!workersData[index].addDays &&
                          <div>
                            <div className="text-purple-dark text-right text-sm font-semibold pb-2">
                              Adicionar dias
                            </div>
                            <button type="button" onClick={() => handleAddDays(index)} className="pl-9">
                              <TbCirclePlus size={24} color="#8D98A9" />
                            </button>
                          </div>
                        }
                        {workersData[index].addDays &&
                          <div className="gap-2 grid pb-2">
                            <div className="flex gap-2 bg-[#edecfe] border border-[#E5E5ED] rounded-xl">
                              <button type="button" onClick={() => handleShowSequentialDay(index)} className={`w-fit h-[20px] rounded-xl px-3  ${!workersData[index].showAddSequential ? 'bg-purple-light' : 'bg-[#edecfe]'} ${!workersData[index].showAddSequential ? 'text-white' : 'text-purple-dark'}  text-[12px] flex items-center justify-between`}>
                                Sequencial
                              </button>
                              <button type="button" onClick={() => handleShowSequentialDay(index)} className={`w-fit h-[20px] rounded-xl px-3  ${workersData[index].showAddSequential ? 'bg-purple-light' : 'bg-[#edecfe]'} ${workersData[index].showAddSequential ? 'text-white' : 'text-purple-dark'} ${workersData[index].showAddSequential ? 'border-none' : 'border border-[#E5E5ED]'} text-[12px] flex items-center justify-between`}>
                                Personalizar
                              </button>
                            </div>
                            {!workersData[index].showAddSequential &&
                              <div className="pl-12 flex gap-4 items-center">
                                <input
                                  type="number"
                                  min={2}
                                  defaultValue={0}
                                  onChange={e => { handleAddSequentialDay(e, index); handleHourSum(index, true, e) }}
                                  className="text-[#768396] shadow-[#E5E5ED] focus:shadow-purple-light inline-flex h-[35px] max-w-[50px] flex-1 items-center justify-center rounded-[9px] px-[10px] py-2 text-[15px] leading-tight shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]">
                                </input>
                                <button type="button" onClick={() => { handleAddDays(index); handleHourSum(index, false); handleCancelSequentiaDays(index) }}>
                                  <TbArrowBackUp size={24} color="#8D98A9" />
                                </button>
                              </div>
                            }
                            {workersData[index].showAddSequential &&
                              <div className="pl-5 h-[35px] flex items-center">
                                <div className="text-purple-dark text-right text-sm font-semibold">
                                  Escolher Datas
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFormState({ ...formState, formPage: 1, customWorkerIndex: index });
                                    setCustomWorkerData(prevData =>({...prevData, id: workersData[index].id, name: workersData[index].name, surname: workersData[index].surname}));
                                    setWorkersData(prevWorkers => [...prevWorkers, customWorkerData]);
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
                )
              }
            </div>
            <button type='submit' className='w-24 h-9 flex justify-center items-center bg-[#EDECFE] text-base text-[#5051F9] hover:bg-[#5051F9] hover:text-white rounded-xl absolute right-12 bottom-7'>
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
                <div className={`text-[#768396] shadow-[#E5E5ED] focus:shadow-purple-light inline-flex h-[30px] w-[10px] flex-1 items-center justify-center rounded-[4px] px-[20px] text-[15px] leading-tight shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px] ${formState.availableHours < 0 ? 'bg-[#fd3c30] text-white' : ''} ${formState.availableHours === 0 ? 'bg-[#41D37E] text-white' : ''}`}>
                  {formState.availableHours}
                </div>
              </div>
            </div>
          </div>
          <form onSubmit={SubmitFormCustom} id="customWorkersHours" className="py-14 pl-8">
            <div className='overflow-auto max-h-80 gap-3 pb-10 scrollbar-hide'>
              <div className="flex gap-16 items-start min-h-[233px] max-h-[233px]">
                <div className="flex pt-5 max-w-[415px] overflow-x-auto scrollbar-hide">
                  <div className='w-[215px] h-[50px] rounded-[10px] shadow-custom bg-purple-light text-white flex pl-5 pr-16 items-center justify-between'>
                    <div className="flex items-center justify-around gap-6">
                      <AvatarColab width='w-[35px]' height='h-[35px]' img={workersData[formState.customWorkerIndex].photo} name={workersData[formState.customWorkerIndex].name} surname={workersData[formState.customWorkerIndex].surname} />
                      <div>{workersData[formState.customWorkerIndex].name}</div>
                    </div>
                  </div>
                  
                  <div>{workersData.map((worker, i) => { return (<div key={i}>{worker.name}</div>)})}</div>
                </div>
                <div className="grid grid-rows gap-4 items-center">                                 
                  {formState.numberOfCustomDays.map((number, index) => {
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
                              onFocus={()=> fixWorker()}
                            //onChange={e => { handleDateSelection(e, index, workers[formState.customWorkerIndex].id) }} 
                            />
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
                          //onChange={e => { handleStartHourSelection(e, index); handleHourSum(index, false) }} 
                          />
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
                          //onChange={e => { handleEndHourSelection(e, index); handleHourSum(index, false) }} 
                          />
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
                      onChange={e => handleCustomDays(e)}
                    />
                  </div>
                </fieldset>
              </div>
            </div>
            <button type='submit' className='w-24 h-9 flex justify-center items-center bg-[#EDECFE] text-base text-[#5051F9] hover:bg-[#5051F9] hover:text-white rounded-xl absolute right-12 bottom-7'>
              Salvar
            </button>
          </form>
        </>

      )
  }
}