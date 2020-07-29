import { IMessageButton } from './MessageButton'

import { Channel, Role, Guild, ServerMember, Message, Presence } from '..'

export interface IClientEvents {
  channelCreate: (channel: Channel) => void
  channelRemove: (channel: Channel) => void
  error: (error: Error) => void
  guildCreate: (guild: Guild) => void
  guildRemove: (guild: Guild) => void
  guildMemberAdd: (serverMember: ServerMember) => void
  guildMemberRemove: (serverMember: ServerMember) => void
  message: (message: Message) => void
  messageButtonClicked: (Button: IMessageButton, done: (message?: string) => Promise<any>) => void
  presenceUpdate: (presence: Presence) => void
  ready: () => void
  roleCreate: (role: Role) => void
  roleUpdate: (role: Role) => void
}

export enum clientEventsNames {
  channelCreate = 'server:add_channel',
  channelRemove = 'server:remove_channel',
  error = 'error',
  guildCreate = 'server:joined',
  guildRemove = 'server:leave',
  guildMemberAdd = 'server:member_add',
  guildMemberRemove = 'server:member_remove',
  message = 'receiveMessage',
  messageButtonClicked = 'message_button_clicked',
  presenceUpdate = 'userStatusChange',
  ready = 'ready',
  roleCreate = 'server:create_role',
  roleUpdate = 'server:update_role'
  /* Not implemented yet
  typingStatus {"channel_id":"6692365473675218944","user":{"unique_id":"6692353538904821760","username":"Toby"}}
  */
}
