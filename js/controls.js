/**
 * 事件，相机控制
 * @author yourenke
 */
Controls = function (object, domElement) {
  var vm = this;
  this.object = object
  this.autoRun = true
  this.disable = false
  this.domElement = (domElement !== undefined) ? domElement : document;
  //内部变量定义
  var target = new THREE.Vector3(),
    lon = 0,
    lat = 0,
    phi = 0,
    theta = 0,
    touchX, touchY;
  this.reset = function () {
    lon = lat = phi = theta = 0;
    this.update()
  }
  this.setDisable = function (disable) {
    this.disable = disable
    if (!disable) {
      vm.domElement.addEventListener('mousedown', onDocumentMouseDown, false);
      vm.domElement.addEventListener('mouseout', onDocumentMouseOut, false);
      vm.domElement.addEventListener('wheel', onDocumentMouseWheel, false);
      vm.domElement.addEventListener('touchstart', onDocumentTouchStart, false);
    } else {
      vm.domElement.removeEventListener('mousedown', onDocumentMouseDown);
      vm.domElement.removeEventListener('onmouseout', onDocumentMouseOut, false);
      vm.domElement.removeEventListener('wheel', onDocumentMouseWheel);
      vm.domElement.removeEventListener('touchstart', onDocumentTouchStart);
    }
  }
  this.update = function () {
    // vm.autoRun && (lon += 0.05)
    lat = Math.max(-85, Math.min(85, lat));
    phi = THREE.Math.degToRad(90 - lat);
    theta = THREE.Math.degToRad(lon - 90);
    target.x = Math.sin(phi) * Math.cos(theta);
    target.y = Math.cos(phi);
    target.z = Math.sin(phi) * Math.sin(theta);
    object.lookAt(target);
  }

  function onDocumentMouseDown(event) {
    event.preventDefault();
    vm.domElement.addEventListener('mousemove', onDocumentMouseMove, false);
    vm.domElement.addEventListener('mouseup', onDocumentMouseUp, false);
  }
  function onDocumentMouseOut(event) {
    event.preventDefault();
    vm.domElement.removeEventListener('mousemove', onDocumentMouseMove);
    vm.domElement.removeEventListener('mouseup', onDocumentMouseUp);
  }
  function onDocumentMouseMove(event) {
    var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
    lon -= movementX * 0.2;
    lat += movementY * 0.2;
  }

  function onDocumentMouseUp(event) {
    vm.domElement.removeEventListener('mousemove', onDocumentMouseMove);
    vm.domElement.removeEventListener('mouseup', onDocumentMouseUp);
  }

  function onDocumentMouseWheel(event) {
    //console.log('111', object.fov, event.deltaY)
    if ((object.fov >= 90 && event.deltaY < 0) || (object.fov < 60 && event.deltaY > 0) || (object.fov < 90 && object.fov >= 60)) {
      object.fov += event.deltaY * 0.05;
      object.updateProjectionMatrix();
    }

  }

  function onDocumentTouchStart(event) {
    //  event.preventDefault();
    var touch = event.touches[0];
    touchX = touch.screenX;
    touchY = touch.screenY;
    vm.autoRun = false
    vm.domElement.addEventListener('touchmove', onDocumentTouchMove, false);
    vm.domElement.addEventListener('touchend', onDocumentTouchEnd, false);
  }

  function onDocumentTouchMove(event) {
    event.preventDefault();
    var touch = event.touches[0];
    lon -= (touch.screenX - touchX) * 0.2;
    lat += (touch.screenY - touchY) * 0.2;
    touchX = touch.screenX;
    touchY = touch.screenY;
  }

  function onDocumentTouchEnd(event) {
    // event.preventDefault();
    vm.domElement.removeEventListener('touchmove', onDocumentTouchMove);
    vm.domElement.removeEventListener('touchend', onDocumentTouchEnd);
    vm.autoRun = true;

  }

  this.setDisable(this.disable)
}
