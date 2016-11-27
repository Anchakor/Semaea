export interface Plastiq {
  html: HtmlModule
  bind: any
  append(element: Element, renderFn: (model: any) => any, model: any): void
}

export interface HtmlModule {
  (...a: any[]): VNode
  refresh: () => void
  refreshAfter: (p: Promise<any>) => void
}

export interface VNode {
}