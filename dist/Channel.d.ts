import Client from './Client';
import Guild from './Guild';
import User from './User';
import SendOptions from './Interfaces/SendOptions';
import { IChannelAuth } from './Interfaces/AuthenticationData';
export default class Channel {
    id: string;
    name?: string;
    guild?: Guild;
    recipient?: User;
    client: Client;
    constructor(channel: IChannelAuth, client: Client);
    send(content: string, options?: SendOptions): Promise<import("./Message").default>;
    toString(): string;
}
