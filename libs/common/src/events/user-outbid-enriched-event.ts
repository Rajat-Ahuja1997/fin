import { User } from '../entities';

export class UserOutbidEnrichedEvent {
  constructor(public readonly users: User[]) {}

  toString() {
    return JSON.stringify({
      users: this.users,
    });
  }
}
