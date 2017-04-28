import Inferno = require("inferno");
import h = require("../node_modules/inferno-hyperscript/dist/inferno-hyperscript");

export function run(x: HTMLElement) {
  Inferno.render(h("h1", {}, "asdf"), x)
}