
const onSearch = (e,setList, datas, keys ) => {
    e.preventDefault();
    let str = e.target.value;
    let dd = datas.filter((data) => {
      //console.log(verify(str, keys, data))
      return verify(str, keys, data) && data
    });

    console.log(dd)
    dd !== [] ? setList(dd) : setList(datas);
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


export {
    onSearch
}