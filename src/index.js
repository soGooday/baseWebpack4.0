require('./index.scss'); 
import $ from '../node_modules/zepto-webpack/zepto.js'
import './assets/tool/Zepto.fx.js' 
import {Knife} from'./Knife.js' 
import {TurntableAni} from './TurntableAni.js';
const gameInfo ={
    phoneHand:[134,135,136,137,138,139,147,150,151,152,157,158,159,182,187,188,130,131,132,155,156,185,186],//随机出现的手机号头 
    redMoney:[10,20,120,220,20],//红包的金额文案数值
    giveStrengthNum:2,//每天开局赠送的体力数量
    whatchVideoTopNum:8,//上线的次数
    playCostStrengthNum:2,//每次花费的体力数两
    key:'uid',//玩家当前的本地储存的key值
    btin_1:null,//看视频获得更多体力 最上面的那个
    btin_2:null,//免费玩游戏的按钮
    btin_3:null,//下面就是相应的奖品按钮
    btin_4:null,
    btin_5:null,
    btin_6:null,
    btin_7:null,  
    passNum:0,//当前是第几关了 
    waring_1:'您已超过最近大关卡数',
    delayNum:10,//单位是毫秒
    
}
//减速道具的相关信息 
let slowDownPropInfo={
    useStatus: 1,//当前道具是否可用 0正在使用中 1是可用 2不可以使用
    normalSpeed:1,//正常的速度是1
    speedDowm:0.85,//减去的速率
     
}
//游戏中的奖品信息
let rewardList={ 
    testPlayType :1,// 1=试玩 2奖品通关  testPlayType与rewardtPlayType是下面奖品类型中typeOfPlay都是同一个意思
    rewardtPlayType:2,//2奖品通关
    //下面的奖品reward1-reward7 分别从下倒下对应着几个奖品页面中的7哥选择按钮
        reward1:{
            id:1,
            content:'获取更多体力',//这个是不需要的 因为这个是获取更多体力的 
            maxPassNum:0,//关数的上线 
            passKnifeNumList:[4,5,6,7],//每一关卡的刀子数量
            timeList:[40,35,25,20],//倒计时的值
            typeOfPlay :1,// 1=试玩 2奖品通关  
        },
        reward2:{
            id:2,
            content:'免费试玩',
            maxPassNum:2,//关卡的上线
            passKnifeNumList:[4,6,6,6], //每一关卡的刀子数量
            timeNumList:[40,35,25,20],//倒计时的值
            typeOfPlay :1,// 1=试玩 2奖品通关
        },
        reward3:{
            id:3,
            content:'华为5G手机', 
            maxPassNum:4,//关卡的上线 
            passKnifeNumList:[5,7,9,10], //每一关卡的刀子数量
            timeNumList:[40,35,25,20],//倒计时的值
            typeOfPlay :2,// 1=试玩 2奖品通关
        },
        reward4:{
            id:4,
            content:'100元红包', 
            maxPassNum:4,//关卡的上线
            passKnifeNumList:[5,7,9,10], //每一关卡的刀子数量 
            timeNumList:[40,35,25,20],//倒计时的值
            typeOfPlay :2,// 1=试玩 2奖品通关
        },
        reward5:{
            id:5,
            content:'5元红包',
            maxPassNum:3,//关卡的上线 
            passKnifeNumList:[5,7,9,10], //每一关卡的刀子数量
            timeNumList:[40,35,25,20],//倒计时的值
            typeOfPlay :2,// 1=试玩 2奖品通关
        },
        reward6:{
            id:6,
            content:'ipadAir3',
            maxPassNum:4,//关卡的上线 
            passKnifeNumList:[5,7,9,10], //每一关卡的刀子数量
            timeNumList:[40,35,25,20],//倒计时的值
            typeOfPlay :2,// 1=试玩 2奖品通关
        },
        reward7:{
            id:7,
            content:'AirPods',
            maxPassNum:4,//关卡的上线
            passKnifeNumList:[5,7,9,10], //每一关卡的刀子数量
            timeNumList:[40,35,25,20],//倒计时的值
            typeOfPlay :2,// 1=试玩 2奖品通关
        }
}
//游戏场景中的UI
let gameSceneUI={
    starts_1:null,//是星星的那个节点
    starts_2:null,//是星星的那个节点
    starts_3:null,//是星星的那个节点
    starts_4:null,//是星星的那个节点
    rewardTitle:null,//当前的奖励标题
}
//本地需要储存的数据
let localStorage = {
    lastTime:0,//每次登入时间就会更新
    strengthNum:10,//当前有的最多的次数 
    canfreePlay:1,//0=false  1=true
    whatchVideoNum:0,//当前观看过几次视频了 
}


