import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { getToken } from "next-auth/jwt";

//掲示板を投稿
//POSTの場合はクエリパラメータ(limit, offset)を設定する

export async function getBoards(take, skip) {
  const prisma = new PrismaClient();
  const boards = await prisma.board.findMany({
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
    take,
    skip,
  });
  //console.log(boards);
  return boards;
}


export async function getBoardCount() {
  const prisma = new PrismaClient();
  const count = await prisma.board.count();
  if (count) {
    return count;
  }
}

//api/boards?limit=100&offset=500
export default async function handler(req, res) {

  if (req.method === "GET") {
    const offset = +req.query.offset || 0;
    const limit =  +req.query.limit || 10;
    const boards = await getBoards(limit, offset);
    return res.json(boards);
  } 
  
  const prisma = new PrismaClient();
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(403).send({
      error:
        "You must be signed in to view the protected content on this page.",
    });
    
  }

    if (req.method === "POST") {
  
      const title = req.body.title;
      const category = req.body.category;
      const description = req.body.description;
      const userId = req.body.userId;
      const result = await prisma.board.create({
        data: {
          title,
          category,
          description,
          userId,
        },
      });

      if (!result) {
        return res.status(404).send("not found");
      }
      return res.status(200).json(result);
    } 
}
