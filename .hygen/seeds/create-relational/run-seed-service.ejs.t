---
inject: true
to: src/database/seeds/relational/run-seed.ts
before: close
---
  await app.get(<%= h.inflection.transform(name, ['camelize']) %>SeedService).run();
