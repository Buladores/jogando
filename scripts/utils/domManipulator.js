export const addClass = (domElement, className) => {
    domElement.classList.add(className);
}

export const removeClass = (domElement, className) => {
    domElement.classList.remove(className);
}

export const append = (domElement, child) => {
    if (typeof child === 'string') child = document.createTextNode(child);
    return domElement.appendChild(child);
}