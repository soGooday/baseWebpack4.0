export default class watchVideosSDK{
    constructor(){
        console.log('SDK初始化成功！')
        this.VIDEOBACK = null;//玩家的返回回调
        this.ERRBACK = null;//玩家错误的回调
        this.initVideoBack();
    }

    /**
     *  判断本地视频是否加载成功
     * @param {function} BACK ; //成功的回调
     * @param {function} ERRBACK  //失败的回调
     */
    haveVideo(BACK,ERRBACK) { 
        this.VIDEOBACK = BACK;
        this.ERRBACK = ERRBACK;
        console.log('拉取bxmSdk://haveVideo前')
        location.href = 'bxmSdk://haveVideo'
        console.log('拉取bxmSdk://haveVideo完毕')
    }
    // 展示视频
    showVideo() {
        console.log('拉取bxmSdk://showVideo前')
        location.href = 'bxmSdk://showVideo'
        console.log('拉取bxmSdk://showVideo完毕')
    }
    initVideoBack() {
        console.log('initVideoBack----1')
        window.bxmEntranceVisible = result => { 
            console.log('initVideoBack----2')
            if (result) {
                console.log('initVideoBack----3')
                this.showVideo() //确定拥有这个视频 然后再展示视频
                this.uesVideoBack() //设置回调
            } else {
                console.log('initVideoBack----4')
                if(this.ERRBACK!=null){
                    this.ERRBACK();
                } 
            }
            console.log('initVideoBack----5')
        }
        console.log('initVideoBack----6')
    }
    uesVideoBack() {
        window.bxmVideoComplete = () => { 
            if(this.VIDEOBACK!=null){
                this.VIDEOBACK();
            }  
            console.log('我收到了视频结束的回调')
        }
    }


}
 