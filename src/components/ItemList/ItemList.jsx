import React, { useEffect, useState } from 'react'
import http from '../../tools/axios'
import './itemlist.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { Loading, List, Empty } from 'react-vant'
import Lazyimg from 'react-lazyimg-component';
function ItemList(props) {
    const navigate = useNavigate()
    const location = useLocation()
    const show = location.pathname === '/index/goods'
    const shoeTwo = location.pathname === '/search'
    const [itemList, setItem] = useState([])
    const [page, setPage] = useState(1)
    const [finished, setFinished] = useState(false)
    // console.log(location);
    const onLoad = async () => {
        ///products?page=1&limit=10&cid=0
        if (show) {
            const res = await http(`products?page=${page}&limit=10&cid=${props.id}`)
            // console.log(res.data.data);
            setItem([...itemList, ...res.data.data.list])
            setPage(page + 1)
            if (res.data.data.totalPage === page || res.data.data.totalPage === 0) {
                setPage(1)
                setFinished(true)
            }
        } else if (shoeTwo) {
            const res = await http(`/product/hot?page=${page}&limit=8`)
            setItem([...itemList, ...res.data.data.list])
            setPage(page + 1)
            if (res.data.data.totalPage === page || res.data.data.totalPage === 0) {
                setPage(1)
                setFinished(true)
            }
        } else {
            const res = await http(`/index/product/${props.index + 1}/?page=${page}&limit=10`)
            setItem([...itemList, ...res.data.data.list])
            setPage(page + 1)
            if (res.data.data.list.length === 0) {
                setFinished(true)
            }
        }
    }
    useEffect(() => {
        setItem([])
        setFinished(false)
        setPage(1)
    }, [props.index, props.id])

    return (
        <div className='somelist'>
            <List offset={0} finished={finished} onLoad={onLoad} loadingText='加载中' finishedText='没有数据了'>
                {itemList.map((item, index) =>
                    <div className='some_item' key={index} onClick={() => {
                        navigate(`/info/${item.id}`)
                    }} >
                        <div className='list-img'>
                            <Lazyimg src={item.image} style={{ height: '170px', lineHeight: '170px' }} placeholder={<Loading style={{ height: '170px', lineHeight: '170px' }} size={35} type='spinner' />}></Lazyimg>
                        </div>
                        <div className='infor'>
                            <div className='name'>{item.storeName}</div>
                            {
                                !show &&
                                <div className='oldprice'>￥{item.otPrice}</div>
                            }
                            <div className='price'>￥{item.price}</div>
                            {show &&
                                <div>已售{item.sales + item.ficti}件</div>
                            }

                        </div>
                    </div>
                )}

            </List>
        </div>
    )
}

export default ItemList
