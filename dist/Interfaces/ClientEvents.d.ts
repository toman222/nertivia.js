import { IMessageButton } from './MessageButton';
import { Channel, Role, Guild, ServerMember, Message, Presence } from '..';
export interface IClientEvents {
    channelCreate: (channel: Channel) => void;
    channelDelete: (channel: Channel) => void;
    error: (error: Error) => void;
    guildCreate: (guild: Guild) => void;
    guildDelete: (guild: Guild) => void;
    guildMemberAdd: (serverMember: ServerMember) => void;
    guildMemberRemove: (serverMember: ServerMember) => void;
    message: (message: Message) => void;
    messageButtonClicked: (Button: IMessageButton, done: (message?: string) => Promise<any>) => void;
    presenceUpdate: (presence: Presence) => void;
    ready: () => void;
    roleCreate: (role: Role) => void;
    roleUpdate: (role: Role) => void;
}
export declare enum clientEventsNames {
    channelCreate = "server:add_channel",
    channelDelete = "server:remove_channel",
    error = "error",
    guildCreate = "server:joined",
    guildDelete = "server:leave",
    guildMemberAdd = "server:member_add",
    guildMemberRemove = "server:member_remove",
    message = "receiveMessage",
    messageButtonClicked = "message_button_clicked",
    presenceUpdate = "userStatusChange",
    ready = "ready",
    roleCreate = "server:create_role",
    roleUpdate = "server:update_role"
}
