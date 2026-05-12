import { Injectable } from '@nestjs/common';
import { PrismaService } from '@workspace/db';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  create(createProfileDto: CreateProfileDto) {
    return 'This action adds a new profile';
  }

  findAll() {
    return `This action returns all profile`;
  }

  async findOne(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        is_active: true,
        is_blocked: true,
        is_super_admin: true,
        type_account: true,
        createdAt: true,
        updatedAt: true,
        info: {
          select: {
            first_name: true,
            last_name: true,
            date_of_birth: true,
            gender: true,
            phone_number: true,
            address: true,
            city: true,
            country: true,
          },
        },
      },
    });
    if (!user) {
      throw new Error('Profile not found');
    }
    return user;
  }

  update(id: number, updateProfileDto: UpdateProfileDto) {
    return `This action updates a #${id} profile`;
  }

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }
}
