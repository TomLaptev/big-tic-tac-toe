
 interface IStore {
    language: string,
    sound: string,
    
}

const store: IStore = {
    language: localStorage.lang ? localStorage.lang : 'ru', 
    sound: localStorage.getItem('sound'),
     
}


export default store;

