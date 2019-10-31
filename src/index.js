require('./index.scss'); 
import $ from '../node_modules/zepto-webpack/zepto.js'
import {getUserInfo} from './assets/api/api.js'
import './point.js'

class fruitMachine{
    constructor(){
        this.init();
        this.playerMoney = 0;
    }
    init(){ 
        this.getUserInfo();
    }
    bin(){

    }
    /**
     * 得到玩家的水果币
     */
    getUserInfo(){
        getUserInfo(null,res=>{
            this.playerMoney = res; 
       },err=>{
            console.log('err:',err);
       });
    }
}
new fruitMachine();