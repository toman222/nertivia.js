import Client from './Client';
import Guild from './Guild';
import Collection from '@discordjs/collection';
export default class Guilds {
    client: Client;
    cache: Collection<string, Guild>;
    constructor(client: Client);
    fetch(_id: string, _cache?: boolean): void;
}
