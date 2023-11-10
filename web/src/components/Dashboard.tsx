import { TbFileImport, TbFileReport, TbStar } from "react-icons/tb";
import { DashCard } from "./DashCard";
import { OrdersChart } from "./OrdersChart";
import { Reminder } from "./Reminder";
import { DashRightMenu } from "./DashRightMenu";
import { api } from "../lib/axios";
import { useEffect, useState } from "react";



type Orders = {
  id: number;
  title: string;
  costumer: string;
  description: string;
  created_at: Date;
}[]

export function Dashboard() {

  const [orders, setOrders] = useState<Orders>()
  const [ordersUnassignedCount, setOrdersUnassignedCount] = useState<number>(0)
  const [newOrders, setNewOrders] = useState<number>(0)
  const [completedOrders, setCompletedOrders] = useState<number>(0)
  const [completedOnWeek, setCompletedOnWeek] = useState<number>(0)

  useEffect(() => {
    api.get('/UnassignedOrders').then(response => {
      setOrders(response.data)
    })
  }, [])

  useEffect(() => {
    api.get('/UnassignedOrdersCount').then(response => {
      setOrdersUnassignedCount(response.data)
    })
  }, [])

  useEffect(() => {
    api.get('/NewOrders').then(response => {
      setNewOrders(response.data)
    })
  }, [])

  useEffect(() => {
    api.get('/CompletedOrders').then(response => {
      setCompletedOrders(response.data)
    })
  }, [])

  useEffect(() => {
    api.get('/CompletedOnWeek').then(response => {
      setCompletedOnWeek(response.data)
    })
  }, [])

  return (
    <div className="flex">
      <section className="w-full">
        <div className=" bg-off-white flex flex-col items-center h-screen">
          <div className="bg-off-white w-background-w h-fit pl-10 pt-8 pb-4 grid grid-cols-3">
            <DashCard icon={TbStar} title={'Ordens Completas'} mainValue={completedOrders} svgStroke={'#5051F9'} kpiValue={completedOnWeek} kpiColor={'text-[#299702]'} link={'/Summary'} />
            <DashCard icon={TbFileImport} title={'Novas Ordens'} mainValue={newOrders} svgStroke={'#1EA7FF'} kpiValue={newOrders} kpiColor={'text-[#1EA7FF]'} link={'/Summary '} />
            <DashCard icon={TbFileReport} title={'Ordens sem Atribuição'} mainValue={ordersUnassignedCount} svgStroke={'#F52104'} kpiValue={newOrders} kpiColor={'text-[#F52104]'} link={'/Backlog'} />
          </div>
          <div className="bg-off-white w-background-w grid col-span-3 h-fit pl-10 pt-4">
            <div className="bg-white w-graphic-w h-graphic-h rounded-2xl">
              <div className="w-full h-61 flex items-center justify-between pl-6 pr-24 pt-6">
                <div className="w-fit h-fit text-purple-dark text-2xl font-semibold pl-10">Ordens Completas vs Criadas</div>
                <div className="w-fit h-fit text-[#1EA7FF] text-lg font-medium pl-80">Semanal</div>
              </div>
              <div className="h-60 w-graphic-w pl-10 pt-8">
                <OrdersChart />
              </div>
            </div>
            <div className=" max-h-[230px] overflow-y-auto overflow-x-hidden scrollbar-hide mt-8">
              {orders?.map((order) => (
                <div
                  key={order.id}
                  className="bg-off-white w-background-w grid col-span-3 h-fit pb-8 gap-4">
                  <Reminder soNumber={order.id} soTitle={order.title} soCostumer={order.costumer.substring(7, 30)} />
                </div>
              ))}
            </div>
          </div>
        </div>
            <div className="bg-off-white h-16"></div>
      </section>
      <DashRightMenu />
    </div>
  )
}