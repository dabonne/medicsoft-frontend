const Loading = ({ children, data = [] }) => {
  return (
    <>
      {data.length !== 0 ? (
        children
      ) : (
        <div className="d-flex justify-content-center">
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
        </div>
      )}
    </>
  );
};

export default Loading;
