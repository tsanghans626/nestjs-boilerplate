---
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>.service.ts
---
import { 
  // common
  Injectable,
} from '@nestjs/common';
import { Create<%= h.inflection.transform(name, ['camelize']) %>Dto } from './dto/create-<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.dto';
import { Update<%= h.inflection.transform(name, ['camelize']) %>Dto } from './dto/update-<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.dto';
import { <%= h.inflection.transform(name, ['camelize']) %>Repository } from './infrastructure/persistence/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { <%= h.inflection.transform(name, ['camelize']) %> } from './domain/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>';

@Injectable()
export class <%= h.inflection.transform(name, ['camelize']) %>Service {
  constructor(
    // Dependencies here
    private readonly <%= h.inflection.camelize(name, true) %>Repository: <%= h.inflection.transform(name, ['camelize']) %>Repository,
  ) {}

  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    create<%= h.inflection.transform(name, ['camelize']) %>Dto: Create<%= h.inflection.transform(name, ['camelize']) %>Dto
  ) {
    // Do not remove comment below.
    // <creating-property />

    return this.<%= h.inflection.camelize(name, true) %>Repository.create({
      // Do not remove comment below.
      // <creating-property-payload />
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.<%= h.inflection.camelize(name, true) %>Repository.findAllWithPagination({
      paginationOptions
    });
  }

  findById(id: <%= h.inflection.transform(name, ['camelize']) %>['id']) {
    return this.<%= h.inflection.camelize(name, true) %>Repository.findById(id);
  }

  findByIds(ids: <%= h.inflection.transform(name, ['camelize']) %>['id'][]) {
    return this.<%= h.inflection.camelize(name, true) %>Repository.findByIds(ids);
  }

  async update(
    id: <%= h.inflection.transform(name, ['camelize']) %>['id'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update<%= h.inflection.transform(name, ['camelize']) %>Dto: Update<%= h.inflection.transform(name, ['camelize']) %>Dto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.<%= h.inflection.camelize(name, true) %>Repository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: <%= h.inflection.transform(name, ['camelize']) %>['id']) {
    return this.<%= h.inflection.camelize(name, true) %>Repository.remove(id);
  }
}
