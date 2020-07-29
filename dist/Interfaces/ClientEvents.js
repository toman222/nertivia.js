"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var clientEventsNames;
(function (clientEventsNames) {
    clientEventsNames["ready"] = "ready";
    clientEventsNames["message"] = "receiveMessage";
    clientEventsNames["presenceUpdate"] = "userStatusChange";
    clientEventsNames["channelCreate"] = "server:add_channel";
    clientEventsNames["guildMemberAdd"] = "server:member_add";
    clientEventsNames["guildMemberRemove"] = "server:member_remove";
    clientEventsNames["guildCreate"] = "server:joined";
    clientEventsNames["guildDelete"] = "server:leave";
    clientEventsNames["messageButtonClicked"] = "message_button_clicked";
    clientEventsNames["error"] = "error";
    clientEventsNames["roleUpdate"] = "server:update_role";
    clientEventsNames["roleCreate"] = "server:create_role";
})(clientEventsNames = exports.clientEventsNames || (exports.clientEventsNames = {}));
