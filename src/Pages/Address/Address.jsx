import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Checkbox, Toast, Dialog, Empty, NavBar } from 'react-vant';
import { AddO, Edit, DeleteO, ArrowLeft, Ellipsis } from '@react-vant/icons'
import './address.css'
import http from '../../tools/axios';


function Address() {
    const { state } = useLocation()
    const navigate = useNavigate()
    const [list, setList] = useState([])
    useEffect(() => {
        http('/address/list?page=1&limit=20').then(({ data }) => {
            // console.log(data.data.list);
            setList(data.data.list)
        })
    }, [])
    // console.log(list);
    return (
        <>
            <div className='address-management'>
                <NavBar
                    title='地址信息'
                    onClickLeft={() => {
                        navigate(-1)
                    }}
                    leftText={<ArrowLeft fontSize={20} />}
                    rightText={<Ellipsis fontSize={20} />}
                    onClickRight={() => Toast('没做')}
                    fixed
                />
                {list.length === 0 ?
                    <Empty image="search" description="暂无可用地址,请添加地址" />
                    : list.map((item, index) =>
                        <div className='radio-group' key={item.id}>
                            <div className='item'>
                                <div className='address' onClick={() => {
                                    // console.log(111);
                                    if (!state) {
                                        return
                                    }
                                    // console.log(111);
                                    navigate('/conorder', {
                                        state: {
                                            type: 1,
                                            id: item.id,
                                            preOrderNo: state.preOrderNo,
                                            totalPrice: state.totalPrice,
                                            // index
                                        }
                                    })
                                }} >
                                    <div className='people'>收货人:{item.realName}<span>{item.phone}</span></div>
                                    <div>收货地址:<span>{item.province + item.city + item.district + item.detail}</span></div>
                                </div>
                                <div className='operation'>
                                    <div className='default'>
                                        <Checkbox
                                            onClick={() => {
                                                if (item.isDefault) {
                                                    return
                                                }
                                                http('/address/default/set', 'post', { id: item.id }).then(res => {
                                                    // console.log(res)
                                                    if (res.data.code === 200) {
                                                        let index = list.findIndex(a => a.id === item.id)
                                                        // console.log( list[index].isDefault);
                                                        for (let i = 0; i < list.length; i++) {
                                                            if (i !== index) {
                                                                list[i].isDefault = false
                                                            }
                                                        }
                                                        item.isDefault = true
                                                        setList([...list])

                                                        Toast.success('设置成功')
                                                    }
                                                })
                                            }}
                                            checked={item.isDefault}
                                            checkedColor='#e93323'
                                            style={{ marginRight: '15px' }}
                                        />设为默认</div>
                                    <div className='oper'>
                                        <span
                                            onClick={() => {
                                                navigate('/addAddress', {
                                                    state: {
                                                        id: item.id,
                                                        msg: item,
                                                        preOrderNo: state && state.preOrderNo,
                                                        totalPrice: state && state.totalPrice,
                                                    }
                                                })
                                            }}
                                        ><Edit fontSize={25} style={{ marginRight: '5px', verticalAlign: 'middle' }} />编辑</span>
                                        <span
                                            onClick={async () => {
                                                await Dialog.alert({
                                                    fontSize: '20px',
                                                    width: 300,
                                                    showCancelButton: true,
                                                    cancelButtonColor: '',
                                                    closeable: true,
                                                    theme: 'round-button',
                                                    message: '确认删除吗？',
                                                })
                                                http('/address/del', 'post', { id: item.id }).then(res => {
                                                    if (res.data.code === 200) {
                                                        let index = list.findIndex(a => a.id === item.id)
                                                        list.splice(index, 1)
                                                        setList([...list])
                                                    }
                                                })
                                            }}
                                        ><DeleteO fontSize={25} style={{ marginRight: '5px', verticalAlign: 'middle' }} />删除</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                {list.length > 0 && <div className='last'>我也是有底线的</div>}
            </div>
            <div className='footer'>
                <div className='add' onClick={() => {
                    let data
                    if (state) {
                        data = {
                            id: 0,
                            preOrderNo: state.preOrderNo,
                            totalPrice: state.totalPrice,
                        }
                    } else {
                        data = {
                            id: 0,
                        }
                    }

                    navigate('/addAddress', {
                        state: data
                    })
                }} >
                    <AddO />
                    添加新地址
                </div>
            </div>
        </>
    )
}

export default Address
