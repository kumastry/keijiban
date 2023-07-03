import { getBoardCount } from ".";

export default async function handler(req, res) {
  const boardCount = await getBoardCount();
  if (boardCount) {
    return res.send(boardCount);
  }
}
