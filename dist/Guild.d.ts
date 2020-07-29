import Client from './Client';
import Channel from './Channel';
import ServerMember from './ServerMember';
import RolesManager from './RolesManager';
import { IServerAuth, IServerMemberAuth } from './Interfaces/AuthenticationData';
import Collection from '@discordjs/collection';
export default class Guild {
    id: string;
    client: Client;
    name: string;
    channels: Collection<string, Channel>;
    members: Collection<string, ServerMember>;
    icon?: string;
    roles: RolesManager;
    constructor(server: IServerAuth, client: Client);
    get iconURL(): string;
    _addMember(data: IServerMemberAuth): ServerMember | undefined;
}
