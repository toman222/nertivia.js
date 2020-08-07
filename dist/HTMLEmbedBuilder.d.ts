import { JsonInput } from 'jsonhtmlfyer';
interface Opts {
    direction?: Direction;
}
declare type Direction = 'column' | 'row';
declare type Embed = Omit<JsonInput, 'content'> & {
    content: JsonInput[];
};
export default class HTMLEmbedBuilder {
    embed: Embed;
    direction: Direction;
    constructor(options?: Opts);
    setBackgroundImage(url: string): this;
    addAvatar(url: string, text?: string, direction?: Direction): this;
    addText(text: string): this;
}
export {};
