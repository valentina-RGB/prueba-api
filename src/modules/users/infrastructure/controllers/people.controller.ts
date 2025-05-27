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
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { PeopleResponseDto } from '../../application/dto/people/people-response.dto';
import { ListPeopleDto } from '../../application/dto/people/list-people.dto';
import {
  IUserService,
  IUserServiceToken,
} from '../../domain/user.service.interface';
import { Public } from 'src/modules/auth/infrastructure/decorators/public.decorator';

@ApiTags('People')
@Controller('people')
export class PeopleController {
  constructor(
    @Inject(IUserServiceToken)
    private readonly userService: IUserService,
  ) {}

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all people' })
  @ApiResponse({ status: 200, description: 'People fetched succesfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findAll() {
    try {
      const people = await this.userService.listPeople();

      return new ListPeopleDto(people);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a person by id' })
  @ApiResponse({
    status: 200,
    description: 'Person fetched succesfully',
    type: PeopleResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Person not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findOne(@Param('id', new ParseIntPipe()) id: number) {
    try {
      const person = await this.userService.getPerson(id);

      return { message: 'Person fetched succesfully', person };
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
