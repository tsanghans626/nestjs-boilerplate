import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationResponseDto<T> {
  records: T[];
  total: number;
  current: number;
  size: number;
  totalPages: number;
}

export function PaginationResponse<T>(classReference: Type<T>) {
  abstract class Pagination {
    @ApiProperty({ type: [classReference] })
    records!: T[];

    @ApiProperty({
      type: Number,
      example: 100,
    })
    total: number;

    @ApiProperty({
      type: Number,
      example: 1,
    })
    current: number;

    @ApiProperty({
      type: Number,
      example: 10,
    })
    size: number;

    @ApiProperty({
      type: Number,
      example: 10,
    })
    totalPages: number;
  }

  Object.defineProperty(Pagination, 'name', {
    writable: false,
    value: `Pagination${classReference.name}ResponseDto`,
  });

  return Pagination;
}
