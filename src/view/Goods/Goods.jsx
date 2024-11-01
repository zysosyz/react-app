import React, { useEffect, useState } from 'react'
import { Tabs } from 'react-vant'
import http from '../../tools/axios'
import ItemList from '../../components/ItemList/ItemList'
import './goods.css'

function GoodsCate() {
    const [list, setList] = useState([])
    const [id, setId] = useState(0)
    function getMsg() {
        http('/category').then(res => {
            // console.log(res.data.data);
            res.data.data.unshift({ name: '全部', id: 0 })
            setList(res.data.data)
        })
    }
    useEffect(() => {
        getMsg()
    }, [])

    // console.log(111);
    return (
        <div className='goodscate'>
            <Tabs
                background='#f1f1f1'
                sticky
                active={0}
                onChange={(num) => {
                    // console.log(num);
                    let id = list[num].id
                    setId(id)
                }}>
                {list.length > 0 && list.map((item, index) => (
                    <Tabs.TabPane key={index} title={item.name}>
                        <ItemList id={id} />
                        {/* 内容 {item} */}
                    </Tabs.TabPane>
                ))}
            </Tabs>
        </div>
    )
}

export default GoodsCate
