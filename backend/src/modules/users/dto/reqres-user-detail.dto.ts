import { ApiProperty } from '@nestjs/swagger';
import { ReqresUserDto } from './reqres-user.dto';

/**
 * Detail of a ReqRes user, with support info.
 */
export class ReqresUserDetailDto extends ReqresUserDto {
  @ApiProperty({ nullable: true })
  support?: {
    url: string;
    text: string;
  };
}
