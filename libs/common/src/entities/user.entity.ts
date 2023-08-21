import { AbstractEntity } from '@app/common';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { Role } from './role.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User extends AbstractEntity<User> {
  @Column()
  email: string;

  // hide this field from the response
  @Exclude()
  @Column()
  password: string;

  @ManyToMany(() => Role, { cascade: true })
  @JoinTable()
  roles?: Role[];
}
