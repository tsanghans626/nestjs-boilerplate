---
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/infrastructure/persistence/relational/mappers/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.mapper.ts
---
import { <%= h.inflection.transform(name, ['camelize']) %> } from '../../../../domain/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>';
import { <%= h.inflection.transform(name, ['camelize']) %>Entity } from '../entities/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.entity';

export class <%= h.inflection.transform(name, ['camelize']) %>Mapper {
  static toDomain(raw: <%= h.inflection.transform(name, ['camelize']) %>Entity): <%= h.inflection.transform(name, ['camelize']) %> {
    const domainEntity = new <%= h.inflection.transform(name, ['camelize']) %>();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: <%= h.inflection.transform(name, ['camelize']) %>): <%= h.inflection.transform(name, ['camelize']) %>Entity {
    const persistenceEntity = new <%= h.inflection.transform(name, ['camelize']) %>Entity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
