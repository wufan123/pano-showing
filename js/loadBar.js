/**
 * 进度条
 * @author yourenke
 */
LoadBar = function (domElement,max) {
    var unitPro = 0 ;
    this.max = max? max:0
    max&&(unitPro = Math.floor(100/max))
    var parent = document.createElement('div')
    parent.classList.add('bar');
    this.element = document.createElement('div')
    this.element.classList.add('item');
    this.element.style.width = '0%';
    parent.appendChild(this.element);
    domElement.appendChild(parent);

    //创建毛玻璃蒙版
    //var mask = document.createElement('div')
    //mask.classList.add('frosted-glass');
   // domElement.appendChild(mask);
    this.hide = function(){
        parent.style.display = 'none';
        this.element.style.width = '0%';
    }

    this.show = function(){
        parent.style.display = '';
    }
    this.setMax = function(max){
        unitPro = Math.floor(100/max)
        this.max = max
    }
    this.setProgress = function(tick){
        //console.log(this.max,unitPro,tick,tick*unitPro,tick!=max)
        this.element.style.width = tick!=this.max? (tick*unitPro+ "%"):"100%"
        this.element.innerHTML = this.element.style.width;
    }
}