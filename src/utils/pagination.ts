import { IPaginationOptions } from './types/pagination-options';
import { PaginationResponseDto } from './dto/pagination-response.dto';

export const pagination = <T>(
  records: T[],
  options: IPaginationOptions,
  total: number,
): PaginationResponseDto<T> => {
  const totalPages = Math.ceil(total / options.size);

  return {
    records,
    total,
    current: options.current,
    size: options.size,
    totalPages,
  };
};
