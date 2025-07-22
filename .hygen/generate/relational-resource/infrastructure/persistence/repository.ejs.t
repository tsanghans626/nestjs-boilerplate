---
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/infrastructure/persistence/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.repository.ts
---
import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { <%= h.inflection.transform(name, ['camelize']) %> } from '../../domain/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>';

export abstract class <%= h.inflection.transform(name, ['camelize']) %>Repository {
  abstract create(
    data: Omit<<%= h.inflection.transform(name, ['camelize']) %>, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<<%= h.inflection.transform(name, ['camelize']) %>>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<[<%= h.inflection.transform(name, ['camelize']) %>[], number]>;

  abstract findById(id: <%= h.inflection.transform(name, ['camelize']) %>['id']): Promise<NullableType<<%= h.inflection.transform(name, ['camelize']) %>>>;

  abstract findByIds(ids: <%= h.inflection.transform(name, ['camelize']) %>['id'][]): Promise<<%= h.inflection.transform(name, ['camelize']) %>[]>;

  abstract update(
    id: <%= h.inflection.transform(name, ['camelize']) %>['id'],
    payload: DeepPartial<<%= h.inflection.transform(name, ['camelize']) %>>,
  ): Promise<<%= h.inflection.transform(name, ['camelize']) %> | null>;

  abstract remove(id: <%= h.inflection.transform(name, ['camelize']) %>['id']): Promise<void>;
}
