import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { registerUserController } from "./user/user.controller";
import { userSchema } from "./user/user.schema";
import dayjs from "dayjs";
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { z } from "zod";
import { conn } from './db/mysqlconnection';
var customParseFormat = require('dayjs/plugin/customParseFormat')

interface Worker {
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

  app.get("/hello", async () => {
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

  // Route to get all workers
  app.get('/workers', async (request, reply) => {
    try {
      const [dbResponse] = await conn.query('SELECT id, name, surname, role, email, photo, color FROM `users`');
      reply.send(dbResponse);
    } catch (error) {
      console.error('Error executing query:', error);
      reply.status(500).send('Internal Server Error');
    }
  });

  // Route to get all service orders
  app.get('/AllOrders', async (request, reply) => {
    try {
      const [dbResponse] = await conn.query('SELECT * FROM `service_orders`');
      reply.send(dbResponse);
    } catch (error) {
      console.error('Error executing query:', error);
      reply.status(500).send('Internal Server Error');
    }
  });

  // Route to get the count of new orders
  app.get('/NewOrders', async (request, reply) => {
    try {
      const [dbResponse] = await conn.query('SELECT id FROM `service_orders` WHERE `status` = ?', ['new']);
      let result = Object.values(JSON.parse(JSON.stringify(dbResponse)));
      var total = 0;
      result.forEach(() => {
        total++;
      })
      reply.send(total);
    } catch (error) {
      console.error('Error executing query:', error);
      reply.status(500).send('Internal Server Error');
    }
  });

  // Route to get unassigned orders
  app.get('/UnassignedOrders', async (request, reply) => {
    try {
      const [dbResponse] = await conn.query('SELECT * FROM `service_orders` WHERE `status` IN (?, ?)', ['new', 'unassigned']);
      reply.send(dbResponse);
    } catch (error) {
      console.error('Error executing query:', error);
      reply.status(500).send('Internal Server Error');
    }
  });

  // Route to get a specific unassigned order
  app.get('/GetUnassignedOrder', async (request, reply) => {
    try {
      const getOrderParam = z.object({
        orderId: z.string(),
      });
      const { orderId } = getOrderParam.parse(request.query);
      const parsedOrderId = Number(orderId);
      const [dbResponse] = await conn.query('SELECT id, title, costumer, description, annotation, planned_hours FROM `service_orders` WHERE `id` = ?', [parsedOrderId]);
      reply.send(dbResponse);
    } catch (error) {
      console.error('Error executing query:', error);
      reply.status(500).send('Internal Server Error');
    }
  });

  // Route to get the count of unassigned orders
  app.get('/UnassignedOrdersCount', async (request, reply) => {
    try {
      const [dbResponse] = await conn.query('SELECT id FROM `service_orders` WHERE `status` IN (?, ?)', ['new', 'unassigned']);
      let result = Object.values(JSON.parse(JSON.stringify(dbResponse)));
      var total = 0;
      result.forEach(() => {
        total++;
      })
      reply.send(total);
    } catch (error) {
      console.error('Error executing query:', error);
      reply.status(500).send('Internal Server Error');
    }
  });

  // Route to get the count of completed orders
  app.get('/CompletedOrders', async (request, reply) => {
    try {
      const [dbResponse] = await conn.query('SELECT id FROM `service_orders` WHERE `status` = ?', ['completed']);
      let result = Object.values(JSON.parse(JSON.stringify(dbResponse)));
      var total = 0;
      result.forEach(() => {
        total++;
      })
      reply.send(total);
    } catch (error) {
      console.error('Error executing query:', error);
      reply.status(500).send('Internal Server Error');
    }
  });

  // Route to get the count of completed orders for the current week
  app.get('/CompletedOnWeek', async (request, reply) => {
    try {
      dayjs.extend(weekOfYear);
      const todayWeek = dayjs().week();
      const [dbResponse] = await conn.query('SELECT id FROM `service_orders` WHERE `completed_at` = ?', [todayWeek]);
      let result = Object.values(JSON.parse(JSON.stringify(dbResponse)));
      var total = 0;
      result.forEach(() => {
        total++;
      })
      reply.send(total);
    } catch (error) {
      console.error('Error executing query:', error);
      reply.status(500).send('Internal Server Error');
    }
  });

  // Route to get the count of new orders for a specific week
  app.get('/WeeklyNewOrders', async (request, reply) => {
    try {
      const getWeekParams = z.object({
        weekNumber: z.string(),
      });
      const { weekNumber } = getWeekParams.parse(request.query);
      const parsedWeekNumber = Number(weekNumber);
      const [dbResponse] = await conn.query('SELECT id FROM `service_orders` WHERE `created_at` = ?', [parsedWeekNumber]);
      let result = Object.values(JSON.parse(JSON.stringify(dbResponse)));
      var total = 0;
      result.forEach(() => {
        total++;
      })
      reply.send(total);
    } catch (error) {
      console.error('Error executing query:', error);
      reply.status(500).send('Internal Server Error');
    }
  });

  // Route to get the count of completed orders for a specific week
  app.get('/WeeklyCompletedOrders', async (request, reply) => {
    try {
      const getWeekParams = z.object({
        weekNumber: z.string(),
      });
      const { weekNumber } = getWeekParams.parse(request.query);
      const parsedWeekNumber = Number(weekNumber);
      const [dbResponse] = await conn.query('SELECT id FROM `service_orders` WHERE `completed_at` = ?', [parsedWeekNumber]);
      let result = Object.values(JSON.parse(JSON.stringify(dbResponse)));
      var total = 0;
      result.forEach(() => {
        total++;
      })
      reply.send(total);

    } catch (error) {
      console.error('Error executing query:', error);
      reply.status(500).send('Internal Server Error');
    }
  });

  // Route to assign order (Step 1)
app.post('/AssignOrderStep1', async (request, reply) => {
  try {
    const updateOrder = z.object({
      osWorker: z.number().array(),
      osId: z.number(),
      osBu: z.string(),
      osDate: z.string(),
      osHours: z.number(),
      osAnnotation: z.string(),
    });
    const { osId, osBu, osDate, osHours, osAnnotation, osWorker } = updateOrder.parse(request.body);
    const osWorkerId: number[] = osWorker.map(worker => worker + 1);

    dayjs.extend(customParseFormat);
    const osDateCorrect = dayjs(osDate).startOf('day').toDate();

    
    await conn.query('UPDATE `service_orders` SET `bu` = ?, `start_date` = ?, `planned_hours` = ?, `annotation` = ?, `assigned_workers_id` = ? WHERE `id` = ?',
      [osBu, osDateCorrect, osHours, osAnnotation, osWorkerId, osId]);

    reply.send('Order assigned successfully!');
  } catch (error) {
    console.error('Error assigning order:', error);
    reply.status(500).send('Internal Server Error');
  }
});

// Route to assign order (Step 2)
app.post('/AssignOrderStep2', async (request, reply) => {
  try {
    const assignOrder = z.object({
      orderDetails: z.object({
        id: z.number(),
        workerName: z.string(),
        workerOsHours: z.number(),
        workerOsDate: z.string(),
        startHour: z.string(),
        endHour: z.string(),
        sequentialDays: z.number(),
        osStatus: z.string(),
        orderId: z.number(),
        assignMode: z.boolean(),
      }).array(),
    });

    const orderDetailsParsed = assignOrder.parse(request.body);
    const { osStatus, orderId, assignMode } = orderDetailsParsed.orderDetails[0];
    var updatedWorkerHours = 0;

    
    await conn.query('UPDATE `service_orders` SET `status` = ? WHERE `id` = ?', [osStatus, orderId]);

    for (const element of orderDetailsParsed.orderDetails) {
      const startDateTime = dayjs(element.workerOsDate.concat(' ').concat(element.startHour)).format('YYYY-MM-DDTHH:mm:ss');
      const endDateTime = dayjs(element.workerOsDate.concat(' ').concat(element.endHour)).format('YYYY-MM-DDTHH:mm:ss');

      if (element.sequentialDays === 0) {
        await conn.query('INSERT INTO assigned_os (worker_id, worker_name, worker_hours, start_date, end_date, order_id) VALUES (?, ?, ?, ?, ?, ?)',
          [element.id, element.workerName, element.workerOsHours, startDateTime, endDateTime, element.orderId]);
      }

      if (element.sequentialDays !== 0) {
        const startDay = dayjs(startDateTime).date();
        const Month = ((dayjs(startDateTime).month()) + 1);
        const Year = (dayjs(startDateTime).year());

        if (assignMode) {
          updatedWorkerHours = element.workerOsHours / element.sequentialDays;
        } else {
          updatedWorkerHours = element.workerOsHours;
        }

        for (let i = element.sequentialDays; i > 0; i--) {
          const endDay = startDay + (i - 1);
          const endDate = Year.toString().concat('-').concat(Month.toString()).concat('-').concat(endDay.toString());
          const startDateTimeSequential = dayjs(endDate.concat(' ').concat(element.startHour)).format('YYYY-MM-DDTHH:mm:ss');
          const endDateTimeSequential = dayjs(endDate.concat(' ').concat(element.endHour)).format('YYYY-MM-DDTHH:mm:ss');

          await conn.query('INSERT INTO assigned_os (worker_id, worker_name, worker_hours, start_date, end_date, order_id) VALUES (?, ?, ?, ?, ?, ?)',
            [element.id, element.workerName, updatedWorkerHours, startDateTimeSequential, endDateTimeSequential, element.orderId]);
        }
      }
    }

    reply.send('Order assigned successfully!');
  } catch (error) {
    console.error('Error assigning order:', error);
    reply.status(500).send('Internal Server Error');
  }
});

// Route to get assigned orders
app.get('/AssignedOrders', async (request, reply) => {
  try {
    
    const [dbResponse] = await conn.query('SELECT assigned_os.id, assigned_os.order_id, assigned_os.worker_name, assigned_os.worker_id, assigned_os.worker_hours, assigned_os.start_date, assigned_os.end_date, service_orders.costumer, service_orders.bu FROM assigned_os INNER JOIN service_orders ON assigned_os.order_id = service_orders.id');
    reply.send(dbResponse);
  } catch (error) {
    console.error('Error fetching assigned orders:', error);
    reply.status(500).send('Internal Server Error');
  }
});

// Route to get assigned workers for an order
app.get('/osWorkers', async (request, reply) => {
  try {
    const getOsParams = z.object({
      workerId: z.string(),
    });

    const { workerId } = getOsParams.parse(request.query)
    var parsedQuery = JSON.parse('['+ workerId +']')
    const osWorkerId: number[] = []
    parsedQuery.forEach((worker: number) => {
      worker = worker + 1
      osWorkerId.push(worker)
    });

    
    const [dbResponse] = await conn.query('SELECT id, name, surname, photo FROM `users`');
    const json = JSON.parse(JSON.stringify(dbResponse));

    const osWorker = json.reduce((result: Worker[], worker: Worker) => {
      if (osWorkerId.includes(worker.id)) {
        result.push({
          id: worker.id,
          name: worker.name,
          surname: worker.surname,
          photo: worker.photo,
        });
      }
      return result;
    }, []);

    reply.send(osWorker);
  } catch (error) {
    console.error('Error fetching assigned workers:', error);
    reply.status(500).send('Internal Server Error');
  }
});

// Route to get assigned workers for an order (Conclude Form)
app.get('/osWorkersConcludeForm', async (request, reply) => {
  try {
    const reqParams = z.object({
      workerId: z.string(),
      orderId: z.string(),
    });

    const { workerId, orderId } = reqParams.parse(request.query);
    const osWorkerId: number[] = JSON.parse(workerId);

    
    const [dbResponse] = await conn.query('SELECT id, name, surname, photo FROM `users`');
    const json = JSON.parse(JSON.stringify(dbResponse));

    const [dbResponse1] = await conn.query('SELECT worker_id, worker_hours FROM `assigned_os` WHERE `order_id` = ?', [orderId]);
    const json1 = JSON.parse(JSON.stringify(dbResponse1));

    const groupedData: GroupedData = json1.reduce((result: GroupedData, entry: WorkerData) => {
      const { worker_id, worker_hours } = entry;
      if (!result[worker_id]) {
        result[worker_id] = 0;
      }
      result[worker_id] += worker_hours;
      return result;
    }, {});

    const osWorker = json.reduce((result: Worker[], worker: Worker) => {
      if (osWorkerId.includes(worker.id)) {
        const workerOs = {
          id: worker.id,
          name: worker.name,
          surname: worker.surname,
          photo: worker.photo,
          workedHours: groupedData[worker.id],
        };
        result.push(workerOs);
      }
      return result;
    }, []);

    reply.send(osWorker);
  } catch (error) {
    console.error('Error fetching assigned workers for conclude form:', error);
    reply.status(500).send('Internal Server Error');
  }
});

}


