import { JsonInput } from 'jsonhtmlfyer';
interface Opts {
    direction: Direction;
}
declare type Direction = 'column' | 'row';
export default class HTMLEmbedBuilder {
    obj: JsonInput | any;
    direction: Direction;
    constructor(options: Opts);
    setBackgroundImage(url: string): this;
    addAvatar(url: string, text?: string, direction?: Direction): this;
    addText(text: string): this;
}
export {};
