"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ClientEvents_1 = require("./Interfaces/ClientEvents");
var Presence_1 = require("./Presence");
exports.Presence = Presence_1.default;
var ServerMember_1 = require("./ServerMember");
exports.ServerMember = ServerMember_1.default;
var Guild_1 = require("./Guild");
exports.Guild = Guild_1.default;
var Role_1 = require("./Role");
exports.Role = Role_1.default;
var Message_1 = require("./Message");
exports.Message = Message_1.default;
var Client_1 = require("./Client");
exports.Client = Client_1.default;
// export const HTMLEmbedBuilder = _HTMLEmbedBuilder
var HTMLEmbedBuilder_1 = require("./HTMLEmbedBuilder");
exports.HTMLEmbedBuilder = HTMLEmbedBuilder_1.default;
var Interfaces;
(function (Interfaces) {
    let ClientEvents;
    (function (ClientEvents) {
        ClientEvents.clientEventsNames = ClientEvents_1.clientEventsNames;
    })(ClientEvents = Interfaces.ClientEvents || (Interfaces.ClientEvents = {}));
})(Interfaces = exports.Interfaces || (exports.Interfaces = {}));
