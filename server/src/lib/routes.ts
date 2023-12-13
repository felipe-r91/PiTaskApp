import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { registerUserController } from "./user/user.controller";
import { userSchema } from "./user/user.schema";
import dayjs from "dayjs";
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { z } from "zod";
import { conn } from './db/mysqlconnection';
var customParseFormat = require('dayjs/plugin/customParseFormat')

interface Worker{
  id: number,
  name: string,
  surname: string,
  photo: string,
  workedHours?: number
}

interface WorkerData {
  worker_id: number;
  worker_hours: number;
}

interface GroupedData {
  [worker_id: number]: number;
}

export async function appRoutes(app: FastifyInstance) {

  app.get("/hello", async() =>{
    return 'helooo'
  })

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: '/profile',
    schema: {
      body: userSchema
    },
    handler: registerUserController
  })

  app.get('/workers', async () => {
    const [dbResponse] = await conn.execute('SELECT id, name, surname, role, email, photo, color FROM `users`');
    return dbResponse;
  })
  app.get('/AllOrders',async () => {
    const [dbResponse] = await conn.execute('SELECT * FROM `service_orders`')
    return dbResponse;
  })
  app.get('/NewOrders', async () => {
    const [dbResponse] = await conn.execute('SELECT id FROM `service_orders` WHERE `status` = ?', ['new'],); 
    let result = Object.values(JSON.parse(JSON.stringify(dbResponse)));
    var total = 0;
    result.forEach(() =>{
      total ++;
    })
    return total;
  })

  app.get('/UnassignedOrders', async () => {
    const [dbResponse] = await conn.execute('SELECT * FROM `service_orders` WHERE `status` = ? OR `status` = ?' , ['new', 'unassigned'],); 
    return dbResponse;
  })

  app.get('/GetUnassignedOrder', async (request) =>{
    const getOrderParam = z.object({
      orderId : z.string()
    })
    const { orderId } = getOrderParam.parse(request.query)
    const parsedOrderId = Number(orderId)
    const [dbResponse] = await conn.execute('SELECT id, title, costumer, description, annotation, planned_hours FROM `service_orders` WHERE `id` = ?', [parsedOrderId])
    return dbResponse;
  })

  app.get('/UnassignedOrdersCount', async () => {
    const [dbResponse] = await conn.execute('SELECT id FROM `service_orders` WHERE `status` = ? OR `status` = ?', ['new', 'unassigned'],); 
    let result = Object.values(JSON.parse(JSON.stringify(dbResponse)));
    var total = 0;
    result.forEach(() =>{
      total ++;
    })
    return total;
  })
  app.get('/AssignedOrdersCount', async () => {
    const [dbResponse] = await conn.execute('SELECT id FROM `service_orders` WHERE `status` = ?', ['assigned'],); 
    let result = Object.values(JSON.parse(JSON.stringify(dbResponse)));
    var total = 0;
    result.forEach(() =>{
      total ++;
    })
    return total;
  })

  app.get('/CompletedOrders', async () => {
    const [dbResponse] = await conn.execute('SELECT id FROM `service_orders` WHERE `status` = ?', ['completed'],); 
    let result = Object.values(JSON.parse(JSON.stringify(dbResponse)));
    var total = 0;
    result.forEach(() =>{
      total ++;
    })
    return total;
  })

  app.get('/CompletedOnWeek', async () => {
    dayjs.extend(weekOfYear)
    const todayWeek = dayjs().week()

    const [dbResponse] = await conn.execute('SELECT id FROM `service_orders` WHERE `completed_at` = ?', [todayWeek],); 
    let result = Object.values(JSON.parse(JSON.stringify(dbResponse)));
    var total = 0;
    result.forEach(() =>{
      total ++;
    })
    return total;

  })

  app.get('/WeeklyNewOrders', async (request) => {
    const getWeekParams = z.object({
      weekNumber : z.string()
    })
    const { weekNumber } = getWeekParams.parse(request.query)
    const parsedWeekNumber = Number(weekNumber)

    const [dbResponse] = await conn.execute('SELECT id FROM `service_orders` WHERE `created_at` = ?', [parsedWeekNumber],); 
    let result = Object.values(JSON.parse(JSON.stringify(dbResponse)));
    var total = 0;
    result.forEach(() =>{
      total ++;
    })
    return total;
  })

  app.get('/WeeklyCompletedOrders', async (request) => {
    const getWeekParams = z.object({
      weekNumber : z.string()
    })
    const { weekNumber } = getWeekParams.parse(request.query)
    const parsedWeekNumber = Number(weekNumber)

    const [dbResponse] = await conn.execute('SELECT id FROM `service_orders` WHERE `completed_at` = ?', [parsedWeekNumber],); 
    let result = Object.values(JSON.parse(JSON.stringify(dbResponse)));
    var total = 0;
    result.forEach(() =>{
      total ++;
    })
    return total;
  })

  app.post('/AssignOrderStep1', async (request) => {
    const updateOrder = z.object({
      osWorker: z.number().array(),
      osId: z.number(),
      osBu: z.string(),
      osDate: z.string(),
      osHours: z.number(),
      osAnnotation: z.string()
    })
    const { osId, osBu, osDate, osHours, osAnnotation, osWorker } = updateOrder.parse(request.body)
    const osWorkerId: number[] = []
    osWorker.forEach(worker => {
      worker = worker + 1
      osWorkerId.push(worker)
    });

    dayjs.extend(customParseFormat)
    const osDateCorrect = dayjs(osDate).startOf('day').toDate()

    await conn.execute('UPDATE `service_orders` SET `bu` = ?, `start_date` = ?, `planned_hours` = ?, `annotation` = ?, `assigned_workers_id` = ? WHERE `id` = ?', 
    [osBu, osDateCorrect, osHours, osAnnotation, osWorkerId, osId])
       
  })

  app.post('/AssignOrderStep2', async (request) =>{

    const assignOrder = z.object({
      orderDetails : z.object( {
        id: z.number(),
        workerName: z.string(),
        workerOsHours: z.number(),
        workerOsDate: z.string(),
        startHour : z.string(),
        endHour : z.string(),
        sequentialDays: z.number(),
        osStatus: z.string(),
        orderId: z.number(),
        assignMode: z.boolean()
      }).array()
    })

    const orderDetailsParsed = assignOrder.parse(request.body)  
    const { osStatus, orderId, assignMode } = orderDetailsParsed.orderDetails[0]
    var updatedWorkerHours = 0    
    await conn.execute('UPDATE `service_orders` SET `status` = ? WHERE `id` = ?', [osStatus, orderId])

    orderDetailsParsed.orderDetails.forEach(async (element) => {
      const startDateTime = dayjs(element.workerOsDate.concat(' ').concat(element.startHour)).format('YYYY-MM-DDTHH:mm:ss')
      const endDateTime = dayjs(element.workerOsDate.concat(' ').concat(element.endHour)).format('YYYY-MM-DDTHH:mm:ss')

      if(element.sequentialDays === 0){  
        await conn.execute('INSERT INTO assigned_os (worker_id, worker_name, worker_hours, start_date, end_date, order_id) VALUES (?, ?, ?, ?, ?, ?)', [element.id, element.workerName, element.workerOsHours, startDateTime, endDateTime, element.orderId])
      }

      if(element.sequentialDays != 0){
        const startDay = dayjs(startDateTime).date()
        const Month = ((dayjs(startDateTime).month())+1)
        const Year = (dayjs(startDateTime).year())
        if(assignMode){
          updatedWorkerHours = element.workerOsHours / element.sequentialDays
        } else{
          updatedWorkerHours = element.workerOsHours
        }
        for(element.sequentialDays; element.sequentialDays > 0; element.sequentialDays--){
          var endDay = startDay + (element.sequentialDays - 1)
          var endDate = Year.toString().concat('-').concat(Month.toString()).concat('-').concat(endDay.toString())
          var startDateTimeSequential = dayjs(endDate.concat(' ').concat(element.startHour)).format('YYYY-MM-DDTHH:mm:ss')
          var endDateTimeSequential = dayjs(endDate.concat(' ').concat(element.endHour)).format('YYYY-MM-DDTHH:mm:ss')

          await conn.execute('INSERT INTO assigned_os (worker_id, worker_name, worker_hours, start_date, end_date, order_id) VALUES (?, ?, ?, ?, ?, ?)', [element.id, element.workerName, updatedWorkerHours, startDateTimeSequential, endDateTimeSequential, element.orderId])
        }
      }
    })


  })

  app.get('/AssignedOrders',async () => {
    const [dbResponse] = await conn.execute('SELECT assigned_os.id, assigned_os.order_id, assigned_os.worker_name, assigned_os.worker_id, assigned_os.worker_hours, assigned_os.start_date, assigned_os.end_date, service_orders.status, service_orders.costumer, service_orders.bu, service_orders.description, service_orders.assigned_workers_id, service_orders.title, service_orders.planned_hours, service_orders.performed_hours, service_orders.lms, service_orders.created_at, service_orders.completed_at  FROM assigned_os INNER JOIN service_orders ON assigned_os.order_id = service_orders.id');
    return dbResponse;
  })

  app.get('/osWorkers', async (request) =>{

    const getOsParams = z.object({
      workerId: z.string()
    })

    const { workerId } = getOsParams.parse(request.query)
    var parsedQuery = JSON.parse('['+ workerId +']')
    const osWorkerId: number[] = []
    parsedQuery.forEach((worker: number) => {
      worker = worker + 1
      osWorkerId.push(worker)
    });
    const [dbResponse] = await conn.execute('SELECT id, name, surname, photo FROM `users`');
    var json = JSON.parse(JSON.stringify(dbResponse))

    const osWorker: Worker[] = []
    
    for(var i = 0; json.length > i; i++){
      osWorkerId.forEach((worker) => {
        if(worker === json[i].id){
          const workerOs = {
            id : json[i].id,
            name : json[i].name,
            surname : json[i].surname,
            photo : json[i].photo
          }
          osWorker.push(workerOs)
        }
      })
    }
    return osWorker;
    
  })

  app.get('/osWorkersConcludeForm',async (request) => {
    const reqParams = z.object({
      workerId: z.string(),
      orderId: z.string()
    })
    const { workerId } = reqParams.parse(request.query)
    const { orderId } = reqParams.parse(request.query)
    const osWorkerId : number[] = JSON.parse(workerId)
    
    const [dbResponse] = await conn.execute('SELECT id, name, surname, photo FROM `users`');
    var json = JSON.parse(JSON.stringify(dbResponse))

    const[dbResponse1] = await conn.execute('SELECT worker_id, worker_hours FROM `assigned_os` WHERE `order_id` = ?', [orderId])
    var json1 = JSON.parse(JSON.stringify(dbResponse1))
    
    const groupedData: GroupedData = json1.reduce((result: GroupedData, entry: WorkerData) => {
      const { worker_id, worker_hours } = entry;
      if (!result[worker_id]) {
        result[worker_id] = 0;
      }
      result[worker_id] += worker_hours;
      return result;
    }, {});
        
    const osWorker: Worker[] = []
    
    for(var i = 0; json.length > i; i++){
      osWorkerId.forEach((worker) => {
        if(worker === json[i].id){
          const workerOs = {
            id : json[i].id,
            name : json[i].name,
            surname : json[i].surname,
            photo : json[i].photo,
            workedHours: groupedData[worker]
          }
          osWorker.push(workerOs)
        }
      })
    }
    return osWorker;

  })

  app.post('/ConcludeForm',async (request) => {
    const concludeOrder = z.object({
      orderId : z.number(),
      lms : z.number().array(),
      dateTimeNow: z.string(),
      totalWorkedHours: z.number().array()
    })
    const { orderId, lms, dateTimeNow, totalWorkedHours } = concludeOrder.parse(request.body)
    dayjs.extend(weekOfYear)
    const completedWeek = dayjs(dateTimeNow).week()
    const perfomedHours = totalWorkedHours.reduce((acc, currValue) => {
      return acc += currValue;
    }, 0)
    const workersCount = totalWorkedHours.length    
    await conn.execute('UPDATE `service_orders` SET `status` = ?, `lms` = ?, `end_date` = ?, `completed_at` = ?, `performed_hours` = ?, `workers_qnt` = ? WHERE `id` = ?', ['completed', lms, dateTimeNow, completedWeek, perfomedHours, workersCount, orderId])
  })

  app.get('/TodayAgenda',async () => {
    //to-do
  })
}


