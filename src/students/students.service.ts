import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentsRepository:
    Repository<Student>){

  }

  async create(createStudentDto: CreateStudentDto) {
    try {
      // Check for missing required fields
      const missingFields = [];
      if (!createStudentDto.firstName) {
        missingFields.push('firstName');
      }
      if (!createStudentDto.lastName) {
        missingFields.push('lastName');
      }
      if (!createStudentDto.email) {
        missingFields.push('email');
      }
      if (!createStudentDto.enrollmentDate) {
        missingFields.push('enrollmentDate');
      }

      if (missingFields.length > 0) {
        // If any required fields are missing, throw an HttpException
        throw new HttpException(
          `Missing required fields: ${missingFields.join(', ')}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      // Check if the email already exists
      const existingStudent = await this.studentsRepository.findOne({
        where: { email: createStudentDto.email },
      });

      if (existingStudent) {
        // If email exists, throw a custom HttpException
        throw new HttpException(
          'Email already exists',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Proceed with creating the student if email does not exist
      const student = this.studentsRepository.create(createStudentDto);
      return await this.studentsRepository.save(student);
    } catch (error) {
      // Handle known errors
      if (error instanceof HttpException) {
        // If it's a known exception, re-throw it
        throw error;
      }

      // For unknown errors, log them (won't show stack trace in the response)
      console.error(error);  // This logs the error to the console but does not show it to the user

      // Throw a generic error response to the client
      throw new HttpException(
        'Failed to create student due to internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    const students = await this.studentsRepository.find();
  
    if (students.length === 0) {
      // If no data is found, throw an HTTP exception with a custom message
      throw new HttpException(
        'No data available',
        HttpStatus.NOT_FOUND, // 404 status code for "Not Found"
      );
    }
  
    return students;
  }
  
  async findOne(id: number) {
    const student = await this.studentsRepository.findOne({
      where: { id },
    });
  
    if (!student) {
      // If no student is found with the given ID, throw an exception
      throw new HttpException(
        `Student with ID ${id} not found`,
        HttpStatus.NOT_FOUND, // 404 status code for "Not Found"
      );
    }
  
    return student;
  }

  // Full update with PUT: Replaces all fields, including setting omitted ones to null
  async update(id: number, updateStudentDto: UpdateStudentDto) {
    const student = await this.studentsRepository.findOne({ where: { id } });

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    // For PUT: Replace the entire student, even if some fields are omitted
    student.firstName = updateStudentDto.firstName ?? null;
    student.lastName = updateStudentDto.lastName ?? null;
    student.email = updateStudentDto.email ?? null;

    return await this.studentsRepository.save(student);
  }

  // Partial update with PATCH: Updates only provided fields
  async patch(id: number, updateStudentDto: UpdateStudentDto) {
    const student = await this.studentsRepository.findOne({ where: { id } });

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    // For PATCH: Only update the fields provided in the request
    Object.assign(student, updateStudentDto);

    return await this.studentsRepository.save(student);
  }

}