class fruitMachine{
    constructor(){  
        this.init();
        this.bin(); 
      
    }
     /**
     *初始化使用
     */
    init(){ 
        //首先取到本地记录 初始化相关的数据
        this.getlocalData();
        //----变量创建区----
        //玩家当前的体力值 
        this.strengthNum = 0;  
        //玩家当前关卡还可以使用的刀子的数量 每使用一个 就会减少一个
        this.haveKnifeNum = 0;
        //玩家先择的游戏奖信息
        this.chooseRwardInfo = null;
        //当前游戏倒计时
        this.gameTimeNum = 0;
        //玩家通成功还是失败的状态  0 还在游戏中未触发成功或者失败的状态(可以继续玩耍)  1 通关成功 2通关失败
        this.levenEndStatus = 0;
        //玩家发射完毕后刀子的相关事项是否处理完毕 true放可以进行发射 包括刀子的预制 刀子数量相应减少
        this.canLaunchStatus = false;
        //倒计时停止倒计时状态  道具看视频使用的 看了 视频倒计时停止
        this.timerIsStop = false; 
        //游戏帧的积累 用于阻碍转盘的减速
        this.gameFrame = 0;
        
        //取到页面上的相关按钮
        this.getBtnNode();
        //绑定出视图与数据区
        this.setPropertyInit(); 

        //初始化数据
        this.strengthNum  = localStorage.strengthNum; 
       

  
        //跑马灯
        this.horseRaceLamp();
        //初始化游戏场景
        this.initGameScene();  
        //按钮状态初始化
        this.Btn1EventInit();
        this.Btn2EventInit();

        this.turntableJump();

        //生成中间转盘掉落的动画页面
        this.turntableFallDown();
        
      
      
    }  
     /**
     * 按钮绑定专用
     */
    bin(){  

        //添加体力的按钮
        this.setBtn('#add-strength-btn',()=>{
            this.mainSceneBtnEvent(rewardList.reward1);
        })
        //免费玩耍的按钮
        this.setBtn('#reward-1-play-btn',()=>{
            this.mainSceneBtnEvent(rewardList.reward2);
        }) 
        //添加奖品按钮事件
        this.setBtn('#reward-2-play-btn',()=>{
            this.mainSceneBtnEvent(rewardList.reward3);
        }) 
        //添加奖品按钮事件
        this.setBtn('#reward-3-play-btn',()=>{
            this.mainSceneBtnEvent(rewardList.reward4);
        }) 
        //添加奖品按钮事件
        this.setBtn('#reward-4-play-btn',()=>{
            this.mainSceneBtnEvent(rewardList.reward5);
        }) 
        //添加奖品按钮事件
        this.setBtn('#reward-5-play-btn',()=>{
            this.mainSceneBtnEvent(rewardList.reward6);
        }) 
        //添加奖品按钮事件
        this.setBtn('#reward-6-play-btn',()=>{
            this.mainSceneBtnEvent(rewardList.reward7);
        }) 
        //刀子的发射
        $('#knife-send-btn').click(()=>{ 
            this.sendKnife(); 
        })
         //失败的窗中 看视频立即复活按钮
        this.setBtn('#fail-pupop-btn-1',()=>{ 
            this.watchVideosSDK(4,()=>{
                this.initPassInfo(localStorage.passNum);
                //关闭提示弹窗
                this.isFailPupop(false);
                //将减速道具设置为已经
                console.log('看视频从本官卡直接复活:',this.passNum);
            })
        })   
        //通关失败返回主页面
        this.setBtn('#fail-pupop-btn-2',()=>{
            this.openMainScene();
        })  
        //玩家试玩成功返回主页面
        this.setBtn('#test-pupop-btn-1',()=>{
            this.openMainScene();
        })   
        //玩家通关成功了
        this.setBtn('#success-pupop-btn',()=>{
            //渠道玩家填写的内容
            let name = document.getElementById('play-name').value;
            let phone = document.getElementById('phone-num').value; 
        })   
        //绑定减速道具
        // this.speedBtn();
    }
    //绑定减速按钮事件
    speedBtn(){
        //减速道具 
        this.setBtn('#speed-reduction',()=>{ 
            //调取视频
            this.isStopTimer(true);
            this.watchVideosSDK(1,()=>{
                // console.log('使用道具')
                this.isStopTimer(false); 
                // this.useSpeedProp(2);
                console.log('slowDownPropInfo.useStatus:',slowDownPropInfo.useStatus);
                slowDownPropInfo.useStatus = 0;
            })

        })  
    }
    /**
     * 绑定数据与数据图
     */
    setPropertyInit(){
        this.setProperty(this,'strengthNum',localStorage.strengthNum,(vlue)=>{
            console.log('strengthNum:',vlue);
            if(vlue<=0){
                vlue = 0;
            }
             $('#strength-num').text(vlue);
             this.dealWithStrengthNum(vlue);
        }); 
     
        this.setProperty(localStorage,'whatchVideoNum',localStorage.whatchVideoNum,(vlue)=>{
            console.log('whatchVideoNum:',vlue); 
            this.Btn1EventInit();
        }); 

        this.setProperty(localStorage,'canfreePlay',localStorage.canfreePlay,(vlue)=>{
            console.log('canfreePlay:',vlue); 
            this.Btn2EventInit();
        }); 

        this.setProperty(localStorage,'passNum',localStorage.passNum,(vlue)=>{
            console.log('passNum:',vlue); 
            this.dealWithpass(vlue);
        }); 
        
        //当前关卡拥可以发生的刀子的数量
        this.setProperty(this,'haveKnifeNum',0,(vlue)=>{
            // console.log('haveKnifeNum:',vlue); 
            //初始化当前可使用的刀子的数量
            this.showHaveKniefNum(vlue); 
        });    

        //当前关卡通关是失败还是成功的状态
        this.setProperty(this,'levenEndStatus',0,(vlue)=>{
            console.log('levenEndStatus:',vlue); 
            this.customsPassStatus(vlue,this.chooseRwardInfo,localStorage.passNum); 
          
        });   
        //减速道具
        this.setProperty(slowDownPropInfo,'useStatus',1,(vlue)=>{
            console.log('useStatus:',vlue);
               //状态进行更换
            console.log('---------------------:',vlue) 
           
            this.useSpeedProp(vlue);
        
        });  
      

    }
    /**
     * 发射刀子
     */
    sendKnife(){
        if(this.haveKnifeNum === 0){
            console.log('玩家当前已经没有刀子了');
            return;
        }
        //有刀子切是可以发射的状态
        if( this.knife && this.canLaunchStatus){ 
            // this.knifeNumArry.push(this.knife);//将刀子放到碰撞检测中
            this.knife.isCanMove = true; //打开刀子的移
            this.canLaunchStatus = false;  //发射后将刀子的准备状态设置为false
        }
    }
    /**
    *  打开游戏的场景
    * @param {*} rewardList 
    */ 
    
