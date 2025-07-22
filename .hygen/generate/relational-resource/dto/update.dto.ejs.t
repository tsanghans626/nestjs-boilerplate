---
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/dto/update-<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.dto.ts
---
// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { Create<%= h.inflection.transform(name, ['camelize']) %>Dto } from './create-<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.dto';

export class Update<%= h.inflection.transform(name, ['camelize']) %>Dto extends PartialType(Create<%= h.inflection.transform(name, ['camelize']) %>Dto) {}
