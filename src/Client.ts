import Users from './Users'
import Channels from './Channels'
import Guilds from './Guilds'
import Guild from './Guild'
import Message from './Message'
import Fetch from './Utils/fetch'
import DataManager from './DataManager'
import ClientUser from './ClientUser'
import Role from './Role'

import IAuthenticationData from './Interfaces/AuthenticationData'
import { PresenceStatusData, PresenceStatus } from './Interfaces/Status'
import IClientEvents, { clientEventsNames } from './Interfaces/ClientEvents'

import io from 'socket.io-client'
import wildcard from 'socketio-wildcard'
const socketIOWildcard = wildcard(io.Manager)

export default class Client {
  token: string | null;
  user: ClientUser | undefined;
  listeners: Map<keyof IClientEvents | string, any>;
  socket: SocketIOClient.Socket;
  users: Users;
  channels: Channels;
  guilds: Guilds;
  fetch: Fetch;
  dataManager: DataManager;
  constructor () {
    this.token = null
    this.user = undefined
    this.listeners = new Map()
    this.socket = io('https://nertivia.supertiger.tk', { autoConnect: true })
    // this.socket = io('http://localhost/', { autoConnect: false });
    this.users = new Users(this)
    this.channels = new Channels(this)
    this.guilds = new Guilds(this)
    this.fetch = new Fetch(this)
    this.dataManager = new DataManager(this)
  }

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
          for (let index = 0; index < data.dms.length; index++) {
            const channel = data.dms[index]
            if (!channel.recipients) continue
            this.dataManager.newUser(channel.recipients[0])
            this.dataManager.newChannel(channel)
          }

          // get servers + channels
          for (let index = 0; index < data.user.servers.length; index++) {
            const server = data.user.servers[index]
            this.guilds.cache.set(server.server_id, new Guild(server, this))
            for (let index = 0; index < server.channels.length; index++) {
              const channel = server.channels[index]
              this.dataManager.newChannel(channel)
            }
          }

          // get server users
          for (let index = 0; index < data.serverMembers.length; index++) {
            this.addServerMember(data.serverMembers[index])
          }

          // get presences
          for (let index = 0; index < data.memberStatusArr.length; index++) {
            this.setMemberPresence(data.memberStatusArr[index])
          }

          // get activity status
          for (let index = 0; index < data.customStatusArr.length; index++) {
            this.setMemberActivityStatus(data.customStatusArr[index])
          }

          // get roles
          for (let index = 0; index < data.serverRoles.length; index++) {
            this.addServerRoles(data.serverRoles[index])
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
          const [event, data]: [any, any] = res.data
          if (Object.keys(events).includes(event)) {
            const func: [string, any, any?] = events[event](data, this)
            if (!func) { return }
            const cb = this.listeners.get(func[0])
            if (!cb) return
            cb(func[1], typeof func[2] === 'function' ? func[2](data, this) : undefined)
          }
        })
      }
      this.socket.on('connect', connectEvent)
    })
  }

  on<T extends keyof IClientEvents> (type: T, callback: IClientEvents[T]) {
    if (this.listeners.get(type)) return
    this.listeners.set(type, callback)
  }

  off<T extends keyof IClientEvents> (type: T) {
    this.listeners.delete(type)
  }

  addServerRoles (role: any) {
    const guild = this.guilds.cache.get(role.server_id)
    if (guild !== undefined) {
      guild.roles.cache.set(role.id, new Role(role, guild))
    }
  }

  addServerMember (member: any) {
    const guild = this.guilds.cache.get(member.server_id)
    if (guild !== undefined) {
      guild._addMember(member)
    }
  }

  setMemberPresence ([id, status]: any) {
    const user = this.users.cache.get(id)
    if (user !== undefined) {
      user.presence.status = PresenceStatusData[parseInt(status)] as PresenceStatus
    }
  }

  setMemberActivityStatus ([id, activity]: any) {
    const user = this.users.cache.get(id)
    if (user !== undefined) {
      user.presence.activity = activity
    }
  }

  buttonDone (data: any) {
    const client = this
    return function (message?: any) {
      return client.fetch.messageButtonCallback(data.channelID, data.messageID, data.id, data.clickedByID, message)
    }
  }
}

