import { FastifyInstance } from "fastify";
import dayjs from "dayjs";
import weekOfYear from 'dayjs/plugin/weekOfYear';
import isBetween from 'dayjs/plugin/isBetween';
import { z } from "zod";
import { connection } from './db/mysqlconnection1';
import { hashPass, verifyPass } from "./user/hashPass";
var customParseFormat = require('dayjs/plugin/customParseFormat');
import multer from 'fastify-multer';
let uniqueFileName: string

const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, '/home/orangepi/Downloads/web/src/assets/uploads')
  },
  filename: function(req, file, cb){
    uniqueFileName = Date.now().toString().concat(file.originalname)
    cb(null, uniqueFileName)
  }
})
const upload = multer({ storage: storage });
import {FastifyReply, FastifyRequest } from "fastify";

interface CustomFastifyRequest extends FastifyRequest {
  file?: {
    buffer: Buffer;
    encoding: string;
    fieldname: string;
    mimetype: string;
    originalname: string;
    size: number;
  };
}


interface Worker{
  id: number,
  name: string,
  surname: string,
  photo: string,
  workedHours?: string
}

interface WorkerData {
  worker_id: number;
  worker_hours: string;
}

interface GroupedData {
  [worker_id: number]: string;
}

export async function appRoutes(app: FastifyInstance) {

  app.get("/hello", async() =>{
    return 'helooo'
  })

  app.post('/userLogin', async (request, response) => {
    const userData = z.object({
      user: z.string(),
      password: z.string()
    })
    const conn = await connection()
    const { user, password } = userData.parse(request.body)
    const query = 'SELECT * FROM users WHERE name = ?'
    const query1 = 'SELECT * FROM admins WHERE name = ?'
    const dbResponse = await conn.query(query, [user])
    const dbResponse1 = await conn.query(query1, [user])
    let userRecord: any = dbResponse1[0]
    let role: string = ''
    if (dbResponse.length === 0 && dbResponse1.length === 0){
      response.status(401).send({ error: 'Invalid Credentials' })
    }
    if(dbResponse.length > 0){
      userRecord = dbResponse
    }
    if(dbResponse1.length > 0){
      userRecord = dbResponse1
      userRecord.role = 'admin'
    }

    const passwordMatch = verifyPass(password, userRecord.password)

    if(!passwordMatch){
      response.status(401).send({ error: 'Invalid Credentials pass'})
    }else {
      response.status(200).send({ message: 'Login Successful', id: userRecord.id, role: userRecord.role})
    }
    conn.release()
  })

  app.get('/userLogged', async (request) => {
    const user = z.object({
      userId: z.string(),
      role: z.string()
    })
    const conn = await connection()
    const { userId, role } = user.parse(request.query)
    if(role === 'admin'){
      const dbResponse = await conn.query('SELECT * FROM admins WHERE id = ?', [userId])
      return dbResponse
    } else {
      const dbResponse = await conn.query('SELECT * FROM users WHERE id = ?', [userId])
      return dbResponse
    }
    conn.release()
  })

 app.post('/profile', {preHandler: upload.single('photo')},  async function( request: CustomFastifyRequest, reply: FastifyReply ){
  
    const formFields = z.object({
      name: z.string(),
      surname: z.string(),
      password: z.string(),
      email: z.string(),
      role: z.string(),
      phone: z.string()
    })
    const conn = await connection()
    const { name, surname, password, email, role, phone } = formFields.parse(request.body)
    const { hashedPass } = hashPass(password)
    if(role === 'admin'){
      await conn.query('INSERT INTO admins (name, surname, password, photo) VALUES (?, ?, ?, ?)', [name, surname, hashedPass, uniqueFileName])
    } else {
      await conn.query('INSERT INTO users (name, surname, role, email, password, photo, phone) VALUES (?, ?, ?, ?, ?, ?, ?)', [name, surname, role, email, hashedPass, uniqueFileName, phone])
    }
    conn.release()
  });

  app.get('/workers', async () => {
    const conn = await connection()
    const dbResponse = await conn.query('SELECT * FROM users');
    conn.release()
    return dbResponse;
  })

  app.get('/AllOrders',async () => {
    const conn = await connection()
    const dbResponse = await conn.query('SELECT * FROM `service_orders`')
    conn.release()
    return dbResponse;
  })

  app.get('/NewOrders', async () => {
    const conn = await connection()
    const dbResponse = await conn.query('SELECT id, created_at FROM service_orders')
    conn.release()
    return dbResponse;
  })

  app.get('/CompletedOrders', async () => {
    const conn = await connection()
    const [dbResponse] = await conn.query('SELECT id, completed_at FROM service_orders WHERE status = ?', ['completed'])
    conn.release()
    return dbResponse;
  })

  app.get('/NewOrdersCount', async () => {
    const conn = await connection()
    const dbResponse = await conn.query('SELECT id FROM `service_orders` WHERE `status` = ?', ['new'],); 
    let result = Object.values(JSON.parse(JSON.stringify(dbResponse)));
    var total = 0;
    result.forEach(() =>{
      total ++;
    })
    conn.release()
    return total;
  })

  app.get('/UnassignedOrders', async () => {
    const conn = await connection()
    const dbResponse = await conn.query('SELECT * FROM `service_orders` WHERE `status` = ? OR `status` = ?' , ['new', 'unassigned'],); 
    conn.release()
    return dbResponse;
  })

  app.get('/GetUnassignedOrder', async (request) =>{
    const getOrderParam = z.object({
      orderId : z.string()
    })
    const conn = await connection()
    const { orderId } = getOrderParam.parse(request.query)
    const parsedOrderId = Number(orderId)
    const dbResponse = await conn.query('SELECT id, title, costumer, description, annotation, planned_hours FROM `service_orders` WHERE `id` = ?', [parsedOrderId])
    conn.release()
    return dbResponse;
  })

  app.get('/UnassignedOrdersCount', async () => {
    const conn = await connection()
    const dbResponse = await conn.query('SELECT id FROM `service_orders` WHERE `status` = ? OR `status` = ?', ['new', 'unassigned'],); 
    let result = Object.values(JSON.parse(JSON.stringify(dbResponse)));
    var total = 0;
    result.forEach(() =>{
      total ++;
    })
    conn.release()
    return total;
  })
  app.get('/AssignedOrdersCount', async () => {
    const conn = await connection()
    const dbResponse = await conn.query('SELECT id FROM `service_orders` WHERE `status` = ?', ['assigned'],); 
    let result = Object.values(JSON.parse(JSON.stringify(dbResponse)));
    var total = 0;
    result.forEach(() =>{
      total ++;
    })
    conn.release()
    return total;
  })

  app.get('/CompletedOrdersCount', async () => {
    const conn = await connection()
    const dbResponse = await conn.query('SELECT id FROM `service_orders` WHERE `status` = ?', ['completed'],); 
    let result = Object.values(JSON.parse(JSON.stringify(dbResponse)));
    var total = 0;
    result.forEach(() =>{
      total ++;
    })
    conn.release()
    return total;
  })

  app.get('/CompletedOnWeek', async () => {
    dayjs.extend(weekOfYear)
    const todayWeek = dayjs().week()

    const conn = await connection()
    const dbResponse = await conn.query('SELECT id FROM `service_orders` WHERE `completed_at` = ?', [todayWeek],); 
    let result = Object.values(JSON.parse(JSON.stringify(dbResponse)));
    var total = 0;
    result.forEach(() =>{
      total ++;
    })
    conn.release()
    return total;

  })

  app.get('/WeeklyNewOrders', async (request) => {
    const getWeekParams = z.object({
      weekNumber : z.string()
    })
    const { weekNumber } = getWeekParams.parse(request.query)
    const parsedWeekNumber = Number(weekNumber)

    const conn = await connection()
    const dbResponse = await conn.query('SELECT id FROM `service_orders` WHERE `created_at` = ?', [parsedWeekNumber],); 
    let result = Object.values(JSON.parse(JSON.stringify(dbResponse)));
    var total = 0;
    result.forEach(() =>{
      total ++;
    })
    conn.release()
    return total;
  })

  app.get('/WeeklyCompletedOrders', async (request) => {
    const getWeekParams = z.object({
      weekNumber : z.string()
    })
    const { weekNumber } = getWeekParams.parse(request.query)
    const parsedWeekNumber = Number(weekNumber)

    const conn = await connection()
    const dbResponse = await conn.query('SELECT id FROM `service_orders` WHERE `completed_at` = ?', [parsedWeekNumber],); 
    let result = Object.values(JSON.parse(JSON.stringify(dbResponse)));
    var total = 0;
    result.forEach(() =>{
      total ++;
    })
    conn.release()
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

    dayjs.extend(customParseFormat)
    const osDateCorrect = dayjs(osDate).startOf('day').toDate()

    const conn = await connection()
    await conn.query('UPDATE `service_orders` SET `bu` = ?, `start_date` = ?, `planned_hours` = ?, `annotation` = ?, `assigned_workers_id` = ? WHERE `id` = ?', 
    [osBu, osDateCorrect, osHours, osAnnotation, osWorker, osId])
    conn.release() 
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

    const conn = await connection()
    const orderDetailsParsed = assignOrder.parse(request.body)  
    const { osStatus, orderId, assignMode } = orderDetailsParsed.orderDetails[0]
    var updatedWorkerHours = 0    
    await conn.query('UPDATE `service_orders` SET `status` = ? WHERE `id` = ?', [osStatus, orderId])

    orderDetailsParsed.orderDetails.forEach(async (element) => {
      const startDateTime = dayjs(element.workerOsDate.concat(' ').concat(element.startHour)).format('YYYY-MM-DDTHH:mm:ss')
      const endDateTime = dayjs(element.workerOsDate.concat(' ').concat(element.endHour)).format('YYYY-MM-DDTHH:mm:ss')

      if(element.sequentialDays === 0){  
        await conn.query('INSERT INTO assigned_os (worker_id, worker_name, worker_hours, start_date, end_date, order_id) VALUES (?, ?, ?, ?, ?, ?)', [element.id, element.workerName, element.workerOsHours, startDateTime, endDateTime, element.orderId])
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

          await conn.query('INSERT INTO assigned_os (worker_id, worker_name, worker_hours, start_date, end_date, order_id) VALUES (?, ?, ?, ?, ?, ?)', [element.id, element.workerName, updatedWorkerHours, startDateTimeSequential, endDateTimeSequential, element.orderId])
        }
      }
    })
    conn.release()

  })

  app.get('/AssignedOrders',async () => {
    const conn = await connection()
    const dbResponse = await conn.query('SELECT assigned_os.id, assigned_os.order_id, assigned_os.worker_name, assigned_os.worker_id, assigned_os.worker_hours, assigned_os.start_date, assigned_os.end_date, service_orders.status, service_orders.costumer, service_orders.bu, service_orders.description, service_orders.assigned_workers_id, service_orders.title, service_orders.planned_hours, service_orders.performed_hours, service_orders.lms, service_orders.created_at, service_orders.completed_at  FROM assigned_os INNER JOIN service_orders ON assigned_os.order_id = service_orders.id');
    conn.release()
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
      osWorkerId.push(worker)
    });
    const conn = await connection()
    const dbResponse = await conn.query('SELECT id, name, surname, photo FROM `users`');
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
    conn.release()
    return osWorker;
    
  })

  app.get('/osWorkersConcludeForm', async (request) => {
    const reqParams = z.object({
      orderId: z.string()
    })
  
    const { orderId } = reqParams.parse(request.query)
    
    const conn = await connection()
    const dbResponse = await conn.query('SELECT `assigned_workers_id` FROM `service_orders` WHERE `id` = ?', [orderId])
    const osWorkerId = (dbResponse as any).map((row: { assigned_workers_id: any; }) => row.assigned_workers_id);
    const dbResponse1 = await conn.query('SELECT id, name, surname, photo FROM `users`');
    const json = JSON.parse(JSON.stringify(dbResponse1));
  
    const dbResponse2 = await conn.query('SELECT worker_id, worker_hours FROM `assigned_os` WHERE `order_id` = ?', [orderId])
    const json1 = JSON.parse(JSON.stringify(dbResponse2));
  
    const groupedData: GroupedData = json1.reduce((result: GroupedData, entry: WorkerData) => {
      const { worker_id, worker_hours } = entry;
      if (!result[worker_id]) {
        result[worker_id] = '0.00';
      }
      // Treat worker_hours as a string when accumulating
      result[worker_id] = (parseFloat(result[worker_id]) + parseFloat(worker_hours)).toFixed(2);
      return result;
    }, {});
  
    const osWorker: Worker[] = []
  
    for (let i = 0; json.length > i; i++) {
      osWorkerId.forEach((worker: any) => {
        if (worker === json[i].id) {
          const workerOs = {
            id: json[i].id,
            name: json[i].name,
            surname: json[i].surname,
            photo: json[i].photo,
            workedHours: groupedData[worker]
          }
          osWorker.push(workerOs)
        }
      })
    }
    conn.release()
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
    const conn = await connection() 
    await conn.query('UPDATE `service_orders` SET `status` = ?, `lms` = ?, `end_date` = ?, `completed_at` = ?, `performed_hours` = ?, `workers_qnt` = ? WHERE `id` = ?', ['completed', lms, dateTimeNow, completedWeek, perfomedHours, workersCount, orderId])
    conn.release()
  })

  app.get('/TodayAgenda',async () => {
    const todayZeroHour = dayjs().format('YYYY-MM-DD').concat('T00:00:00')
    const todayLastHour = dayjs().format('YYYY-MM-DD').concat('T23:59:00')
    const query = 'SELECT DISTINCT assigned_os.order_id, assigned_os.worker_id, service_orders.costumer FROM assigned_os JOIN service_orders ON assigned_os.order_id = service_orders.id WHERE assigned_os.start_date >= ? AND assigned_os.end_date <= ? AND service_orders.status <> ?'
    const conn = await connection()
    const dbResponse = await conn.query(query, [todayZeroHour, todayLastHour, 'completed'])
    const aggregatedResults: Record<number, { orderId: number; costumer: string; workersId: number[] }> = {};

    (dbResponse as any).forEach((item: { order_id: any; costumer: any; worker_id: any; }) => {
      const { order_id, costumer, worker_id } = item;
    
      // If orderId is not in the aggregatedResults object, create an entry
      if (!aggregatedResults[order_id]) {
        aggregatedResults[order_id] = {
          orderId: order_id,
          costumer: costumer,
          workersId: [worker_id],
        };
      } else {
        // If orderId is already in the object, push the worker_id to the workersId array
        aggregatedResults[order_id].workersId.push(worker_id);
      }
    });
    
    // Convert the object values into an array
    const resultArray = Object.values(aggregatedResults);
    conn.release()
    return resultArray;
  })

  app.post('/EditOrder',async (request) => {
    const editOrder = z.object({
      orderId: z.number(),
      workersToDelete: z.number().array(),
      workersIdToUpdate: z.number().array()
    })
    const conn = await connection()
    const updateOrder = editOrder.parse(request.body)
    const { orderId, workersToDelete, workersIdToUpdate} = updateOrder
    const assignedWorkersId = '['.concat(workersIdToUpdate.toString()).concat(']')
    workersToDelete.forEach(async worker => {
      await conn.query('DELETE FROM `assigned_os` WHERE `worker_id` = ? AND `order_id` = ?', [worker, orderId])
    })
    await conn.query('UPDATE `service_orders` SET `assigned_workers_id` = ? WHERE `id` = ?', [assignedWorkersId, orderId])
    conn.release()
  })

  app.get('/AssignedWorkersForOS', async (request) =>{
    const getWorkersId = z.object({
      orderId: z.string()
    })
    const conn = await connection()
    const { orderId } = getWorkersId.parse(request.query)
    const dbResponse = await conn.query('SELECT `assigned_workers_id` FROM `service_orders` WHERE `id` = ?', [orderId])
    conn.release()
    return dbResponse;
  })

  app.post('/AddWorkerToOS',async (request) => {
    const updateData = z.object({
      orderId: z.number(),
      workersId: z.number().array()
    })

    const { orderId, workersId } = updateData.parse(request.body)
    const uniqueWid = new Set<number>()
    workersId.forEach((worker) => {
      if(!uniqueWid.has(worker)){
        uniqueWid.add(worker)
      }
    })
    const conn = await connection()
    const workersIdDb = Array.from(uniqueWid)
    await conn.query('UPDATE `service_orders` SET `assigned_workers_id` = ? WHERE `id` = ?', [workersIdDb, orderId])
    conn.release()
  })

  app.post('/TimelineUpdateEventDate',async (request) => {
    const updateEventDate = z.object({
      eventId: z.string().optional(),
      newEventDate: z.string(),
      idToUpdate: z.number(),
      nameToUpdate: z.string(),
      orderId: z.number()
    })

    const conn = await connection()
    const { eventId, newEventDate, idToUpdate, nameToUpdate, orderId} = updateEventDate.parse(request.body)
    const fixedDate = newEventDate.substring(0, 10)
    const query = `UPDATE assigned_os SET worker_name = ?, worker_id = ?, start_date = CONCAT(?, 'T', SUBSTRING(start_date, 12)), end_date = CONCAT(?, 'T', SUBSTRING(end_date, 12)) WHERE id = ?`
    await conn.query(query, [nameToUpdate, idToUpdate, fixedDate, fixedDate, eventId])
    const dbResponse = await conn.query('SELECT DISTINCT worker_id FROM assigned_os WHERE order_id = ?', [orderId])
    const workerIdsArray = (dbResponse as any).map((row: { worker_id: any; }) => row.worker_id);
    const jsonIds = JSON.stringify(workerIdsArray)
    await conn.query('UPDATE service_orders SET assigned_workers_id = ? WHERE id = ?', [jsonIds, orderId])
    conn.release()
  })

  app.post('/CalendarEventMoved',async (request) => {
    const updateEvent = z.object({
      eventId: z.string(),
      newEventStart: z.string(),
      newEventEnd: z.string(),
      resourceId: z.string(),
      orderId: z.number()
    })
    const conn = await connection()
    const { eventId, newEventStart, newEventEnd, resourceId, orderId} = updateEvent.parse(request.body)
    let workerName: string
    const dbWorkerName = await conn.query('SELECT name FROM users WHERE id = ?',[resourceId])
    if (dbWorkerName.length > 0) {
      workerName = dbWorkerName[0].name;
      
    } else {
      // Handle the case where the result array is empty
      console.log('No worker found for the given ID');
      workerName = ''
    }
    await conn.query('UPDATE assigned_os SET worker_name = ?, worker_id = ?, start_date = ?, end_date = ? WHERE id = ?', [workerName, resourceId, newEventStart, newEventEnd, eventId])
    const dbResponse = await conn.query('SELECT DISTINCT worker_id FROM assigned_os WHERE order_id = ?', [orderId])
    const workerIdsArray = (dbResponse as any).map((row: { worker_id: any; }) => row.worker_id);
    const jsonIds = JSON.stringify(workerIdsArray)
    await conn.query('UPDATE service_orders SET assigned_workers_id = ? WHERE id = ?', [jsonIds, orderId])
    conn.release()
  })

  app.post('/CalendarEventResized',async (request) => {
    const updateEvent = z.object({
      eventId: z.string(),
      newEventStart: z.string(),
      newEventEnd: z.string()
    })

    const { eventId, newEventStart, newEventEnd} = updateEvent.parse(request.body)
    const startDate = dayjs(newEventStart)
    const endDate = dayjs(newEventEnd)
    const diff = endDate.diff(startDate)
    const workHours = diff/3600000
    const conn = await connection()
    await conn.query('UPDATE assigned_os SET worker_hours = ?, start_date = ?, end_date = ? WHERE id = ?',[workHours,newEventStart, newEventEnd, eventId])
    conn.release()
  })

  app.get('/KpiPlanning', async () => {
    dayjs.extend(weekOfYear)
    const todayWeek = dayjs().week()

    const conn = await connection()
    const dbResponse = await conn.query('SELECT performed_hours, planned_hours FROM service_orders WHERE status = ? AND completed_at = ?', ['completed', todayWeek])
    const plannedHoursArray = (dbResponse as any).map((row: { planned_hours: any; }) => row.planned_hours)
    const perfomedHoursArray = (dbResponse as any).map((row: { performed_hours: any; }) => row.performed_hours)
    const totalPlannedHours = plannedHoursArray.reduce((acc: any, currValue: any) => {
      return acc += currValue
    }, 0)
    const totalPerformedHours = perfomedHoursArray.reduce((acc: any, currValue: any) => {
      return acc += currValue
    }, 0)
    conn.release()
    return {totalPlannedHours, totalPerformedHours}
  })

  app.get('/KpiResourceAllocation', async () => {
    const currentDate = dayjs()
    const daysUntilSunday = (currentDate.day() + 7 ) % 7
    const firstDayOfWeek = currentDate.subtract(daysUntilSunday, 'day').startOf('day')
    const lastDayOfWeek = firstDayOfWeek.add(6, 'days')
    const queryFirstDay = firstDayOfWeek.format('YYYY-MM-DD').concat('T00:00:00')
    const queryLastDay = lastDayOfWeek.format('YYYY-MM-DD').concat('T00:00:00')
    const query = 'SELECT worker_id, SUM(worker_hours) as total_hours FROM assigned_os WHERE start_date BETWEEN ? AND ? GROUP BY worker_id'
    const conn = await connection()
    const dbResponse = await conn.query(query, [queryFirstDay, queryLastDay])
    const result = (dbResponse as any).map((row: { worker_id: any; total_hours: any; }) => ({
      workerId: row.worker_id,
      totalHours: row.total_hours
    }))
    conn.release()
    return result;
  })

  app.get('/FinishThisWeek', async () => {

    const currentDate = dayjs()
    const daysUntilSunday = (currentDate.day() + 7) % 7
    const firstDayOfWeek = currentDate.subtract(daysUntilSunday, 'day').startOf('day')
    const lastDayOfWeek = firstDayOfWeek.add(6, 'days')
    const latestEndDateQuery = 'SELECT order_id, MAX(end_date) AS latest_end_date FROM assigned_os GROUP BY order_id';
    const conn = await connection()
    const latestEndDateResult = await conn.query(latestEndDateQuery);
    const ordersToFinish = (latestEndDateResult as any).map((order: { latest_end_date: string | number | Date | dayjs.Dayjs | null | undefined; order_id: any; }) => {
      dayjs.extend(isBetween)
      if(dayjs(order.latest_end_date).isBetween(dayjs(firstDayOfWeek), dayjs(lastDayOfWeek), 'day', '[]')){
        return order.order_id
      } else {
        return null
      }
    }).filter((orderId: any) => orderId !== null)
    conn.release()
    return ordersToFinish
  })
  app.get('/AllEvents', async () => {
    const conn = await connection()
    const dbResponse = await conn.query('SELECT assigned_os.order_id, assigned_os.worker_id, service_orders.costumer, service_orders.bu, assigned_os.start_date, service_orders.status FROM assigned_os INNER JOIN service_orders WHERE assigned_os.order_id = service_orders.id')
    conn.release()
    return dbResponse
  })
}

