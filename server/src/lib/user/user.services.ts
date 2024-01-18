import { CreateUserSchema } from "./user.schema";
import { hashPass } from "./hashPass";
import { randomColor } from "./user.color";
import { conn } from '../db/mysqlconnection';


export async function createUser(body: CreateUserSchema) {

  const { name, surname, role, email, password, photo, phone } = body

  const { hashedPass } = hashPass(password)
  
  const data = { name, surname, role, email, password: hashedPass, photo, phone }

  conn.execute('INSERT INTO users (name, surname, role, email, password, photo, phone) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [data.name, data.surname, data.role, data.email, data.password, data.photo, data.phone],
  )

}