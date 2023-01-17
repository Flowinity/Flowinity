type OpenGraph = {
  enabled: boolean
  color: string
  siteName: string
  siteURL: string
  author: string
  authorURL: string
  title: string
  description: string
  customFields: {
    [key: string]: string
  }
}
