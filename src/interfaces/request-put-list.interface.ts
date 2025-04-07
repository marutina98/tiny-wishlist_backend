
/*

model List {
  id              String @id @default(uuid())
  title           String
  description     String?
  thumbnail       String?
  archived        Boolean @default(false)
  private         Boolean @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  user            User @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId          String
  priority        Priority @relation(fields: [priorityId], references: [id], onDelete: Cascade)
  priorityId      Int
  groups          Group[]
}

*/

export default interface IRequestPostList {
  title: string,
  description?: string,
  thumbnail?: string,
}