import React, { useEffect, useState } from "react";


const InfoPatient = () => {
  const [datas, setDatas] = useState([]);

  useEffect(() => {
    setDatas([...Array(20).keys()]);
  }, []);

  return (
    <>
      <div className="row">
        <h1 className="h2">Jannie DOE</h1>
      </div>
      <div className="row my-4">
        
      </div>

      
    </>
  );
};

export default InfoPatient;
