export default class ExchangePage{ 
    constructor(config){
        this.config={
            parentID:'bg',
            waringPop:null,//传入的是消息框的弹出消息框的放 
        }
        this.config = config; 
        this.exchangeBtnEvent = null,//点击兑换按钮执行的事件
        this.addDoument(this.config);
        
    }
    addDoument(config){
        var body = `
        <div id="exchange-page">
            <div id="exchange-page-bg">
                <input id="exchange-page-input" type="text" placeholder='请输入'  οnkeyup="this.value=this.value.replace(/[^\d]/g,'') "/>
                <div id="exchange-page-cangetnum"></div>
                <div id="exchange-page-allnum"></div>
                <div id="exchange-page-one"></div>
                <div id="exchange-page-exBtn"></div>
                <div id="exchange-page-close"></div>
            </div>
        </div>
        `
        $(`#${config.parentID}`).append(body);

        //添加css 
        this.isShow(false);
        this.bin();
    }

    bin(){
        this.setBtn('#exchange-page-exBtn',()=>{
            if(typeof(this.exchangeBtnEvent) === 'undefined') {
                console.log('兑换按钮的事件是空的,请重新绑定exchangeBtnEventFun的方法')
                return;//
            }
            this.exchangeBtnEvent();
        })
        //关闭按钮
        this.setBtn('#exchange-page-close',()=>{ 
            $(`#exchange-page`).hide();
        })

       //提供给下面使用
       var self = this
       var enterInput = $("#exchange-page-input");
       enterInput.change(function(e){ 
           console.log('处理input框')
           var value= enterInput.val()
           var reg=/^\d+$/; // 注意：故意限制了 0321 这种格式，如不需要，直接reg=/^\d+$/;/^[1-9]\d*$|^0$/
           if(reg.test(value)==true){
               self.makeExchangeInfoF(value,(num)=>{
                   console.log('可以了')
                   self.isUseOfIntegral = num
                   self.isCanExchangeStatus = true;

               },(num)=>{
                   self.config.waringPop(`最多可兑换${num}个`);
                   enterInput.val(num);
                   if(num>0){//可兑换的积分 大于0 的才会能打开放开兑换按钮
                       self.isCanExchangeStatus = true;
                       self.isUseOfIntegral = num;
                   }
               })
           }else{
               self.isCanExchangeStatus = false;
               enterInput.val(''); 
               self.config.waringPop('请输入数字');
               self.isUseOfIntegral = 0 

           }
       }); 
    }
    /**
     * 兑换按钮点击事件
     * @param {*} BACK ;
     */
    exchangeBtnEventFun(BACK){
        this.exchangeBtnEvent = BACK;
    }
    /**
     * 得到兑换按钮事件的方法
     * //返回的是玩家选择的相关采纳数
     * isUseOfIntegral {number}
     */
    getExchangeEventData(){
        var self = this; 
        if(typeof(self.isUseOfIntegral) === 'undefined'){ 
            return null;
        }
        return {
            isUseOfIntegral:self.isUseOfIntegral,//当前兑换的积分的数量
        } 
    }

    /**
     * /公共积分算出来当前可以获得的金币数量
     * @param {umber} info 
     * @param {function} OKBACK 
     * @param {function} WARINGBACK 
     */
    makeExchangeInfoF(info,OKBACK,WARINGBACK){
        var  canUseNum = 0;
        if(info>this.IntExchange.usefulScore){
            canUseNum = this.IntExchange.usefulScore;
            if(WARINGBACK!=null){
                WARINGBACK(canUseNum);
            }
        }else {
            canUseNum = info;
            if(OKBACK!=null){
                OKBACK(info);
            }
        }
        //兑换后的框 显示出来可以兑换多少金币
        $('#exchange-page-cangetnum').text(canUseNum*this.IntExchange.rateBean);
    }

    /**
     * 是不是打开本页面
     * @param {boolean} bool ;
     */
    isShow(bool){
        if(bool === true){
            $(`#exchange-page`).show();
        }else{
            $(`#exchange-page`).hide();
        }
    }

    /**
     * 显示出来相关的数据在页面上
     * @param {object} info 
     */
   initPageData(info=null){ 
       if(typeof(info) == "undefined"){
           return;
       }
       //取到当前的相关兑换的信息
       this.IntExchange = info;
       //设置比例
       $('#exchange-page-one').text(info.rateBean)
       //显示当前可以兑换的积分
       $('#exchange-page-allnum').text(info.usefulScore)
        console.log('取到了参数',info);

   }
  
    //-------------animation 专区-----------------
    /**
     * 封装的按钮事件 当前的按钮
     * @param {*} _nodeId ;当前node节点id的名字
     * @param {*} BACK 
     */
    setBtn(_nodeId,BACK){
        let startStatus={
            transform: 'scale(1.0)'
        }
        //结束的状态
        let targetStatus1={
            transform: 'scale(1.1)'
        }
        let targetStatus2={
            transform: 'scale(0.9)'
        }
        let node = $(_nodeId); 
        node.click(()=>{
            node.animate(targetStatus1,100,()=>{
                node.animate(targetStatus2,100,()=>{ 
                    if(BACK!=null){
                        BACK();
                    }
                    node.animate(startStatus,50,()=>{})
                })
            })
           
        }) 
    }
} 


// #exchange-page{ 
//     // display: none;
//     position: absolute;
//     top: 0;
//     left: 0; 
//     bottom: 0;
//     right: 0;
//     @include aWHU(750,1334); 
//     #exchange-page-bg{
//         margin: ax(250) 0 0 ax(80);
//         @include aWHU(600,620);
//         @include setBg('./assets/images/101x.png'); 
   
//         #exchange-page-input{ 
//             position: absolute; 
//             max-width: ax(148);
//             left: ax(210);
//             top: ax(420);
//             color: rgb(255, 144, 45) ;
//             font-size: ax(35);
//         }
//         #exchange-page-cangetnum{ 
//             position: absolute; 
//             color: rgb(255, 144, 45);
//             min-width: ax(40);
//             line-height: ax(35);
//             font-size: ax(35);
//             left: ax(480);
//             top: ax(420);
//             text-align: center;
//         }
//         #exchange-page-allnum{
//             position: absolute; 
//             color: rgb(255, 144, 45);
//             min-width: ax(40);
//             line-height: ax(35);
//             font-size: ax(35);
//             left: ax(332);
//             top: ax(514);
//             text-align: left; 
//         }
//         #exchange-page-one{
//             position: absolute; 
//             color: rgb(255, 144, 45);
//             min-width: ax(40);
//             line-height: ax(20);
//             font-size: ax(20);
//             left: ax(345);
//             top: ax(568);
//             text-align: center; 
//         }
//         #exchange-page-exBtn{
//             position: absolute; 
//             top: ax(700);
//             left: ax(200); 
//             @include aWHU(329,88); 
//             @include setBg('./assets/images/102x.png'); 
//         }
//         #exchange-page-close{
//             position: absolute; 
//             top: ax(230);
//             right: ax(60); 
//             @include aWHU(58,58); 
//             @include setBg('./assets/images/100x.png'); 
//         }
//     }
// }