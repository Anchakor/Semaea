interface Plastiq {
  html: any
  bind: any
  append(element: Element, renderFn: (model) => any, model: any): void
}

declare const plastiq: Plastiq

declare module "plastiq" {
  export = plastiq
}