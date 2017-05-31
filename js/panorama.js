/**
 * 主控场景控制
 * @author yourenke
 */
// loadJSON('js/stages.json', function (config) {
//     console.log("取到的配置",config)
//     document.title = config.title
//     panorama = new Panorama(config, document.body)
// })
var stageList;
try {
    stageList = convertCubePicUrls(JSON.parse(window.sessionStorage.getItem("stageList")));
}catch (e)
{
    anError("场景列表信息异常",1000);
}

function convertCubePicUrls(list) {
    for(var i =0;i<list.length;i++)
    {
        list[i].cubePicUrls = JSON.parse(list[i].cubePicUrls);
    }
    return list;
}
var panorama = new Panorama({
    title: "",
    size: 768,
    audio: "./resource/music_bg.mp3",
    autoplay: true,
    toolbar: {
        audio: true,
        select: true
    },
    stages:stageList
},document.body);
function Panorama (config, domElement, clickSpotFn) {
    var camera, scene, renderer, hotSpots = [],
        controls, animationFrame;
    var minMapElement, titleElement, toolElement ,showElement,showParentElement;
    var vm = this;

    config.size = Math.floor(config.size ? config.size * 1.5 : 768 * 1.5);
    var halfSize = Math.floor(config.size / 2);
    //初始化
    function init() {
        camera = new THREE.PerspectiveCamera(90, domElement.clientWidth / domElement.clientHeight, .1, 1000);
        scene = new THREE.Scene();
        renderer = new THREE.CSS3DRenderer();
        renderer.setSize(domElement.clientWidth, domElement.clientHeight);
        renderer.domElement.style.position = 'absolute';
        domElement.appendChild(renderer.domElement);
        //添加控制器
        controls = new Controls(camera, renderer.domElement);
        window.addEventListener('resize', onWindowResize, false);
        // createShowBox();
        createToolBar();
        InitloaderManager();
        loadFirstStage();
        animate()
    }

    //窗口变化
    function onWindowResize() {
        camera.aspect = domElement.clientWidth / domElement.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(domElement.clientWidth, domElement.clientHeight);
    }
    function createShowBox() {
        controls.setDisable(true);
        showParentElement =  document.createElement('div');
        showParentElement.classList.add("show");
        showElement  =document.createElement('div');
        showElement.classList.add("show-box");
        showParentElement.appendChild(showElement);
        setTimeout(function () {
            showParentElement.addEventListener('click',function () {
                controls.setDisable(false);
                renderer.domElement.removeChild(showParentElement);
            },false)
        },100);
        renderer.domElement.appendChild(showParentElement);
    }

    //创建工具条按钮对象
    function createToolBarItem(iconName, title, eventFn) {
        var toolElementItem = document.createElement('div');
        toolElementItem.classList.add('toolbar-item');
        var iconElement = document.createElement('div');
        iconElement.className = 'iconfont ' + iconName;
        var titleElement = document.createElement('div');
        titleElement.className = 'title';
        titleElement.innerText = title;
        var fn = function (event) {
            //console.log(event)
            eventFn.call(this, toolElementItem, iconElement);
            event.stopPropagation();
        };
        if (eventFn) {
            toolElementItem.addEventListener('click', fn, false);
            //toolElementItem.addEventListener('touchstart', fn,false)
        }
        toolElementItem.appendChild(iconElement);
        toolElementItem.appendChild(titleElement);
        toolElement.appendChild(toolElementItem);
        return toolElementItem
    }

    //创建工具条
    function createToolBar() {
        toolElement = document.createElement('div');
        toolElement.classList.add('toolbar');
        // var estateElement = document.createElement('div');
        // estateElement.className = 'preview';
        createToolBarItem("icon-house","户型选择",function () {
                window.history.go(-1);
        });
        if (config.toolbar.select) { // 房间选择
            var planeElement = document.createElement('div');
            planeElement.className = 'preview';
            var itemsElement = document.createElement('div');
            itemsElement.className = 'preview-items';
            planeElement.appendChild(itemsElement);
            for (var i = 0; i < config.stages.length; i++) {
                var stage = config.stages[i];
                var itemElement = document.createElement('div');
                itemElement.className = 'preview-item';
                itemElement.style.backgroundImage = 'url(' + stage.previewUrl + ')';
                !(function (stage) {
                    itemElement.addEventListener('click', function () {
                        loadStage(stage.id)
                    })
                })(stage);
                var titleElement = document.createElement('div');
                titleElement.className = 'preview-title';
                titleElement.innerText = stage.name;
                itemElement.appendChild(titleElement);
                itemsElement.appendChild(itemElement)
            }
            toolElement.appendChild(planeElement);
            createToolBarItem('icon-menu', '房间选择', function (toolElementItem, iconElement) {
                if (planeElement.style.opacity == 0) {
                    controls.setDisable(true);
                    planeElement.style.height = '140px';
                    planeElement.style.opacity = 1
                } else {
                    controls.setDisable(false);
                    planeElement.style.height = '0px';
                    planeElement.style.opacity = 0
                }

            })
        }
        if (config.toolbar.audio) { // 声音控制
            //创建aduio
            var audioElement = document.createElement('audio');
            audioElement.loop = 'loop';
            audioElement.src = config.audio;
            domElement.appendChild(audioElement);
            audioElement.load();
            var item = createToolBarItem('icon-soundminus', '声音', function (toolElementItem, iconElement) {
                console.log(audioElement.paused);
                if (audioElement.paused) {
                    audioElement.play();
                    iconElement.className = 'iconfont icon-soundplus';
                } else {
                    audioElement.pause();
                    iconElement.className = 'iconfont icon-soundminus';
                }
            });
            config.autoplay && item.click()
        }
        renderer.domElement.appendChild(toolElement)
    }

    //加载第一个场景
    function loadFirstStage() {
        if (config.stages && config.stages.length <= 0) {
            anError('没有场景信息');
            return;
        }
        loadStage(config.stages[0].id)
    }

    //重置场景
    function resetStage() {
        while (scene.children.length > 0) {
            scene.remove(scene.children[0]);
        }
        controls.reset()
    }

    //根据ID加载场景
    function loadStage(stageId) {
        var stage = null;
        for (var i = 0; i < config.stages.length; i++) {
            if (config.stages[i].id == stageId) {
                stage = config.stages[i]
            }
        }
        if (!stage) {
            anError('没有找到ID为' + stageId + '的场景信息');
            return;
        }
        if (stage.cubeMap && stage.cubeMap.length < 6) {
            anError('贴图信息异常');
            return;
        }
        console.log('进入场景:' + stage.name);
        resetStage();
        var sides = [{
            url: stage.cubePicUrls[0],
            position: [-halfSize, 0, 0],
            rotation: [0, Math.PI / 2, 0]
        },
            {
                url: stage.cubePicUrls[1],
                position: [halfSize, 0, 0],
                rotation: [0, -Math.PI / 2, 0]
            },
            {
                url: stage.cubePicUrls[2],
                position: [0, halfSize, 0],
                rotation: [Math.PI / 2, 0, Math.PI]
            },
            {
                url: stage.cubePicUrls[3],
                position: [0, -halfSize, 0],
                rotation: [-Math.PI / 2, 0, Math.PI]
            },
            {
                url: stage.cubePicUrls[4],
                position: [0, 0, halfSize],
                rotation: [0, Math.PI, 0]
            },
            {
                url: stage.cubePicUrls[5],
                position: [0, 0, -halfSize],
                rotation: [0, 0, 0]
            }
        ];
        for (var i = 0; i < sides.length; i++) {
            var side = sides[i];
            var loader = new THREE.ImageLoader();
            (function (side) {
                loader.load(
                    side.url,
                    function (image) {
                        image.width = config.size + 1;
                        var object = new THREE.CSS3DObject(image);
                        object.position.fromArray(side.position);
                        object.rotation.fromArray(side.rotation);
                        scene.add(object);
                    })
            })(side)
        }
        //添加场景描述
        if (stage.name) {
            if (!titleElement) {
                titleElement = document.createElement('div');
                titleElement.classList.add('stage-title');
                renderer.domElement.appendChild(titleElement)
            }
            titleElement.innerText = stage.name
        }

        //加载热点
        if (stage.vrAnchors && stage.vrAnchors.length > 0) {
            for (var i = 0; i < stage.vrAnchors.length; i++) {
                if (!clickSpotFn) {
                    clickSpotFn =hotspotFn;
                }
                var hotSpot = new HotSpot(camera, stage.vrAnchors[i], halfSize - 40, clickSpotFn);
                hotSpot.mount(scene);
                hotSpots.push(hotSpot)
            }
        }
    }
    
    function hotspotFn(hotspot) {

        if(hotspot.type==0)
        {
            loadStage(hotspot.toVrstageId)
        }else{

            createShowBox();
            httpGet(hotspot.linkurl,function (re) {
                showElement.innerHTML =re;
            })
        }
    }

    //初始化全局加载器
    function InitloaderManager() {
        var loadBar = new LoadBar(renderer.domElement);
        THREE.DefaultLoadingManager.onStart = function (url, itemsLoaded, itemsTotal) {
            //cancelAnimationFrame(animationFrame);
            loadBar.show()
        };
        THREE.DefaultLoadingManager.onLoad = function () {
            setTimeout(function () {
                loadBar.hide();
                //requestAnimationFrame(animate)
            }, 200);
        };
        THREE.DefaultLoadingManager.onProgress = function (url, itemsLoaded, itemsTotal) {
            loadBar.setMax(itemsTotal);
            loadBar.setProgress(itemsLoaded)
        };
        THREE.DefaultLoadingManager.onError = function (url) {
            anError('资源加载失败:' + url)
        };
    }

    function animate() {
        animationFrame = requestAnimationFrame(animate);
        controls.update();
        //hotSpotsUpdate()
        renderer.render(scene, camera);
    }

    //添加热点
    this.addHotSpot = function (hotSpot) {
        hotSpot.mount(scene);
        hotSpots.push(hotSpot);
    };
    this.getSpotXYZ = function (coordinates) {
        var clientV = new THREE.Vector3(
            (coordinates.x / domElement.clientWidth) * 2 - 1, -(coordinates.y / domElement.clientHeight) * 2 + 1,
            0.5);
        clientV.unproject(camera);
        // console.log(clientV); //向量
        var offset = (halfSize - 40) / Math.sqrt(Math.pow(clientV.x, 2) + Math.pow(clientV.y, 2) + Math.pow(clientV.z, 2)); //offset*根号(x平方+y平方+z平方) = 向量增幅即半径
        return {
            "x": clientV.x * offset,
            "y": clientV.y * offset,
            "z": clientV.z * offset
        };
    };

    this.getHotspot = function (spot, clickSpotFn) {
        return new HotSpot(camera, spot, halfSize - 40, clickSpotFn);
    };
    this.removeSpot = function (hotspot) {
        scene.remove(hotspot.spot);
        hotSpots.pop(hotspot);
    };
    init()
}
