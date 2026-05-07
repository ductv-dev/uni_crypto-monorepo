import { Controller, Get, UseGuards } from '@nestjs/common';
import { getCurrentUserId } from 'src/auth/decorators';
import { AtGuard } from 'src/auth/guards';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private guard: AtGuard,
  ) {}

  @Get()
  @UseGuards(AtGuard)
  findOne(@getCurrentUserId() userId: string) {
    return this.profileService.findOne(userId);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
  //   return this.profileService.update(+id, updateProfileDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.profileService.remove(+id);
  // }
}
