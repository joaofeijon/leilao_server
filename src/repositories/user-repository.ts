import { Prisma, User } from "@prisma/client"


export interface UserRepository {
  createUser(data: Prisma.UserCreateInput): Promise<User>
  findByEmail(email: string): Promise<User | null>
}