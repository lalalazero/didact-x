import { legacyRenderSubtreeIntoContainer } from "./ReactDOMLegacy";

export function render(element, container) {
    return legacyRenderSubtreeIntoContainer(null, element, container)
}