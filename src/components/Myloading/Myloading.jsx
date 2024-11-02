import React from "react";
import { Loading } from "react-vant";
import "./loading.css";

export default () => {
  return (
    <div className="loading">
      <Loading type="ball" />
    </div>
  );
};