    openGameScene(rewardList,BACK = null){
        //当前的奖品的信息
        this.chooseRwardInfo = rewardList;
        //设置当前关卡数 游戏挂卡中的动态信息 在 localStorage.passNum 中
        // localStorage.passNum = 1; 
        //更新右上角的奖品
        this.showReWardTitle(rewardList.content);
        //打开游戏场景
        this.isOpenMainScene(false); 
        //初始化相关数据
        this.initPassInfo(1);
        //将减速道具设置为可以使用
        // this.useSpeedProp(1);
        slowDownPropInfo.useStatus = 1;
        // this
        //回调方法 
        if(BACK!=null){
            BACK();
        } 
    }
    /**
     * 打开主页面场景
     */
    openMainScene(){
        this.isOpenMainScene(true);
        this.closeAllPupop();
        this.cleanKnifeArry();//转盘清空
    }
 
    /**
     * 是否打开main场景
     * @param {bool} _bool 
     */
    isOpenMainScene(_bool){
        let mainScene = $('#main-scene');
        let ganeScene = $('#game-scene');
        if(_bool){
            mainScene.show();
            ganeScene.hide();
        }else{
            ganeScene.show();
            mainScene.hide();
        }

    } 
    //-------------------mainScene部分----------
    /**
     * 取到页面上的相关按钮
     */
    getBtnNode(){
        gameInfo.btin_1 = $('#add-strength-btn');
        gameInfo.btin_2 = $('#reward-1-play-btn');
        gameInfo.btin_3 = $('#reward-2-play-btn');
        gameInfo.btin_4 = $('#reward-3-play-btn');
        gameInfo.btin_5 = $('#reward-4-play-btn');
        gameInfo.btin_6 = $('#reward-5-play-btn');
        gameInfo.btin_7 = $('#reward-6-play-btn');
        
        
        gameSceneUI.starts_1 =  $('#list-1');
        gameSceneUI.starts_2 =  $('#list-2');
        gameSceneUI.starts_3 =  $('#list-3');
        gameSceneUI.starts_4 =  $('#list-4');
        gameSceneUI.rewardTitle =  $('#reward-content');
    
    }
    /**
     * 处理主场景的btn事件
     * @param {number} type 
     */
    mainSceneBtnEvent(reward){

        let type = reward.id; 

        if(type === rewardList.reward1.id){
            this.Btn1Event(reward);
        }else if(type === rewardList.reward2.id){
            this.btn2Event(reward);
        }else if(type>=rewardList.reward3.id){
            this.btnRwardEvent(reward);
        } 
        //将数据储存在本地
        this.setlocalData();
    }
    /**
     * 当前的按钮初始化状态
     */
    Btn1EventInit(){
      //玩家当前是不是看视频增加体力
        if(localStorage.whatchVideoNum > gameInfo.whatchVideoTopNum){
            gameInfo.btin_1.addClass('gray');
            gameInfo.btin_1.off();
        }
      
    }
    /**
     *试玩的按钮初始化状态 
     */
    Btn2EventInit(){
        //玩家之前是不是试玩过了 是的话 今天就不可以再试玩了
        if(localStorage.canfreePlay === 0){
            gameInfo.btin_2.addClass('gray');
            gameInfo.btin_2.off();
        }  
    }
    /**
     * 获取更多体力显示的 最对点击8次 超过了就不可以再进行点击了  置灰处理
     */
    Btn1Event(){ 
        if(localStorage.whatchVideoNum<=gameInfo.whatchVideoTopNum){
           
           
            this.watchVideosSDK(3,()=>{
                //将减速道具设置为已经
                localStorage.whatchVideoNum++;
                console.log('玩家唤起视频，增加体力');
            })
        }else{
            console.log('玩家不能唤起视频，增加体力');
        }
        
    }
    /**
     * 按钮2的事件处理 
     * @param {object} reward 
     */
    btn2Event(reward){
        if(localStorage.canfreePlay ===  1){
            this.openGameScene(reward)
            console.log('玩家开始免费试玩')
        }else{
            console.log('玩家不能开始免费试玩')
        }
        //游戏玩完了 就将状态设置为当前不可以再玩游戏了
        localStorage.canfreePlay = 0;
    } 
    /**
     * 选择固定的游戏进行挑战
     * @param {object} rewardList 
     */
    btnRwardEvent(rewardList){

        //体力值大于等于2 可以开始游戏
        if(this.strengthNum>=gameInfo.playCostStrengthNum){
            //打开游戏场景 
            this.openGameScene(rewardList,()=>{
                //减去点体力值作为门票
                this.addstrengthNum(-gameInfo.playCostStrengthNum);
            });
            console.log('可以直接开始游戏,活动的将奖品id是',rewardList)
        }else{ 
            this.watchVideosSDK(2,()=>{
                //将减速道具设置为已经
                 console.log('没有体力使用看视频充体力,看视频开始游戏');
            })
            // //体力值小于2 则打开调取看视频玩游戏的逻辑
            // console.log('不可以直接开始游戏,玩家的体力值不够,活动的将奖品id是',rewardList)
        }

    }

