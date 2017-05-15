/**
 * 工具
 * @author yourenke
 */
anError = function (error,showTime) {
    var errorMsg = document.createElement('div');
    errorMsg.className = 'info-box';
    errorMsg.innerHTML = '<p>' + error + '</p>';
    document.body.appendChild(errorMsg);
    if(showTime){
        setTimeout(function(){
            errorMsg.remove()
        },showTime)
    }
}

loadJSON = function (url,cb) {
    request = new XMLHttpRequest();
    request.onload = function () {
        if (request.status != 200) {
            // 访问加载失败
            var a = document.createElement('a');
            a.href = configFromURL.config;
            a.innerHTML = a.href;
            anError('文件 ' + a.outerHTML + ' 不可访问.');
            return;
        }
        var responseMap = JSON.parse(request.responseText);
        cb(responseMap)
    };
    request.open('GET', url);
    request.send();
    return;
}