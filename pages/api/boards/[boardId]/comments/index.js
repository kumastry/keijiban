import { PrismaClient } from "@prisma/client";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]";

//コメントを投稿
// POST
// comment, boardId, authorIdが必須
// GETはクエリが必要

export const getCommentCount = async () => {
  const prisma = new PrismaClient();
  const comment = await prisma.comment.count();
  return comment;
}

export const getComments = async (boardId, take, skip) => {
  const prisma = new PrismaClient();
  const comments = await prisma.comment.findMany({
    where: {
      boardId,
    },
    take, 
    skip
  });
  return comments;
};

export default async function handler(req, res) {
  const session = await unstable_getServerSession(req, res, authOptions);
  const prisma = new PrismaClient();
  if (session) {
    if (req.method === "POST") {
      const comment = req.body.comment;
      const userId = req.body.userId;
      const boardId = +req.body.boardId;
      const result = await prisma.comment.create({
        data: {
          comment,
          boardId,
          userId,
        },
      });
      res.json(result);
    } else if (req.method === "GET") {
      const boardId = +req.query.id;
      const comments = await prisma.comment.findMany({
        where:{
          boardId
        }
      });
      res.json(comments);
    }
  } else {
    res.status(403).send("forbidden");
  }
}
