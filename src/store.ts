
 interface IStore {
    language: string,
    isSoundEnable: string,
    
}

const store: IStore = {
    language: localStorage.lang ? localStorage.lang : 'ru', 
    isSoundEnable: localStorage.getItem('isSoundEnable'),
     
}

export default store;

