import { Service } from "typedi"
import { CacheService } from "@app/services/cache.service"
import { NoteService } from "@app/services/note.service"
//@ts-ignore
import edjsHTML from "editorjs-parser"
//@ts-ignore
import HTMLtoDOCX from "html-to-docx"
import { WorkspaceNote } from "@app/classes/graphql/workspaces/note"

@Service()
export class WorkspacesDownloadService {
  constructor(
    private readonly noteService: NoteService,
    private readonly cacheService: CacheService
  ) {}

  async html(data: WorkspaceNote) {
    const parsers = {
      list: (data: any) => {
        const string = data.style === "ordered" ? "ol" : "ul"
        const parseList = (data: any) => {
          let html = ""
          for (const item of data.items) {
            if (!item.items?.length) html += `<li>${item.content}</li>`
            if (item.items?.length) {
              html += `<li>${item.content || "‎"} <${string}>${parseList(
                item
              )}</${string}></li>`
            }
          }
          return html
        }
        return `<${string}>${parseList(data)}</${string}>`
      },
      header: (data: any, _: any, tunes: any) => {
        let style = ""
        if (tunes?.align) {
          style += `text-align: ${tunes.align.alignment};`
        }
        return `<h${data.level} style="${style}">${data.text}</h${data.level}>`
      },
      checklist: (data: any) => {
        let html = ""
        for (const item of data.items) {
          html += `<div>[${item.checked ? "X" : " "}] ${item.text}</div>`
        }
        return html
      }
    }
    const edjsParser = new edjsHTML(undefined, parsers)
    const html = edjsParser.parse(data)
    return html
  }

  async docx(data: WorkspaceNote) {
    const html = await this.html(data)

    return await HTMLtoDOCX(html)
  }
}
