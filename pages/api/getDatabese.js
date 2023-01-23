import prisma from "../../lib/prismadb";

export const getCommentCount = async () => {
    const comment = await prisma.comment.count();
    return comment;
}
  
export const getBoard = async boardId => {
    const board = await prisma.board.findUnique ({
      where:{
        id:boardId
      }
    });
  
    return board;
}
  
export const getUser = async userId => {
    const user = await prisma.user.findUnique({
      where:{
        id:userId
      }
    });
  
    return user;
}
  
export const getCommentUserId = async (boardId, take, skip) => {
    const commentUserId = await prisma.comment.findMany({
      where: {
        boardId,
      },
      select:{
        userId:true
      },
      take, 
      skip
    });
    return commentUserId;
};
  
export const getComments = async (boardId, take, skip) => {
    const comments = await prisma.comment.findMany({
      where: {
        boardId,
      },
      take, 
      skip
    });
    return comments;
};
  
export const getfavorites = async (boardId, session) => {
    console.log("bad", session.user.id)
    const result = await prisma.favorite.findMany({
      where:{
        AND:[
          {boardId},
          {userId:session.user.id}
        ]
        
      }
    });
    console.log(result);
    if(result) {
      return result;
    }
  }
  
  export const getfavoriteCount = async() => {
    const result = await prisma.$queryRaw `SELECT COUNT(*) AS count, commentId FROM Favorite GROUP BY commentId`;
  
    if(result) {
      return result;
    }
  }
  