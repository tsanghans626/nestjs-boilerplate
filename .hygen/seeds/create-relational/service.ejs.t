---
to: src/database/seeds/relational/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>-seed.service.ts
---
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { <%= h.inflection.transform(name, ['camelize']) %>Entity } from '../../../../<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/infrastructure/persistence/relational/entities/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.entity';
import { Repository } from 'typeorm';

@Injectable()
export class <%= h.inflection.transform(name, ['camelize']) %>SeedService {
  constructor(
    @InjectRepository(<%= h.inflection.transform(name, ['camelize']) %>Entity)
    private repository: Repository<<%= h.inflection.transform(name, ['camelize']) %>Entity>,
  ) {}

  async run() {
    const count = await this.repository.count();

    if (count === 0) {
      await this.repository.save(this.repository.create({}));
    }
  }
}
