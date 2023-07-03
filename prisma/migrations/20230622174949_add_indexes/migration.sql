-- CreateIndex
CREATE INDEX "Board_title_category_description_userId_idx" ON "Board"("title", "category", "description", "userId");

-- CreateIndex
CREATE INDEX "Comment_comment_boardId_userId_idx" ON "Comment"("comment", "boardId", "userId");

-- CreateIndex
CREATE INDEX "favorite_userId_boardId_commentid_idx" ON "favorite"("userId", "boardId", "commentid");

-- CreateIndex
CREATE INDEX "user_name_image_idx" ON "user"("name", "image");
