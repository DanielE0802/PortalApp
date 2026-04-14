import { IsOptional, IsString, IsInt, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

/**
 * Query DTO for listing posts.
 */
export class FindPostsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Buscar por título',
    example: 'react',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filtrar por ID de autor local' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  authorUserId?: number;

  @ApiPropertyOptional({ description: 'Filtrar por ID de autor en ReqRes' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  reqresAuthorId?: number;

  @ApiPropertyOptional({
    enum: ['newest', 'oldest', 'title'],
    default: 'newest',
    description: 'Orden de resultados',
  })
  @IsOptional()
  @IsIn(['newest', 'oldest', 'title'])
  orderBy?: 'newest' | 'oldest' | 'title' = 'newest';
}
