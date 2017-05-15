/**
 * 事件，相机控制
 * @author yourenke
 */
Controls = function (object, domElement) {
    var vm = this
    this.object = object
    this.autoRun = true
    this.disable = false
    this.domElement = (domElement !== undefined) ? domElement : document;
    //内部变量定义
    var target = new THREE.Vector3(),
        autoRunTimeOut,
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
            vm.domElement.addEventListener('wheel', onDocumentMouseWheel, false);
            vm.domElement.addEventListener('touchstart', onDocumentTouchStart, false);
            vm.domElement.addEventListener('touchmove', onDocumentTouchMove, false);
            vm.domElement.addEventListener('touchend', onDocumentTouchEnd, false);
        } else {
            vm.domElement.removeEventListener('mousedown', onDocumentMouseDown);
            vm.domElement.removeEventListener('wheel', onDocumentMouseWheel);
            vm.domElement.removeEventListener('touchstart', onDocumentTouchStart);
            vm.domElement.removeEventListener('touchmove', onDocumentTouchMove);
            vm.domElement.removeEventListener('touchend', onDocumentTouchEnd);
        }
    }
    this.update = function () {
        vm.autoRun && (lon += 0.05)
        lat = Math.max(-85, Math.min(85, lat));
        phi = THREE.Math.degToRad(90 - lat);
        theta = THREE.Math.degToRad(lon - 90);
        target.x = Math.sin(phi) * Math.cos(theta);
        target.y = Math.cos(phi);
        target.z = Math.sin(phi) * Math.sin(theta);
        object.lookAt(target);
    }

    function onDocumentMouseDown(event) {
        //    event.preventDefault();
        vm.domElement.addEventListener('mousemove', onDocumentMouseMove, false);
        vm.domElement.addEventListener('mouseup', onDocumentMouseUp, false);
    }

    function onDocumentMouseMove(event) {
        var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
        lon -= movementX * 0.1;
        lat += movementY * 0.1;
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
        clearTimeout(autoRunTimeOut)
    }

    function onDocumentTouchMove(event) {
        event.preventDefault();
        var touch = event.touches[0];
        lon -= (touch.screenX - touchX) * 0.1;
        lat += (touch.screenY - touchY) * 0.1;
        touchX = touch.screenX;
        touchY = touch.screenY;
    }

    function onDocumentTouchEnd(event) {
        // event.preventDefault();
        autoRunTimeOut = setTimeout(function () {
            vm.autoRun = true
        }, 3000)
    }
    this.setDisable(this.disable)
}