import { TbActivity, TbAlertTriangle, TbBuildingFactory2, TbDatabaseOff, TbFileReport, TbTargetArrow } from "react-icons/tb";
import { DashCard } from "./DashCard";
import { OrdersChart } from "./OrdersChart";
import { DashRightMenu } from "./DashRightMenu";
import { api } from "../lib/axios";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { OsStatusChart } from "./OsStatusChart";
import { DashCardGraph } from "./DashCardGraph";

type KpiPlanning = {
  totalPlannedHours: number,
  totalPerformedHours: number
}
type KpiResourceAllocation = {
  workerId: number;
  totalHours: string;
}[]

type OrderDetails = {
  id: number;
  bu: string;
  costumer: string;
}

export function Dashboard() {

  const [ordersUnassignedCount, setOrdersUnassignedCount] = useState<number>(0)
  const [KpiPlann, setKpiPlann] = useState<KpiPlanning>()
  const [KpiResource, setKpiResource] = useState<KpiResourceAllocation>()
  const [workersNumber, setWorkersNumber] = useState(0)
  const [ordersToFinish, setOrdersToFinish] = useState<number[]>([])
  const [allOrders, setAllOrders] = useState<OrderDetails[]>([])
  const [newOrders, setNewOrders] = useState<number>(0)
  const [completedOrders, setCompletedOrders] = useState<number>(0)
  const [assignedOrders, setAssignedOrders] = useState<number>(0)
  const [orderDetails, setOrderDetails] = useState<OrderDetails[]>([])
  const [showData, setShowData] = useState<boolean>(true)
  dayjs.extend(weekOfYear)
  const todayWeek = dayjs().week()

  useEffect(() => {
    api.get('/UnassignedOrdersCount').then(response => {
      setOrdersUnassignedCount(response.data)
    })
  }, [])

  useEffect(() => {
    api.get('/NewOrdersCount').then(response => {
      setNewOrders(response.data)
    })
  }, [])

  useEffect(() => {
    api.get('/CompletedOrdersCount').then(response => {
      setCompletedOrders(response.data)
    })
  }, [])

  useEffect(() => {
    api.get('/AssignedOrdersCount').then(response => {
      setAssignedOrders(response.data)
    })
  }, [])

  useEffect(() => {
    api.get('/KpiPlanning').then(response => {
      setKpiPlann(response.data)
    })
  }, [])

  useEffect(() => {
    api.get('/workers').then(response => {
      let total = 0
      response.data.forEach(() => {
        total += 1
      })
      setWorkersNumber(total)
    })
  }, [])

  useEffect(() => {
    api.get('/KpiResourceAllocation').then(response => {
      setKpiResource(response.data)
    })
  }, [])

  useEffect(() => {
    api.get('/FinishThisWeek').then(response => {
      setOrdersToFinish(response.data)
    })
  }, [])

  useEffect(() => {
    api.get('/AllOrders').then(response => {
      setAllOrders(response.data)
    })
  }, [])

  useEffect(() => {
    setOrderDetails(ordersToFinish
      .map((order) => allOrders.find((o) => o.id === order))
      .filter((order): order is OrderDetails => order !== undefined))
  }, [ordersToFinish, allOrders]);

  useEffect(() => {
    if (ordersToFinish.length === 0) {
      setShowData(false)
    } else {
      setShowData(true)
    }
  }, [ordersToFinish])


  function getAllWeekWorkedHours(data: KpiResourceAllocation | undefined) {
    const array = data?.map(totalWorkedHr => totalWorkedHr.totalHours)
    const totalWorkedHoursArray = array?.map(parseFloat)
    const totalWorkedHours = totalWorkedHoursArray?.reduce((acc, currVal) => {
      return acc += currVal
    }, 0)
    return totalWorkedHours
  }

  function buColor(bu: string) {
    switch (bu) {
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

  const KpiResourceData1 = getAllWeekWorkedHours(KpiResource)

  return (
    <div className="flex h-[100dvh]">
      <section className="w-full bg-off-white">
        <div className="flex">
          <div>
            <div className="flex gap-8 pt-10 pl-10 pb-5">
              <DashCard icon={TbFileReport} title={'Ordens sem Atribuição'} mainValue={ordersUnassignedCount} svgStroke={'#F52104'} kpiValue={newOrders} kpiColor={'text-[#F52104]'} link={'/OsStatus'} />
              <DashCardGraph icon={TbTargetArrow} title={`Planejamento S${todayWeek}`} label="Precisão" firstData={KpiPlann?.totalPlannedHours} secondData={KpiPlann?.totalPerformedHours} />
              <DashCardGraph icon={TbBuildingFactory2} title={`Utilização S${todayWeek}`} label="Total" firstData={KpiResourceData1} secondData={(workersNumber * 44)} />
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
                <div className="bg-white rounded-xl h-[295px] w-[430px]">
                  <div className="text-purple-dark font-bold text-xl pl-8 pt-6 flex gap-5 items-center">
                    <div className="bg-dashboard-icon w-9 h-9 rounded-full justify-center items-center">
                      <div className="p-1.5">
                        <TbAlertTriangle size={24} color="#8D98A9" />
                      </div>
                    </div>
                    <div className="flex gap-7">
                      <div>Finalizar nessa semana:</div>
                      <div>S{todayWeek}</div>
                    </div>
                  </div>
                  <div className="pl-3 pt-3">
                    <div className="bg-[#E8EDF1] h-line-h w-[400px]"></div>
                  </div>
                  {showData ? (
                    <div className=" justify-center items-center grid pt-5 max-h-[200px] overflow-auto scrollbar-hide">
                      {orderDetails.map((order) => (
                        <div key={order.id} className="pt-5">
                          <div className="flex gap-3">
                            <div className="text-purple-light font-semibold bg-[#EDECFE] w-14 flex justify-center h-6 rounded-md">{order.id}</div>
                            <div className={`${buColor(order.bu)} flex justify-center w-8 rounded-md`}>{order.bu}</div>
                            <div className="text-[#8D98A9]">{order.costumer.substring(7, 30)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid">
                      <div className="flex justify-center pt-12">
                        <TbDatabaseOff size={30} color="#8D98A9" />
                      </div>
                      <div className="pt-3 text-gray-light text-center">Sem dados suficientes</div>
                    </div>
                  )
                  }
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