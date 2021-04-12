export function debounce(fn: Function, wait: number) {
    let timeoutID: any = null
    return function () {
        if (timeoutID != null) clearTimeout(timeoutID)
        timeoutID = setTimeout(fn, wait)
    }
}

// 文档高端
export function getScrollTop(){
    let bodyScrollTop = 0;
    let documentScrollTop = 0;
    if(document.body){
        bodyScrollTop = document.body.scrollTop;
    }
    if(document.documentElement){
        documentScrollTop = document.documentElement.scrollTop;
    }
    return (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
}
// 可视窗口高度
export function getWindowHeight(){
    let windowHeight = 0;
    if(document.compatMode == "CSS1Compat"){
        windowHeight = document.documentElement.clientHeight;
    }
    else{
        windowHeight = document.body.clientHeight;
    }
    return windowHeight;
}
// 滚动条高度
export function getScrollHeight(){
    let bodyScrollHeight = 0
    let documentScrollHeight = 0;
    if(document.body){
        bodyScrollHeight = document.body.scrollHeight;
    }
    if(document.documentElement){
        documentScrollHeight = document.documentElement.scrollHeight;
    }
    return (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
}
