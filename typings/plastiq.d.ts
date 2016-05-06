interface Plastiq {
  html: any
  bind: any
  append(element: Element, renderFn: (model) => any, model: any): void
}

declare var plastiq: Plastiq

declare module "plastiq" {
  export = plastiq
}