    /**
     *处理体力值 从而对按钮显示不同状态
     * @param {number} num 当前生于的体力数量
     */
    dealWithStrengthNum(num){
        let deal = {
            changeBtn:function(node){
                if(num<=0){
                    this.btn_watchVideos(node); 
                    this.btn_1();
                }else{
                    this.btn_playGamw(node);
                }
            },
            btn_watchVideos:function(node){
                node.removeClass();
                node.addClass('continue_btn_T')
            },
            btn_playGamw:function(node){
                node.removeClass();
                node.addClass('play_btn_T')
            },
            btn_1:function(){
                gameInfo.btin_1.removeClass()
                gameInfo.btin_1.addClass('more-btn-T-1');
            }
        } 
        //对按钮的状态进行处理
        deal.changeBtn(gameInfo.btin_3);
        deal.changeBtn(gameInfo.btin_4);
        deal.changeBtn(gameInfo.btin_5);
        deal.changeBtn(gameInfo.btin_6);
        deal.changeBtn(gameInfo.btin_7); 

        
 

    }
    // --------------------gameScene部分------------
    initGameScene(){
        let self = this;//为了下面能够使用
        let turntableBox = 'turntable-box';
        this.isTopGame = false;//是不是停止游戏
        this.playerIsfail = false;//检测游戏是不是失败了 失败就不在生成刀子了
        this.turntableRotate={//大转盘旋转的角度 为了能让刀子对象时时的取到 于是使用了obj指向内存的属性 可以时时取到最新的角度信息
            num:0             //同时也是初始化 角度
        };
        this.knifeNumArry = [];//当前的数组 放刀子的数据 
        this.knifeConfig = {//预制刀子的配置
            bornAreaID:'game-scene',//生成在什么节点下
            id: self.knifeNumArry.length,//传入生成的id
            parentID:turntableBox, //刀子插入的大转盘的id 
            radiusRatio:0.25,//半径的比值 一半小于0.5是刀子正好插在边上 取值范围(0,0.5]
            knifeList: self.knifeNumArry,//将数组传进去 刀子插入转盘的时候 加入到这个数组中去
            node:{//刀子旋转与定位到了圆里面的信息
                rotate:self.turntableRotate,//当前大转盘的角度
                width:286,//大转盘的宽 这个是大转盘#gs-turntable 里面css设置的宽高的1/2  290 -> 0.215
                height:286,//大转盘的高 290 -> 0.32
            }
        };
        let turntable = document.getElementById(turntableBox); 
        let turntableT = document.getElementById('turntable-box-T'); 
        this.setProperty(this.turntableRotate,'num',this.turntableRotate.num,(vlue)=>{ 
             turntable.style.webkitTransform=`rotate(${vlue}deg)`;  
             turntableT.style.webkitTransform=`rotate(${vlue}deg)`; 
        })
  
        this.updata();
        
    }
    //预制刀子  生成新的数据
    prefabKinfeObj(){  
        //玩家没有失败或者通关 或者玩家没有可是使用的刀子的数量了  
        if(this.isStopGame() || this.haveKnifeNum === 0) return;
        //延时用于检测有没有碰撞 -- 因为预制出来新的刀子后就检测的是新的刀子与转盘上的刀子 就不在检测之前的刀子是不是与转盘上的刀子碰撞
        setTimeout(()=>{    
            if(this.isStopGame() || this.haveKnifeNum === 0) return;
            this.knife = new Knife(this.knifeConfig,this.knifeNumArry.length,()=>{  
                //减去刀子的数量
                this.haveKnifeNum --; 
                //如果没有刀子了说玩家通关成功了
                if(this.haveKnifeNum === 0) {
                    setTimeout(()=>{
                      
                        //延迟300毫秒检测碰撞
                        this.canChangeGameStatus(1); 
                       
                    },300)
                    return
                }  
                //生成信息的刀子
                this.prefabKinfeObj();  
            }); 
          //刀子与相关UI准备完毕 可以发射
          this.canLaunchStatus = true;//刀子可以发射了
        },gameInfo.delayNum); 
    }
    /**
     *清除飞刀与数组所占的内存
     */
    cleanKnifeArry(){ 
        this.knifeNumArry.forEach((element)=>{
            element.isRemove();
         });
         //移除当前的刀子
         if(this.knife){
            this.knife.isRemove()
         }
         this.knife = null;
         this.knifeNumArry = [];
         console.log('数组被清空了',this.knife);
    }
    //刀子数组的碰撞检测
    checkKinfeArry(){
        if( this.knifeNumArry.length <2) return;
        // console.log('this.knifeNumArry.length:',this.knifeNumArry.length);
        this.knifeNumArry.forEach((element)=>{ 
            //检测有无刀子
            if(this.knife === null ||  this.knife === undefined || this.knife === '') return;
                //检测当前是不是对比的本身的刀子
                if(this.knife.id === element.id){
                    return;
                }   
               var knifeInfo = this.knife.objctknifeInfo.offset();
               var elementInfo = element.objctknifeInfo.offset();  
               if(this.checkCrash(knifeInfo,elementInfo) === true){
                    this.canChangeGameStatus(2);
                    console.log('刀子相撞了',this.knife.id,element.id,knifeInfo,elementInfo);   
               } 
        })  
    }
    /**
     * 当前关卡设置的事件
     * @param {number} num 
     */
    dealWithpass(num){
        //显示左上角的关卡数量
        this.showPassStarts(num); 

        //检查关卡数是不是超过了本奖品的最大关卡数 是的话 出现弹窗提示
        if(num > this.chooseRwardInfo.maxPassNum){
            console.log(gameInfo.waring_1);
            return;
        } 
        console.log('当前关卡应该有的数量:',num,this.chooseRwardInfo.passKnifeNumList[num-1])
        //初始化当前的刀子的数量
        this.haveKnifeNum = this.chooseRwardInfo.passKnifeNumList[num-1]; 
        
        //初始化时间
        this.showTimerNum(this.chooseRwardInfo.timeNumList[num-1],()=>{ 
            //倒计时结束 游戏闯关失败
           this.canChangeGameStatus(2);
            console.log('倒计时结束');

        })
    }
    /**
     * 检测当前是不是可以进行更改游戏额状态
     * @param {number} num 
     */
    canChangeGameStatus(num){
        if(this.levenEndStatus===0){
            //当前状态在游戏中
            this.levenEndStatus = num //游戏结束 通关了 所以状态是1
            //通关成功打开大转盘两半的动画
            if(num === 1){
                 //打开大转盘掉落的动画
                 this.turntableDoAni();
            }
        } else{
            console.log('无法更换游戏状态因为 已经是',this.levenEndStatus,'两个状态不能同时存在')
        }    
        return 
    }
    /**
     * 展示星星关卡数  左上角 当前的关卡数是多少
     * @param {number} num 
     */
    showPassStarts(num){ 
       let  dealWite={
           //更新星星的数量
            changeStatsY:function(node){
                node.removeClass();
                node.addClass('passdStart_y')
            },
            changeStatsN:function(node){
                node.removeClass();
                node.addClass('passdStart_n')
            },
       }

       dealWite.changeStatsN(gameSceneUI.starts_1)
       dealWite.changeStatsN(gameSceneUI.starts_2)
       dealWite.changeStatsN(gameSceneUI.starts_3)
       dealWite.changeStatsN(gameSceneUI.starts_4)
       if(num === 1){
            dealWite.changeStatsY(gameSceneUI.starts_1) 
       }else if(num === 2){
            dealWite.changeStatsY(gameSceneUI.starts_1) 
            dealWite.changeStatsY(gameSceneUI.starts_2) 
       }else if(num === 3){
            dealWite.changeStatsY(gameSceneUI.starts_1) 
            dealWite.changeStatsY(gameSceneUI.starts_2) 
            dealWite.changeStatsY(gameSceneUI.starts_3) 
        }else if(num === 4){
            dealWite.changeStatsY(gameSceneUI.starts_1) 
            dealWite.changeStatsY(gameSceneUI.starts_2) 
            dealWite.changeStatsY(gameSceneUI.starts_3) 
            dealWite.changeStatsY(gameSceneUI.starts_4) 
        } 
    }
    
