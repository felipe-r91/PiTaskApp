import { FastifyReply, FastifyRequest } from 'fastify'
import { CreateUserSchema } from './user.schema';
import { createUser } from './user.services';

export async function registerUserController(
  request: FastifyRequest<{Body: CreateUserSchema}>,
  reply: FastifyReply
){
  const body = request.body
  await createUser(body)

  reply
  .status(201)
  .send({message : 'User created with success'})
}