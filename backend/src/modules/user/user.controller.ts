import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from 'modules/auth/auth.service';
import { JwtAuthGuard } from 'modules/auth/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { JWT_SECRET, URL } from '../auth/constants';

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private jwtService: JwtService
  ) {}

  @Get()
  async getAllUsers(@Res() res: any): Promise<User[] | undefined> {
    const data = await this.userService.getAllUsers();
    res.json(data);
    return data;
  }

  @Get(':id')
  async getUserbyId(@Param('id') id: string): Promise<User | undefined> {
    const data = await this.userService.getUserbyId(id);
    return data;
  }

  @Post(':id/login')
  @UseGuards(JwtAuthGuard)
  async editlogin(
    @Param('id') userId: string,
    @Body() body: { newLogin: string },
    @Res() res: any
  ) {
    try {
      let user = await this.userService.getUserbyId(userId);
      if (!user) {
        return res.json({ success: false });
      }

      const uniqueLogin = await this.userService.uniqueLogin(body.newLogin);
      if (body.newLogin.trim() === '' || uniqueLogin === false) {
        return res.json({ success: false });
      }
      await this.userService.updateLogin(userId, body.newLogin);
      return res.json({ success: true });
    } catch (error: any) {
      console.error('Error login ', error);
      return res.json({ success: false });
    }
  }

  @Post(':id/verifyOtp')
  async verifyOtp(
    @Param('id') userId: string,
    @Body() body: { otp: string },
    @Res() res: any
  ) {
    try {
      const isVerified = await this.authService.verifyOtp(userId, body.otp);

      if (isVerified) {
        const userExists = await this.userService.getUserbyId(userId);

        const { created_at, updated_at, ...userWithoutDate } = userExists;

        const payload = { userWithoutDate };
        const jwt = this.jwtService.sign(payload, {
          secret: JWT_SECRET,
        });

        res.cookie('jwt', jwt);
        res.clearCookie('id');
        return res.json({ sucess: true });
      } else {
        return res.json({ sucess: false });
      }
    } catch (error) {
      console.error('Error during OTP verification:', error);
      res.json({ success: false, error: 'Internal Server Error' });
    }
  }

  @Get(':id/enableOtp')
  @UseGuards(JwtAuthGuard)
  async enableOtp(@Param('id') userId: string, @Res() res: any) {
    try {
      const isEnabled = await this.authService.enableOtp(userId);

      if (isEnabled) {
        return res.json({ sucess: true });
      } else {
        return res.json({ sucess: false });
      }
    } catch (error) {
      console.error('Error during OTP verification:', error);
      res.json({ success: false, error: 'Internal Server Error' });
    }
  }

  @Get(':id/disableOtp')
  @UseGuards(JwtAuthGuard)
  async disableOtp(@Param('id') userId: string, @Res() res: any) {
    try {
      const disEnabled = await this.authService.disableOtp(userId);

      if (disEnabled) {
        return res.json({ sucess: true });
      } else {
        return res.json({ sucess: false });
      }
    } catch (error) {
      console.error('Error during OTP verification:', error);
      res.json({ success: false, error: 'Internal Server Error' });
    }
  }

  @Post(':id/avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  async editavatar(
    @Param('id') userId: string,
    @UploadedFile() avatar: Express.Multer.File,
    @Res() res: any
  ) {
    try {
      let user = await this.userService.getUserbyId(userId);
      if (!user) {
        return res.json({ success: false });
      }
      if (!avatar) {
        return res.json({ success: false });
      }

      const avatarFilename = avatar.filename;
      const avatarUrl = `${URL}:3001/${avatarFilename}`;

      await this.userService.updateAvatar(userId, avatarUrl);
      return res.json({ success: true });
    } catch (error: any) {
      console.error('Error avatar:', error);
      return res.json({ success: false });
    }
  }

  @Post('addfriend')
  // @UseGuards(JwtAuthGuard)
  async addfriend(
    @Body() body: { userId: string; friendId: string },
    @Res() res: any
  ) {
    try {
      const { userId, friendId } = body;
      const isFriend = await this.userService.createFriend(userId, friendId);
      if (isFriend === 'alreadyFriend') {
        return res.json({ success: true , isFriend: true});
      } else {
        return res.json({ success: false , isFriend: false});
      }
      return res.json({ success: true });
    } catch (error: any) {
      console.error('Error addfriend:', error);
      return res.json({ success: false });
    }
  }

  @Get(':id/friends')
  // @UseGuards(JwtAuthGuard)
  async getFriends(@Param('id') userId: string, @Res() res: any) {
    try {
      const friends = await this.userService.getFriends(userId);
      return res.json({ success: true, friends });
    } catch (error: any) {
      console.error('Error getFriends:', error);
      return res.json({ success: false });
    }
  }

  @Get(':id/PendingInvite')
  // @UseGuards(JwtAuthGuard)
  async PendingInvite(@Param('id') userId: string, @Res() res: any) {
    try {
      const PendingInvite = await this.userService.PendingInvite(userId);
      const friendIds = PendingInvite.map((item) => item.friendId);
      const friendsDetails = await Promise.all(
        friendIds.map((id) => this.userService.getUserbyId(id))
      );

      return res.json({ success: true, friendsDetails });
    } catch (error: any) {
      console.error('Error getFriends:', error);
      return res.json({ success: false });
    }
  }

  @Get(':id/freindrequest')
  // @UseGuards(JwtAuthGuard)
  async freindrequest(@Param('id') userId: string, @Res() res: any) {
    try {
      const freindrequest = await this.userService.freindrequest(userId);
      const friendIds = freindrequest.map((item) => item.userId);
      const friendsDetails = await Promise.all(
        friendIds.map((id) => this.userService.getUserbyId(id))
      );

      return res.json({ success: true, friendsDetails });
    } catch (error: any) {
      console.error('Error getFriends:', error);
      return res.json({ success: false });
    }
  }

  @Put('/:userId/acceptFriend/:friendId')
  // @UseGuards(JwtAuthGuard)
  async acceptFriendRequest(
    @Param('userId') userId: string,
    @Param('friendId') friendId: string
  ) {
    const acceptFriendRequest = await this.userService.acceptFriendRequest(userId, friendId);
    return acceptFriendRequest;
  }
}