    /**
     * 展示当前的奖品内容
     * @param {string} content 
     */
    showReWardTitle(content){
        gameSceneUI.rewardTitle.text(content);
    }

    /**
     * 当前通关的状态  1=成功  2=失败
     * @param {number} num 
     * @param {object} chooseRwardInfo 奖品的内容chooseRwardInfo 
     * @param {number} passNum 当前是第几关卡 
     */
    customsPassStatus(num,chooseRwardInfo,passNum){
        if(num!==0){
            this.timerOver() 
        }
        let gameType = 0;
        if( num === 1 ){
            gameType = this.getShowPupopTyp(passNum,chooseRwardInfo);
            // console.log('通关成功');
        }else if( num === 2 ){
            gameType = 3
        }
        //传动给弹窗弹窗分析器 
        setTimeout(()=>{
            this.showPupop(gameType,passNum)
        },1000)
        
         
    }
    /**
     * 得到当前应该展示的弹窗的类型
     * @param {number} num 
     * @param {object} chooseRwardInfo  
     */
    getShowPupopTyp(passNum,chooseRwardInfo){
        //0 没有意义   1 试玩成功 2通关成功 3 通关失败 4得到奖品
        let type = 0 ;
        //检测当前是模式  试玩？ 奖品？
        if(chooseRwardInfo.typeOfPlay === rewardList.testPlayType){
            //试玩模式
            if(passNum<chooseRwardInfo.maxPassNum){
                type = 2;
            }else{
                type = 1;
            } 
            console.log('当前是测试：给出来的相关数据',type,'关卡是:',passNum);
        }else if(chooseRwardInfo.typeOfPlay === rewardList.rewardtPlayType){
            // 奖品模式
            if(passNum<chooseRwardInfo.maxPassNum){
                type = 2;
            }else{
                type = 4;
            } 
        }

        return type

    }
    /**
     * 展示相关的弹窗
     * @param {number} num  0 没有意义   1 试玩成功 2通关成功 3 通关失败 4得到奖品
     * @param {number} passNum 当前的关卡数
     */
    showPupop(num,passNum){
        if(num === 1){
            this.showTestGamePupop(true); 
        }else if(num === 2){ 
         
            this.isSuccessPupop(passNum); 
        }else if(num === 3){
            this.isFailPupop(true); 
        }else if(num === 4){
            this.showSuccessGamePupop(true); 
        }

    }

