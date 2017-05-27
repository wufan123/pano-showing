/**
 * 场景热点
 * @author yourenke
 */
HotSpot = function (object, spotInfo, radius, eventFn) {
  var interval;
  var hotSpot = this;
  this.object = object;
  this.name = spotInfo.name;
  this.toVrstageId = spotInfo.toVrstageId;
  this.linkurl = spotInfo.linkurl;
  this.type = spotInfo.type
  this.id =spotInfo.id;
  this.mdContent =spotInfo.mdContent;
  this.element = document.createElement('div');
  this.element.classList.add('hot-spot');
  this.elementIcon = document.createElement('div');
  if (this.type == "0") {//0为跳转箭头
    this.elementIcon.classList.add('allow');
  }
  else {
    this.elementIcon.classList.add('info');
  }
  this.elementTitle = document.createElement('div');
  this.elementTitle.classList.add('title');
  this.elementTitle.innerText = this.name;
  this.element.appendChild(this.elementTitle);
  this.element.appendChild(this.elementIcon);

  this.spot = new THREE.CSS3DSprite(this.element);

  if (spotInfo.posType == 'latlon') { //经纬度类型坐标
    theta = THREE.Math.degToRad(spotInfo.lon - 90);
    phi = THREE.Math.degToRad(90 - spotInfo.lat);
    this.spot.position.x = radius * Math.sin(phi) * Math.cos(theta);
    this.spot.position.y = radius * Math.cos(phi);
    //console.log(radius, radius * Math.sin(phi) * Math.sin(theta))
    this.spot.position.z = radius * Math.sin(phi) * Math.sin(theta);
  } else { //向量类型坐标
    this.spot.position.x = spotInfo.x;
    this.spot.position.y = spotInfo.y;
    this.spot.position.z = spotInfo.z;
  }

  this.mount = function (scene) {
    //console.log(this.spot)
    scene.add(this.spot);
    var offset = 0;
    var vm = this;
    if (this.type == "0") {
      this.interval = setInterval(function () {
        offset = offset <= -910 ? 0 : offset - 70;
        vm.elementIcon.style.backgroundPosition = '0px ' + offset + 'px'
      }, 50)
    }
  };

  this.destroy = function () {
    clearInterval(interval)
  };

  function spotClick(event) {
    event.stopPropagation();
    eventFn && eventFn.call(null, hotSpot)
  }

  this.element.addEventListener('touchstart', spotClick, false);
  this.element.addEventListener('click', spotClick, false);

  // this.update = function () {
  //     //this.spot.quaternion.copy(object.quaternion);
  // }


};
