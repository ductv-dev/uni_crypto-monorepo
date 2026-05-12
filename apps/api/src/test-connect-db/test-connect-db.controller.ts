import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateTestConnectDbDto } from './dto/create-test-connect-db.dto';
import { UpdateTestConnectDbDto } from './dto/update-test-connect-db.dto';
import { TestConnectDbService } from './test-connect-db.service';

@Controller('test-connect-db')
export class TestConnectDbController {
  constructor(private readonly testConnectDbService: TestConnectDbService) {}

  @Post()
  create(@Body() createTestConnectDbDto: CreateTestConnectDbDto) {
    return this.testConnectDbService.create(createTestConnectDbDto);
  }

  @Get()
  findAll() {
    return this.testConnectDbService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testConnectDbService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTestConnectDbDto: UpdateTestConnectDbDto,
  ) {
    return this.testConnectDbService.update(+id, updateTestConnectDbDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testConnectDbService.remove(+id);
  }
}
