import Client from './Client';
import User from './User';
import Collection from '@discordjs/collection';
export default class Users {
    client: Client;
    cache: Collection<string, User>;
    constructor(client: Client);
    fetch(_id: string, _cache?: boolean): void;
}
