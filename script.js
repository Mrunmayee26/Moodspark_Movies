function executeSearch(query) {
    // Remove old highlights first
    removeHighlights();

    if (!query) return;

    // Create a regular expression for the search query (case-insensitive)
    const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
    
    // Walk through text nodes in the body
    highlightTextNodes(document.body, regex);
}

function highlightTextNodes(element, regex) {
    for (let child of element.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) {
            const matches = child.nodeValue.match(regex);
            if (matches) {
                const parent = child.parentNode;
                // Skip if already inside a mark tag
                if (parent.nodeName === 'MARK') continue;

                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = child.nodeValue.replace(regex, '<mark class="search-highlight">\$1</mark>');
                
                while (tempDiv.firstChild) {
                    parent.insertBefore(tempDiv.firstChild, child);
                }
                parent.removeChild(child);
            }
        } else if (child.nodeType === Node.ELEMENT_NODE && !['SCRIPT', 'STYLE', 'MARK'].includes(child.nodeName)) {
            highlightTextNodes(child, regex);
        }
    }
}

function removeHighlights() {
    const highlights = document.querySelectorAll('mark.search-highlight');
    highlights.forEach(mark => {
        const parent = mark.parentNode;
        parent.replaceChild(document.createTextNode(mark.textContent), mark);
        parent.normalize();
    });
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^\${}()|[\]\\]/g, '\\$&');
}
