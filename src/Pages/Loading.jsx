import React from "react";

const Loading = ({ type }) => {
  return (
    <div className="loading">
      {type === "text" ? <h1>Loading...</h1> : <div></div>}
    </div>
  );
};

export default Loading;
