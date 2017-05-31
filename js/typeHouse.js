var openId, communityId,unionid,nickname,avatar;

// getData();
login();
function getData() {
    if (haveToken()) {
        httpPost("/api/area/community/getDetail", {"id": communityId}, function (res) {
            if (res.ret == 0)
                createTitle("当前小区：" + res.result.name);
        });
        httpGet("/api/area/building/getTypeList?communityId=" + communityId, function (res) {
            if (res.ret == 0)
                createItems(res.result.data);
        })
    }
}
function haveToken() {
    var token = window.sessionStorage.getItem("token");
    if (token=="undefined") {
        login();
        return false;
    }else
    {
        return true;
    }

}
function login() {
    communityId = "856414-4173-1869-9008";
    openId = "ouytHtzVh8PmfQQLkI3ittwEpYNA";
    unionid="o4x5iszXtSPSOJ8WkbWP5ceIIuqo";
    nickname="123456";
    avatar="http%3A%2F%2Fwx.qlogo.cn%2Fmmopen%2FajNVdqHZLLAHV00sCqwMg8ibib8ZyPCF2EJLK7q88jSZ5yyj83KA28vdoWX2hBdaibpz9Y4nNFL625K1xbKwZ9M1w%2F0";
    // communityId = getPar("communityId");
    // openId = getPar("openId");
    // unionid = getPar("unionid");
    // nickname = getPar("nickname");
    // avatar = getPar("avatar");
    httpPost("/api/role/user/loginWx", {"wxOpenId": openId,"appId":1000,"wxUnionId":unionid,"wxNick":nickname,"wxAvatarUrl":avatar}, function (res) {
        if(res.ret==0)
        {
            window.sessionStorage.setItem("token", res.result.token);
            getData();
        }
    })
}

function createTitle(title) {
    var titleEle = document.createElement("div");
    titleEle.classList.add("type_title");
    titleEle.innerHTML = title;
    document.getElementById("title").appendChild(titleEle);
    var tagEle = document.createElement("div");
    tagEle.classList.add("type_tag");
    tagEle.innerHTML = "全部户型：";
    document.getElementById("title").appendChild(tagEle);
}

function createItems(items) {
    for (var i = 0; i < items.length; i++) {
        (function (item) {
            var itemEle = document.createElement("div");
            itemEle.classList.add("type_item");
            itemEle.innerHTML = item.name;
            itemEle.addEventListener("click", function (event) {
                event.stopPropagation();
                getStageList(item);
            }, false);
            document.body.appendChild(itemEle);
        })(items[i]);
    }
}

function getStageList(item) {
    httpGet("/api/estate/vrHouses/getVrStageList?houseTypeId=" + item.id, function (res) {
        if(res.ret==0&&res.result.data.length>0)
        {
            window.sessionStorage.setItem("stageList", JSON.stringify(res.result.data));
            location.href = "panorama.html";
        }else
        {
            anError("当前场景下没有全景看房",1000);
        }
    });
    //
    // loadJSON('js/stages.json', function (config) {
    //     // console.log(JSON.stringify(config))
    //     window.sessionStorage.setItem("stageList", JSON.stringify(config.stages));
    //     location.href = "panorama.html";
    // })
}
