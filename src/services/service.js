
const onSearch = (e,setList, datas, keys ) => {
    e.preventDefault();
    let str = e.target.value;
    let dd = datas.filter((data) => {
      //console.log(verify(str, keys, data))
      return verify(str, keys, data) && data
    });

    console.log(dd)
    dd.length !== 0 ? setList(dd) : setList(datas);
  };

  const verify = (str, keys, data) =>{
    let isTrue = false

    keys.forEach(key => {
      if(data[key]?.toLowerCase().includes(str.toLowerCase())){
        isTrue = isTrue || true
      }
      
    })
    return  isTrue
  }

  const matrice = (datas) =>{
    let i = 0
    let counter = 0
    let length = 1
    let list = []
    let tab = []

    datas.forEach((data) =>{
      if(i === 9 || length === datas.length){
        list = [...list,[...tab, data]]
        tab = []
        counter = counter + 1
        i = 0
      }else{
        tab = [...tab, data]
        i = i + 1
      }
      
      length = length + 1
    })

    return {
      list:list,
      counter:counter
    }
  }


export {
    onSearch,
    matrice
}