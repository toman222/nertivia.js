import User from './User';
import Client from './Client';
import Guild from './Guild';
export default class ServerMember {
    user: User;
    client: Client;
    type: string;
    guild: Guild;
    constructor(client: Client, guild: Guild, member: any);
    toString(): string;
}
