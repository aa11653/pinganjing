// 标题文本框宽度自适应
const $ = document.querySelector.bind(document),
    $$ = (s) => [...document.querySelectorAll(s)];
(function () {
    const flexableInputs = $$("#title input")
    function refreshInputWidth() {
        flexableInputs.forEach(el => {
            const l = el.value.length
            el.style.width = l + "em"
        })
    }
    flexableInputs.forEach(el => el.addEventListener("input", refreshInputWidth))
})()

// 数据选取相关
const dataSelect = (function () {
    const $dataContainer = $("#dataContainer"),
        elementDataMap = new Map(),
        selectedElement = new Set(),
        selectedDataSets = new Set()
    function createDataElement(title, data) {
        const $outer = document.createElement("div");
        $outer.className = "dataBlock"
        $outer.appendChild(document.createTextNode(title))
        const $example = document.createElement("span")
        $example.className = "example"
        const exampleStr = (function () {
            switch (data.length) {
                case 1:
                    return data[0]
                case 2:
                    return `${data[0]}/${data[1]}`
                default:
                    return `${data[0]}/${data[1]}…`
            }
        })()
        $example.innerHTML = exampleStr
        $outer.appendChild($example)
        return $outer
    }
    /**
     * 处理选择/取消选择数据的事件
     * @this {HTMLElement}
     */
    function clickEventHandle() {
        if (selectedElement.has(this)) {
            // 如果有了，则关闭
            const d = elementDataMap.get(this)
            selectedDataSets.delete(d);
            selectedElement.delete(this)
            this.className = "dataBlock"
        } else {
            const d = elementDataMap.get(this)
            selectedDataSets.add(d);
            selectedElement.add(this)
            this.className = "dataBlock selected"
        }
    }
    function createDataElementAndInit(n) {
        const $el = createDataElement(n.title, n.data)
        $dataContainer.appendChild($el);
        elementDataMap.set($el, n)
        $el.addEventListener("click", clickEventHandle.bind($el))
        return $el
    }
    // 创建 dataElement
    insetData.forEach(createDataElementAndInit)
    return {
        selectedDataSets,
        createDataElementAndInit
    }
})();

// 生成有关

(function () {
    const $generateBtn = $("#generatebutton"),
        $generateContent = $("#generatedContent"),
        $downloadHTML = $("#downloadHTML"),
        $downloadMarkdown = $("#downloadMarkdown"),
        $display = $("#generatedContentDisplay"),
        $dataContainer = $("#dataContainer")
    $generateContent.style.display = "none"
    /**
     * 下载
     * @param {string} text 下载内容
     * @param {string} fileName 下载文件名称
     */
    function download(text, fileName) {
        const blob = new Blob([text]);
        const u = URL.createObjectURL(blob);
        const a = document.createElement("a")
        a.href = u
        a.download = fileName
        a.click()
    }
    /**
     * 更改对应的下载按钮的事件
     */
    function generate() {
        if (!dataSelect.selectedDataSets.size) {
            alert("还没有选择数据")
            return
        }
        const textName = $("#textName").value,
            textType = $("#textType").value
        const $gHTML = generateHTML(dataSelect.selectedDataSets, textName, textType),
            gMarkdown = generateMarkdown(dataSelect.selectedDataSets, textName, textType)
        $downloadHTML.onclick = download.bind(undefined, $gHTML.outerHTML, textName + textType + ".html")
        $downloadMarkdown.onclick = download.bind(undefined, gMarkdown, textName + textType + ".md")
        $display.contentWindow.document.body.innerHTML = $gHTML.innerHTML;
        $generateContent.style.display = ""
        $dataContainer.style.maxHeight = "20vh"
    }
    $generateBtn.addEventListener("click", generate)
})();

// 添加数据有关

(function () {
    const $addDataMenu = $("#addDataMenu")
        , $addDataBtn = $("#addDataButton")
        , $confirmAddData = $("#confirmAdd")
        , $cancelAddData = $("#cancelAdd")
        , $newDataName = $("#newDataName")
        , $newDataContent = $("#newDataContent");
    function openAddDataMenu() {
        $addDataMenu.className = ""
        $addDataBtn.style.display = "none"
    }
    function clearInput() {
        $newDataName.value = ""
        $newDataContent.value = ""
    }
    function closeAddDataMenu() {
        $addDataMenu.className = "hidden"
        $addDataBtn.style.display = ""
    };
    function createDataObjectByInput() {
        const title = $newDataName.value
        const dataString = $newDataContent.value
        const data = dataString.split(/[、，,;； 。.\\/\n]/g)
        return { title, data }
    }
    function addDataClickHandler() {
        clearInput();
        openAddDataMenu();
    }
    function confirmDataHandler() {
        if (!$newDataName.value) {
            alert("请输入数据名称")
            return
        }
        if (!$newDataContent.value) {
            alert("请输入数据")
            return
        }
        dataSelect.createDataElementAndInit(createDataObjectByInput()).click();
        closeAddDataMenu()
    }
    function cancelAddData() {
        const b = confirm("确定取消数据的创建吗？")
        if (b) closeAddDataMenu()
    }
    $addDataBtn.addEventListener("click", addDataClickHandler)
    $confirmAddData.addEventListener("click", confirmDataHandler)
    $cancelAddData.addEventListener("click", cancelAddData)

    // 以下代码用于移除打开页面时菜单的过渡
    $addDataMenu.style.display = "none"
    closeAddDataMenu()
    setTimeout(() => { $addDataMenu.style.display = "" }, 200)
})()