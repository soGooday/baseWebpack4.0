import {setHttp} from './apiSet'

 
export function getUserInfo(parameter,OKBACK,ERRBACK){ 
    setHttp('/fruits/user','GET',parameter,OKBACK,ERRBACK) ;
}