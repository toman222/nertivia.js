import { Channel, Guild, Message, Role, ServerMember } from '.'

import Users from './Users'
import Channels from './Channels'
import Guilds from './Guilds'
import DataManager from './DataManager'
import ClientUser from './ClientUser'

import Fetch from './Utils/fetch'

import { IAuthenticationData, IServerRoleAuth, IServerMemberAuth, IServerAuth, IChannelAuth } from './Interfaces/AuthenticationData'
import { PresenceStatusData, PresenceStatus } from './Interfaces/Status'
import { IClientEvents, clientEventsNames } from './Interfaces/ClientEvents'

import io from 'socket.io-client'
import wildcard from 'socketio-wildcard'
const socketIOWildcard = wildcard(io.Manager)

export default class Client {
  token: string | null = null
  user?: ClientUser = undefined
  listeners: Map<keyof IClientEvents | string, Function | undefined> = new Map()
  socket: SocketIOClient.Socket = io('https://nertivia.supertiger.tk', { autoConnect: true })
  users: Users = new Users(this)
  channels: Channels = new Channels(this)
  guilds: Guilds = new Guilds(this)
  fetch: Fetch = new Fetch(this)
  dataManager: DataManager = new DataManager(this)

  login (token: string) {
    return new Promise((resolve, reject) => {
      if (this.token) reject(new Error('Already logged in.'))
      this.token = token
      this.socket.connect()
      socketIOWildcard(this.socket)
      const connectEvent = () => {
        this.socket.removeAllListeners()
        this.socket.emit('authentication', { token })
        this.socket.once('success', (data: IAuthenticationData) => {
          resolve('success')
          this.socket.off('auth_err')
          this.dataManager.newUser(data.user)
          this.user = new ClientUser(data.user, this)

          // get DM Channels + users
          for (const dm of data.dms) {
            if (dm.recipients === undefined) {
              continue
            }
            this.dataManager.newUser(dm.recipients[0])
            this.dataManager.newChannel(dm)
          }

          // get servers + channels
          for (const server of data.user.servers) {
            const guild = new Guild(server, this)
            this.guilds.cache.set(server.server_id, guild)
            for (const channel of server.channels) {
              this.dataManager.newChannel(channel, guild)
            }
          }

          // get server users
          for (const member of data.serverMembers) {
            this.addServerMember(member)
          }
          // get presences
          for (const presence of data.memberStatusArr) {
            this.setMemberPresence(presence)
          }
          // get activity status
          for (const status of data.customStatusArr) {
            this.setMemberActivityStatus(status)
          }
          // get roles
          for (const role of data.serverRoles) {
            this.addServerRoles(role)
          }

          const readyCB = this.listeners.get(clientEventsNames.ready)
          if (readyCB) readyCB()
        })
        this.socket.once('auth_err', (data: string) => {
          reject(new Error(data))
          this.socket.removeAllListeners()
        })
        this.socket.on('disconnect', () => {
          const cb = this.listeners.get(clientEventsNames.error)
          if (cb) cb(new Error('Connection Lost.'))
          else throw new Error('Connection Lost.')
          this.socket.removeAllListeners()
          this.socket.on('connect', connectEvent)
        })
        this.socket.on('*', (res: any) => {
          const [event, data]: [string, any] = res.data
          if (Object.keys(events).includes(event)) {
            const func = events[event](data, this)
            if (func === undefined) { return }
            return this.listeners.get(func[0])?.call(func[1], func[2]?.call(data, this))
          } else {
            console.warn(`Received unexpected event:\n${event}`)
            console.warn(`With data:\n${JSON.stringify(data)}`)
          }
        })
      }
      this.socket.on('connect', connectEvent)
    })
  }

  on<T extends keyof IClientEvents> (type: T, callback: IClientEvents[T]) {
    if (this.listeners.get(type)) { return }
    this.listeners.set(type, callback)
  }

  off<T extends keyof IClientEvents> (type: T) {
    this.listeners.delete(type)
  }

  addServerRoles (role: IServerRoleAuth) {
    const guild = this.guilds.cache.get(role.server_id)
    if (guild !== undefined) {
      guild.roles.cache.set(role.id, new Role(role, guild))
    }
  }

  addServerMember (member: IServerMemberAuth) {
    const guild = this.guilds.cache.get(member.server_id)
    if (guild !== undefined) {
      guild.addMember(member)
    }
  }

  setMemberPresence ([id, status]: [string, string]) {
    const user = this.users.cache.get(id)
    if (user !== undefined) {
      user.presence.status = PresenceStatusData[parseInt(status)] as PresenceStatus
    }
  }

  setMemberActivityStatus ([id, activity]: [string, string]) {
    const user = this.users.cache.get(id)
    if (user !== undefined) {
      user.presence.activity = activity
    }
  }

  buttonDone (data: {channelID: string, messageID: string, id: string, clickedByID: string}) {
    const client = this
    return function (message?: string) {
      return client.fetch.messageButtonCallback(data.channelID, data.messageID, data.id, data.clickedByID, message)
    }
  }
}

