import Collection from '@discordjs/collection';
import ServerMember from './ServerMember';
import User from './User';
import Message from './Message';
import Client from './Client';
export default class MessageMentions {
    members: Collection<string, ServerMember>;
    users: Collection<string, User>;
    constructor(message: Message, client: Client);
}
