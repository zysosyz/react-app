import React, { useState, useEffect } from "react";
import Swip from "../components/Swiper/Swiper";
import Grid from "../components/Gird/Grid";
import Goods from "../components/Goods/Goods";
import "./home.css";
import Search from "../components/Search/Search";
import Itemlist from "../components/ItemList/ItemList";
import Gooditem from "../components/Gooditem/Gooditrm";
import http from "../tools/axios";
import plusReady from "../tools/plusReady";
function Home() {
  const [index, setIndex] = useState(0);
  const [swiperhData, setSwiper] = useState([]);
  const [gridData, setGrid] = useState([]);
  const [goodsitem, setGoodsitem] = useState([]);
  useEffect(() => {
    http("/index").then(({ data }) => {
      setSwiper(data.data.banner);
      setGrid(data.data.menus);
      setGoodsitem(data.data.explosiveMoney);
    });
    plusReady(() => {
      plus.navigator.setStatusBarBackground("#e93323");
    });
  }, []);
  function sendIndex(index) {
    setIndex(index);
  }
  return (
    <div className="home">
      <Search />
      <Swip data={swiperhData} />
      <Grid data={gridData} />
      <Goods />
      <Gooditem data={goodsitem} sendIndex={sendIndex} />
      <Itemlist index={index} />
    </div>
  );
}

export default Home;
