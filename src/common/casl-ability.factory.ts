import {
  AbilityBuilder,
  createMongoAbility,
  MongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { UserDocument } from '../users/users.schema';

export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete';
export type Subjects = 'user' | 'all';
export type AppAbility = MongoAbility<[Actions, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: UserDocument) {
    console.log(user.role);

    const { can, cannot, build } = new AbilityBuilder(createMongoAbility);
    if (user.role === 'admin') {
      can('manage', 'all');
    } else if (user.role === 'user') {
      can('read', 'user');
    }
    return build();
  }
}
