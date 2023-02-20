import MarkdownIt from "markdown-it";
//@ts-ignore
import MarkdownItEmoji from "markdown-it-emoji";
let md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: false,
  breaks: true,
  quotes: "“”‘’",
  langPrefix: "language-",
  xhtmlOut: false
});
md.use(MarkdownItEmoji);
const defaultRender =
  md.renderer.rules.link_open ||
  function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };

md.renderer.rules = {
  ...md.renderer.rules,
  link_open(tokens, idx, options, env, self) {
    // If you are sure other plugins can't add `target` - drop check below
    const aIndex = tokens[idx].attrIndex("target");

    if (aIndex < 0) {
      tokens[idx].attrPush(["target", "_blank"]); // add new attribute
      tokens[idx].attrPush([
        "onclick",
        "window.tpuInternals.processLink(this.href); return false;"
      ]); // add new attribute
    } else {
      // @ts-ignore
      tokens[idx].attrs[aIndex][1] = "_blank"; // replace value of existing attr
      tokens[idx].attrPush([
        "onclick",
        "window.tpuInternals.processLink(this.href); return false;"
      ]); // add new attribute
    }

    // pass token to default renderer.
    return defaultRender(tokens, idx, options, env, self);
  },
  emoji(tokens, idx, options, env, self) {
    const codepoint = tokens[idx].content.codePointAt(0)?.toString(16);
    // if emoji is TM or R, return the unicode character
    if (codepoint === "2122" || codepoint === "ae" || codepoint === "a9") {
      return tokens.filter((token) => token.type !== "emoji").length === 0
        ? `<span class="emoji-large-text">${tokens[idx].content}</span>`
        : `<span>${tokens[idx].content}</span>`;
    }
    if (tokens.filter((token) => token.type !== "emoji").length === 0) {
      return `<img class="emoji emoji-large" draggable="false" alt="${tokens[idx].content}" src="/emoji/emoji_u${codepoint}.svg">`;
    }
    return `<img class="emoji" draggable="false" alt="${tokens[idx].content}" src="/emoji/emoji_u${codepoint}.svg">`;
  }
};

export default md;
