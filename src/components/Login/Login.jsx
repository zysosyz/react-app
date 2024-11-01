import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Field, Toast } from "react-vant";
import { PhoneCircleO, CommentCircleO } from "@react-vant/icons";
import "./login.css";
import http from "../../tools/axios";
import plusReady from "../../tools/plusReady";

function Login() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const [phone, setPhone] = useState(null);
  const [captcha, setCaptcha] = useState(null);
  const [password, setPassword] = useState(null);
  const [loginType, setLoginType] = useState(0);
  function Login(msg) {
    plusReady(() => {
      plus.oauth.getServices((list) => {
        list.forEach((item) => {
          if (item.id === msg) {
            item.login();
          }
        });
      });
    });
  }
  // console.log(phone);
  // const location = useLocation()
  return (
    <div className="loginPage">
      <div className="login">
        <div className="shading">
          <div className="pic">
            <img src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201501%2F11%2F20150111022943_jXcVW.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1689392600&t=aefe896d92ad4813e0a12f2ad4c27de6"></img>
          </div>
        </div>
        <div className="msg">
          <Field
            style={{ padding: "16px" }}
            leftIcon={
              <PhoneCircleO
                style={{ verticalAlign: "middle", fontSize: "20rpx" }}
              />
            }
            placeholder="请输入手机号码"
            onChange={(phone) => {
              setPhone(phone);
            }}
          />
          {loginType === 0 ? (
            <Field
              style={{ padding: "16px" }}
              center
              leftIcon={
                <CommentCircleO
                  style={{ verticalAlign: "middle", fontSize: "20rpx" }}
                />
              }
              placeholder="请输入短信验证码"
              onChange={(captcha) => {
                setCaptcha(captcha);
              }}
              suffix={
                <div
                  style={{ color: "red" }}
                  onClick={() => {
                    if (!phone) {
                      Toast.fail("请输入正确的手机号");
                      return;
                    }
                    http(
                      "/sendCode",
                      "post",
                      { phone },
                      "application/x-www-form-urlencoded"
                    ).then((res) => {
                      if (res.data.code) {
                        Toast.success("获取验证码成功");
                      }
                      // console.log(res.data.code);
                    });
                  }}
                >
                  获取验证码
                </div>
              }
            />
          ) : (
            <Field
              style={{ padding: "16px" }}
              center
              leftIcon={
                <CommentCircleO
                  style={{ verticalAlign: "middle", fontSize: "20rpx" }}
                />
              }
              placeholder="请输入密码"
              onChange={(ps) => {
                setPassword(ps);
              }}
              //   suffix={
              //     <div
              //       style={{ color: "red" }}
              //       onClick={() => {
              //         if (!phone) {
              //           Toast.fail("请输入正确的手机号");
              //           return;
              //         }
              //         http(
              //           "/sendCode",
              //           "post",
              //           { phone },
              //           "application/x-www-form-urlencoded"
              //         ).then((res) => {
              //           if (res.data.code) {
              //             Toast.success("获取验证码成功");
              //           }
              //           // console.log(res.data.code);
              //         });
              //       }}
              //     >
              //       获取验证码
              //     </div>
              //   }
            />
          )}
        </div>
        <div
          className="login-btn"
          onClick={() => {
            Login("qq");
          }}
        >
          qq登录
        </div>
        <div
          className="login-btn"
          onClick={() => {
            Login("weixin");
          }}
        >
          微信登录
        </div>
        <div
          className="login-btn"
          onClick={() => {
            if (loginType === 0) {
              http("/login/mobile", "post", { phone, captcha }).then((res) => {
                if (res.data.code === 200) {
                  localStorage.setItem("token", res.data.data.token);
                  const url = params.get("redirectUrl");
                  // console.log(url);
                  if (!url) {
                    navigate(-1);
                  } else {
                    navigate(`/${url}`, { replace: true });
                  }
                }
                // console.log(res);
              });
            } else {
              http("/login", "post", { account: phone, password }).then(
                (res) => {
                  if (res.data.code === 200) {
                    localStorage.setItem("token", res.data.data.token);
                    const url = params.get("redirectUrl");
                    if (!url) {
                      navigate(-1);
                    } else {
                      navigate(`/${url}`, { replace: true });
                    }
                  }
                  //   console.log(res, "res");
                }
              );
            }
          }}
        >
          登录
        </div>
        <div
          className="login-btn"
          onClick={() => {
            setLoginType(1);
          }}
        >
          密码登录
        </div>
      </div>
    </div>
  );
}

export default Login;
