import * as Popover from '@radix-ui/react-popover';
import { TbBellRingingFilled, TbCheckbox, TbCheckupList, TbDots } from "react-icons/tb";
import * as Dialog from "@radix-ui/react-dialog";
import { FiX } from "react-icons/fi";
import { AssignOneOrderForm } from "./AssignOneOrderForm";
import { Order } from './OsStatus';
import { useState } from 'react';
import { ConcludeOSForm } from './ConcludeOSForm';
import { EditOS } from './EditOS';
import { VisualizeOS } from './VisualizeOS';

interface OsCard {
  soNumber: number,
  soTitle: string,
  soCostumer: string,
  backgColor: string,
  isEditable: boolean,
  osBu: string,
  osStatus?: string
  width: string,
  height: string,
  isSelected?: boolean,
  fromBacklog?: boolean,
  createdAt?: number
  order?: Order
}


export function OsCard(props: OsCard) {

  const [orderDetails, setOrderDetails] = useState<Order>()

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

  function border(operator?: boolean) {
    if (operator) {
      return 'border border-purple-light'
    } else {
      return 'border-none'
    }
  }




  return (
    <div className={`${props.width} ${props.height} ${props.backgColor} ${border(props.isSelected)} rounded-xl pl-[16px]`}>
      <div className="w-full h-fit pt-[18px] flex justify-between pr-3">
        <div className={`flex items-center justify-center w-fit h-fit rounded-md px-1 ${buColor()}`}>{props.osBu}</div>
        <Popover.Root>
          {props.isEditable &&
            <Popover.Trigger asChild>
              
              <button 
              type="button" 
              title="options" 
              className="pr-3 " 
              onClick={() => setOrderDetails(props.order)}
              >
                <TbDots size={24} color='#768396' />
              </button>
              
            </Popover.Trigger>}
          <Popover.Portal>
            <Popover.Content
              className="rounded-lg border p-3 w-[100px] m-auto bg-white opacity-90 shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2)] focus:shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2)] will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade"
              sideOffset={0}>
              {props.osStatus != 'completed' && props.osStatus != 'new' && (
                <Dialog.Root>
                  <Dialog.Trigger>
                    <div className='text-sm text-purple-light font-semibold px-4 pb-1'>
                      Editar
                    </div>
                  </Dialog.Trigger>
                  <Dialog.Portal>
                    <Dialog.Overlay className="bg-black opacity-60 data-[state=open]:animate-overlayShow fixed inset-0" />
                    <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[1090px] translate-x-[-50%] translate-y-[-50%] rounded-[12px] p-6 bg-white shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
                      <Dialog.Title className="m-0 text-[30px] font-medium flex items-center gap-7">
                        Editar Ordem de Serviço
                      </Dialog.Title>
                      <Dialog.Close className="absolute right-6 top-6">
                        <div className="hover:bg-purple-100 rounded-full">
                          <FiX size={24} color='#5051F9' />
                        </div>
                      </Dialog.Close>
                     <EditOS order={props.order}/>
                    </Dialog.Content>
                  </Dialog.Portal>
                </Dialog.Root>
              )}
              {props.osStatus === 'completed' &&
                <Dialog.Root>
                  <Dialog.Trigger>
                    <div className='text-sm text-purple-light font-semibold px-2 pb-1 '>
                      Visualizar
                    </div>
                  </Dialog.Trigger>
                  <Dialog.Portal>
                    <Dialog.Overlay className="bg-black opacity-60 data-[state=open]:animate-overlayShow fixed inset-0" />
                    <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[1090px] translate-x-[-50%] translate-y-[-50%] rounded-[12px] p-6 bg-white shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
                      <Dialog.Title className="m-0 text-[30px] font-medium flex items-center gap-7">
                        Visualizar Ordem de Serviço
                      </Dialog.Title>
                      <Dialog.Close className="absolute right-6 top-6">
                        <div className="hover:bg-purple-100 rounded-full">
                          <FiX size={24} color='#5051F9' />
                        </div>
                      </Dialog.Close>
                     <VisualizeOS order={props.order}/>
                    </Dialog.Content>
                  </Dialog.Portal>
                </Dialog.Root>
              }
              {props.osStatus === 'new' &&
                <Dialog.Root>
                  <Dialog.Trigger>
                    <div className='text-sm text-purple-light font-semibold px-3 pb-1 '>
                      Atribuir
                    </div>
                  </Dialog.Trigger>
                  <Dialog.Portal>
                    <Dialog.Overlay className="bg-black opacity-60 data-[state=open]:animate-overlayShow fixed inset-0" />
                    <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[1090px] translate-x-[-50%] translate-y-[-50%] rounded-[12px] p-6 bg-white shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
                      <Dialog.Title className="m-0 text-[30px] font-medium flex items-center gap-7">
                        Atribuir Ordem de Serviço
                      </Dialog.Title>
                      <Dialog.Close className="absolute right-6 top-6">
                        <div className="hover:bg-purple-100 rounded-full">
                          <FiX size={24} color='#5051F9' />
                        </div>
                      </Dialog.Close>
                      <AssignOneOrderForm orderId={props.soNumber} />
                    </Dialog.Content>
                  </Dialog.Portal>
                </Dialog.Root>}
              {props.osStatus === 'assigned' &&
                <Dialog.Root>
                  <Dialog.Trigger>
                    <div className='text-sm text-purple-light font-semibold px-3 pb-1 '>
                      Concluir
                    </div>
                  </Dialog.Trigger>
                  <Dialog.Portal>
                    <Dialog.Overlay className="bg-black opacity-60 data-[state=open]:animate-overlayShow fixed inset-0" />
                    <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[1090px] translate-x-[-50%] translate-y-[-50%] rounded-[12px] p-6 bg-white shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
                      <Dialog.Title className="m-0 text-[30px] font-medium flex items-center gap-7">
                        Concluir Ordem de Serviço
                      </Dialog.Title>
                      <Dialog.Close className="absolute right-6 top-6">
                        <div className="hover:bg-purple-100 rounded-full">
                          <FiX size={24} color='#5051F9' />
                        </div>
                      </Dialog.Close>
                      <ConcludeOSForm order={orderDetails}/>
                    </Dialog.Content>
                  </Dialog.Portal>
                </Dialog.Root>}
              <Popover.Arrow className='fill-white' />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>

      </div>
      <div className="pl-0 flex text-purple-dark text-xs font-semibold pt-3">
        OS {props.soNumber}
      </div>
      <div className="pl-0 flex text-purple-dark text-xs font-semibold pt-[5px]">
        {props.soTitle}
      </div>
      {!props.fromBacklog &&
        <>
          <div className="flex justify-between">
            <div className="text-[#768396] text-xs font-semibold py-1">
              {props.soCostumer}
            </div>
          </div>
        </>
      }
      {props.fromBacklog &&
        <>
          <div className="text-purple-dark pt-6 font-bold text-[13px]">
            Cliente:
          </div>
          <div className="text-[#768396] text-[12px] h-4">
            {props.soCostumer}
          </div>
          <div className="text-purple-dark pt-10 font-bold text-[13px]">
            Criada em:
          </div>
          <div className="flex gap-[86px]">
            <div className="w-[91px] h-[22px] border border-[#E2E2E2] rounded-[4px] text-purple-dark font-medium flex items-center justify-center text-[14px]">
              <div>
                Semana {props.createdAt}
              </div>
            </div>
            {props.osStatus === 'new' &&
              <TbBellRingingFilled size={24} color="#fd3c30" />
            }
            {props.osStatus === 'assigned' &&
              <TbCheckupList size={24} color="#F7B000" />
            }
            {props.osStatus === 'completed' &&
              <TbCheckbox size={24} color="#1ed760" />
            }
          </div>
        </>

      }
    </div>

  )

}