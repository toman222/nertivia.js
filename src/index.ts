import _IAuthenticationData from './Interfaces/AuthenticationData'
import _IClientEvents, { clientEventsNames as _clientEventsNames } from './Interfaces/ClientEvents'
import _IMessageButton from './Interfaces/MessageButton'
import _IRolePermissions from './Interfaces/RolePermissions'
import _ISendOptions from './Interfaces/SendOptions'
import _IUser from './Interfaces/User'

export { default as Presence } from './Presence'
export { default as ServerMember } from './ServerMember'
export { default as Guild } from './Guild'
export { default as Role } from './Role'
export { default as Message } from './Message'
export { default as Client } from './Client'

// export const HTMLEmbedBuilder = _HTMLEmbedBuilder
export { default as HTMLEmbedBuilder } from './HTMLEmbedBuilder'

export namespace Interfaces {
  export type IAuthenticationData = _IAuthenticationData
  export type IClientEvents = _IClientEvents
  export namespace ClientEvents {
    export const clientEventsNames = _clientEventsNames
  }
  export type IMessageButton = _IMessageButton
  export type IRolePermissions = _IRolePermissions
  export type ISendOptions = _ISendOptions
  export type IUser = _IUser
}