const events: {[key: string]: Function} = {
  receiveMessage: (data: any, client: Client) => {
    return ['message', new Message(data.message, client)]
  },
  userStatusChange: (data: { uniqueID: string, status: any }, client: Client) => {
    const presence = client.users.cache.get(data.uniqueID)?.presence
    if (presence) {
      presence.status = PresenceStatusData[parseInt(data.status)] as PresenceStatus
      return ['presenceUpdate', presence]
    }
  },
  'member:custom_status_change': (data: { uniqueID: string, custom_status: string }, client: Client) => {
    const presence = client.users.cache.get(data.uniqueID)?.presence
    if (presence) {
      presence.activity = data.custom_status
      return ['presenceUpdate', presence]
    }
  },
  'server:member_add': (data: { serverMember: any, custom_status: string, presence: string }, client: Client) => {
    if (client.guilds.cache.has(data.serverMember.server_id)) {
      const clientPresence = client.users.cache.get(data.serverMember.member.uniqueID)
      if (clientPresence) {
        if (data.presence) clientPresence.presence.status = PresenceStatusData[parseInt(data.presence)] as PresenceStatus
        if (data.custom_status) clientPresence.presence.activity = data.custom_status
      }
      return ['guildMemberAdd', client.guilds.cache.get(data.serverMember.server_id)?._addMember(data.serverMember)]
    }
  },
  'server:member_remove': (data: { uniqueID: string, server_id: string }, client: Client) => {
    const guild = client.guilds.cache.get(data.server_id)
    const member = guild?.members.get(data.uniqueID)
    const memberClone = Object.assign(Object.create(Object.getPrototypeOf(member)), member)
    if (guild) guild.members.delete(data.uniqueID)
    return ['guildMemberRemove', memberClone]
  },
  'server:update_server': (data: { name: string, server_id: string, avatar: string }, client: Client) => {
    if (client.guilds.cache.has(data.server_id)) {
      const guild = client.guilds.cache.get(data.server_id)
      if (data.name) {
        guild!!.name = data.name
      }
      if (data.avatar) {
        guild!!.icon = data.avatar
      }
    }
  },
  'server:joined': (server: {[key: string]: string}, client: Client) => {
    const guild = new Guild(server, client)
    client.guilds.cache.set(server.server_id, guild)
    for (let index = 0; index < server.channels.length; index++) {
      const channel = server.channels[index]
      client.dataManager.newChannel(channel, guild)
    }
    return ['N/A']
  },
  message_button_clicked: (data: any, client: Client) => {
    return ['messageButtonClicked', data, client.buttonDone.bind(client)]
  },
  'server:update_role': (data: any, client: Client) => {
    const guild = client.guilds.cache.get(data.server_id)
    if (!guild) return
    const role = guild.roles.cache.get(data.id)
    if (!role) return
    role.permissions = data.permissions || role.permissions
    role.color = data.color || role.color
    role.name = data.name || role.name
    return ['roleUpdate', role]
  },
  'server:create_role': (data: any, client: Client) => {
    const guild = client.guilds.cache.get(data.server_id)
    if (!guild) return
    if (guild.roles.cache.has(data.id)) return
    const role = new Role(data, guild)
    guild.roles.cache.set(data.id, role)
    return ['roleCreate', role]
  },
  'server:members': (data: any, client: Client) => {
    const { serverMembers, memberPresences, programActivityArr } = data
    for (let index = 0; index < serverMembers.length; index++) {
      client.addServerMember(serverMembers[index])
    }
    for (let index = 0; index < memberPresences.length; index++) {
      client.setMemberPresence(data.memberPresences[index])
    }
    for (let index = 0; index < programActivityArr.length; index++) {
      client.setMemberActivityStatus(programActivityArr[index])
    }

    // guild create is used here since members is a seperate event
    // and members array would be empty if used properly.
    const guild = client.guilds.cache.get(serverMembers[0].server_id)
    if (guild) {
      return ['guildCreate', guild]
    }
  },
  'server:roles': (data: any, client: Client) => {
    for (let i = 0; i < data.roles.length; i++) {
      client.addServerRoles(data.roles[i])
    }
    return ['N/A']
  }
}
