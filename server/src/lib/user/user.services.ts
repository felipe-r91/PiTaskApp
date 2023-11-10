import { CreateUserSchema } from "./user.schema";
import { hashPass } from "./hashPass";
import { randomColor } from "./user.color";
import { conn } from '../db/mysqlconnection';


export async function createUser(body: CreateUserSchema) {

  const { name, surname, role, email, password, photo } = body

  const { hashedPass } = hashPass(password)
  const { userColor } = randomColor()

  const data = { name, surname, role, email, password: hashedPass, photo, color: userColor }

  conn.execute('INSERT INTO users (name, surname, role, email, password, photo, color) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [data.name, data.surname, data.role, data.email, data.password, data.photo, data.color],

    
  )

}