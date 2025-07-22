---
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/infrastructure/persistence/relational/entities/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.entity.ts
---
import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: '<%= h.inflection.transform(name, ['underscore']) %>',
})
export class <%= h.inflection.transform(name, ['camelize']) %>Entity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
