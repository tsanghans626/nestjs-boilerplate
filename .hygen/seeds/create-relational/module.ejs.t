---
to: src/database/seeds/relational/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>-seed.module.ts
---
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { <%= h.inflection.transform(name, ['camelize']) %>Entity } from '../../../../<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/infrastructure/persistence/relational/entities/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.entity';
import { <%= h.inflection.transform(name, ['camelize']) %>SeedService } from './<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([<%= h.inflection.transform(name, ['camelize']) %>Entity])],
  providers: [<%= h.inflection.transform(name, ['camelize']) %>SeedService],
  exports: [<%= h.inflection.transform(name, ['camelize']) %>SeedService],
})
export class <%= h.inflection.transform(name, ['camelize']) %>SeedModule {}
