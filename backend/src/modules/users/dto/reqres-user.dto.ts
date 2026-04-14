import { ApiProperty } from '@nestjs/swagger';

/**
 * Represents a user as it comes from the ReqRes API
 */
export class ReqresUserDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'george.bluth@reqres.in' })
  email: string;

  @ApiProperty({ example: 'George' })
  first_name: string;

  @ApiProperty({ example: 'Bluth' })
  last_name: string;

  @ApiProperty({ example: 'https://reqres.in/img/faces/1-image.jpg' })
  avatar: string;

  @ApiProperty({
    description: 'Indicates if the user was already imported to the local DB',
  })
  isSaved: boolean;

  @ApiProperty({
    description: 'Local ID if imported, null if not',
    nullable: true,
  })
  localId: number | null;
}

export class ReqresUsersResponseDto {
  @ApiProperty({ type: [ReqresUserDto] })
  data: ReqresUserDto[];

  @ApiProperty()
  page: number;

  @ApiProperty()
  per_page: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  total_pages: number;
}
