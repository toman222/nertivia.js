import Channel from '../Channel';
import Client from '../Client';
import Guild from '../Guild';
import Message from '../Message';
import Role from '../Role';
import User from '../User';
import { SendOptions } from '../Interfaces/SendOptions';
export default class Fetch {
    client: Client;
    constructor(client: Client);
    postJSON(method: string, path: string, json?: any): Promise<any>;
    send(content: string, opts: SendOptions, channel: Channel | User): Promise<Message>;
    deleteMessage(channel: Channel, message: Message): Promise<Message>;
    edit(content: string, opts: SendOptions, message: Message): Promise<Message>;
    createDM(recipient: User): Promise<Channel>;
    getExistingDM(user: User): Channel | undefined;
    setStatus(status: number): Promise<any>;
    setActivity(content: string): Promise<any>;
    messageButtonCallback(channelID: string, messageID: string, buttonID: string, clickedByID: string, message?: string): Promise<any>;
    createRole(opts: {
        data: {
            name: string;
            color: string;
        };
    }, guild: Guild): Promise<any>;
    updateRole(opts: any, role: Role, guild: Guild): Promise<any>;
    createInvite(guild: Guild): Promise<{
        invite_code: string;
    }>;
}
