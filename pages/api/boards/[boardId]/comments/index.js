import { PrismaClient } from "@prisma/client";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]";

//コメントを投稿
// POST
// comment, boardId, authorIdが必須
// GETはクエリが必要

export const getComments = async (boardId) => {
  const prisma = new PrismaClient();
  const comments = await prisma.comment.findMany({
    where: {
      boardId: +boardId,
    },
  });
  return comments;
};

export default async function handler(req, res) {
  const session = await unstable_getServerSession(req, res, authOptions);
  const prisma = new PrismaClient();
  if (session) {
    if (req.method === "POST") {
      const comment = req.body.comment;
      const authorId = +req.query.authorId;
      const boardId = +req.query.boardId;
      const result = await prisma.comment.create({
        data: {
          comment,
          boardId,
          authorId,
        },
      });
      res.json(result);
    } else if (req.method === "GET") {
      const comments = await prisma.comment.findMany();
      res.json(comments);
    }
  } else {
    res.status(403).send("forbidden");
  }
}
