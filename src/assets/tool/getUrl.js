var getUrlInfo = {
    uid: null,
    qtjuid: null,
    code: null,
    mediaUid: null,//趣淘金的qtjuid
    openid: null,
    parameterInfo: location.href.split('?')[1],
    url: null,
    GetRequestKey(key) {



        if (key === 'mediaUid' && this.mediaUid != null) {
            return this.mediaUid;
        }
        if (key === 'qtjuid' && this.qtjuid != null) {
            return this.qtjuid;
        }
        if (key === 'uid' && this.uid != null) {
            return this.uid;
        }
        if (key === 'code' && this.code != null) {
            return this.code;
        }
        if (key === 'openid' && this.openid != null) {
            return this.openid;
        }
        if (key === 'url' && this.openid != null) {
            return this.url;
        }


        var url = location.href;
        // console.log('url:', location.href);
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.split('?')[1];
            str = str.split('#')[0];
            var strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);

            }
        }
        // console.log('取到的相关参数：', theRequest, '请求的是 key:', key)
        var value = theRequest[key]
        this.uid = theRequest['uid']
        this.qtjuid = theRequest['qtjuid']
        this.code = theRequest['code']
        this.openid = theRequest['openid']
        this.mediaUid = theRequest['mediaUid']
        this.url = url
        console.log('版本:1:需要的参数', theRequest);

        if (value === -1) {
            return undefined
        }
        return value;
    }
}
export default getUrlInfo
