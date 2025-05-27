import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  IEventService,
  IEventServiceToken,
} from '../../domain/event.service.interface';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/modules/auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/infrastructure/guards/roles.guard';
import { Roles } from 'src/modules/auth/infrastructure/decorators/roles.decorator';
import { Role } from 'src/modules/users/application/dto/enums/role.enum';
import { CreateEventDto } from '../../application/dto/events/create-event.dto';
import { Public } from 'src/modules/auth/infrastructure/decorators/public.decorator';
import { ResponseEventDto } from '../../application/dto/events/response-events.dto';

@ApiTags('Events')
@Controller('events')
export class EventController {
  constructor(
    @Inject(IEventServiceToken)
    private readonly eventService: IEventService,
  ) {}

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'Events retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getAllEvents() {
    try {
      const events = await this.eventService.findAllEvents();
      return new ResponseEventDto(events).toResponse();
    } catch (error) {
      this.handleError(error);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_SYS, Role.ADMIN_STORE, Role.CLIENT)
  @Get('status/:status')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'Events retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getEventsByStatus(@Param('status') status: string) {
    try {
      const events = await this.eventService.findEventByStatus(status);
      return new ResponseEventDto(events).toResponse();
    } catch (error) {
      this.handleError(error);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_SYS, Role.ADMIN_STORE, Role.ADMIN_BRANCH)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: 201,
    description: 'Event created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBody({ type: CreateEventDto })
  async createEvent(@Body() event: CreateEventDto) {
    try {
      const createdEvent = await this.eventService.createEvent(event);
      return {
        message: 'Event created successfully',
        event: createdEvent,
      };
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
