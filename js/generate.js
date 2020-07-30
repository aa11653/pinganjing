/**
 * 将数据转为 HTML 标签
 * @param {{title:string, data:strong[]}[]} dataSets 要成书的数据
 * @param {string} textName 文本的主题 ，如致富
 * @param {string} bookType 文本的类型，如经
 * @returns {HTMLDivElement}
 */
function generateHTML(dataSets, textName, bookType) {
    const $root = document.createElement("div");
    const $bookTitle = document.createElement("h1")
    $bookTitle.innerHTML = textName + bookType
    $root.appendChild($bookTitle)
    dataSets.forEach(n => {
        const $h = document.createElement("h2")
        $h.innerHTML = n.title + textName
        const $p = document.createElement("p")
        $p.innerHTML = n.data.join(textName + "，") + textName + "。"
        $root.appendChild($h)
        $root.appendChild($p)
    })
    return $root
}

/**
 * 将数据转为 Markdown
 * @param {{title:string, data:strong[]}[]} dataSets 要成书的数据
 * @param {string} textName 文本的主题 ，如致富
 * @param {string} bookType 文本的类型，如经
 * @returns {string}
 */
function generateMarkdown(dataSets, bookName, bookType) {
    let s = "# " + bookName + bookType + "\n\n"
    dataSets.forEach(n => {
        s += "\n\n## " + n.title + "\n\n"
        s += n.data.join(bookName + "，") + bookName + "。"
    })
    return s
}