"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HTMLEmbedBuilder {
    constructor(options) {
        this.direction = options ? options.direction : 'row';
        this.obj = {
            tag: 'div',
            styles: {
                display: 'flex',
                flexDirection: this.direction
            },
            content: []
        };
    }
    setBackgroundImage(url) {
        this.obj.styles.backgroundImage = url;
        this.obj.styles.backgroundSize = '100%';
        this.obj.styles.backgroundPosition = 'center';
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
        this.obj.content.push({
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
        this.obj.content.push({
            tag: 'div',
            content: text
        });
        return this;
    }
}
exports.default = HTMLEmbedBuilder;
