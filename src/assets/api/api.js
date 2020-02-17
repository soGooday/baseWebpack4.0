import {setHttp} from './apiSet'

 //当前的相关的数据
export function getUserInfo(parameter,OKBACK,ERRBACK){ 
    setHttp('fruits/user','GET',parameter,OKBACK,ERRBACK) ;
}
//上传玩家开始游戏通知
export function getGameBeginInfo(parameter,OKBACK,ERRBACK){ 
    setHttp('fruits/game/begin','POST',parameter,OKBACK,ERRBACK) ;
}
//上传玩家游戏的结果
export function sendGameResultInfo(parameter,OKBACK,ERRBACK){ 
    setHttp('fruits/game/result','POST',parameter,OKBACK,ERRBACK) ;
}
//奖品信息的列表
export function getGameRewardInfo(parameter,OKBACK,ERRBACK){ 
    setHttp('fruits/game/reward','GET',parameter,OKBACK,ERRBACK) ;
}
//看视频增加的金币的数量
export function getGameMoneyInfo(parameter,OKBACK,ERRBACK){
    setHttp('fruits/user/gold','POST',parameter,OKBACK,ERRBACK) ;
}
//查询兑换游戏币的相关数据 参数
export function getExchangeRateInfo(parameter,OKBACK,ERRBACK){ 
    setHttp('cm/getExchangeRate','GET',parameter,OKBACK,ERRBACK) ;
}
//使用积分对换游戏币的数量
export function getExchangeBeanInfo(parameter,OKBACK,ERRBACK){ 
    setHttp('cm/exchangeBean','POST',parameter,OKBACK,ERRBACK) ;
}
//请求
export function getmainHallUserInfo(parameter,OKBACK,ERRBACK){ 
    setHttp('/user','GET',parameter,OKBACK,ERRBACK) ;
}
