---
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/infrastructure/persistence/relational/relational-persistence.module.ts
---
import { Module } from '@nestjs/common';
import { <%= h.inflection.transform(name, ['camelize']) %>Repository } from '../<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.repository';
import { <%= h.inflection.transform(name, ['camelize']) %>RelationalRepository } from './repositories/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { <%= h.inflection.transform(name, ['camelize']) %>Entity } from './entities/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.entity';

@Module({
  imports: [TypeOrmModule.forFeature([<%= h.inflection.transform(name, ['camelize']) %>Entity])],
  providers: [
    {
      provide: <%= h.inflection.transform(name, ['camelize']) %>Repository,
      useClass: <%= h.inflection.transform(name, ['camelize']) %>RelationalRepository,
    },
  ],
  exports: [<%= h.inflection.transform(name, ['camelize']) %>Repository],
})
export class Relational<%= h.inflection.transform(name, ['camelize']) %>PersistenceModule {}
