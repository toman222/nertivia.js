"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const collection_1 = __importDefault(require("@discordjs/collection"));
class Channels {
    constructor(client) {
        this.client = client;
        this.cache = new collection_1.default();
    }
    fetch(_id, _cache) {
        console.log('channels.fetch not implimented yet.');
    }
}
exports.default = Channels;
