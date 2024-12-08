import React, { useState, useEffect } from "react";
import {
  Toast,
  NavBar,
  SubmitBar,
  Checkbox,
  SwipeCell,
  ProductCard,
  Button,
  Stepper,
  Empty,
} from "react-vant";
import { WapHomeO, Ellipsis } from "@react-vant/icons";
import http from "../../tools/axios";
import "./Cart.css";
import { useNavigate } from "react-router-dom";
import plusReady from "../../tools/plusReady";

export default () => {
  const [confirm, setConfirm] = useState(true);
  const [checked, setChecked] = useState(false);
  const [totalPrice, setTot] = useState(0);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  const [checkList, setCheckList] = useState([]);
  const [haha, setHa] = useState(null);
  const [index, setIndx] = useState(null);
  useEffect(() => {
    http("/cart/list?page=1&limit=20&isValid=true").then((res) => {
      if (!res.data) {
        return;
      }
      setCart(res.data?.data?.list);
    });
    // plusReady(()=>{
    //     plus.navigator.setStatusBarBackground('#e93323');

    // })
  }, []);
  useEffect(() => {
    if (checkList.length > 0) {
      setConfirm(false);
    } else {
      setConfirm(true);
    }
    if (cart?.length === 0) {
      setTot(0);
      setChecked(false);
      setConfirm(true);
    }
  }, [checkList, cart]);

  return (
    <div className="CartPage">
      <NavBar
        title="购物车"
        onClickLeft={() => {
          navigate("/");
        }}
        leftText={<WapHomeO fontSize={20} />}
        rightText={<Ellipsis fontSize={20} />}
        onClickRight={() => Toast("没做")}
        fixed
      />
      <div className="goods">
        <Checkbox.Group
          value={checkList}
          checkedColor="#ff0000"
          onChange={(checkedList) => {
            // console.log(checkedList);
            let totalPrice = 0;
            checkedList.map((item) => {
              totalPrice += item.cartNum * item.price;
            });
            setTot(totalPrice * 100);

            if (checkedList.length === cart.length) {
              setChecked(true);
            } else {
              setChecked(false);
            }
            if (haha) {
              // console.log();
              let s = checkedList.filter((item) => item.id !== index);
              // console.log(checkedList);
              setCheckList(s);
            } else {
              setCheckList(checkedList);
            }
          }}
        >
          {cart?.length === 0 ? (
            <Empty image="search" description="暂无商品" />
          ) : (
            cart?.map((item, index) => (
              <SwipeCell
                key={item.id}
                rightAction={
                  <Button
                    style={{ height: "100%" }}
                    square
                    type="danger"
                    onClick={() => {
                      http(
                        "/cart/delete",
                        "post",
                        {
                          ids: item.id,
                        },
                        "application/x-www-form-urlencoded"
                      ).then(({ data }) => {
                        let index = cart.findIndex((a) => a.id === item.id);
                        console.log(data);
                        if (data.code === 200) {
                          // http('/cart/list?page=1&limit=20&isValid=true').then(res => {
                          //     if (!res.data) {
                          //         return
                          //     }
                          //     setCart(res.data.data.list)
                          // })
                          setHa("haha");
                          setIndx(item.id);
                          Toast.success("删除成功");
                          cart.splice(index, 1);
                          // console.log(checkList);
                          if (checked) {
                            let totalPrice = 0;
                            cart.map((item) => {
                              totalPrice += item.cartNum * item.price;
                            });
                            setTot(totalPrice * 100);
                          }

                          setCart([...cart]);
                        }
                        // console.log(res);
                      });
                      // console.log(111);
                    }}
                  >
                    删除
                  </Button>
                }
              >
                <div className="goodItem">
                  <ProductCard
                    onClickThumb={() => {
                      navigate(`/info/${item.productId}`);
                    }}
                    num={item.cartNum}
                    price={item.price}
                    desc={item.suk}
                    title={item.storeName}
                    thumb={item.image}
                    footer={
                      <div style={{ margin: "10px 0px" }}>
                        <Stepper
                          min={1}
                          defaultValue={item.cartNum}
                          buttonSize="17px"
                          theme="round"
                          onOverlimit={() => console.log("overlimit")}
                          // onMinus={() => console.log('minus')}
                          // onPlus={() => console.log('plus')}
                          onChange={async (value) => {
                            let index = cart.findIndex((a) => a.id === item.id);
                            await http(
                              "/cart/num",
                              "post",
                              {
                                id: item.id,
                                number: value,
                              },
                              "application/x-www-form-urlencoded"
                            ).then((res) => {
                              cart[index].cartNum = value;
                              setCart([...cart]);
                            });
                            let totalPrice = 0;
                            checkList.map((item) => {
                              totalPrice += item.cartNum * item.price;
                            });
                            setTot(totalPrice * 100);
                          }}
                        />
                      </div>
                    }
                  />
                  <div className="checkbox">
                    <Checkbox name={item}></Checkbox>
                  </div>
                </div>
              </SwipeCell>
            ))
          )}
        </Checkbox.Group>
      </div>
      <SubmitBar
        price={totalPrice}
        buttonText="提交订单"
        disabled={confirm}
        onSubmit={async () => {
          let s = checkList.map((item) => {
            return {
              shoppingCartId: item.id,
            };
          });
          let obj = {
            orderDetails: s,
            preOrderType: "shoppingCart",
          };
          let { data } = await http("/order/pre/order", "post", obj);
          if (data.code === 200) {
            navigate("/conorder", {
              replace: true,
              state: {
                preOrderNo: data.data.preOrderNo,
                totalPrice,
              },
            });
          } else {
            Toast.fail(data.message);
          }
        }}
      >
        <Checkbox
          checked={checked}
          checkedColor="#ff0000"
          onClick={() => {
            // console.log(111);
            setChecked(!checked);
            if (cart.length > 0) {
              let totalPrice = 0;
              cart.map((item) => {
                totalPrice += item.cartNum * item.price;
              });
              setTot(totalPrice * 100);
              setCheckList(cart);
            }
            if (cart.length === 0 || checked) {
              console.log(23456);
              setChecked(false);
              setCheckList([]);
              setTot(0);
              setConfirm(true);
            }
          }}
        >
          全选
        </Checkbox>
      </SubmitBar>
    </div>
  );
};
