import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]";
import { getComments } from "./../../../getDatabese";

//コメントを投稿
// POST
// comment, boardId, authorIdが必須
// GETはクエリが必要

//コメントの取得

export default async function handler(req, res) {
  console.log("OMOOMOMM");
  //const session = await getServerSession(req, res, authOptions);
  /*if(!session) {
    return res.status(403).send("forbidden");
  }*/
  const prisma = new PrismaClient();

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

    if (!result) {
      return res.status("404").send("Not Found");
    }

    return res.json(result);
  }

  if (req.method === "GET") {

    const boardId = +req.params.boardId;

    console.log("MEMEMETO");
    console.log(req.boardId);
    console.log("FD");
    //const boardId = +req.params.boardId;

    const limit = +req.query.limit || 50;
    const offset = +req.query.offset || 0;
    try {
      const comments = await getComments(boardId, limit, offset);
      return res.json(comments);
    } catch (error) {
      return res.status(500).send(error);
    }
  }
}
