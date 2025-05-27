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
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  IEventService,
  IEventServiceToken,
} from '../../domain/event.service.interface';
import { JwtAuthGuard } from 'src/modules/auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/infrastructure/guards/roles.guard';
import { Roles } from 'src/modules/auth/infrastructure/decorators/roles.decorator';
import { Role } from 'src/modules/users/application/dto/enums/role.enum';
import { CurrentUser } from 'src/modules/auth/infrastructure/decorators/current-user.decorator';
import { CreateEventClientDto } from '../../application/dto/event-client/create-event-client.dto';
import { ListEventsByClientDto } from '../../application/dto/event-client/response-event-client.dto';
import { ResponseCreteEventClientDto } from '../../application/dto/event-client/response-create-event-client.dto';

@ApiTags('Event-client')
@Controller('event-client')
export class EventClientController {
  constructor(
    @Inject(IEventServiceToken)
    private readonly eventClientService: IEventService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_SYS, Role.CLIENT)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: 201,
    description: 'Add client to event created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBody({ type: CreateEventClientDto })
  async addClientToEvent(
    @CurrentUser() user,
    @Body() data: CreateEventClientDto,
  ) {
    try {
      const eventClient = await this.eventClientService.addClientToEvent(user, data);

      return new ResponseCreteEventClientDto(eventClient);
    } catch (error) {
      this.handleError(error);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_SYS, Role.CLIENT)
  @Get(':clientId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'Events by client Id retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getEventByClientId(@Param('clientId', ParseIntPipe) clientId: number) {
    try {
      const events = await this.eventClientService.getEventByClientId(clientId);
      return new ListEventsByClientDto(events).toResponse();
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any) {
    if (error instanceof HttpException) {
      throw error;
    } else {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
