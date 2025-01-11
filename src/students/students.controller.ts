import { Controller, Get, Post, Body, Patch, Param, Delete, Put, HttpException, HttpStatus } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @Get()
  findAll() {
    return this.studentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(+id);
  }

  // PUT: Full update (need to include all the values to replace/update)
  @Put(':id')
  async updateFull(
    @Param('id') id: number,  // id as number
    @Body() updateStudentDto: UpdateStudentDto
  ) {
    try {
      const updatedStudent = await this.studentsService.update(id, updateStudentDto);
      return updatedStudent;
    } catch (error) {
      throw new HttpException(error.message || 'An error occurred', error.status || HttpStatus.BAD_REQUEST);
    }
  }

  // PATCH: Partial update (only update provided fields)
  @Patch(':id')
  async updatePartial(
    @Param('id') id: number,  // id as number
    @Body() updateStudentDto: UpdateStudentDto
  ) {
    try {
      const updatedStudent = await this.studentsService.patch(id, updateStudentDto);
      return updatedStudent;
    } catch (error) {
      throw new HttpException(error.message || 'An error occurred', error.status || HttpStatus.BAD_REQUEST);
    }
  }

}
