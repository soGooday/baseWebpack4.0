export default class WaringPop{
    /**
     * 传入的是玩家设置的警告页面的相关设置
     * @param {objact} config ;
     */
    constructor(config=null){ 
        var self = this;
        this.pageInfo = {
            pageID : 'waring-pop',//页面的名字
            pageContextID : `waring-pop-context`,//内容框的id
            parent : 'bg',//放在什么node的id下面
          
        };
        this.fontSize = self.getFontSize(),//计算出fontSize的值 用于
        this.waringPageNode = null;//当前的页面
        this.waringTextnode = null;//当前的警告弹窗内容
        if(config!=null){
            this.pageInfo = config;
        }
        this.addWaringPopDOM(this.pageInfo);
    }
    //waing-pop-page
    addWaringPopDOM(pageInfo){ 
        var wringDOM = `
        <div id=${pageInfo.pageID}> 
            <div id=${pageInfo.pageContextID}>网络不通畅，请重新尝试</div>
        </div> 
        ` 
        $(`#${pageInfo.parentNodeID}`).append(wringDOM);//当前的添加警告的元素 
       
        this.waringPageNode =  $(`#${pageInfo.pageID}`);//取到页面
        this.waringTextnode =  $(`#${pageInfo.pageContextID}`);//取到内容显示
        this.isShowWaringPage(false);//关闭警告页面
        
        //添加css的内容
        // var pageCss ={
        //     "position": "absolute",
        //     "top": "0",
        //     "left": "0", 
        //     "bottom": "0",
        //     "right": "0",
        //     "width" : `${this.getRem(750)}`,
        //     "height" : `${this.getRem(1134)}`, 
        // }  
        // var contextCss={
        //     "margin-right": `${this.getRem(760)}`,
        //     "margin-top": `${this.getRem(400)}`,
        //     "padding": ` ${this.getRem(5)} ${this.getRem(10)}  ${this.getRem(8)} ${this.getRem(10)}`,
        //     "border-radius":`${this.getRem(10)}`,
        //     "display":"inline-block", 
        //     "font-size": `${this.getRem(30)}`,
        //     "min-width": `${this.getRem(200)}`,
        //     "text-align": `center`,
        //     "color": `white`, 
        //     "background-color": `rgba(0,0,0,0.68)`,
        // } 
        // $(`#${pageInfo.pageID}`).css(pageCss) 
        // $(`#${pageInfo.pageContextID}`).css(contextCss) 
    }
    /**
     * 得到rem
     * @param {number} num ;//传入的是以px为单位的
     */
    getRem(num){  
        console.log('this.pageInfo.fontSiz:',this.fontSize);
        return num/this.fontSize+'rem'
    }
    /**
     * 出现警告弹窗
     * @param {*} context ;
     */
    showWaringConText(context){
        this.initWaringConText(context);
        this.isShowWaringPage(true);

        setTimeout(()=>{
            this.isShowWaringPage(false);
        },1500);
    
    }
    /**
     * 显示还是关闭页面
     * @param {boolean} bool ;
     */
    isShowWaringPage(bool){ 
        if(this.waringPageNode === null || this.waringPageNode  === undefined || this.waringPageNode === '' ){
            this.waringPageNode =  $(`#${pageInfo.pageID}`);//取到页面
        }  
        if(bool === true){
            this.waringPageNode.show();//关闭当前的警告页面
        }else{
            this.waringPageNode.hide();//关闭当前的警告页面
        } 
    }
    /**
     * 设置警告显示的内容
     * @param {string} context  警告需要显示的内容
     */
    initWaringConText(context){
       
        if(this.waringTextnode === null || this.waringTextnode  === undefined || this.waringTextnode === '' ){
            this.waringTextnode =  $(`#${pageInfo.pageContextID}`);//取到页面
        }
        this.waringTextnode.text(context);  
    }
    //取到fontSize
    getFontSize(){
        var docEl = document.documentElement;
            var clientWidth = docEl.clientWidth || 375;
            clientWidth > 750 ? clientWidth = 750 : clientWidth = clientWidth; 
            if (clientWidth){
                const fz = docEl.style.fontSize = 20 * (clientWidth / 375);
                docEl.style.fontSize = 20 * (clientWidth / 375) + 'px';
                window.remscale = clientWidth / 375;
                console.log(2);
                var realfz = ~~(+window.getComputedStyle(document.getElementsByTagName("html")[0]).fontSize.replace('px','')*10000)/10000
                console.log('fz:',fz,'realfz:',realfz);
                if (fz !== realfz) {
                    console.log(4);
                    return fz * (fz / realfz) *2 ;
                }else{
                    return fz *2 ;
                }
            }
      
        
    }

}



// #waing-pop-page{
//     // display: none;
//     position: absolute;
//     top: 0;
//     left: 0; 
//     bottom: 0;
//     right: 0;
//     @include aWHU(750,1334);
//     justify-content : center; 
//     #waring-context{ 
//         margin-top: ax(400);
//         padding: 0 ax(10) 0 ax(10);
//         border-radius:ax(10);
//         display:inline-block;
//         line-height: ax(70);
//         font-size: ax(30);
//         min-width: ax(200);
//         text-align: center;
//         color: white;
//         background-color: rgba(0,0,0,0.44) 
//     } 
// }