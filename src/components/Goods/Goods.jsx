import React from "react";
import http from "../../tools/axios";
import { useState, useEffect } from "react";
import "./Goods.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFire, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Lazyimg from "react-lazyimg-component";
import { Loading } from "react-vant";
import plusReady from "../../tools/plusReady";
export default function () {
  const navigate = useNavigate();
  const [goods, setGoods] = useState([]);
  useEffect(() => {
    http("/product/leaderboard").then(({ data }) => {
      setGoods(data.data.splice(0, 3));
    });
    plusReady(() => {
      plus.navigator.setStatusBarBackground("#f1f1f1");
    });
  }, []);

  return (
    <>
      <div className="goodslist">
        <div className="title">
          <FontAwesomeIcon
            icon={faFire}
            beat
            style={{ color: "red", marginRight: "5px" }}
          />
          商品排行榜
          <span className="more">
            更多
            <FontAwesomeIcon icon={faAngleUp} rotation={90} />
          </span>
        </div>
        {goods.length > 0 &&
          goods.map((item) => (
            <div
              className="goods_item"
              key={item.id}
              onClick={() => {
                navigate(`/info/${item.id}`);
              }}
            >
              <div className="item_img">
                <Lazyimg
                  src={item.image}
                  //   style={{ height: "100px", lineHeight: "100px" }}
                  placeholder={
                    <Loading
                      style={{ height: "100%" }}
                      size={35}
                      type="spinner"
                    />
                  }
                ></Lazyimg>
                {/* <img src={item.image} /> */}
              </div>
              <div className="item_infor">
                <p className="storeName">{item.storeName}</p>
                <div>
                  <span className="price">{item.price}</span>
                  <span className="sale">销量{item.sales}件</span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
