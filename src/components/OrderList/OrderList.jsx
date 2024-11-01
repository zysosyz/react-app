import React, { useEffect, useState } from 'react'
import './orderlist.css'
import pic from '../../assets/images/wenjuan.png'
import { Empty, Dialog, Toast, NavBar } from 'react-vant';
import http from '../../tools/axios'
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from '@react-vant/icons';
function OrderList() {
    const [list, setList] = useState([])
    const location = useLocation()
    const [msg, setMsg] = useState('')
    const [activeIndex, setIndex] = useState(0)
    const [html, setHtml] = useState('')
    const navigate = useNavigate()
    const Msg = [
        {
            name: '待付款',
            num: msg.unPaidCount,
            type: 1
        }, {
            name: '待发货',
            num: msg.unShippedCount,
            type: 2
        }, {
            name: '待收货',
            num: msg.receivedCount,
            type: 3
        }, {
            name: '待评价',
            num: msg.evaluatedCount,
            type: 4
        }, {
            name: '已完成',
            num: msg.completeCount,
            type: 5
        },
    ]
    useEffect(() => {
        http(`/order/list?type=0&page=1&limit=20`).then(res => {
            // console.log(res.data.data);
            setList(res.data.data.list)
        })
        http('/order/data').then(res => {
            console.log(res.data.data);
            setMsg(res.data.data)
        })
        if (location.state) {
            setIndex(location.state.index)
            sendResq(location.state.index)
        }
    }, [])
    function sendResq(type) {
        http(`/order/list?type=${type}&page=1&limit=20`).then(res => {
            // console.log(res.data.data);
            setList(res.data.data.list)
        })
    }
    async function payMent(orderId) {
        // console.log(111);
        await http('/pay/payment', 'post', {
            "orderNo": orderId,
            "payChannel": "weixinh5",
            "payType": "alipay",
            "scene": "0"
        }).then(res => {
            setHtml(res.data.data.alipayRequest)
        })
    }
    async function cancel(id) {
        // console.log(item);
        let res = await http('/order/cancel', 'post', { id }, 'application/x-www-form-urlencoded')
        // console.log(res.data);
        if (res.data.code === 200) {
            Toast.success('取消成功')
            http('/order/data').then(res => {
                setMsg(res.data.data)
                if (res.data.data.unPaidCount === 0) {
                    setList([])
                }
            })
        }
    }
    useEffect(() => {
        if (html) {
            document.forms[0].submit();
        }
    }, [html])
    // console.log(Msg);
    return (
        <div style={{ height: '100%', backgroundColor: '#f5f5f5' }}>
            <div className='my-order' >
                <NavBar
                    fixed={true}
                    border={false}
                    // leftText='返回'
                    style={{ background: '#ff448f', height: '50px' }}
                    leftArrow={<ArrowLeft />}
                    onClickLeft={() => {
                        navigate(-1)
                    }}
                    onClickRight={() => Toast('按钮')}
                />
                <div className='headers'>
                    <div className='headers-left'>
                        <div className='msg'>订单信息</div>
                        <div>
                            <span style={{ marginRight: '5px' }}>消费订单：{msg.orderCount}</span>
                            <span>总消费：￥{msg.sumPrice}</span>
                        </div>
                    </div>
                    <div className='headers-rit'>
                        <img src={pic} ></img>
                    </div>
                </div>
                <div className='order-nav'>
                    {Msg.map((item, index) =>
                        <div className={activeIndex === index ? 'nav-item on' : 'nav-item '} key={index} onClick={() => {
                            setIndex(index)
                            sendResq(index)
                        }}>
                            <div>{item.name}</div>
                            <div>{item.num}</div>
                        </div>
                    )}
                </div>
                {list.map((item, index) =>
                    <div className='order-list' key={index}>
                        <div className='list-tab'>
                            <div>
                                <span>{item.createTime}</span>
                            </div>
                            <div>{activeIndex === 0 ? '待支付' : '待发货'}</div>
                        </div>
                        {item.orderInfoList.map((a, b) =>
                            <div className='list-item' key={b}>
                                <div className='list-pic'>
                                    <img src={a.image}></img>
                                </div>
                                <div className='list-desc'>
                                    <span>
                                        {a.storeName}
                                    </span>
                                </div>
                                <div className='list-num'>
                                    <span>￥{a.price}</span>
                                    <span style={{ textAlign: 'right' }}>x{a.cartNum}</span>
                                </div>
                            </div>
                        )}
                        <div className='list-total'>
                            <div>共{item.totalNum}件商品,总金额<span style={{ color: '#ff448f', fontWeight: 'bolder', fontSize: '14px' }}>￥{item.payPrice}</span></div>
                        </div>
                        {
                            activeIndex === 0 &&
                            <div className='list-pay'>
                                <button className='cancel' onClick={async () => {
                                    await Dialog.alert({
                                        fontSize: '20px',
                                        width: 300,
                                        showCancelButton: true,
                                        cancelButtonColor: '',
                                        closeable: true,
                                        theme: 'round-button',
                                        message: '确认取消订单吗？',
                                    })
                                    cancel(item.id)
                                }}>取消订单</button>
                                <button className='pay' onClick={() => {
                                    // console.log(item.orderId);
                                    payMent(item.orderId)
                                }}>立即付款</button>
                            </div>
                        }
                        {
                            activeIndex === 1 &&
                            <div className='list-pay'>
                                <button className='pay' onClick={() => {
                                    // console.log(item.orderId);
                                    // payMent(item.orderId)
                                }}>查看详情</button>
                            </div>


                        }

                    </div>
                )}
                <div dangerouslySetInnerHTML={{ __html: html }}></div>
                {
                    list.length === 0 &&
                    <div className='empty'>
                        <Empty
                            description='暂无订单信息'
                        />
                    </div>

                }
                {
                    list.length > 0 &&
                    <div className='list-last'>我也是有底线的</div>
                }
            </div>
        </div>

    )
}

export default OrderList
