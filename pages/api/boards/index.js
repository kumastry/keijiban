import { PrismaClient } from "@prisma/client";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { getToken } from "next-auth/jwt";

//掲示板を投稿
//POSTの場合はクエリパラメータ(limit, offset)を設定する

export async function getBoards(limit, offset) {
  const prisma = new PrismaClient();
  const boards = await prisma.board.findMany();
  //console.log(boards);
  return boards;
}

export default async function handler(req, res) {
  // const secret = process.env.NEXTAUTH_SECRET;
  // console.log(process)
  //console.log(secret);
  const prisma = new PrismaClient();
  const session = await unstable_getServerSession(req, res, authOptions);

  //const token = await getToken({ req, secret })
  //console.log("JSON Web Token", token)
  //console.log("session", session);
  console.log(session);

  if (session) {
    if (req.method === "GET") {
      const boards = await getBoards(0, 0, boards);
      res.json(boards);
    } else if (req.method === "POST") {
      //console.log('POST');
      const title = req.body.title;
      const category = req.body.category;
      const description = req.body.description;
      const userId = req.body.userId;
      //console.log(title);
      //console.log(category);
      //console.log(authorId);
      //console.log(session);
      const result = await prisma.board.create({
        data: {
          title,
          category,
          description,
          userId,
        },
      });

      if (!result) {
        res.status(404).send("not found");
      }

      res.status(200).json(result);
    } else {
      res.status(403).send({
        error:
          "You must be signed in to view the protected content on this page.",
      });
    }
  }
}
