---
inject: true
to: src/database/seeds/relational/run-seed.ts
after: \@nestjs\/core
---
import { <%= h.inflection.transform(name, ['camelize']) %>SeedService } from './<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>-seed.service';