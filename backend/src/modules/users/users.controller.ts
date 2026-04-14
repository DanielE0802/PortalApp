import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'List users from ReqRes (proxy)' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Paginated list of ReqRes users' })
  findReqresUsers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return this.usersService.findReqresUsers(page);
  }

  @Get('reqres/:reqresId')
  @ApiOperation({ summary: 'Get user detail from ReqRes (proxy)' })
  @ApiResponse({ status: 200, description: 'ReqRes user detail' })
  @ApiResponse({ status: 404, description: 'User not found in ReqRes' })
  findReqresUser(@Param('reqresId', ParseIntPipe) reqresId: number) {
    return this.usersService.findReqresUserById(reqresId);
  }

  @Post('import/:reqresId')
  @ApiOperation({ summary: 'Import user from ReqRes and save to database' })
  @ApiResponse({ status: 201, description: 'User imported successfully' })
  @ApiResponse({ status: 404, description: 'User not found in ReqRes' })
  importUser(@Param('reqresId', ParseIntPipe) reqresId: number) {
    return this.usersService.importUser(reqresId);
  }

  @Get('saved')
  @ApiOperation({ summary: 'List locally saved users (paginated)' })
  @ApiResponse({ status: 200, description: 'Paginated list of saved users' })
  findSaved(@Query() query: PaginationQueryDto) {
    return this.usersService.findSavedUsers(query.page, query.limit);
  }

  @Get('saved/:id')
  @ApiOperation({ summary: 'Get saved user by local ID' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findById(id);
  }

  @Delete('saved/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete saved user' })
  @ApiResponse({ status: 204, description: 'User deleted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }
}
