import User from './User';
import { PresenceStatus } from './Interfaces/Status';
export default class ClientUser extends User {
    setStatus(status: PresenceStatus): Promise<import("./Presence").default>;
    setActivity(content: string): Promise<import("./Presence").default>;
}
