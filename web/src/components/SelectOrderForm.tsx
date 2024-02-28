import { useEffect, useState } from "react";
import { api } from "../lib/axios";
import { OsCard } from "./OsCard";
import { AssignOneOrderForm } from "./AssignOneOrderForm";
import { TbChevronRight } from "react-icons/tb";

export type Orders = {
  id: number;
  title: string;
  costumer: string;
  description: string;

}[]

export function SelectOrderForm() {
  const [ordersUnassigned, setOrdersUnassigned] = useState<Orders>([]);
  const [orderSelected, setOrderSelected] = useState(0);
  const [cardBorder, setCardBorder] = useState<boolean[]>([]);
  const [formRender, setFormRender] = useState(false)

  useEffect(() => {
    api.get('/UnassignedOrders').then(response => {
      setOrdersUnassigned(response.data)
    })

  }, [])

  useEffect(() => {
    ordersUnassigned.map(() => {
      cardBorder.push(false)
    })

  }, [ordersUnassigned])

  function selectOrder(id: number, index: number) {
    setOrderSelected(id)
    cardBorder[index] = !cardBorder[index]
    const newCardBorder = [...cardBorder]
    setCardBorder(newCardBorder)

  }

  function callForm(selectedOrders: boolean[]) {
    if(selectedOrders.indexOf(true) != selectedOrders.lastIndexOf(true)){
      alert('Selecione apenas uma Ordem de Serviço')
      ordersUnassigned.map(() => {
        cardBorder.push(false)
      })
      setCardBorder(cardBorder)
    } else if ((selectedOrders.filter(value => value === true).length) === 0){
      alert('Selecione ao menos uma ordem de serviço')
    } else {

      setFormRender(true)
    }
  }

  return (
    <>
      {!formRender &&
        <>
          <div className="text-purple-dark text-right text-sm font-semibold flex pt-5 pl-5" >
            Selecione a Ordem de Serviço
          </div>
          <div className="flex pt-8">
            <div className="flex h-fit w-fit">
              <div className="grid grid-cols-4 pl-7 mr-4 gap-4 pb-10 overflow-auto max-h-80 scrollbar-hide">
                {ordersUnassigned?.map((order, index) => (
                  <button
                    type="button"
                    onClick={() => selectOrder(order.id, index)}
                    key={order.id}>
                    <OsCard soNumber={order.id} soTitle={order.title.substring(0, 25)} soCostumer={order.costumer.split(' ')[2] + ' ' + order.costumer.split(' ')[3] + ' ' + order.costumer.split(' ')[4]} backgColor={"bg-off-white"} isEditable={false} osBu={"SB"} width={" w-[220px]"} height={"h-[150px]"} isSelected={cardBorder[index]} />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="pt-10"></div>
          <button type='button' onClick={() => callForm(cardBorder)} className='w-24 h-9 flex justify-center items-center bg-[#EDECFE] text-base text-[#5051F9] hover:bg-[#5051F9] hover:text-white rounded-xl absolute right-12 bottom-7'>
            Avançar
            <TbChevronRight size={15} />
          </button>
        </>
      }

      {formRender &&
        <AssignOneOrderForm orderId={orderSelected} isFirstStep={false}/>
      }
    </>
  )
}