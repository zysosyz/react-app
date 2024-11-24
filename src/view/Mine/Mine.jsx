import React, { useEffect, useRef, useState } from "react";
import { Cell, Image, Loading, Swiper, Badge } from "react-vant";
import {
  Arrow,
  PendingPayment,
  Logistics,
  SendGift,
  Comment,
  Edit,
} from "@react-vant/icons";
import "./mine.css";
import http from "../../tools/axios";
import { useNavigate } from "react-router-dom";
import Lazyimg from "react-lazyimg-component";
import plusReady from "../../tools/plusReady";
function Mine() {
  const ref = useRef();
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [serverList, setServer] = useState([]);
  const [msg, setMsg] = useState(null);
  const [payMsg, setPayMsg] = useState("");
  const [files, setFiles] = useState(null);
  const Msg = [
    {
      name: "待付款",
      icon: <PendingPayment color="red" />,
      bdg: payMsg?.unPaidCount,
    },
    {
      name: "待发货",
      icon: <Logistics color="red" />,
      bdg: payMsg?.unShippedCount,
    },
    {
      name: "待收货",
      icon: <SendGift color="red" />,
      bdg: payMsg?.receivedCount,
    },
    {
      name: "待评价",
      icon: <Comment color="red" />,
      bdg: payMsg?.evaluatedCount,
    },
  ];
  useEffect(() => {
    http("/menu/user").then(({ data }) => {
      if (!data) {
        return;
      }
      // console.log(data);
      setList(data.data?.routine_my_banner);
      setServer(data.data?.routine_my_menus);
    });
    http("/user").then(({ data }) => {
      if (!data) {
        return;
      }
      // console.log(data.data);
      setMsg(data.data);
    });
    http("/order/data").then((res) => {
      //   console.log(res.data.data);
      setPayMsg(res.data.data);
    });

    plusReady(() => {
      plus.navigator.setStatusBarBackground("#e93323");
    });
  }, []);
  useEffect(() => {
    if (files) {
      const formData = new FormData();
      formData.append("multipart", files);
      http(
        "/upload/image?model=maintain&pid=0",
        "post",
        formData,
        "multipart/form-data"
      ).then(async (res) => {
        console.log(res);
        if (res.data.code === 500) {
          Toast.fail("上传头像失败");
        } else {
          const data = {
            avatar: res.data.data.url,
            nickname: msg.nickname,
            phone: msg.phone,
          };
          await http("/user/edit", "post", data);
          msg.avatar = res.data.data.url;
          setMsg({ ...msg });
        }
      });
    }
  }, [files]);
  // console.log(payMsg);
  return (
    <>
      <div className="person-info">
        <div className="head">
          <div className="head-top">
            {msg && (
              <Cell
                center
                // key={idx}
                title={msg.nickname}
                label={
                  <div>
                    <span>{msg.phone}</span>
                    <span style={{ marginLeft: "5px" }}>
                      {<Edit fontSize={16} style={{ verticalAlign: "top" }} />}
                    </span>
                  </div>
                }
                icon={
                  <>
                    <div className="head-img">
                      <Image
                        fit="cover"
                        lazyload={true}
                        loadingIcon={<Loading type="spinner" />}
                        // width={60}
                        // height={60}
                        src={msg.avatar}
                        round
                        onClick={() => {
                          ref.current.click();
                        }}
                      />
                    </div>
                    <input
                      ref={ref}
                      type="file"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        console.log(e.target.files[0]);
                        setFiles(e.target.files[0]);
                      }}
                    ></input>
                  </>
                }
              />
            )}
          </div>
          <div className="num-wrapper">
            {msg && (
              <>
                <div>
                  0.00
                  <p>余额</p>
                </div>
                <div>
                  0<p>积分</p>
                </div>
                <div>
                  {msg.couponCount}
                  <p>优惠券</p>
                </div>
                <div
                  onClick={() => {
                    navigate("/user/collect");
                  }}
                >
                  {msg.collectCount}
                  <p>收藏</p>
                </div>
              </>
            )}
          </div>
          <div className="order-wrapper">
            <div className="center">
              <span
                className="center-title"
                style={{
                  // fontSize: "15px",
                  color: "#282828",
                  fontWeight: "bolder",
                }}
              >
                订单中心
              </span>
              <span
                className="center-more"
                style={{ color: "#666" }}
                onClick={() => {
                  navigate("/user/orderlist");
                }}
              >
                查看全部
                <Arrow />
              </span>
            </div>
            <div className="order-bd">
              {Msg.map((item, index) => (
                <div
                  className="bd-item"
                  key={index}
                  onClick={() => {
                    navigate("/user/orderlist", {
                      state: {
                        index,
                      },
                    });
                  }}
                >
                  <Badge showZero={false} content={item.bdg}>
                    {item.icon}
                  </Badge>
                  <p>{item.name}</p>
                </div>
              ))}
              <div className="bd-item">
                <Badge showZero={false} content={payMsg?.unPaidCount}>
                  <SendGift color="red" />
                </Badge>
                <p>售后/退款</p>
              </div>
            </div>
          </div>
        </div>
        <div className="contenBox">
          <div className="slider-wrapper">
            {list?.length > 0 && (
              <Swiper autoplay={3000}>
                {list.map((item, index) => (
                  <Swiper.Item key={item.id}>
                    <div className="pic">
                      <Image
                        lazyload={true}
                        loadingIcon={<Loading type="spinner" />}
                        src={item.pic}
                      ></Image>
                      {/* <img src={item.pic} ></img> */}
                    </div>
                  </Swiper.Item>
                ))}
              </Swiper>
            )}
          </div>
          <div className="server">
            <div className="myServer">我的服务</div>
            <div className="list-box">
              {serverList?.map((item, index) => (
                <div
                  className="server-item"
                  key={item.id}
                  onClick={() => {
                    if (item.name === "地址信息") {
                      // console.log(111);
                      navigate("/address");
                    }
                  }}
                >
                  <div className="img">
                    <Lazyimg
                      className="lazy"
                      src={item.pic}
                      placeholder={<Loading type="spinner" />}
                    ></Lazyimg>
                  </div>
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="title">@罗小黑出版，必属精品</div>
        </div>
      </div>
    </>
  );
}

export default Mine;
