---
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/dto/query-<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.dto.ts
---
import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { <%= h.inflection.transform(name, ['camelize']) %> } from '../domain/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>';
import { BaseQueryDto } from '../../utils/dto/base-query.dto';

export class Filter<%= h.inflection.transform(name, ['camelize']) %>Dto {
  // TODO: Add filter properties here
}


export class Query<%= h.inflection.transform(name, ['camelize']) %>Dto extends IntersectionType(
  BaseQueryDto<<%= h.inflection.transform(name, ['camelize']) %>>,
  Filter<%= h.inflection.transform(name, ['camelize']) %>Dto,
) {}