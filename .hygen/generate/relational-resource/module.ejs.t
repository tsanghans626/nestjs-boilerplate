---
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>.module.ts
---
import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { <%= h.inflection.transform(name, ['camelize']) %>Service } from './<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>.service';
import { <%= h.inflection.transform(name, ['camelize']) %>Controller } from './<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>.controller';
import { Relational<%= h.inflection.transform(name, ['camelize']) %>PersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    // do not remove this comment
    Relational<%= h.inflection.transform(name, ['camelize']) %>PersistenceModule,
  ],
  controllers: [<%= h.inflection.transform(name, ['camelize']) %>Controller],
  providers: [<%= h.inflection.transform(name, ['camelize']) %>Service],
  exports: [<%= h.inflection.transform(name, ['camelize']) %>Service, Relational<%= h.inflection.transform(name, ['camelize']) %>PersistenceModule],
})
export class <%= h.inflection.transform(name, ['camelize']) %>Module {}
