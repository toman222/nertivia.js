"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Users_1 = __importDefault(require("./Users"));
const Channels_1 = __importDefault(require("./Channels"));
const Guilds_1 = __importDefault(require("./Guilds"));
const Guild_1 = __importDefault(require("./Guild"));
const Message_1 = __importDefault(require("./Message"));
const fetch_1 = __importDefault(require("./Utils/fetch"));
const DataManager_1 = __importDefault(require("./DataManager"));
const ClientUser_1 = __importDefault(require("./ClientUser"));
const Role_1 = __importDefault(require("./Role"));
const Status_1 = require("./Interfaces/Status");
const ClientEvents_1 = require("./Interfaces/ClientEvents");
const socket_io_client_1 = __importDefault(require("socket.io-client"));
const socketio_wildcard_1 = __importDefault(require("socketio-wildcard"));
const socketIOWildcard = socketio_wildcard_1.default(socket_io_client_1.default.Manager);
class Client {
    constructor() {
        this.token = null;
        this.user = undefined;
        this.listeners = new Map();
        this.socket = socket_io_client_1.default('https://nertivia.supertiger.tk', { autoConnect: true });
        // this.socket = io('http://localhost/', { autoConnect: false })
        this.users = new Users_1.default(this);
        this.channels = new Channels_1.default(this);
        this.guilds = new Guilds_1.default(this);
        this.fetch = new fetch_1.default(this);
        this.dataManager = new DataManager_1.default(this);
    }
    login(token) {
        return new Promise((resolve, reject) => {
            if (this.token)
                reject(new Error('Already logged in.'));
            this.token = token;
            this.socket.connect();
            socketIOWildcard(this.socket);
            const connectEvent = () => {
                this.socket.removeAllListeners();
                this.socket.emit('authentication', { token });
                this.socket.once('success', (data) => {
                    resolve('success');
                    this.socket.off('auth_err');
                    this.dataManager.newUser(data.user);
                    this.user = new ClientUser_1.default(data.user, this);
                    // get DM Channels + users
                    for (const dm of data.dms) {
                        if (dm.recipients === undefined) {
                            continue;
                        }
                        this.dataManager.newUser(dm.recipients[0]);
                        this.dataManager.newChannel(dm);
                    }
                    // get servers + channels
                    for (const server of data.user.servers) {
                        const guild = new Guild_1.default(server, this);
                        this.guilds.cache.set(server.server_id, guild);
                        for (const channel of server.channels) {
                            this.dataManager.newChannel(channel, guild);
                        }
                    }
                    // get server users
                    for (const member of data.serverMembers) {
                        this.addServerMember(member);
                    }
                    // get presences
                    for (const presence of data.memberStatusArr) {
                        this.setMemberPresence(presence);
                    }
                    // get activity status
                    for (const status of data.customStatusArr) {
                        this.setMemberActivityStatus(status);
                    }
                    // get roles
                    for (const role of data.serverRoles) {
                        this.addServerRoles(role);
                    }
                    const readyCB = this.listeners.get(ClientEvents_1.clientEventsNames.ready);
                    if (readyCB)
                        readyCB();
                });
                this.socket.once('auth_err', (data) => {
                    reject(new Error(data));
                    this.socket.removeAllListeners();
                });
                this.socket.on('disconnect', () => {
                    const cb = this.listeners.get(ClientEvents_1.clientEventsNames.error);
                    if (cb)
                        cb(new Error('Connection Lost.'));
                    else
                        throw new Error('Connection Lost.');
                    this.socket.removeAllListeners();
                    this.socket.on('connect', connectEvent);
                });
                this.socket.on('*', (res) => {
                    var _a, _b;
                    const [event, data] = res.data;
                    console.debug(`Received event ${event}`);
                    if (Object.keys(events).includes(event)) {
                        const func = events[event](data, this);
                        if (func === undefined) {
                            return;
                        }
                        return (_a = this.listeners.get(func[0])) === null || _a === void 0 ? void 0 : _a.call(func[1], (_b = func[2]) === null || _b === void 0 ? void 0 : _b.call(data, this));
                    }
                });
            };
            this.socket.on('connect', connectEvent);
        });
    }
    on(type, callback) {
        if (this.listeners.get(type)) {
            return;
        }
        this.listeners.set(type, callback);
    }
    off(type) {
        this.listeners.delete(type);
    }
    addServerRoles(role) {
        const guild = this.guilds.cache.get(role.server_id);
        if (guild !== undefined) {
            guild.roles.cache.set(role.id, new Role_1.default(role, guild));
        }
    }
    addServerMember(member) {
        const guild = this.guilds.cache.get(member.server_id);
        if (guild !== undefined) {
            guild._addMember(member);
        }
    }
    setMemberPresence([id, status]) {
        const user = this.users.cache.get(id);
        if (user !== undefined) {
            user.presence.status = Status_1.PresenceStatusData[parseInt(status)];
        }
    }
    setMemberActivityStatus([id, activity]) {
        const user = this.users.cache.get(id);
        if (user !== undefined) {
            user.presence.activity = activity;
        }
    }
    buttonDone(data) {
        const client = this;
        return function (message) {
            return client.fetch.messageButtonCallback(data.channelID, data.messageID, data.id, data.clickedByID, message);
        };
    }
}
exports.default = Client;
const events = {
    receiveMessage: (data, client) => {
        return ['message', new Message_1.default(data.message, client)];
    },
    userStatusChange: (data, client) => {
        var _a;
        const presence = (_a = client.users.cache.get(data.uniqueID)) === null || _a === void 0 ? void 0 : _a.presence;
        if (presence) {
            presence.status = Status_1.PresenceStatusData[parseInt(data.status)];
            return ['presenceUpdate', presence];
        }
        return undefined;
    },
    'member:custom_status_change': (data, client) => {
        var _a;
        const presence = (_a = client.users.cache.get(data.uniqueID)) === null || _a === void 0 ? void 0 : _a.presence;
        if (presence) {
            presence.activity = data.custom_status;
            return ['presenceUpdate', presence];
        }
        return undefined;
    },
    'server:member_add': (data, client) => {
        var _a, _b;
        const clientPresence = client.users.cache.get(data.serverMember.member.uniqueID);
        if (clientPresence) {
            clientPresence.presence.status = Status_1.PresenceStatusData[parseInt(data.presence)];
            clientPresence.presence.activity = (_a = data.custom_status) !== null && _a !== void 0 ? _a : null;
            return ['guildMemberAdd', (_b = client.guilds.cache.get(data.serverMember.server_id)) === null || _b === void 0 ? void 0 : _b._addMember(data.serverMember)];
        }
        return undefined;
    },
    'server:member_remove': (data, client) => {
        const guild = client.guilds.cache.get(data.server_id);
        const member = guild === null || guild === void 0 ? void 0 : guild.members.get(data.uniqueID);
        const memberClone = Object.assign(Object.create(Object.getPrototypeOf(member)), member);
        if (guild)
            guild.members.delete(data.uniqueID);
        return ['guildMemberRemove', memberClone];
    },
    'server:update_server': (data, client) => {
        const guild = client.guilds.cache.get(data.server_id);
        if (guild !== undefined) {
            guild.name = data.name;
            if (data.avatar) {
                guild.icon = data.avatar;
            }
        }
        return undefined;
    },
    'server:joined': (server, client) => {
        const guild = new Guild_1.default(server, client);
        client.guilds.cache.set(server.server_id, guild);
        for (let index = 0; index < server.channels.length; index++) {
            const channel = server.channels[index];
            client.dataManager.newChannel(channel, guild);
        }
        return ['N/A'];
    },
    message_button_clicked: (data, client) => {
        return ['messageButtonClicked', data, client.buttonDone.bind(client)];
    },
    'server:update_role': (data, client) => {
        const guild = client.guilds.cache.get(data.server_id);
        if (!guild)
            return;
        const role = guild.roles.cache.get(data.id);
        if (!role)
            return;
        role.permissions = data.permissions || role.permissions;
        role.color = data.color || role.color;
        role.name = data.name || role.name;
        return ['roleUpdate', role];
    },
    'server:create_role': (data, client) => {
        const guild = client.guilds.cache.get(data.server_id);
        if (!guild)
            return;
        if (guild.roles.cache.has(data.id))
            return;
        const role = new Role_1.default(data, guild);
        guild.roles.cache.set(data.id, role);
        return ['roleCreate', role];
    },
    'server:members': (data, client) => {
        for (const member of data.serverMembers) {
            client.addServerMember(member);
        }
        for (const presence of data.memberPresences) {
            client.setMemberPresence(presence);
        }
        for (const activity of data.programActivityArr) {
            client.setMemberActivityStatus(activity);
        }
        // guild create is used here since members is a seperate event
        // and members array would be empty if used properly.
        const guild = client.guilds.cache.get(data.serverMembers[0].server_id);
        if (guild === undefined) {
            return undefined;
        }
        return ['guildCreate', guild];
    },
    'server:roles': (data, client) => {
        for (const role of data.roles) {
            client.addServerRoles(role);
        }
        return undefined;
    }
};
