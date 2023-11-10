import dayjs from "dayjs";
import { MdQueryBuilder } from "react-icons/md";
import * as Popover from '@radix-ui/react-popover';
import { TbDots } from "react-icons/tb";


interface TaskCardProps {
  soBu: string;
  soNumber: number;
  soTitle: string;
  soCostumer: string;
  soStartDate: dayjs.Dayjs;
  soPlannedHours: number;
  soDescription: string;
}


export function TaskCard(props: TaskCardProps) {

  const startDate = dayjs(props.soStartDate).format('DD/MM/YYYY')
  function buColor() {
    switch (props.soBu) {
      case 'ER':
        return 'bg-[#1EA7FF]';
      case 'MI':
        return 'bg-[#41D37E]';
      case 'MR':
        return 'bg-[#F7B000]';
    }
  }

  return (

    <div className="w-[235px] h-[305px] bg-white rounded-xl pl-[16px]">
      <div className="w-full h-fit pt-[18px] flex justify-between items-center pr-3">
        <div className={`w-fit h-fit rounded-md ${buColor()}  text-white text-xs p-1`}>
          {props.soBu}
        </div>
        <Popover.Root>
          <Popover.Trigger asChild>
            <button type="button" title="options" className="pr-3">
              <TbDots size={24} color='#768396' />
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              className="rounded p-3 w-[120px] m-auto bg-purple-light shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2)] focus:shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2)] will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade"
              sideOffset={5}>
              <div className='text-sm text-white font-semibold px-6 pb-3 '>
                Deletar
              </div>
              <div className='text-sm text-white font-semibold px-3'>
                Completar
              </div>
              <Popover.Arrow className='fill-purple-light' />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>

      </div>
      <div className="text-sm text-purple-dark font-semibold pt-2.5">
        OS {props.soNumber}
      </div>
      <div className="text-sm text-purple-dark font-semibold pt-[5px]">
        {props.soTitle}
      </div>
      <div className="text-sm text-[#768396] font-semibold pt-[2px]">
        {props.soCostumer}
      </div>

      <div className='text-sm text-purple-dark font-semibold pt-[6px]'>
        Descrição
      </div>
      <div className='text-sm text-[#768396] font-medium pt-[2px] h-[90px]'>
        {props.soDescription}
      </div>
      <div className="flex items-center justify-between">
        <div className="pt-4">
          <div className="text-purple-dark text-xs">
            Data início:
          </div>
          <div className="w-24 h-6 border border-[#E2E2E2] rounded text-[#768396] text-sm flex justify-center">
            {startDate}
          </div>
        </div>
        <div className="flex items-center pt-4 pr-6">
          <MdQueryBuilder size={24} color='#768396' />
          <div className="text-sm text-[#768396] pl-1 font-semibold">
            {props.soPlannedHours}D
          </div>
        </div>
      </div>
    </div>

  )

}