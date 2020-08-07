import Client from './Client';
import Channel from './Channel';
import Collection from '@discordjs/collection';
export default class Channels {
    client: Client;
    cache: Collection<string, Channel>;
    constructor(client: Client);
    fetch(_id: string, _cache?: boolean): void;
}
