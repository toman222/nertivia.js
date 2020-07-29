import _IAuthenticationData from './Interfaces/AuthenticationData';
import _IClientEvents, { clientEventsNames as _clientEventsNames } from './Interfaces/ClientEvents';
import _IMessageButton from './Interfaces/MessageButton';
import _IRolePermissions from './Interfaces/RolePermissions';
import _ISendOptions from './Interfaces/SendOptions';
import _IUser from './Interfaces/User';
export { default as Presence } from './Presence';
export { default as ServerMember } from './ServerMember';
export { default as Guild } from './Guild';
export { default as Role } from './Role';
export { default as Message } from './Message';
export { default as Client } from './Client';
export { default as HTMLEmbedBuilder } from './HTMLEmbedBuilder';
export declare namespace Interfaces {
    type IAuthenticationData = _IAuthenticationData;
    type IClientEvents = _IClientEvents;
    namespace ClientEvents {
        const clientEventsNames: typeof _clientEventsNames;
    }
    type IMessageButton = _IMessageButton;
    type IRolePermissions = _IRolePermissions;
    type ISendOptions = _ISendOptions;
    type IUser = _IUser;
}
