---
inject: true
to: src/database/seeds/relational/seed.module.ts
before: \@Module
---
import { <%= h.inflection.transform(name, ['camelize']) %>SeedModule } from './<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>-seed.module';
