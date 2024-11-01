import React, { useEffect, useState } from 'react'
import http from '../../tools/axios'
import { Search, Arrow } from '@react-vant/icons';
import './searchkey.css'
import ItemList from '../ItemList/ItemList'
import { useNavigate } from 'react-router-dom';
import { Empty, Toast } from 'react-vant';
function SearchKey() {
    const [list, setList] = useState([])
    const [value, setValue] = useState('');
    const [keyList, setKeyList] = useState([])
    const [done, setDone] = useState(null)
    const navigate = useNavigate()
    useEffect(() => {
        http('/search/keyword').then(res => {
            setList(res.data.data)
        })
    }, [])
    function SearchKey(a) {
        setDone('hahaha')
        if (!value && !a) {
            Toast.info('请输入商品名称')
            return
        }
        http(`/products?keyword=${a ? a : value}&page=1&limit=8`).then((res) => {
            console.log(res);
            setKeyList(res.data.data.list)
        })
    }
    return (
        <div>
            <div className='Search' >
                <div className='search-input'>
                    <Search
                        fontSize={18}
                        style={{ marginLeft: '10px' }}
                        onClick={() => {
                            SearchKey()
                        }}
                    />
                    <input value={value} onChange={(e) => { setValue(e.target.value) }} placeholder="请输入搜索关键词" />
                </div>
                <div style={{ paddingBottom: '5px' }}
                    onClick={() => {
                        SearchKey()
                    }}
                >搜索</div>
            </div>
            <div className='hot'>
                <div className='hot-search'>热门搜索</div>
                <div className='hotlist'>
                    {
                        list.map((item =>
                            <span onClick={() => {
                                SearchKey(item.title)
                                setValue(item.title)
                            }} key={item.id}>{item.title}</span>
                        ))
                    }
                </div>
            </div>
            {(keyList.length === 0 && done) &&
                <Empty description='暂无搜索商品，请搜索其他商品' />
            }
            {
                keyList.length === 0 &&
                <>
                    <div className='hot-com'>
                        <span>热门推荐</span>
                    </div>
                    <ItemList />
                </>
            }
            {
                keyList.length > 0 &&
                <div className='done'>
                    {
                        keyList.map(item =>
                            <div className='searchdone' key={item.id} onClick={() => {
                                navigate(`/info/${item.id}`)
                            }}>
                                <div className='searchdone-pic'>
                                    <img src={item.image}></img>
                                </div>
                                <div className='search-content'>
                                    <div className='desc'>{item.storeName}</div>
                                    <div>
                                        <p className='price'>￥<span>{item.price}</span></p>
                                        <p className='sales'>已售{item.sales}</p>
                                    </div>
                                    <div className='search-icon'><Arrow /></div>
                                </div>
                            </div>
                        )
                    }

                </div>
            }


        </div>
    )
}

export default SearchKey