    /**
     *展示当前刀子的数量
     * @param {unmber} num 
     */
    showHaveKniefNum(num){
        let shi_node = $("#knife-num-decade");
        let ge_node = $('#knife-num-bit');
        if(num>=10 && num<100){ 
            shi_node.show();
            shi_node.removeClass().addClass(`num_${parseInt(num/10)}`);
        }else{
            shi_node.hide();
        } 
        ge_node.removeClass().addClass(`num_${num%10}`);
    }
    /**
     * 倒计时的处理
     * @param {number} num 
     */
    showTimerNum(num,BACK=null){
        let timer = $('#game-timer'); 
        //取消倒计时
        this.timerOver();
        //时间初始化
        this.showSurplusTime(timer,num);
        //时间倒计时
        this.gameTimer = setInterval(()=>{ 
            if(this.timerIsStop){
                return;
            }
            num--; 
            this.showSurplusTime(timer,num);
            //倒计时完毕的回调
            if(BACK!=null && num<=0){
                BACK();
            }
            //倒计时结束的取消倒计时
            if(num<=0){
                this.timerOver();
            }
        },1000) 
    }
    /**
     * 结束倒计时倒计时
     */
    timerOver(){
        //取消倒计时
        if(this.gameTimer){
            clearInterval(this.gameTimer);
        } 
    }
   /**
    * 停止倒计时
    * @param {boolean} bool  true 停止倒计时  false继续倒计时
    */
    isStopTimer(bool = false){
        this.timerIsStop = bool;
    }

    /**
     * 时间的补位  
     * @param {number} num 
     */
    patchPosition(num){
        let _num = num.toString();
        if(num<10){
            _num = '0'+_num;
        }
        return _num;
    }
    /**
     *  展示剩余时间
     * @param {node} timerNode 
     * @param {number} num 
     */
    showSurplusTime(timerNode,num){
        //计算剩余时间  时间展示上线是59:69
        let minute = this.patchPosition(parseInt( num/60));
        let second =this.patchPosition(num%60); 
        timerNode.text(minute+':'+second);  
    }
   /**
    * 成功通关了 当前显示的是第几关卡
    * @param {number} num 
    */
    isSuccessPupop(num){   
        let node =  $('#successfulEntry');
        $('#popup-num').removeClass().addClass(`pupop_num_${num+1}`);
        node.css('display','inline')
        setTimeout(()=>{ 
            let _num = num + 1 ;
            this.initPassInfo(_num);
            node.css('display','none') 
        },2000); 
        console.log('玩家通关 这边需要初始化通关的相关信息')
    }
    /**
     * 展示失败的弹窗
     * @param {boolean} bool 
     */
    isFailPupop(bool=false){
        let node = $('#fail-game-pupop');
        if(bool){
            node.css('display','inline')
        }else{
            node.css('display','none')
        }
    }
   /**
    * 试玩通关 弹窗
    * @param {boolean} bool  true=打开弹窗  false关闭弹窗
    */
    showTestGamePupop(bool=false){
        let node = $('#test-game-pupop');
        if(bool){
            node.css('display','inline')
        }else{
            node.css('display','none')
        } 
    } 
    /**
     * 展示玩家通关的页面 
     * @param {boolean} bool 
     */
    showSuccessGamePupop(bool = false){
        let node = $('#success-game-pupop');
        if(bool){
            node.css('display','inline')
        }else{
            node.css('display','none')
        } 
    }
    /**
     * 关闭当前所有的弹窗
     */
    closeAllPupop(){
        $('#test-game-pupop').css('display','none');
        $('#fail-game-pupop').css('display','none');
        $('#successfulEntry').css('display','none');
        $('#success-game-pupop').css('display','none');
    }
    /**
     * 返回当前是不是停止游戏
     */
    isStopGame(){
        let bool = false;
        if(this.levenEndStatus !== 0){
            bool = true
        }
        return bool;
    }
    //大转盘进行上下抖动
    turntableJump(){
        let turntable1 = $('#turntable-box');
        let turntable2 = $('#turntable-box-T');

        console.log('当前的坐标:',turntable1.position(),$('#test').css('top'))
        // let top1={
        //     top: '-0.2rem'
        // }
        // let top2={
        //     top:'0.2rem'
        // }
        // let top3={
        //     top:'0rem'
        // }
        // turntable2.animate(top1,50,()=>{
        //     turntable2.animate(top2,50,()=>{
        //         turntable2.animate(top3,50,()=>{
        //             this.turntableJump();
        //         })
        //     })
        // })

    }
   /**
    * 初始化当前关卡的信息
    * @param {number} num 传入关卡数更新当前相关关卡的数据与准备信息 
    */
    initPassInfo(num){
        //如果当前道具是使用中的  就改为已经使用过了。 因为这个道具只能使用一关 
        if(slowDownPropInfo.useStatus === 0){
            slowDownPropInfo.useStatus = 2;
        }
        //关卡数增加
        localStorage.passNum = num; 
        //清空大转盘
        this.cleanKnifeArry();
        //让大转盘转动起来
        this.levenEndStatus = 0;
        //预制刀子
        this.prefabKinfeObj();
        //显示大转盘 因为之前可能因为掉落的动画 将大转盘给关掉了
        this.showTurntableBox(true);
 
    }
    /**
     * 当前道具的状态 0正在使用中  1可以使用  2已经使用过了 
     * @param {number} num 
     */
    useSpeedProp(num){ 
        if(num === 1){
            //取消道具使用的按钮事件
            $('#speed-reduction').off();
            //绑定按钮事件
            this.speedBtn() 
            $('#speed-reduction').removeClass().addClass('speed-reduction-y');
        }else if(num === 2 || num === 0){//使用过了就去掉按钮的事件
            //取消按钮事件
            $('#speed-reduction').off();
            $('#speed-reduction').removeClass().addClass('speed-reduction-n');
        } 
     
    }
    // useSpeedProp(num){
    //     slowDownPropInfo.useStatus=num;
    //     if(num === 1){
    //         $('#speed-reduction').removeClass().addClass('speed-reduction-y');
    //     }else if(num === 2){//使用过了就去掉按钮的事件
    //         $('#speed-reduction').off();
    //         $('#speed-reduction').removeClass().addClass('speed-reduction-n');
    //     } 
     