const events: {[key: string]: (data: any, client: Client)=>[string, any?, Function?]|undefined} = {
  [clientEventsNames.message]: (data: {message: any}, client: Client) => {
    return ['message', new Message(data.message, client)]
  },
  [clientEventsNames.presenceUpdate]: (data: { uniqueID: string, status: string }, client: Client) => {
    const presence = client.users.cache.get(data.uniqueID)?.presence
    if (presence) {
      presence.status = PresenceStatusData[parseInt(data.status)] as PresenceStatus
      return ['presenceUpdate', presence]
    }
    return undefined
  },
  'member:custom_status_change': (data: { uniqueID: string, custom_status: string }, client: Client) => {
    const presence = client.users.cache.get(data.uniqueID)?.presence
    if (presence) {
      presence.activity = data.custom_status
      return ['presenceUpdate', presence]
    }
    return undefined
  },
  [clientEventsNames.channelCreate]: (data: { channelAuth: IChannelAuth }, client: Client) => {
    return ['channel', new Channel(data.channelAuth, client)]
  },
  [clientEventsNames.channelRemove]: (data: { channelID: string, server_id?: string}, client: Client) => {
    const channel = client.channels.cache.get(data.channelID)
    if (channel === undefined) {
      return undefined
    }
    client.channels.cache.delete(data.channelID)
    if (data.server_id !== undefined) {
      const guild = client.guilds.cache.get(data.server_id)
      if (guild !== undefined && guild.channels.has(data.channelID)) {
        guild.channels.delete(data.channelID)
      }
    }
    client.channels.cache.delete(data.channelID)
    return ['channelRemove', channel]
  },
  [clientEventsNames.guildMemberAdd]: (data: { serverMember: IServerMemberAuth, custom_status?: string, presence: string }, client: Client) => {
    const user = client.users.cache.get(data.serverMember.member.uniqueID)
    if (user !== undefined) {
      user.presence.status = PresenceStatusData[parseInt(data.presence)] as PresenceStatus
      user.presence.activity = data.custom_status ?? null
      return ['guildMemberAdd', client.guilds.cache.get(data.serverMember.server_id)?.addMember(data.serverMember)]
    }
    return undefined
  },
  [clientEventsNames.guildMemberRemove]: (data: { uniqueID: string, server_id: string }, client: Client) => {
    const guild = client.guilds.cache.get(data.server_id)
    const member = guild?.members.get(data.uniqueID)
    const memberClone: ServerMember = Object.assign(Object.create(Object.getPrototypeOf(member)), member)
    if (guild) {
      guild.members.delete(data.uniqueID)
    }
    return ['guildMemberRemove', memberClone]
  },
  'server:update_server': (data: IServerAuth, client: Client) => {
    const guild = client.guilds.cache.get(data.server_id)
    if (guild !== undefined) {
      guild.name = data.name
      if (data.avatar) {
        guild.icon = data.avatar
      }
    }
    return undefined
  },
  [clientEventsNames.guildCreate]: (server: IServerAuth, client: Client) => {
    const guild = new Guild(server, client)
    client.guilds.cache.set(server.server_id, guild)
    for (let index = 0; index < server.channels.length; index++) {
      const channel = server.channels[index]
      client.dataManager.newChannel(channel, guild)
      return ['guildCreate', guild]
    }
    return undefined
  },
  [clientEventsNames.messageButtonClicked]: (data: any, client: Client) => {
    return ['messageButtonClicked', data, client.buttonDone.bind(client)]
  },
  [clientEventsNames.roleUpdate]: (data: IServerRoleAuth, client: Client) => {
    const guild = client.guilds.cache.get(data.server_id)
    if (!guild) {
      return undefined
    }
    const role = guild.roles.cache.get(data.id)
    if (!role) {
      return undefined
    }
    role.permissions = data.permissions || role.permissions
    role.color = data.color || role.color
    role.name = data.name || role.name
    return ['roleUpdate', role]
  },
  [clientEventsNames.roleCreate]: (data: IServerRoleAuth, client: Client) => {
    const guild = client.guilds.cache.get(data.server_id)
    if (!guild) {
      return undefined
    }
    if (guild.roles.cache.has(data.id)) {
      return undefined
    }
    const role = new Role(data, guild)
    guild.roles.cache.set(data.id, role)
    return ['roleCreate', role]
  },
  [clientEventsNames.guildRemove]: (data: any, client: Client) => {
    const guild = client.guilds.cache.get(data.server_id)
    if (guild) {
      client.guilds.cache.delete(data.server_id)
    }
    return ['guildDelete', guild]
  },
  'server:members': (data: {
      serverMembers: IServerMemberAuth[],
      memberPresences: [string, string][],
      programActivityArr: [string, string][]
    }, client: Client) => {
    for (const member of data.serverMembers) {
      client.addServerMember(member)
    }
    for (const presence of data.memberPresences) {
      client.setMemberPresence(presence)
    }
    for (const activity of data.programActivityArr) {
      client.setMemberActivityStatus(activity)
    }

    // guild create is used here since members is a seperate event
    // and members array would be empty if used properly.
    const guild = client.guilds.cache.get(data.serverMembers[0].server_id)
    if (guild === undefined) {
      return undefined
    }
    return ['guildCreate', guild]
  },
  'server:roles': (data: {roles: IServerRoleAuth[]}, client: Client) => {
    for (const role of data.roles) {
      client.addServerRoles(role)
    }
    return undefined
  }
}
