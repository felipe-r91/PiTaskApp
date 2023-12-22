import { TbActivity, TbAlertTriangle, TbFileImport, TbFileReport, TbStar } from "react-icons/tb";
import { DashCard } from "./DashCard";
import { OrdersChart } from "./OrdersChart";
import { Reminder } from "./Reminder";
import { DashRightMenu } from "./DashRightMenu";
import { api } from "../lib/axios";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { OsStatusChart } from "./OsStatusChart";


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
  const [assignedOrders, setAssignedOrders] = useState<number>(0)
  dayjs.extend(weekOfYear)
  const todayWeek = dayjs().week()

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

  useEffect(() => {
    api.get('/AssignedOrdersCount').then(response => {
      setAssignedOrders(response.data)
    })
  }, [])

  return (
    <div className="flex h-[100vh]">
      <section className="w-full flex bg-off-white">
        <div>
          <div className="flex gap-8 pt-10 pl-10 pb-5">
            <DashCard icon={TbStar} title={'Ordens Completas'} mainValue={completedOrders} svgStroke={'#5051F9'} kpiValue={completedOnWeek} kpiColor={'text-[#299702]'} link={'/OsStatus'} />
            <DashCard icon={TbFileImport} title={'Novas Ordens'} mainValue={newOrders} svgStroke={'#1EA7FF'} kpiValue={newOrders} kpiColor={'text-[#1EA7FF]'} link={'/OsStatus '} />
            <DashCard icon={TbFileReport} title={'Ordens sem Atribuição'} mainValue={ordersUnassignedCount} svgStroke={'#F52104'} kpiValue={newOrders} kpiColor={'text-[#F52104]'} link={'/OsStatus'} />
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
            <div className=" max-h-[270px] overflow-y-auto overflow-x-hidden scrollbar-hide mt-8">
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
        <div className="flex justify-center w-full">
          <div className="pt-10">
            <div>
              <div className="bg-white rounded-xl h-[280px] w-[430px]">
                <div className="text-purple-dark font-bold text-xl pl-8 pt-6 flex gap-5 items-center">
                  <div className="bg-dashboard-icon w-9 h-9 rounded-full justify-center items-center">
                    <div className="p-1.5">
                      <TbActivity size={24} color="#8D98A9" />
                    </div>
                  </div>
                  <div>Status Totais</div>
                </div>
                <div className="pl-3 pt-3">
                  <div className="bg-[#E8EDF1] h-line-h w-[400px]"></div>
                </div>
                <div className="flex justify-center pt-6">
                  <OsStatusChart completedOrders={completedOrders} unassignedOrders={ordersUnassignedCount} assignedOrders={assignedOrders} />
                </div>
              </div>
            </div>
            <div className="pt-10 pr-8">
              <div className="bg-white rounded-xl h-[280px] w-[430px]">
                <div className="text-purple-dark font-bold text-xl pl-8 pt-6 flex gap-5 items-center">
                  <div className="bg-dashboard-icon w-9 h-9 rounded-full justify-center items-center">
                    <div className="p-1.5">
                      <TbAlertTriangle size={24} color="#8D98A9" />
                    </div>
                  </div>
                  <div className="flex gap-7">
                    <div>Finalizar nessa semana:</div>
                    <div>{todayWeek}</div>
                  </div>
                </div>
                <div className="pl-3 pt-3">
                  <div className="bg-[#E8EDF1] h-line-h w-[400px]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <DashRightMenu />
    </div>
  )
}