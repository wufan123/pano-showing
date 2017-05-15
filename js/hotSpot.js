/**
 * 场景热点
 * @author yourenke
 */
HotSpot = function (object, spotInfo, radius, eventFn) {
    var interval;
    var hotSpot = this;
    this.object = object
    this.to = spotInfo.to;
    this.showInfo = spotInfo.showInfo;
    this.element = document.createElement('div')
    this.element.classList.add('hot-spot');
    this.elementAllow = document.createElement('div')
    this.elementAllow.classList.add('allow');
    this.elementTitle = document.createElement('div')
    this.elementTitle.classList.add('title');
    this.elementTitle.innerText = spotInfo.title
    this.element.appendChild(this.elementTitle);
    this.element.appendChild(this.elementAllow);

    this.spot = new THREE.CSS3DSprite(this.element);

    if (spotInfo.posType == 'vector') { //向量类型坐标
        this.spot.position.x = spotInfo.x;
        this.spot.position.y = spotInfo.y;
        this.spot.position.z = spotInfo.z;
    } else { //经纬度类型坐标
        theta = THREE.Math.degToRad(spotInfo.lon - 90);
        phi = THREE.Math.degToRad(90 - spotInfo.lat);
        this.spot.position.x = radius * Math.sin(phi) * Math.cos(theta);
        this.spot.position.y = radius * Math.cos(phi);
        //console.log(radius, radius * Math.sin(phi) * Math.sin(theta))
        this.spot.position.z = radius * Math.sin(phi) * Math.sin(theta);
    }


    this.setTitle = function (title) {
        console.log(hotSpot.spot);
        hotSpot.spot.element.childNodes[0].innerHTML = "123";
    }
    this.mount = function (scene) {
        //console.log(this.spot)
        scene.add(this.spot)
        var offset = 0
        var vm = this
        interval = setInterval(function () {
            offset = offset <= -910 ? 0 : offset - 70;
            vm.elementAllow.style.backgroundPosition = '0px ' + offset + 'px'
        }, 50)
    }

    this.destroy = function () {
        clearInterval(interval)
    }

    function spotClick() {
        eventFn && eventFn.call(null, hotSpot)
    }

    this.element.addEventListener('touchstart', spotClick, false);
    this.element.addEventListener('click', spotClick, false);
    // this.update = function () {
    //     //this.spot.quaternion.copy(object.quaternion);
    // }


}