import prisma from "../../lib/prismadb";

/*export const getCommentCountByBoardId = async boardId => {
  const commentCount = await prisma.comment.findMany({
    include:{
      _count:{
      }
    }
  });

  return commentCount;
}*/

export const getBoardCountByUserId = async (userId) => {
  const boardCount = await prisma.board.count({
    where:{
      userId
    }
  });

  return boardCount;
}

export const getCommentCountByUserId = async (userId) => {
  const commentCount = await prisma.comment.count({
    where:{
      userId
    }
  });

  return commentCount;

}
  
export const getFavoriteCountByUserId = async (userId) => {
  const favriteCount = await prisma.favorite.count({
    where:{
      userId
    }
  });

  return favriteCount;

}

export const getCommentCount = async () => {
  const comment = await prisma.comment.count();
  return comment;
};

export const getCommentCountByBoardId = async (boardId) => {
  const commentCount = await prisma.comment.count({
    where:{
      boardId
    }
  });

  return commentCount;
}

export const getBoard = async (boardId) => {
  const board = await prisma.board.findUnique({
    where: {
      id: boardId,
    },
  });

  return board;
};

export const getUserByUserId = async (userId) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  return user;
};

export const getCommentUserId = async (boardId, take, skip) => {
  const commentUserId = await prisma.comment.findMany({
    where: {
      boardId,
    },
    select: {
      userId: true,
    },
    take,
    skip,
  });
  return commentUserId;
};

export const getComments = async (boardId, take, skip) => {
  const comments = await prisma.comment.findMany({
    where: {
      boardId,
    },
    take,
    skip,
  });

  return comments;
};

export const getfavorites = async (boardId, userId) => {
  //console.log("bad", session.user.id);
  if (!userId) {
    return [];
  }

  const result = await prisma.favorite.findMany({
    where: {
      AND: [{ boardId }, { userId }],
    },
  });
  console.log(result);
  if (result) {
    return result;
  }
};

export const getfavoriteCount = async () => {
  const result =
    await prisma.$queryRaw`SELECT COUNT(*) AS count, commentId FROM Favorite GROUP BY commentId`;

  if (result) {
    return result;
  }
};
