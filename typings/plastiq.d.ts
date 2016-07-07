declare const plastiq: Plastiq.Plastiq

declare namespace Plastiq {
  interface Plastiq {
    html: HtmlModule
    bind: any
    append(element: Element, renderFn: (model: any) => any, model: any): void
  }
  
  interface HtmlModule {
    (...a: any[]): VNode
    refresh: () => void
  }

  interface VNode {
  }
}