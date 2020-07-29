import Client from './Client';
import Guild from './Guild';
import Channel from './Channel';
import User from './User';
import { IChannelAuth, IUserAuth } from './Interfaces/AuthenticationData';
import IUser from './Interfaces/User';
export default class DataManager {
    client: Client;
    constructor(client: Client);
    newChannel(data: IChannelAuth, guild?: Guild): Channel;
    newUser(data: (IUser & IUserAuth)): User;
}
