---
inject: true
to: src/database/seeds/relational/seed.module.ts
after: imports
---
    <%= h.inflection.transform(name, ['camelize']) %>SeedModule,