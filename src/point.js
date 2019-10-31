//埋点
class countinfoPoint{
    /**
     * 传入是测试服 还是正式服的发送的埋点的链接
     * @param _urlPoint
     */
    constructor(_urlPoint){
        this.urlPoint = _urlPoint == true ? 'https://adscount.fawulu.com/award/countInf0' : 'http://47.98.242.33:15018/award/countInf0';//链接地址;
    }

    /**
     * 发送相关的埋点  3首页，4参与
     * @param activeTyoe
     */
    setPonitType(activeTyoe){
        this.countinfoPoint(activeTyoe);
        this.senIamgInfoPoint(activeTyoe ===3 ? 3001 : 4001)
    }
    /**
     * 发送相关的埋点  3 或者是 4
     * @param activeTyoe 3首页，4参与
     */
    countinfoPoint(activeTyoe){
        var obj={
            appkey:this.appkey || this.GetRequestKey('appkey'),
            uid: this.uid || this.GetRequestKey('uid'),
            business: this.business || this.GetRequestKey('business'),
            activityid:this.activityid ||　this.GetRequestKey('activityid'),
            ua:this.getEv(),
            appos:this.isIOS(),
            modeltype:activeTyoe,//3首页，4参与
            modelname:activeTyoe === 3 ? '首页':'参与',//3首页，4参与
            random3:this.getWH(),//屏幕宽,屏幕高

        }
        // console.log('发送的相关的参数',obj)
        var formData = new FormData();
        formData.append("appkey", obj.appkey);
        formData.append("uid", obj.uid);
        formData.append("business", obj.business);
        formData.append("activityid", obj.activityid);
        formData.append("ua", obj.ua);
        formData.append("appos", obj.appos);
        formData.append("modeltype", obj.modeltype);
        formData.append("modelname", obj.modelname);
        formData.append("random3", obj.random3);

        var request = new XMLHttpRequest();
        request.open("POST", this.urlPoint );
        request.send(formData);


    }

    /**
     * 图片发送的相关埋点
     * @param activeTyoe （首页：3001  参与： 4001）
     */
    senIamgInfoPoint(activeTyoe){
        var params={
            t:Math.random(),
            p: 'ads', //（写死ads）
            locaurl:encodeURIComponent(location.href),
            referrer:encodeURIComponent(document.referrer)||'',
            sh:window.screen.height,//(屏幕高)
            sw:window.screen.width,//(屏幕宽)
            cd: window.screen.colorDepth || 0,
            lang:navigator.language || '',
            activityid:this.activityid || this.GetRequestKey('activityid'),
            mt:activeTyoe,//（首页：3001  参与： 4001）
            startTime:new Date().getTime(),
            jsV: 20191018
        }
        // console.log('当前图片发送的相关的参数：',params);

        const img = new Image(1, 1);
        const path = 'https://log.cudaojia.com:10090/dot/s.gif';
        let paramsStr = '';
        for (const key in params) {
            paramsStr += `${paramsStr.indexOf('?') >= 0 ? '&' : '?'}${key}=${encodeURI(params[key])}`;
        }
        img.src = `${path}${paramsStr}`;
    }


    /**
     * 发送链接
     * @param url
     * @param type
     * @param obj
     * @param BACK
     * @param ERROR
     */
    setHttpCountinfo(url,type,obj = null,BACK,ERROR){
        var _openID = this.openID || this.GetRequestKey('openid');//设置openID
        $.ajax({
            url: url,
            type: type,
            data: JSON.stringify(obj),
            dataType: 'json',
            crossDomain: true, //强制使用5+跨域
            contentType: 'application/x-www-form-urlencoded',
            success: function (res) {
                console.log('res:',res);
                if(BACK!=null){
                    BACK(res);
                }
            },
            error:function (xhr,text) {

                if(xhr.status == 200){
                    if(BACK!=null){
                        BACK(text);
                    }
                }else {
                    // console.log('text:',text,'xhr:',xhr);
                    if(ERROR!=null){
                        ERROR(text,xhr);
                    }
                }
            }
        });
    }

    //取到链接上的参数
    GetRequestKey(key){
        this.theRequestGet = new Object();
        var url = location.search;
        if (url.indexOf("?") != -1)
        {
            var str = url.split("?")[1];
            // var str = url.substr(1);
            var strs = str.split("&");
            for (var i = 0; i < strs.length; i++)
            {
                this.theRequestGet[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
            }
        }
        var value = this.theRequestGet[key];
        this.appkey =  this.theRequestGet['appkey'];
        this.uid = this.theRequestGet['uid'];
        this.business = this.theRequestGet['business'];
        this.activityid = this.theRequestGet['activityid'];


        return value;
    }

    /**
     * 检测当前是不是微信 支付宝 或其他环境 1->微信，2->支付宝, 0->其他
     * @returns {*}
     */
    getEv(){
        //防止重复检测 浪费性能
        if(this.getEvType!=null &&　this.getEvType!=undefined && this.getEvType!=''){
            return this.getEvType;
        }
        var typeNum = 0;
        var browser = navigator.userAgent.toLowerCase();
        if(browser.match(/Alipay/i)=="alipay"){
            console.log("支付宝app的浏览器");
            typeNum = 2;

        }else if(browser.match(/MicroMessenger/i)=="micromessenger"){
            console.log("微信app的浏览器");
            typeNum = 1;

        }
        this.getEvType = typeNum;
        return typeNum;
    }

    /**
     * 检测当前是不是ios 1->非ios，2->ios
     * @returns {number|*}
     */
    isIOS(){
        //防止重复检测 浪费性能
        if(this.isIos != '' && this.isIos != null && this.isIos !=undefined){
            return this.isIos;
        }
        var u = navigator.userAgent;
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        this.isIos = isiOS === true ? 2:1
        return this.isIos;
    }

    /**
     * 获取当前的宽高
     * @returns {string}
     */
    getWH(){
        if(this.isWH === '' ||  this.isWH === null || this.isWH === undefined){
            this.isWH = `${window.screen.width},${window.screen.height}`
        }

        return this.isWH;

    }

}




//-------------------埋点的链接--------------------
