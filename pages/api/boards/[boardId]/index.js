import { PrismaClient } from "@prisma/client";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

//boardIdの掲示板を取得
//GET

export const getBoard = async () => {
  const prisma = new PrismaClient();
  //const session = await unstable_getServerSession(req, res, authOptions);
  const boardId = 1;
  //+req.query.boardId;
  const result = await prisma.comment.findFirst({
    where: {
      id: boardId,
    },
  });
  console.log(result);
  console.log("api");
  return result;
};

export default async function handler(req, res) {
  const prisma = new PrismaClient();
  const session = await unstable_getServerSession(req, res, authOptions);
  if (session) {
    const boardId = +req.query.boardId;
    const result = await prisma.comment.findFirst({
      where: {
        id: boardId,
      },
    });

    if (!result) {
      res.status(404).send("not found");
    }
    res.status(200).json(result);
  } else {
    res.status(403).send("forbidden");
  }
}
