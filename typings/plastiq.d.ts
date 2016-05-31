declare const plastiq: Plastiq.Plastiq

declare namespace Plastiq {
  interface Plastiq {
    html: HtmlModule
    bind: any
    append(element: Element, renderFn: (model) => any, model: any): void
  }
  
  interface HtmlModule {
    (...a): VNode
    refresh: () => void
  }

  interface VNode {
  }
}