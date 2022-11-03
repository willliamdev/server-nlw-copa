import Fastify from "fastify";
import cors from "@fastify/cors";
import { PrismaClient } from "@prisma/client";

import ShortUniqueId from "short-unique-id";
import { z } from "zod";


const prisma = new PrismaClient({
  log: ["query"]
});

async function bootstrap() {
  const fastify = Fastify({
    logger: true
  });

  await fastify.register(cors, {
    origin: true
  });

  fastify.get("/pools/count", async () => {
    const count = await prisma.pool.count();

    return {
      count
    };
  });

  fastify.post("/pools", async (request, response) => {
    const createPoolBody = z.object({
      title: z.string()
    });

    const { title } = createPoolBody.parse(request.body);

    const generate = new ShortUniqueId({ length: 6 });
    const code = String(generate()).toUpperCase();

    await prisma.pool.create({
      data: {
        title: title,
        code
      }
    });



    return response.status(201).send({ code });
  });
  await fastify.listen({ port: 3333,/* host: "0.0.0.0"*/ });
}

bootstrap();
