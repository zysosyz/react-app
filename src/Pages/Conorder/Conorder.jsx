import React, { useCallback, useEffect, useRef, useState } from 'react'
import http from '../../tools/axios'
import { useLocation, useNavigate } from 'react-router-dom'
import { NavBar, Toast, ProductCard, Cell, Field, SubmitBar, Popup, Empty } from 'react-vant'
import { WapHomeO, Ellipsis, Arrow, WechatPay, Alipay, LocationO } from '@react-vant/icons'
import './Conorder.css'
function Conorder() {
    const ref = useRef()
    const { state } = useLocation()
    const [type, setType] = useState(0)
    const [html, setHtml] = useState(null)
    let { preOrderNo } = state
    const [list, setList] = useState([])
    let list2 = list.filter(item => item.isDefault)
    const [list3, setList3] = useState([])
    const [buyList, setBuyList] = useState([])
    const [num, setNum] = useState(0)
    const [activeIndex, setActive] = useState(0)
    const [activeIndex2, setActive2] = useState(0)
    const navigate = useNavigate()
    const [visible, setVisible] = useState(false)
    const [code, setCode] = useState(0)
    const payList = [
        {
            icon: <WechatPay style={{ verticalAlign: 'middle' }} color='red' fontSize={20} />,
            type: 'weixin'
        }, {
            icon: <Alipay style={{ verticalAlign: 'middle' }} color='red' fontSize={20} />,
            type: 'alipay'
        }
    ]
    async function getMsg() {
        let res = await http(`/order/load/pre/${state.preOrderNo}`)
        console.log(res);
        if (res.data.code === 500) {
            Toast.fail(res.data.message)
            return
        }
        setBuyList(res.data.data.orderInfoVo.orderDetailList)
        setNum(res.data.data.orderInfoVo.orderProNum)
        let res2 = await http('/address/list?page=1&limit=20')
        if (res.data.code === 500) {
            setList([])
            return
        }
        setList(res2.data.data.list)
    }
    useEffect(() => {
        getMsg()
        if (state.type) {
            http(`/address/detail/${state.id}`).then(res => {
                setType(state.type)
                if (!res.data.data) {
                    setList3([])
                    return
                }
                setList3([res.data.data])
            })
        }
    }, [])
    useEffect(() => {
        if (html) {
            ref.current.children[0].submit()
        }
    }, [html])
    return (
        <div className='buyPage'>
            <NavBar
                title='确认订单'
                onClickLeft={() => {
                    navigate('/')
                }}
                leftText={<WapHomeO fontSize={20} />}
                rightText={<Ellipsis fontSize={20} />}
                onClickRight={() => Toast('没做')}
                fixed
            />
            <div className='header' onClick={() => {
                setVisible(true)
            }}>
                {(type === 0 ? list2 : list3).map(item =>
                    <div className='address' key={item.id}>
                        <div className='name'>
                            {item.realName}<span style={{ marginLeft: '15px' }} >{item.phone}</span>
                        </div>
                        <div className='addressInfo'>
                            <span className='default'>{item.isDefault && '[默认]'}</span>
                            <span style={{ marginLeft: '8px' }} >{item.province + item.city + item.district + item.detail}</span>
                        </div>
                        {/* <div className='addressName'>
                            <span >{item.realName}<span>{item.phone}</span></span><br></br>
                            <span>{item.province + item.city + item.district}</span>
                        </div> */}
                        <div className='right'><Arrow color='#979797' fontSize={14} /></div>
                    </div>
                )}
                {((list2.length === 0) && type !== 1) &&
                    <div className='setAddress'>
                        <div>设置收货地址</div>
                        <div><Arrow fontSize={18} /></div>
                    </div>
                }

            </div>
            <div className='content'>
                <div className='goodsNum'>共{num}件商品</div>
                <div>
                    {buyList.map((item, index) =>
                        <ProductCard
                            key={index}
                            num={item.payNum}
                            price={item.price}
                            desc={item.suk}
                            title={item.productName}
                            thumb={item.image}
                        />
                    )}
                </div>
            </div>
            <div className='content'>
                <Cell title='快递运费' value='免运费' />
                <Cell title='备注信息' />
                <div style={{ marginTop: '10px' }} >
                    <Field
                        rows={2}
                        autoSize
                        // label="留言"
                        type="textarea"
                        placeholder="请添加备注150字以内"
                        maxLength={150}
                        showWordLimit
                    />
                </div>
            </div>
            <div className='content'>
                <Cell title='支付方式' />
                <div>
                    {payList.map((item, index) =>
                        <div className={activeIndex === index ? 'paytype active' : 'paytype'} key={index}
                            onClick={() => {
                                setActive(index)
                            }}
                        >
                            <div className='pay-type'>{item.icon}&nbsp;&nbsp;{item.type === 'weixin' ? '微信支付' : '支付宝支付'}</div>
                            <div className='type'>{item.type === 'weixin' ? '微信快捷支付' : '支付宝快捷支付'}</div>
                        </div>
                    )}
                </div>
            </div>
            <div className='content'>
                <div ref={ref} dangerouslySetInnerHTML={{ __html: html }}></div>
                <Cell title='商品总价' value={buyList.length > 0 ? '￥' + (state.totalPrice / 100).toFixed(2) : '￥0.00'} />
            </div>
            <SubmitBar price={buyList.length > 0 ? state.totalPrice : '0.00'} buttonText="立即结算"
                onSubmit={async () => {
                    if (list2.length === 0) {
                        Toast.success('地址不能为空')
                        return
                    }
                    let address = await http('/address/list?page=1&limit=20')
                    console.log(address);
                    console.log(address.data.data.list);
                    if (address.data.data.list.length === 0) {
                        return
                    }
                    let { id, phone, realName } = address.data.data.list[0]
                    // console.log(id);
                    let data = {
                        addressId: id,
                        couponId: 0,
                        mark: '',
                        payChannel: "weixinh5",
                        payType: payList[activeIndex].type,
                        phone,
                        preOrderNo: preOrderNo,
                        realName,
                        shippingType: 1,
                        storeId: 0,
                        useIntegral: false
                    }
                    // console.log(data);
                    let msg = await http('/order/create', 'post', data)
                    console.log(msg);
                    if (msg.data.code !== 200) {
                        Toast.fail(msg.data.message)
                        return
                    }
                    // console.log(msg.data.data.orderNo);
                    let data2 = {
                        "orderNo": msg.data.data.orderNo,
                        "payChannel": "weixinh5",
                        "payType": "alipay",
                        "scene": "0"
                    }
                    let sm = await http('/pay/payment', 'post', data2)
                    setHtml(sm.data.data.alipayRequest)
                }}
            />
            <Popup
                visible={visible}
                onClose={() => setVisible(false)}
                position='bottom'
                closeable
                style={{ height: 'auto' }}
            >
                <div className='buy-add'>
                    <div className='title'>选择地址</div>
                    {list.length === 0 ?
                        <Empty image="search" description="暂无可用地址" />
                        : list.map((item, index) =>
                            <div className={activeIndex2 === index ? 'list active2' : 'list'}
                                onClick={() => {
                                    // console.log(item);
                                    setActive2(index)
                                    setVisible(false)
                                    setType(1)
                                    setList3([item])
                                }}
                                key={item.id}>
                                <div><LocationO fontSize={18} /></div>
                                <div className='address'>
                                    <div className='name'>
                                        <span>{item.realName}</span>
                                        <span style={{ marginLeft: '10px' }}>{item.phone}</span>
                                    </div>
                                    <div className='line'>{item.province + item.city + item.district}</div>
                                </div>
                            </div>
                        )}

                    <div className='address-other' onClick={() => {
                        navigate('/address', {
                            state: {
                                preOrderNo,
                                totalPrice: state.totalPrice
                            }
                        })
                    }}>
                        选择其他地址
                    </div>
                </div>
            </Popup>
        </div>
    )
}

export default Conorder
