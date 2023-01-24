import { PrismaClient } from "@prisma/client";
import { authOptions } from "../../../../auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import rateLimit from "../../../../../rateLimit";
import requestIp from "request-ip";

const limiter = rateLimit({
  interval: 1, // 1 seconds
  uniqueTokenPerInterval: 500, // Max 500 users per second
});

const limitCount = 10;
export default async function handler(req, res) {
  const prisma = new PrismaClient();

  const session = await unstable_getServerSession(req, res, authOptions);
  console.log("NOOOOOOOOOOOOOOOOOOOOOOOOOOo");
  console.log(session);
  const clientIp = requestIp.getClientIp(req) || "IP_NOT_FOUND";
  console.log(clientIp);
  //commentIdとuserIdが必要
  if (req.method === "POST") {
    console.log("post");
    try {
      await limiter.check(res, limitCount, clientIp);
      console.log("FDPOPOPOFPOFPDOPFPPD");
      console.log(req.query);
      const commentId = +req.body.commentId;
      const userId = req.body.userId;
      const boardId = +req.body.boardId;
      console.log(commentId);
      console.log(userId);
      const result = await prisma.favorite.create({
        data: {
          userId,
          commentId,
          boardId,
        },
      });
      res.json(result);
    } catch {
      res.status(429).json({ error: "Rate limit exceeded" });
    }
  } else if (req.method === "GET") {
    //console.log("YUFYUDGFUGSFD")
    //console.log(req.query)
    const boardId = +req.query.id;
    //console.log(commentId);
    const result = await prisma.favorite.findMany({
      where: {
        AND: [{ userId: session.user.id }, { boardId }],
      },
      select: {
        commentId: true,
      },
    });
    //console.log(result);
    if (result) {
      res.json(result);
    }
  } else if (req.method === "DELETE") {
    //console.log("MOMOMMM");
    console.log("delete");
    //console.log(req.body)
    //const userId = req.body.userId;
    try {
      await limiter.check(res, limitCount, clientIp);
      const commentId = +req.body.commentId;
      const deleteRecord = await prisma.favorite.findFirst({
        where: {
          AND: [{ userId: session.user.id }, { commentId }],
        },
        select: {
          id: true,
        },
      });

      //console.log(deleteRecord);
      const deletefavorite = await prisma.favorite.delete({
        where: {
          id: deleteRecord.id,
        },
      });
    } catch {
      res.status(429).json({ error: "Rate limit exceeded" });
    }
  }
}
