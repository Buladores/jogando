export const addClass = (domElement, className) => domElement.classList.add(className);

export const removeClass = (domElement, className) => {
    if (!domElement) return;
    if (!domElement.classList.contains(className)) return;
    domElement.classList.remove(className)
};


export const append = (domElement, child) => {
    if (typeof child === 'string') child = document.createTextNode(child);
    if (typeof domElement === 'string') domElement = document.createElement(domElement);

    domElement.appendChild(child);
    return domElement;
}