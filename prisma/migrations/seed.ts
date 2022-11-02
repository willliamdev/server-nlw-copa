import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


async function main() {
  const user = await prisma.user.create({
    data: {
      name: "Jhon Doe",
      email: "jhon.doe@email.com",
      avatarUrl: "https://shorturl.at/fhyA1"
    },
  });

  const pool = await prisma.pool.create({
    data: {
      title: "Example pool",
      code: "BOL234",
      ownerId: user.id,


      participants: {
        create: {
          userId: user.id
        }
      }
    }
  });

  await prisma.game.create({
    data: {
      date: "2022-11-16T14:00:00.692Z",
      firstTeamCountry: "BR",
      secondTeamCountry: "AR"
    }
  });

  await prisma.game.create({
    data: {
      date: "2022-11-18T11:00:00.692Z",
      firstTeamCountry: "BR",
      secondTeamCountry: "FR",

      guesses: {
        create: {
          firstTeamPoints: 4,
          secontTeamPoints: 1,

          participant: {
            connect: {
              userId_poolId: {
                userId: user.id,
                poolId: pool.id
              }
            }
          }
        }
      }
    }
  });

}

main();