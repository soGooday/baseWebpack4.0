

//使用ajax 引用zepto
import $ from '../../../node_modules/zepto-webpack/zepto.js'
import URLiNFO from '../../config/index.js'
// //设置当前的url
const baseURL = process.env.NODE_ENV === 'development' ? URLiNFO.TEST_URL : URLiNFO.PROD_URL;//链接地址;
// //设置openID
const openID = GetRequestKey(URLiNFO.HEAD_KEY);

export function setHttp(url,type,obj = null,BACK,ERROR){
    var _openID = openID || GetRequestKey(URLiNFO.HEAD_KEY);//设置openID
    $.ajax({
        url: baseURL+url,
        type: type,
        data: type === 'GET' ? obj : JSON.stringify(obj),//GET 与POST
        dataType: 'json',
        crossDomain: true, //强制使用5+跨域
        contentType: 'application/json',
        beforeSend: function(request) {
            request.setRequestHeader('X-AA-BXMID',_openID );
            // request.setRequestHeader('X-AA-BXMID','bxm' );
        },
        success: function (res) {
            // console.log('res:',res);
            if(BACK!=null){
                BACK(res);
            }
        },
        error:function (xhr,text) {
            // console.log('text:',text,'xhr:',xhr);
            if(xhr.status == 200){
                if(BACK!=null){
                    BACK(text);
                }
            }else {
                if(ERROR!=null){
                    ERROR(xhr);
                }
            }
        }
    });
}
 
 
function GetRequestKey(key){
    var url = location.href;
    var theRequest = new Object();
    if (url.indexOf("?") != -1)
    {
        var str = url.split("?")[1]; 
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++)
        {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    var value = theRequest[key];
    return value;
}