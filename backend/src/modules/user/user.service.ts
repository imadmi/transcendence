import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient, Prisma, User } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class UserService {
  constructor() {}

  async getAllUsers() {
    try {
      const allUsers = await prisma.user.findMany();
      return allUsers;
    } catch (e) {
      console.log('Error: ', e);
      return undefined;
    }
  }

  async getUserbyId(id: string) {
    try {
      const User = await prisma.user.findUnique({
        where: {
          intraId: id,
        },
      });
      return User;
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new HttpException(
            {
              status: HttpStatus.NOT_FOUND,
              error: 'NotFoundException',
              message: 'User cannot be found',
            },
            HttpStatus.NOT_FOUND,
            { cause: error }
          );
        }
      }
    }
  }

  async getUserbyLogin(login: string) {
    try {
      const User = await prisma.user.findUnique({
        where: {
          login: login,
        },
      });
      return User;
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new HttpException(
            {
              status: HttpStatus.NOT_FOUND,
              error: 'NotFoundException',
              message: 'User cannot be found',
            },
            HttpStatus.NOT_FOUND,
            { cause: error }
          );
        }
      }
    }
  }


  async updateLogin(userId: string, newLogin: string): Promise<void> {
    const user = await this.getUserbyId(userId);

    if (!user) {
      console.log(`User with ID ${userId} not found`);
      return;
    }

    try {
      await prisma.user.update({
        where: {
          intraId: userId,
        },
        data: {
          login: newLogin,
        },
      });
    } catch (error) {
      console.error('Error updating login:', error);
    }
  }

  async updateAvatar(userId: string, newAvatar: string): Promise<void> {
    try {
      await prisma.user.update({
        where: {
          intraId: userId,
        },
        data: {
          Avatar: newAvatar,
        },
      });
    } catch (error) {
      console.error('Error updating login:', error);
    }
  }

}
