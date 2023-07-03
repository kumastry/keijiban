import { PrismaClient } from "@prisma/client";

//掲示板を投稿
const prisma = new PrismaClient();
//POST
//ユーザーの投稿
export default async function handler(req, res) {
  const { name } = req.body;
  const result = await prisma.user.create({
    data: {
      name,
    },
  });

  res.json(result);
}
