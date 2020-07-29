"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var clientEventsNames;
(function (clientEventsNames) {
    clientEventsNames["channelCreate"] = "server:add_channel";
    clientEventsNames["channelDelete"] = "server:remove_channel";
    clientEventsNames["error"] = "error";
    clientEventsNames["guildCreate"] = "server:joined";
    clientEventsNames["guildRemove"] = "server:leave";
    clientEventsNames["guildMemberAdd"] = "server:member_add";
    clientEventsNames["guildMemberRemove"] = "server:member_remove";
    clientEventsNames["message"] = "receiveMessage";
    clientEventsNames["messageButtonClicked"] = "message_button_clicked";
    clientEventsNames["presenceUpdate"] = "userStatusChange";
    clientEventsNames["ready"] = "ready";
    clientEventsNames["roleCreate"] = "server:create_role";
    clientEventsNames["roleUpdate"] = "server:update_role";
    /* Not implemented yet
    typingStatus {"channel_id":"6692365473675218944","user":{"unique_id":"6692353538904821760","username":"Toby"}}
    */
})(clientEventsNames = exports.clientEventsNames || (exports.clientEventsNames = {}));
