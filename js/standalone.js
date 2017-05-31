/**
 * 工具
 * @author yourenke
 */
anError = function (error, showTime) {
    var errorMsg = document.createElement('div');
    errorMsg.className = 'info-box';
    errorMsg.innerHTML = '<p>' + error + '</p>';
    document.body.appendChild(errorMsg);
    if (showTime) {
        setTimeout(function () {
            errorMsg.remove()
        }, showTime)
    }
}

loadJSON = function (url, cb) {
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

function creatRequest(url,arg, callback) {
    var request = new XMLHttpRequest();
    var timeout = false;
    var timer = setTimeout(function () {
        timeout = true;
        request.abort();
    }, 6000);
    request.open(arg?"post":"get", url);
    request.setRequestHeader("appname", "resident_app");
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.setRequestHeader("Accept", "application/json;version=1");
    request.setRequestHeader("authorization", "Bearer " + window.sessionStorage.getItem("token"));
    request.onreadystatechange = function () {
        if (request.readyState !== 4) return;
        if (timeout) return;
        clearTimeout(timer);
        if (request.status === 200) {
            callback(request.responseText);
        }
    }
    request.send(JSON.parse(arg));

}
function httpPost(url,arg, callback) {
    creatRequest(url,arg,callback);
}

function httpGet(url, callback) {
    creatRequest(url,null,callback);
}

function getPar(par) {
    //获取当前URL
    var local_url = document.location.href;
    //获取要取得的get参数位置
    var get = local_url.indexOf(par + "=");
    if (get == -1) {
        return false;
    }
    //截取字符串
    var get_par = local_url.slice(par.length + get + 1);
    //判断截取后的字符串是否还有其他get参数
    var nextPar = get_par.indexOf("&");
    if (nextPar != -1) {
        get_par = get_par.slice(0, nextPar);
    }
    return get_par;
}