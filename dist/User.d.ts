import Client from './Client';
import Presence from './Presence';
import { SendOptions } from './Interfaces/SendOptions';
export default class User {
    username: string;
    tag: string;
    avatar?: string;
    id: string;
    discriminator: string;
    client: Client;
    presence: Presence;
    avatarURL: string;
    bot: boolean;
    constructor(user: any, client: Client);
    toString(): string;
    send(content: string, options?: SendOptions): Promise<import("./Message").default>;
}
