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
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateClientDto } from '../../application/dto/clients/create-client.use-case';
import { ClientResponseDto } from '../../application/dto/clients/client.response';
import { ListClientsDto } from '../../application/dto/clients/list.client.dto';
import {
  IUserService,
  IUserServiceToken,
} from '../../domain/user.service.interface';
import { UpdatePersonDto } from '../../application/dto/people/update-people.dto';
import { Public } from 'src/modules/auth/infrastructure/decorators/public.decorator';

@ApiTags('Clients')
@Controller('clients')
export class ClientController {
  constructor(
    @Inject(IUserServiceToken)
    private readonly userService: IUserService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new client' })
  @ApiResponse({ status: 201, description: 'Client created succesfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBody({ type: CreateClientDto })
  async create(@Body() data: CreateClientDto) {
    try {
      const client = await this.userService.createClient(
        data.userData,
        data.personData,
      );

      return {
        message: 'Client created succesfully',
        client: new ClientResponseDto(client),
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all client' })
  @ApiResponse({ status: 200, description: 'Client fetched succesfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findAll() {
    try {
      const client = await this.userService.listClients();

      return new ListClientsDto(client);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a client by id' })
  @ApiResponse({
    status: 200,
    description: 'Client fetched succesfully',
    type: ClientResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Client not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findOne(@Param('id', new ParseIntPipe()) id: number) {
    try {
      const client = await this.userService.getClient(id);

      return new ClientResponseDto(client);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Public()
  @Get('user/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get client by user id' })
  @ApiResponse({
    status: 200,
    description: 'Client fetched succesfully',
    type: ClientResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Client not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findOneByUser(@Param('id', new ParseIntPipe()) id: number) {
    try {
      const client = await this.userService.getClientByUser(id);

      return new ClientResponseDto(client);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a client' })
  @ApiResponse({ status: 200, description: 'Client updated succesfully' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBody({ type: UpdatePersonDto })
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() clientData: UpdatePersonDto,
  ) {
    try {
      const client = await this.userService.updateClient(id, clientData);

      return {
        message: 'Client updated succesfully',
        client: new ClientResponseDto(client),
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  @Patch('verify/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Toggle client verification status' })
  @ApiResponse({
    status: 200,
    description: 'Client verification status toggled successfully',
  })
  @ApiResponse({ status: 404, description: 'Client not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async toggleVerificationStatus(
    @Param('id', new ParseIntPipe()) id: number,
    @Body('isVerified') isVerified: boolean,
  ) {
    try {
      const updatedClient = await this.userService.verifyClient(id, isVerified);
      return {
        message: `Client verification status changed to ${updatedClient.is_verified}`,
        client: new ClientResponseDto(updatedClient),
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any) {
    if (error instanceof HttpException) throw error;

    throw new HttpException(
      'Internal server error',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
