import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ライクする
// UPDATE
// インクリメントする
export default async function handler(req, res) {
  //commentIdは一意
  const commentId = +req.query.commentId;
  const boardId = +req.query.boardId;
  const result = await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      likes: { increment: 1 },
    },
  });
  res.json(result);
}
