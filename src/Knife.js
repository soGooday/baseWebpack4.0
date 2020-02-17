 var objId = 0;
 export class Knife{
    constructor(config,objID,MAINBACK){
        this.isCanMove = false;
        config.id = objID;
        this.id = objID;//刀子的id
        
        this.MAINBACK = MAINBACK;//插进水果之后的回调
        this.objctknifeInfo = null;//当前zetop的游戏体
        
        

        this.config = config;
        this.init(this.id,config);
    }
    init(id,config){
        //创造出来一个刀子
        var objctknifeF = `<div class="gs-launch" id=knife-${id}></div>`
        //取到id
        this.objID = `#knife-${id}`; 
        //创建node
        $(`#${config.bornAreaID}`).append(objctknifeF);
        //取到此节点
        this.objctknife = $(`#${config.bornAreaID}`).children(this.objID)[0];  
        this.topNum = 1000 /40;
        this.objctknifeInfo = $(this.objID); 
         
    }
    move(BACK=null){ 
        if(this.isCanMove === false) return;
        this.topNum -= 0.5; 
        // this.objctknife.style.top = `${this.topNum}px`
        this.objctknife.style.top = `${this.topNum}rem`
        // console.log('this.objctknife.style.top:',this.objctknife.style.top);
        if(this.topNum<= 18){//检测到了制定的坐标就变为大转盘的子节点
            this.isCanMove = false
            this.setRotation(this.config,this.objctknife); 
            //插入了大转盘 执行一个回调
            if(BACK!=null){
                BACK(); 
            }
        } 
    }
    //变为大转盘的子节点
    toBeTurntableChild(config,selfNode){
        this.objctknife.style.top = `${config.x}rem`;//设置刀子的坐标 
        this.objctknife.style.left = `${config.y}rem`;//设置刀子的坐标  
        this.objctknife.style.transform  = `rotate(${-config.rotate}deg)`;

        $(`#${config.parentID}`).append(selfNode);
        //刀子发射的回调
        this.mainBackFun();
        
    }
    //计算出角度与坐标
    setRotation(config,selfNode){   
        let docEl = document.documentElement.style.fontSize;  
        let R_ = config.node.rotate.num  ;
        R_  = R_ - Math.floor(R_ / 360) * 360;
        let x_ = (config.node.width*config.radiusRatio *Math.cos((R_ )/180*Math.PI) + config.node.width*(0.08))*window.remscale; 
        let y_ = (config.node.height*config.radiusRatio *Math.sin((R_ )/180*Math.PI) + config.node.height*(0.2))*window.remscale;  
        config.rotate = R_; 
        config.x = (x_/window.realfz).toFixed(2);
        config.y =( y_/window.realfz).toFixed(2); 
        this.toBeTurntableChild(config, selfNode); 
    } 
    //回调方法
    mainBackFun(){
        if(this.MAINBACK!=null || this.MAINBACK!=undefined || this.MAINBACK!=''){
            this.MAINBACK();
        }
    }
    //移除自己
    isRemove(){
        $(this.objID).remove();
    }
    //取到玩家碰撞的信息
    getCollideInfo(){
        return {
            x:this.objctknifeInfo.offset().left-30,
            y:this.objctknifeInfo.offset().top,
            width:30,
            height:95
        } 
    }
}        
 