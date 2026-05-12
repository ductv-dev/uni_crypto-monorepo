import { Injectable } from '@nestjs/common';
import { PrismaService } from '@workspace/db';
import { CreateTestConnectDbDto } from './dto/create-test-connect-db.dto';
import { UpdateTestConnectDbDto } from './dto/update-test-connect-db.dto';

@Injectable()
export class TestConnectDbService {
  constructor(private readonly prisma: PrismaService) {}
  create(createTestConnectDbDto: CreateTestConnectDbDto) {
    return 'This action adds a new testConnectDb';
  }

  async findAll() {
    const result = await this.prisma.user.findMany();
    return result;
  }

  findOne(id: number) {
    return `This action returns a #${id} testConnectDb`;
  }

  update(id: number, updateTestConnectDbDto: UpdateTestConnectDbDto) {
    return `This action updates a #${id} testConnectDb`;
  }

  remove(id: number) {
    return `This action removes a #${id} testConnectDb`;
  }
}
