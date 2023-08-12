import { Service } from "typedi"
import { CacheService } from "@app/services/cache.service"
import { NoteDataV2, NoteService } from "@app/services/note.service"
//@ts-ignore
import edjsHTML from "editorjs-parser"
import { OutputData } from "@editorjs/editorjs"
//@ts-ignore
import HTMLtoDOCX from "html-to-docx"
import { Blocks } from "@editorjs/editorjs/types/api"

@Service()
export class WorkspacesDownloadService {
  constructor(
    private readonly noteService: NoteService,
    private readonly cacheService: CacheService
  ) {}

  async html(data: NoteDataV2) {
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
    const html = edjsParser.parse(data as OutputData)
    return html
  }

  async docx(data: NoteDataV2) {
    const html = await this.html(data)

    return await HTMLtoDOCX(html)
  }
}
