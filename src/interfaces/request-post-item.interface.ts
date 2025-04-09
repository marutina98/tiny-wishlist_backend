/*

model Item {
  id              String @id @default(uuid())
  title           String
  description     String?
  thumbnail       String?
  url             String?
  quantity        Int @default(1)
  price           Decimal
  archived        Boolean
  reserved        Boolean @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  group           Group @relation(fields: [groupId], references: [id], onDelete: Cascade)
  groupId         String
}

*/

export default interface IRequestPostItem {
  title: string,
  description?: string,
  thumbnail?: string,
  url?: string,
  quantity?: number,
  price?: number,
}