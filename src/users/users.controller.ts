import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';

import { UpdateProfileDto } from './users.dto';
import { RequestWithUser } from './users.interface';
import { UsersService } from './users.service';
import { AppAbility } from 'src/common/casl-ability.factory';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { CheckPermissions } from 'src/common/decorators/permission.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard, PermissionsGuard)
  @CheckPermissions((ability: AppAbility) => ability.can('read', 'user'))
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard, PermissionsGuard)
  @CheckPermissions((ability: AppAbility) => ability.can('read', 'user'))
  getProfile(@Req() req: RequestWithUser, @Param('id') id: string) {
    try {
      return this.usersService.findById(id);
    } catch (error) {
      console.log(error);
    }
  }

  @Put('profile')
  updateProfile(@Req() req: RequestWithUser, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(String(req.user._id), dto);
  }
}
