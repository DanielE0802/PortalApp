import { ApiProperty } from '@nestjs/swagger';

/**
 * Response DTO when importing a user from ReqRes.
 */
export class ImportUserResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  reqresId: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty({ nullable: true })
  avatar: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ description: 'true if the user was already in the database' })
  alreadyExisted: boolean;
}
