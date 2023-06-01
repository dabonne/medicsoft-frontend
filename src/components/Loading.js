const Loading = ({ children, data = [], stopLoad = false }) => {
  return (
    <>
      {data.length !== 0 ? (
        children
      ) : (
        <div className="d-flex justify-content-center">
          {!stopLoad ? (
            <div className="loadingio-spinner-spinner-g7josdrmxi">
              <div className="ldio-s71ku63tgz">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          ) : (
            <p className="fw-bold">Pas de donnée disponible</p>
          )}
        </div>
      )}
    </>
  );
};

export default Loading;
