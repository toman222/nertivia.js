import Client from './Client';
import Channel from './Channel';
import Guild from './Guild';
import User from './User';
import ServerMember from './ServerMember';
import MessageMentions from './MessageMentions';
import { SendOptions } from './Interfaces/SendOptions';
export default class Message {
    id: string;
    content?: string;
    author: User;
    channel: Channel | undefined;
    guild: Guild | undefined;
    client: Client;
    member: ServerMember | undefined;
    mentions: MessageMentions;
    constructor(message: any, client: Client);
    send(content: string, options?: SendOptions): Promise<Message> | undefined;
    edit(content: string, options?: SendOptions): Promise<Message>;
    reply(content: string, options?: SendOptions): Promise<Message> | undefined;
    delete(delay?: number): void;
}
