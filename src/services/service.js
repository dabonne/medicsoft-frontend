
const onSearch = (e,setList, datas, keys ) => {
    e.preventDefault();
    let str = e.target.value;
    let dd = datas.filter((data) => {
      return verify(str, keys, data)
    });

    dd !== [] ? setList(dd) : setList(datas);
  };

  const verify = (str, keys, data) =>{
    let isTrue = false

    keys.map(key => isTrue = isTrue || data[key].toLowerCase().includes(str.toLowerCase()))
    return 
  }


export {
    onSearch
}