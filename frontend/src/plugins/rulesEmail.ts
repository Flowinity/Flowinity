import MarkdownIt from "markdown-it"
//@ts-ignore
import MarkdownItEmoji from "markdown-it-emoji"

let md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: false,
  breaks: true,
  quotes: "“”‘’",
  langPrefix: "language-",
  xhtmlOut: true
})
const defaultRender =
  md.renderer.rules.link_open ||
  function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options)
  }

// @ts-ignore
md.renderer.rules = {
  ...md.renderer.rules,
  link_open(tokens, idx, options, env, self) {
    // If you are sure other plugins can't add `target` - drop check below
    const aIndex = tokens[idx].attrIndex("target")
    if (aIndex < 0) {
      tokens[idx].attrPush(["target", "_blank"]) // add new attribute
      tokens[idx].attrPush([
        "onclick",
        "window.tpuInternals.processLink(this.href); return false;"
      ]) // add new attribute
    } else {
      // @ts-ignore
      tokens[idx].attrs[aIndex][1] = "_blank" // replace value of existing attr
      tokens[idx].attrPush([
        "onclick",
        "window.tpuInternals.processLink(this.href); return false;"
      ]) // add new attribute
      // set the content value of the a to the link like <a>https://example.com</a>
    }

    // pass token to default renderer.
    return defaultRender(tokens, idx, options, env, self)
  }
}

export default md
