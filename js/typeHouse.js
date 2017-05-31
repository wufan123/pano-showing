var openId, communityId;

getData();

function getData() {
    if (haveToken()) {
        httpPost("/area/community/getDetail", {"id": communityId}, function (res) {
            if (res.ret == 0)
                createTitle("当前小区：" + res.result.name)
        });
        httpGet("/area/building/getTypeList?communityId=" + communityId, function (res) {
            if (res.ret == 0)
                createItems(res.result.data)
        })
    }
}
function haveToken() {
    var token = window.sessionStorage.getItem("token");
    if (!token) {
        login()
    }

}
function login() {
    openId = getPar("openId");
    communityId = getPar("communityId");
    httpPost("/role/user/loginWx", {"wxOpenId": openId}, function (res) {
        window.sessionStorage.setItem("token", res.token);
        getHouseType();
    })
}

function createTitle(title) {
    var titleEle = document.createElement("div");
    titleEle.classList.add("type_title");
    titleEle.innerHTML = title;
    document.body.appendChild(titleEle);
    var tagEle = document.createElement("div");
    tagEle.classList.add("type_tag");
    tagEle.innerHTML = "全部户型：";
    document.body.appendChild(tagEle);
}

function createItems(items) {
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var itemEle = document.createElement("div");
        itemEle.classList.add("type_item");
        itemEle.innerHTML = item.name;
        itemEle.addEventListener("click", function (event) {
            event.stopPropagation();
            getStageList(item);
        }, false);
        document.body.appendChild(itemEle);
    }
}

function getStageList(item) {
    httpGet("/estate/vrHouses/getVrStageList?houseTypeId=" + item.id, function (res) {
        if(res.ret==0&&res.result.data.length>0)
        {
            window.sessionStorage.setItem("stageList", JSON.stringify(res.result.data));
            location.href = "panorama.html";
        }else
        {
            anError(res,"当前场景下没有全景看房");
        }
    });
    //
    // loadJSON('js/stages.json', function (config) {
    //     // console.log(JSON.stringify(config))
    //     window.sessionStorage.setItem("stageList", JSON.stringify(config.stages));
    //     location.href = "panorama.html";
    // })
}
