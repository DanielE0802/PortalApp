import {
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsInt,
  IsPositive,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    minLength: 3,
    maxLength: 255,
    example: 'Introducción a React Hooks',
  })
  @IsString()
  @MinLength(3, { message: 'El título debe tener al menos 3 caracteres' })
  @MaxLength(255, { message: 'El título no puede superar 255 caracteres' })
  title: string;

  @ApiProperty({
    minLength: 10,
    example:
      'Los React Hooks revolucionaron la forma en que escribimos componentes funcionales.',
  })
  @IsString()
  @MinLength(10, { message: 'El contenido debe tener al menos 10 caracteres' })
  content: string;

  @ApiPropertyOptional({
    description: 'ID local del autor (tabla users)',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  authorUserId?: number;

  @ApiPropertyOptional({
    description: 'ID de ReqRes del autor (si no está importado)',
    example: 4,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  reqresAuthorId?: number;
}
