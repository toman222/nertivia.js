import Client from './Client';
import User from './User';
import { PresenceStatus } from './Interfaces/Status';
export default class Presence {
    client: Client;
    status: PresenceStatus;
    user: User;
    activity: string | null;
    constructor(status: PresenceStatus | number, activity: string | undefined, user: User, client: Client);
}