    // }
    //帧循环事件
    updata(){ 
        window.requestAnimationFrame(this.updata.bind(this));
        //大转盘左的动画
        if(this.turntableAni_left){
            this.turntableAni_left.Animation();
        }
        //大转盘右边的动画
        if(this.turntableAni_right){
            this.turntableAni_right.Animation();
        }
        //停止游戏
        if(this.isStopGame()){
            return;
        }
        let speedNum = slowDownPropInfo.normalSpeed;
        //旋转转盘 
        //检测当前的道具状态是不是使用中 是使用中的话 转盘减速
        if(slowDownPropInfo.useStatus === 0){ 
            speedNum = speedNum * slowDownPropInfo.speedDowm;
        }
        this.turntableRotate.num += speedNum; 


        //开始碰撞检测
        this.checkKinfeArry();
       
        //如果刀子插入的大转盘的话 就将他放入碰撞队列之中
        if(this.knife) this.knife.move(()=>{
            this.knifeNumArry.push(this.knife);
        })
    }

    //------------------------公共方法-----------------
    /**
     * 看视频的接口
     */
    watchVideosSDK(num,BACKOK=null){
        console.log('观看视频');
        if(BACKOK!=null){
            BACKOK();
        }
    } 
    /**
     * 增加或者减少体力使用的
     * @param {number} num 这个可以正数  可以负数
     */
    addstrengthNum(num){
        let strengthNum = this.strengthNum;
        strengthNum +=num; 
        //检测当前体力值的数量
        if(strengthNum<=0){
            strengthNum = 0;
        }
        this.strengthNum = strengthNum;
    }
    /**
     * 封装使用数据驱动
     * @param {obj} obj 作用域 
     * @param {string} parametern 变量名字
     * @param {number} nun 初始化的数值 
     * @param {function} BACK 每次的改动的回调
     */
    setProperty(obj,parametern,nun,BACK){ 
        //玩家的当前的金币数量
        Object.defineProperty(obj,parametern,{
            get(){
                return nun;
            },
            set(vlue){ 
                nun= vlue;
                if(BACK!=null){
                    BACK(vlue);
                 }
            }
        }) 
    } 
    /**
     * 封装的按钮事件 当前的按钮
     * @param {string} _nodeId ;当前node节点id的名字
     * @param {function} BACK 
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
    //碰撞检测的方法  
    checkCrash(bodyA,bodyB){ 
        bodyA.left -=13;
        // bodyA.top +=110;

        // bodyB.left -=0;
        // bodyB.top +=110;

        // bodyA.width = bodyB.width =15;
        // bodyA.height = bodyB.height = 25;

        bodyA.width = bodyB.width =24;
        return !(bodyA.left + bodyA.width < bodyB.left ||

            bodyB.left + bodyB.width < bodyA.left ||

            bodyA.top + bodyA.height < bodyB.top ||

            bodyB.top + bodyB.height < bodyA.top);
    } 

    /**
     * 设置本地的相关参数  
     * @param {string} key 
     */
    setlocalData(){ 
        console.log('储存本地的数据1');
        //检查浏览器是不是支出本地储存数据
        if (window.localStorage){
            //主逻辑业务
            //取到时间  换算成秒 方便进行处理检查是不是今天
            let lsstTimeInfo_ = new Date();
            localStorage.lastTime = lsstTimeInfo_;
            //建立储存
            let storage = window.localStorage;
            // console.log('storage:',storage);
            let _localStorage = JSON.stringify(localStorage);
            //写入W105SINFO字段
            storage[gameInfo.key] = _localStorage; 
            // console.log('储存本地的数据2',_localStorage);
        }
    }
    /**
     *取到本地的相关参数
     * @param {string} key 
     */
    getlocalData(key){
        // console.log('玩家当前的在提取本地记录'); 
        //提取本地的记录-----------------------
        let storage = window.localStorage;
        let info = storage.getItem(gameInfo.key)
        if (info) {
            let userData_ = JSON.parse(info); 
           //检测是不是进今天
           if(this.isSameDay(userData_.lastTime,new Date())){
                localStorage = userData_;
                console.log('本地的相关数据是:',localStorage);
           }
        //    else{
        //     console.log('本地储存的数据没有取到');
        //    } 
        } 
        // else {
        //     console.log('本地储存的数据没有取到');
        // }
    }
    /**
     * 检测是不是统一
     * @param {*} timeStampA 
     * @param {*} timeStampB 
     */
    isSameDay(timeStampA, timeStampB) {
        let dateA = new Date(timeStampA);
        let dateB = new Date(timeStampB);
        return (dateA.setHours(0, 0, 0, 0) == dateB.setHours(0, 0, 0, 0));
    }

