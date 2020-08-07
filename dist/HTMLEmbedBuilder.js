"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HTMLEmbedBuilder {
    constructor(options) {
        var _a;
        this.direction = (_a = options === null || options === void 0 ? void 0 : options.direction) !== null && _a !== void 0 ? _a : 'row';
        this.embed = {
            tag: 'div',
            styles: {
                display: 'flex',
                flexDirection: this.direction
            },
            content: []
        };
    }
    setBackgroundImage(url) {
        var _a;
        this.embed.styles = (_a = this.embed.styles) !== null && _a !== void 0 ? _a : {};
        this.embed.styles.backgroundImage = url;
        this.embed.styles.backgroundSize = '100%';
        this.embed.styles.backgroundPosition = 'center';
        return this;
    }
    addAvatar(url, text, direction) {
        const content = [
            {
                tag: 'img',
                attributes: { src: url },
                styles: {
                    borderRadius: '50%',
                    height: '30px',
                    marginRight: '5px',
                    width: '30px'
                }
            }
        ];
        if (text) {
            content.push({
                tag: 'span',
                content: text
            });
        }
        this.embed.content.push({
            tag: 'div',
            styles: {
                display: 'flex',
                alignItems: 'center',
                alignContent: 'center',
                flexDirection: direction || 'row'
            },
            content
        });
        return this;
    }
    addText(text) {
        this.embed.content.push({
            tag: 'div',
            content: text
        });
        return this;
    }
}
exports.default = HTMLEmbedBuilder;
