import { PrismaClient } from "@prisma/client";
import { authOptions } from "../../../../auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";


export const getLikes = async (boardId) => {
  const prisma = new PrismaClient();
  const result = await prisma.like.findMany({
    where:{
      boardId:+boardId
    }
  });

  if(result) {
    return result;
  }
}
export default async function handler(req, res) {
  const prisma = new PrismaClient();
  
  const session = await unstable_getServerSession(req, res, authOptions);
  console.log("NOOOOOOOOOOOOOOOOOOOOOOOOOOo");
  console.log(session);
  //commentIdとuserIdが必要
  if(req.method === "POST") {
    console.log("FDPOPOPOFPOFPDOPFPPD")
    console.log(req.query);
    const commentId = +req.body.commentId;
    const userId = req.body.userId;
    const boardId = +req.body.boardId;
    console.log(commentId);
    console.log(userId);
    const result = await prisma.like.create({
      data: {
        userId,
        commentId,
        boardId
      },
    });
    res.json(result);
  } else if(req.method === "GET"){
    //console.log("YUFYUDGFUGSFD")
    //console.log(req.query)
    const boardId = +req.query.id;
    //console.log(commentId);
    const result = await prisma.like.findMany({
      where:{
        AND:[
          {userId : session.user.id},
          {boardId}
        ]
        
      },
      select:{
        commentId:true
      }
    });
    console.log(result);
    if(result) {
      res.json(result);
    }
  } else if(req.method === "DELETE") {
    console.log("MOMOMMM");

    console.log(req.body)
    //const userId = req.body.userId;
    const commentId = +req.body.commentId;

    const deleteRecord = await prisma.like.findFirst({
      where: {
        AND:[
           {userId : session.user.id},
          {commentId}
        ],
      },

      select : {
        id:true
      }
    });

    console.log(deleteRecord);
    const deleteLike = await prisma.like.delete({
      where: {
        id:deleteRecord.id
      },
    });

    return deleteLike;
  }
}
