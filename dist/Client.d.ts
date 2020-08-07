/// <reference types="socket.io-client" />
import Users from './Users';
import Channels from './Channels';
import Guilds from './Guilds';
import DataManager from './DataManager';
import ClientUser from './ClientUser';
import Fetch from './Utils/fetch';
import { IClientEvents } from './Interfaces/ClientEvents';
export default class Client {
    token: string | null;
    user?: ClientUser;
    listeners: Map<keyof IClientEvents | string, Function | undefined>;
    socket: SocketIOClient.Socket;
    users: Users;
    channels: Channels;
    guilds: Guilds;
    fetch: Fetch;
    dataManager: DataManager;
    login(token: string): Promise<unknown>;
    on<T extends keyof IClientEvents>(type: T, callback: IClientEvents[T]): void;
    off<T extends keyof IClientEvents>(type: T): void;
}
