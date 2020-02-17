export class TurntableAni{
    /**
     * 轮子被碰撞的动画
     */
    constructor(positionX,positionY,nodeID){
        //停止动画
        this.stopAni = true;
        //移动的坐标数组
        this.movelist = null,
        //当前的游戏体
        //node
        this.qjNode =  $(`#${nodeID}`);
        //node
        this.gameNode = this.qjNode[0];
        //初始化的坐标
        this.positionX = positionX;
        this.positionY = positionY; 
        //生成多少帧的动画坐标
        this.speedNum = 1000/10;
        //第几帧动画的只
        this.indexNum =0;   
        //结束的回调状态
        this.isBackStatus = false;
        //回调函数 动画结束的
        this.overBackFun = null;
    }
      /**
         * 设置左边飞行的动画路径
         */
        setLeftMove(){
            this.indexNum =0; 
            this.movelist = this.bser( [{ x: this.positionX, y: this.positionY},{ x:74, y: 7},{ x: 23, y: 126},{ x: 22, y: 1200}] ,this.speedNum);
            // this.stopAni = false 
            // console.log('当前的内容:',this.movelist)
            return this;
        }

        /**
         * 设置右边动画飞行的路径
         */
        setRightMove(){
            this.indexNum =0; 
            this.movelist = this.bser( [{ x: this.positionX, y: this.positionY},{ x: 2*this.positionX-74, y: 7},{ x: 2*this.positionX-23, y: 126},{ x: 2*this.positionX-22, y: 1200}] ,this.speedNum);
            // this.stopAni = false
            return this;
        }

        /**
         * 动画的执行
         */
        Animation(){
       
            // 是否能开始动画
            if(this.stopAni &&this.gameNode && this.movelist.length>0){
                return;
            }
            //是不是用完了动画帧
            if(this.speedNum -1 < this.indexNum ){
                //控制每次结束仅仅回调一次
                if(this.isBackStatus){
                    this.isBackStatus = false;
                    //动画结束方法启用回调
                    if(this.overBackFun){
                        this.overBackFun();
                    }  
                }
                return;
            }
            //当前的动画
            this.indexNum++;
        
            if(this.movelist[this.indexNum]){ 
                this.position(this.movelist[this.indexNum].e,this.movelist[this.indexNum].f);
            } 
        } 
        /**
         * 设置当前的node坐标位置的位置
         * @param {number} x 
         * @param {number} y 
         */
        position(x,y){
            let _x = (x/window.realfz).toFixed(2);
            let _y = (y/window.realfz).toFixed(2); 
            this.gameNode.style.top = `${_y}rem`;//设置刀子的坐标 
            this.gameNode.style.left = `${_x}rem`;//设置刀子的坐标   
       }
       /**
        * 开始动画
        */
       beginAni(){
           //从零帧开始
            this.indexNum = 0;
           //打开活动
            this.stopAni = false;
            //初始化位置
            this.position(this.positionX,this.positionY);
            this.isBackStatus = true;
            return this;
       }
       /**
        * 动画结束后的回调
        * @param {function} BACK 
        */
       AnimationOver(BACK=null){
           if(BACK!=null){
            this.overBackFun = BACK;
           }  
       }
       /**
        * 设置的分开柠檬是显示开始显示
        * @param {boolean} bool 
        */
       setActive(bool = false){ 
            let node = $('#pass-over-ani');
            if(bool){
                node.show();
            }else{
                node.hide();
            } 
       }
        /**
         * 赛贝尔函数使用用户
         * @param{any}anchorpoints 传入的{起始点的x,y}，{起始点的参数x,y},{末位点的参数x,y},{末位点的采纳数x,y}
         * @param{number}pointsAmount 速度参数
         * @returns {e,f} 返回的 {x，y}的参数在坐标的体系中
         */
        bser(anchorpoints, pointsAmount) {
            let points = [];
            for (let i = 0; i < pointsAmount; i++) {
                let point = MultiPointBezier(anchorpoints, i / pointsAmount);
                points.push(point);
            }
            return points;
            function MultiPointBezier(points_, t) {//t贞数
                let len = points_.length;
                let x = 0, y = 0;
                let erxiangshi = function (start, end) {
                    let cs = 1, bcs = 1;
                    while (end > 0) {
                        cs *= start;
                        bcs *= end;
                        start--;
                        end--;
                    }
                    return (cs / bcs);
                };
                for (let i = 0; i < len; i++) {
                    let point = points_[i];
                    x +=/*Math.round()*/ point.x * Math.pow((1 - t), (len - 1 - i)) * Math.pow(t, i) * (erxiangshi(len - 1, i));//x弧度
                    y +=/*Math.round()*/ point.y * Math.pow((1 - t), (len - 1 - i)) * Math.pow(t, i) * (erxiangshi(len - 1, i));//y弧度
                }
                return { e: x, f: y };
            }
        } 
}