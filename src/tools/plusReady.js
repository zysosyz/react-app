let plusReady = (Callback) => {
  if (window.plus) {
    Callback();
  } else {
    document.addEventListener("plusready", Callback);
  }
};
export default plusReady;