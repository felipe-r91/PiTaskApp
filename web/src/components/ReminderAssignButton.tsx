import { TbChecklist, } from "react-icons/tb"
import '../styles/reminderIconHover.css'
import * as Dialog from '@radix-ui/react-dialog';
import { FiX } from "react-icons/fi";
import { AssignOneOrderForm } from "./AssignOneOrderForm";

interface ButtonProps {
  orderId: number
}


export function ReminderAssignButton( props : ButtonProps) {


  return (

    <>
      <Dialog.Root>
        <Dialog.Trigger>
          <div title='Assign Order' className="bg-dashboard-icon w-9 h-9 rounded-full justify-center items-center shadow-custom">
            <div className="reminderIconHover p-1.5">
            <TbChecklist size={24}/>  
            </div>
          </div>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-black opacity-60 data-[state=open]:animate-overlayShow fixed inset-0" />
          <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[1090px] translate-x-[-50%] translate-y-[-50%] rounded-[12px] p-6 bg-white shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
            <Dialog.Title className="m-0 text-[30px] font-medium flex items-center gap-7">
              Atribuir Ordem de Serviço
            </Dialog.Title>
            <Dialog.Close className="absolute right-6 top-6 hover:bg-purple-100 rounded-full">
                <FiX size={24} color='#5051F9' />
            </Dialog.Close>
            <AssignOneOrderForm orderId={props.orderId} isFirstStep={true} />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>

  )

}