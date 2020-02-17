export default class LoadingPage{
    constructor(config=null){
        this.config={
            parentID : 'bg',//放在什么node的id下面
        }
        if(config!=null){
            this.config = config;
        }
        this.addDocment(this.config);
    }
    addDocment(config){
        var loadingDCM=`
        <div id="loading-page">
            <div id="loading-bg">
                <div id="loading-animtion"></div>
            </div>
        </div>`
        $(`#${config.parentID}`).append(loadingDCM);//当前的添加警告的元素 
    }
    show(){
        $('#loading-page').show();
    }
    hide(){
        $('#loading-page').hide();
    }
}

// #loading-page{
//     position: absolute;
//     top: 0;
//     left: 0; 
//     bottom: 0;
//     right: 0;
//     @include aWHU(750,1334); 
//     #loading-bg{
//         overflow: hidden;
//         @include aWHU(250,250); 
//         background-color: rgba(0, 0, 0, 0.37);
//         border-radius: 25px;
//         margin: ax(350) 0 0 ax(250);
//         #loading-animtion{
//             margin: ax(100) 0 0 ax(100); 
//             @include aWHU(48,48);  
//             @include setBg('./assets/images/laodingL.png'); 
//             animation: loading-ani 3s linear infinite;
//         }
//     }
//     @keyframes loading-ani {
//         0%{
//             transform: rotate(0deg);
//         }
//         100%{
//             transform: rotate(360deg);
//         }
//     }
// }