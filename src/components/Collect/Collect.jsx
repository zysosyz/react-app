import React, { useEffect, useState } from 'react'
import http from '../../tools/axios'
import { Field, ProductCard, Toast, Checkbox, Empty } from 'react-vant';
// import { Checkbox } from 'antd-mobile'
import './collect.css'
function Collect() {
    const [list, setList] = useState([])
    const [cancal, setCancal] = useState(false)
    const [checkList, setCheckList] = useState([])
    const [checked, setChecked] = useState(false)
    const [haha, setHa] = useState(null)
    const [hub, setHub] = useState([])
    useEffect(() => {
        http('/collect/user?page=1&limit=8').then(res => {
            // console.log(res);
            setList(res.data.data.list)
        })
    }, [])
    useEffect(() => {
        console.log(checkList, 'checkList');
        console.log(list, 'list');
   /*      if (list.length === checkList.length && list.length > 0) {
            setChecked(true)
        } else {
            setChecked(false)
        }
        if (list.length === 0) {
            setChecked(false)
        } */
    }, [checkList, list])
    return (
        <div className='collect'>
            <div className='collecter'>
                <div className='collectItem'>
                    <div className='collect-item'>
                        {
                            list.length > 0 &&
                            <Field
                                readOnly={true}
                                label={`共${list.length}件商品`}
                                suffix={

                                    <div onClick={() => {
                                        const div = document.querySelectorAll('.checkbox')
                                        const div2 = document.querySelector('.checkboxAll-s')
                                        setCancal(!cancal)
                                        if (!cancal) {
                                            div.forEach(item => {
                                                item.style.display = 'block'
                                            })
                                            div2.style.display = 'block'
                                        } else {
                                            div.forEach(item => {
                                                item.style.display = 'none'
                                            })
                                            div2.style.display = 'none'
                                        }
                                    }}>{cancal ? '取消' : '管理'}</div>
                                }
                            />
                        }

                        <Checkbox.Group value={checkList} checkedColor='#ff448f' onChange={(s) => {
                            if (haha) {
                                let m = s.filter((item, index) => {
                                    if (index >= hub.length) {
                                        return true
                                    }
                                    return hub[index] !== item.id
                                })
                                setCheckList(m)
                            } else {
                                setCheckList(s)
                            }
                        }}>
                            <div>
                                {list.length > 0 &&
                                    list.map(item =>
                                        <div className='collect-goods' key={item.id}>
                                            <ProductCard
                                                title={item.storeName}
                                                price={item.price}
                                                desc={item.storeName}
                                                thumb={item.image}
                                            />
                                            <div className='checkbox'><Checkbox name={item} ></Checkbox></div>
                                        </div>
                                    )
                                }
                                {
                                    list.length === 0 &&
                                    <Empty description='暂无收藏商品' />
                                }
                            </div>
                        </Checkbox.Group>
                    </div>
                    {
                        list.length > 0 &&
                        <div className='checkboxAll-s'>
                            <div className='checkboxAll'>
                                <Checkbox checked={checked} checkedColor='#ff448f' onChange={(value) => {
                                    if (value) {
                                        setCheckList(list)
                                    } else {
                                        setCheckList([])
                                    }
                                }}>全选</Checkbox>
                                <div className='collect-cancel' onClick={async () => {
                                    let newList = []
                                    checkList.forEach((item, index) => {
                                        newList[index] = item.id
                                    })
                                    setHub(newList)
                                    let m = newList.join(',')
                                    let res = await http('/collect/delete', 'post', { ids: m })
                                    let res2 = await http('/collect/user?page=1&limit=8')
                                    if (res.data.code === 200) {
                                        setHa('hahah')
                                        Toast.success('取消成功')
                                        setList(res2.data.data.list)
                                    } else {
                                        Toast.info(res.data.message)
                                    }
                                }}>取消收藏</div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default Collect
