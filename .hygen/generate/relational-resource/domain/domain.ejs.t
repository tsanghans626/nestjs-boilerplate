---
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/domain/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.ts
---
import { ApiProperty } from '@nestjs/swagger';

const idType = Number;

export class <%= h.inflection.transform(name, ['camelize']) %> {
  @ApiProperty({
    type: idType,
  })
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
