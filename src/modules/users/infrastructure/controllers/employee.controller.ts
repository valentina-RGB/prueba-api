import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateEmployeeDto } from '../../application/dto/employee/create-employee.dto';
import { EmployeeResponseDto } from '../../application/dto/employee/employee-response.dto';

import {
  IUserServiceToken,
  IUserService,
} from '../../domain/user.service.interface';
import { ListEmployeeDto } from '../../application/dto/employee/list-employee.dto';
import { DataEmployeeDto } from '../../application/dto/employee/data-employee.dto';
import { Public } from 'src/modules/auth/infrastructure/decorators/public.decorator';

@ApiTags('Employees')
@Controller('employees')
export class EmployeeController {
  constructor(
    @Inject(IUserServiceToken)
    private readonly userService: IUserService,
  ) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new employee' })
  @ApiResponse({ status: 201, description: 'Employee created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBody({ type: DataEmployeeDto })
  async create(@Body() data: DataEmployeeDto) {
    try {
      const employee = await this.userService.createEmployee(
        data.employeeData,
        data.userData,
        data.personData,
      );
      return {
        message: 'Employee created successfully',
        employee: new EmployeeResponseDto(employee),
      };
    } catch (error) {
      this.handleError(error);
    }
  }
  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all employees' })
  @ApiResponse({ status: 200, description: 'Employees fetched successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findAll() {
    try {
      const employees = await this.userService.findAllEmployees();
      return new ListEmployeeDto(employees);
    } catch (error) {
      this.handleError(error);
    }
  }
  @Public()
  @Get(':id') 
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get an employee by ID' })
  @ApiResponse({ status: 200, description: 'Employee fetched successfully' })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findById(@Param('id', new ParseIntPipe()) id: number) {
    try {
      const employee = await this.userService.findEmployeeById(id);
      return {
        message: 'Employee fetched successfully',
        employee: new EmployeeResponseDto(employee),
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any) {
    if (error instanceof HttpException) {
      throw error;
    }

    console.error(error);

    throw new HttpException(
      'Internal server error',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
