import React, { useEffect, useState } from 'react'
import { Field, Area, Checkbox, Toast, NavBar } from 'react-vant';
import { Location, ArrowLeft, Ellipsis } from '@react-vant/icons'
import { areaList } from '@vant/area-data'
import http from '../../tools/axios'
import './add.css'
import { useLocation, useNavigate } from 'react-router-dom';

function Add() {
    const [value, setValue] = useState([])
    const [address, setAddress] = useState({})
    const [obj, setObj] = useState([])
    const navigate = useNavigate()
    const { state } = useLocation()
    // console.log(state.id);
    function city(selectRows) {
        if (value.length > 0) {
            return selectRows.map(row => row?.text).join(',')
        } else if (state.msg) {
            return state.msg.province + ',' + state.msg.city + ',' + state.msg.district
        } else {
            return '省,市,区'
        }
    }
    useEffect(() => {
        if (state.msg) {
            setAddress(state.msg)
        }
    }, [])
    return (
        <div className='box2'>
            <NavBar
                title={state.id === 0 ? '添加地址' : '修改地址'}
                onClickLeft={() => {
                    navigate(-1)
                }}
                leftText={<ArrowLeft fontSize={20} />}
                rightText={<Ellipsis fontSize={20} />}
                onClickRight={() => Toast('没做')}
                fixed
            />
            <div className='con'>
                <Field
                    label="姓名"
                    defaultValue={state.msg && state.msg.realName}
                    placeholder='请输入姓名'
                    onChange={(realName) => {
                        // console.log(defaultValue);
                        setAddress({ ...address, realName })
                    }}
                />
                <Field
                    label="联系电话"
                    defaultValue={state.msg && state.msg.phone}
                    placeholder='请输入联系电话'
                    onChange={(phone) => {
                        setAddress({ ...address, phone })
                    }}
                />
                <Area
                    popup={{
                        round: true,
                    }}
                    title='地址信息'
                    value={value}
                    areaList={areaList}
                    onConfirm={setValue}
                    onChange={(a, b) => {
                        setObj(b)
                        // console.log(b);
                    }}
                >
                    {(_, selectRows, actions) => {
                        return (
                            <Field
                                label='所在地区'
                                defaultValue={city(selectRows)}
                                value={city(selectRows)}
                                onClick={() => actions.open()}
                            />
                        )
                    }}
                </Area>
                <Field
                    label="详细地址"
                    rightIcon={<Location color='red' fontSize={22} />}
                    defaultValue={state.msg && state.msg.detail}
                    placeholder='请填写具体地址'
                    onChange={(detail) => {
                        setAddress({ ...address, detail })
                    }}
                >
                </Field>
            </div>
            <Field
                label="设为默认地址"
                style={{ marginTop: '20px', borderRadius: '7PX' }}
                leftIcon={<Checkbox checkedColor='#ee0a24' onChange={(isDefault) => {
                    setAddress({ ...address, isDefault })
                }} />}
            >
            </Field>
            <div className='save'
                onClick={() => {
                    // console.log(state);
                    // console.log(obj);
                    // console.log(address);
                    if (!state || obj.length == 0) {
                        if (obj.length === 0) {
                            Toast.fail('地址不能为空')
                            return
                        }
                    }
                    if (obj.length < 3) {
                        Toast.info('请输入完整地址')
                        return
                    }
                    // console.log(obj);
                    // console.log(address);
                    let { realName, detail, phone, isDefault } = address

                    let address2 = {
                        "address": {
                            "province": obj.length === 0 ? state.msg.province : obj[0].text,
                            "city": obj.length === 0 ? state.msg.city : obj[1].text,
                            "district": obj.length === 0 ? state.msg.district : obj[2].text,
                            "cityId": 26779
                        },
                        detail,
                        "id": state.msg ? state.msg.id : 0,
                        'isDefault': isDefault ? true : false,
                        phone,
                        realName
                    }
                    // console.log(address2);
                    http('/address/edit', 'post', address2).then(({ data }) => {
                        // console.log(data);
                        if (data.code === 200) {
                            if (state) {
                                Toast.success('修改成功')
                            } else {
                                Toast.success('添加成功')
                            }
                            navigate('/address', {
                                state: {
                                    preOrderNo: state.preOrderNo,
                                    totalPrice: state.totalPrice,
                                }
                            })
                        } else {
                            Toast.fail(data.message)
                        }
                        // console.log(data);
                    })
                }}
            >{state.id === 0 ? '立即保存' : '立即修改'}</div>

        </div >
    )
}

export default Add

