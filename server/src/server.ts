import cors from "@fastify/cors";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { server } from "./lib/fastify";
import { appRoutes } from "./lib/routes";
import multer from 'fastify-multer'



async function main() {
  server.register(cors, { origin: true})
  server.register(multer.contentParser);
  server.setValidatorCompiler(validatorCompiler)
  server.setSerializerCompiler(serializerCompiler)

  await server.register(appRoutes)
  const address = await server.listen({ port: 3333 });
  console.log(`Server is running on ${address}`);
  
}

main()