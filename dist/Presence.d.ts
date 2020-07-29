import Client from './Client';
import { PresenceStatus } from './Interfaces/Status';
import User from './User';
export default class Presence {
    client: Client;
    status: PresenceStatus;
    user: User;
    activity: string | null;
    constructor(status: PresenceStatus | number, activity: string | undefined, user: User, client: Client);
}
