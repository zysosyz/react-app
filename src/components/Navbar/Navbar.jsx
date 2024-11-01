import { useNavigate, useLocation } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { Tabbar } from 'react-vant'
import { FriendsO, WapHomeO, ShoppingCartO, AppsO } from '@react-vant/icons'

export default () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [activeIndex, setIndex] = useState(0)
    const list = [
        {
            name: '首页',
            icon: <WapHomeO />,
            path: 'home'
        }, {
            name: '分类',
            icon: <AppsO />,
            path: 'goods'
        }, {
            name: '购物车',
            icon: <ShoppingCartO />,
            path: 'cart'
        }, {
            name: '我的',
            icon: <FriendsO />,
            path: 'mine'
        }
    ]
    return (
        <div className='demo-tabbar'>
            <Tabbar
                value={location.pathname}
                activeColor='red'
            >
                {list.map((item, index) =>
                    <Tabbar.Item key={index} icon={item.icon} name={`/index/${item.path}`} onClick={() => {
                        navigate(item.path)
                    }} >{item.name}</Tabbar.Item>
                )}
            </Tabbar>
        </div>
    )
}
