createTitle("当前：万科");
for (var i = 0; i < 5; i++) {
    createItem({name: "户型a"});
}
function createTitle(title) {
    var titleEle = document.createElement("div");
    titleEle.classList.add("type_title");
    titleEle.innerHTML = title;
    document.body.appendChild(titleEle);
    var tagEle = document.createElement("div")
    tagEle.classList.add("type_tag")
    tagEle.innerHTML = "全部户型："
    document.body.appendChild(tagEle);
}

function createItem(item) {
    var itemEle = document.createElement("div");
    itemEle.classList.add("type_item");
    itemEle.innerHTML = item.name;
    itemEle.addEventListener("click", function (event) {
        event.stopPropagation();
        getStageList(item);
    }, false);
    document.body.appendChild(itemEle);
}

function getStageList(item) {
    loadJSON('js/stages.json', function (config) {
        // console.log(JSON.stringify(config))
        window.sessionStorage.setItem("stageList",JSON.stringify(config.stages));
        location.href = "panorama.html";
    })
}
