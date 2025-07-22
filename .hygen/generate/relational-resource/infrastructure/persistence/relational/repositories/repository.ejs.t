---
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/infrastructure/persistence/relational/repositories/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.repository.ts
---
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { <%= h.inflection.transform(name, ['camelize']) %>Entity } from '../entities/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { <%= h.inflection.transform(name, ['camelize']) %> } from '../../../../domain/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>';
import { <%= h.inflection.transform(name, ['camelize']) %>Repository } from '../../<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.repository';
import { <%= h.inflection.transform(name, ['camelize']) %>Mapper } from '../mappers/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class <%= h.inflection.transform(name, ['camelize']) %>RelationalRepository implements <%= h.inflection.transform(name, ['camelize']) %>Repository {
  constructor(
    @InjectRepository(<%= h.inflection.transform(name, ['camelize']) %>Entity)
    private readonly <%= h.inflection.camelize(name, true) %>Repository: Repository<<%= h.inflection.transform(name, ['camelize']) %>Entity>,
  ) {}

  async create(data: <%= h.inflection.transform(name, ['camelize']) %>): Promise<<%= h.inflection.transform(name, ['camelize']) %>> {
    const persistenceModel = <%= h.inflection.transform(name, ['camelize']) %>Mapper.toPersistence(data);
    const newEntity = await this.<%= h.inflection.camelize(name, true) %>Repository.save(
      this.<%= h.inflection.camelize(name, true) %>Repository.create(persistenceModel),
    );
    return <%= h.inflection.transform(name, ['camelize']) %>Mapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<[<%= h.inflection.transform(name, ['camelize']) %>[], number]> {
    const [entities, total] = await this.<%= h.inflection.camelize(name, true) %>Repository.findAndCount({
      skip: (paginationOptions.current - 1) * paginationOptions.size,
      take: paginationOptions.size,
    });

    return [entities.map((entity) => <%= h.inflection.transform(name, ['camelize']) %>Mapper.toDomain(entity)), total];
  }

  async findById(id: <%= h.inflection.transform(name, ['camelize']) %>['id']): Promise<NullableType<<%= h.inflection.transform(name, ['camelize']) %>>> {
    const entity = await this.<%= h.inflection.camelize(name, true) %>Repository.findOne({
      where: { id },
    });

    return entity ? <%= h.inflection.transform(name, ['camelize']) %>Mapper.toDomain(entity) : null;
  }

  async findByIds(ids: <%= h.inflection.transform(name, ['camelize']) %>['id'][]): Promise<<%= h.inflection.transform(name, ['camelize']) %>[]> {
    const entities = await this.<%= h.inflection.camelize(name, true) %>Repository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => <%= h.inflection.transform(name, ['camelize']) %>Mapper.toDomain(entity));
  }

  async update(
    id: <%= h.inflection.transform(name, ['camelize']) %>['id'],
    payload: Partial<<%= h.inflection.transform(name, ['camelize']) %>>,
  ): Promise<<%= h.inflection.transform(name, ['camelize']) %>> {
    const entity = await this.<%= h.inflection.camelize(name, true) %>Repository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.<%= h.inflection.camelize(name, true) %>Repository.save(
        <%= h.inflection.transform(name, ['camelize']) %>Mapper.toPersistence({
          ...<%= h.inflection.transform(name, ['camelize']) %>Mapper.toDomain(entity),
          ...payload,
        }),
    );

    return <%= h.inflection.transform(name, ['camelize']) %>Mapper.toDomain(updatedEntity);
  }

  async remove(id: <%= h.inflection.transform(name, ['camelize']) %>['id']): Promise<void> {
    await this.<%= h.inflection.camelize(name, true) %>Repository.delete(id);
  }
}
