import { IMessageButton } from './MessageButton';
import { IChannelAuth } from './AuthenticationData';
import Message from '../Message';
import Presence from '../Presence';
import ServerMember from '../ServerMember';
import Guild from '../Guild';
import Role from '../Role';
export interface IClientEvents {
    ready?: () => void;
    message: (message: Message) => void;
    presenceUpdate: (presence: Presence) => void;
    guildMemberAdd: (serverMember: ServerMember) => void;
    guildMemberRemove: (serverMember: ServerMember) => void;
    guildCreate: (guild: Guild) => void;
    channelCreate: (channel: IChannelAuth) => void;
    error: (error: Error) => void;
    messageButtonClicked: (Button: IMessageButton, done: (message?: string) => Promise<any>) => void;
    roleUpdate: (role: Role) => void;
    roleCreate: (role: Role) => void;
    guildDelete: (guild: Guild) => void;
}
export declare enum clientEventsNames {
    ready = "ready",
    message = "receiveMessage",
    presenceUpdate = "userStatusChange",
    channelCreate = "server:add_channel",
    guildMemberAdd = "server:member_add",
    guildMemberRemove = "server:member_remove",
    guildCreate = "server:joined",
    guildDelete = "server:leave",
    messageButtonClicked = "message_button_clicked",
    error = "error",
    roleUpdate = "server:update_role",
    roleCreate = "server:create_role"
}