    //**************************跑马灯的需求*********** */
    horseRaceLamp(){  
        let addNUm = -100;
        let fristNum = 0;
        let obj = $('#rewardList-index28-0'); 
        
        let initTop={
            top:'0%',
        };  
        let timerNUM = 500;
        var self = this; 
        self.index28MakeList(1);
        self.index28MakeList(4); 
        obj.animate(initTop,1,function(){ 
            self.index28MakeList(2);
            fristNum += addNUm;
            obj.animate({top:`${fristNum}%`},timerNUM,()=>{
                fristNum += addNUm;
                self.index28MakeList(3);
                setTimeout(()=>{
                    obj.animate({top:`${fristNum}%`},timerNUM,()=>{
                        fristNum += addNUm;
                        setTimeout(()=>{
                            obj.animate({top:`${fristNum}%`},timerNUM,()=>{
                                fristNum += addNUm;  
                                setTimeout(()=>{
                                    obj.animate({top:`${fristNum}%`},1,()=>{ 
                                        self.horseRaceLamp();
                                    });
                                },1000);
                            });
                        },1000);
                    });   
                },1000);
            });
        }); 
    }
    
    //处理文本
    index28NakeDescribe(){
        let text_1 =  '恭喜';
        let getHandNum = Math.ceil(Math.random()*20);
        let text_2 =  gameInfo.phoneHand[getHandNum];
        let listNum = Math.ceil(Math.random()*10000) ;
        if(listNum<1000){
            listNum = 6785;
        }
        let text_3 = '***';
        let getMoneyNum = Math.floor(Math.random()*5) ;
        getMoneyNum = gameInfo.redMoney[getMoneyNum];
        let redNumText = '获得'+getMoneyNum+'元红包';
        return {
            context1:text_1+text_2.toString()+text_3+listNum.toString(),
            context2: redNumText,
        };
    } 
    /**
     * 当前是第一个 从而更新相关的信息
     * @param {*} num ;
     */
    index28MakeList(num){
        let context = this.index28NakeDescribe();
        let obj = $(`#rewardList-index28-${num}`);
        let content1 = obj.find('#index-context-1');
        let content2 = obj.find('#index-context-2');
        if(num=== 1 ){
    
            content1.text(context.context1);
            content2.text(context.context2);
        }else if(num=== 2){
            content1.text(context.context1);
            content2.text(context.context2);
        }else if(num=== 2){
            content1.text(context.context1);
            content2.text(context.context2);
        }else{
            content1.text(context.context1);
            content2.text(context.context2);
        }

    }
    /**
     * 大转盘的掉落
     */
    turntableFallDown(){ 
        // //左边的
        this.turntableAni_left = new  TurntableAni(100,120,'left-turntable');
        this.turntableAni_left.setLeftMove();
        // // //有右边的
        this.turntableAni_right = new TurntableAni(100,120,'right-turntable');
        this.turntableAni_right.setRightMove();

        this.showTurntableDoAniPage(false);
    }
    /**
     * 打开掉落的动画
     */
    turntableDoAni(BACK=null){
        //打开动画状态
        this.turntableAni_left.beginAni();
        this.turntableAni_right.beginAni();

        //将当前的大专篇关闭掉 动画结束再打开
        this.showTurntableBox(false);
        //设置动画的回调
        this.turntableAni_right.  AnimationOver(()=>{
            console.log('动画结束了')
            this.showTurntableDoAniPage(false);
            // this.showTurntableBox(true);
            if(BACK){
                BACK();
            }
          
        })
        //打开动画页面
        this.showTurntableDoAniPage(true);
    } 
    /**
     * 打开还关闭动画页面
     * @param {boolean} bool 
     */
    showTurntableDoAniPage(bool = false){
        if(bool){
            $('#pass-over-ani').css('display','inline'); 
        }else{
            $('#pass-over-ani').css('display','none');
        }
    }
    /** */
    showTurntableBox(bool = false){
        let node1 = $('#turntable-box');
        let node2 = $('#turntable-box-T');
        if(bool){
            console.log('打开:',bool);
            node1.css('display','inline');
            node2.css('display','inline');
        }else{
            node1.css('display','none');
            node2.css('display','none');
        }
    }

    
}
new fruitMachine();