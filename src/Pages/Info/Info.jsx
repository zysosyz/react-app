import React, { useEffect, useState, memo } from 'react'
import { CartO, StarO, ArrowLeft, Ellipsis, Arrow, Star, } from '@react-vant/icons'
import { Skeleton, Loading, ActionBar, Image, Swiper, ShareSheet, Tabs, ImagePreview, Popup, Stepper, Cell, Toast } from 'react-vant'
import { useNavigate, useParams } from 'react-router-dom'
import './info.css'
import http from '../../tools/axios'
import Lazyimg from 'react-lazyimg-component';
import plusReady from '../../tools/plusReady'


const Info = () => {
  const [loading, setLoading] = useState(true)
  const [num, setNum] = useState(1)
  const [goods, setGoods] = useState([])
  const [visible2, setVisible2] = useState(false)
  const [isShow, setShow] = useState(true)
  const [animalImg, setImg] = useState([])
  const [cartNum, setCartNum] = useState(0)
  const [content, setContent] = useState('')
  const [obj, setObj] = useState('')
  const [productAttr, setAttr] = useState([])
  const [productValue, setValue] = useState('')
  const [productInfo, setInfo] = useState('')
  const [skuList, setSkuList] = useState([])
  const [serverList, setServerList] = useState({})
  // let skuList = [0]
  const parmas = useParams()
  // console.log(111);
  async function Show() {
    let res = await http(`/collect/cancel/${parmas.id}`, 'post', '', 'application/x-www-form-urlencoded')
    // console.log(res);
    let res2 = await http('/collect/add', 'post', {
      "category": "product",
      "id": parmas.id
    })
    if (!isShow) {
      if (res.data.code === 200) {
        Toast.success('取消收藏')
        setShow(true)
      }
    } else {
      if (res2.data.code === 200) {
        Toast.success('收藏成功')
        setShow(false)
      }
    }
  }
  useEffect(() => {
    http('/product/good').then(({ data }) => {
      let list = data.data.list
      let sum = list.length
      let num = Math.ceil(sum / 6);
      let arry = [];
      for (let i = 0; i < num; i++) {
        if (i === num - 1) {
          arry[i] = list.slice(i * 6)
        } else {
          arry[i] = list.slice(i * 6, 6)

        }
      }
      setGoods(arry)
    })
    http(`/product/detail/${parmas.id}?type=normal`).then(({ data }) => {
      // console.log(data);
      let sku = []
      data.data.productAttr.forEach((item, i) => {
        sku[i] = 0
      })
      setSkuList(sku)
      let skname = []
      sku.forEach((item, index) => {
        let attr = (data.data.productAttr[index].attrValues).split(',')[item]
        skname.push(attr)
      })
      skname = skname.join(',')
      setInfo(data.data.productInfo)
      setValue(data.data.productValue)
      setObj(data.data.productValue[skname])
      setAttr(data.data.productAttr)
      setContent(data.data.productInfo.content)
      setImg(JSON.parse(data.data.productInfo.sliderImage))

      if (data.data.userCollect) {
        setShow(false)
      } else {
        setShow(true)
      }
      plusReady(() => {
        plus.navigator.setStatusBarBackground('#e93323');
      })
    }, [])

    // http('/cart/count?numType=true&type=total').then(({ data }) => {
    //   console.log(data);
    //   // if(!data){
    //   //   setCartNum(0)
    //   //   return
    //   // }
    //   setCartNum(data.data.count)
    // })
  }, [])
  useEffect(() => {
    // console.log(obj);
    if (animalImg.length > 0) {
      setLoading(false)
      // console.log(222);
    }

  }, [animalImg])
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)
  const options = [
    { name: '微信', id: 'weixin', icon: 'wechat' },
    { name: '朋友圈', id: 'weixin', icon: 'wechat-moments' },
    { name: '微博', id: 'sinaweibo', icon: 'weibo' },
    { name: 'QQ', id: 'qq', icon: 'qq' },
  ]
  let imgList = []  //存储需要的信息
  content?.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/g, function (match, capture) {
    imgList.push(capture); // capture图片地址 img标签中src内容   match // img标签整体
  })
  const Height = document.documentElement.clientWidth
  return (
    <Skeleton round={false} loading={loading} row={5} rowHeight={[Height, 30, 40, 40, 50]}>
      <div className='info'>
        <div className='left' onClick={() => {
          navigate(-1)
        }} ><ArrowLeft color='#3f45ff' /></div>
        <div className='right' onClick={() => setVisible(true)} ><Ellipsis /></div>

        <Tabs
          sticky={true}
          scrollspy={{ autoFocusLast: true, reachBottomThreshold: 50, scrollImmediate: false }}
          onScroll={({ scrollTop }) => {
            const div = document.querySelector('.rv-sticky')
            if (scrollTop > 0) {
              div.style.display = 'block'
            } else {
              div.style.display = 'none'
            }
          }}
        >
          <Tabs.TabPane key='a' title={`商品`}  >
            <div >
              <div className='anm-img'>
                <Swiper autoplay={4000}>
                  {animalImg.map((item) => (
                    <Swiper.Item key={item}>
                      {/* <Lazyimg  width='100%'   placeholder={<Loading width='100%' type='spinner' />}></Lazyimg> */}
                      <Image lazyload={true} src={item} width='100%' height={document.documentElement.clientWidth + 'px'} loadingIcon={<Loading width='100%' type='spinner' />} />
                    </Swiper.Item>
                  ))}
                </Swiper>
              </div>
              <div className='msg-info'>
                <p className='price'>{obj.price}</p>
                <p className='name'>{productInfo.storeName}</p>
                <div className='good-info'>
                  <span className='otPrice'>{obj.otPrice}</span>
                  <span>库存:{obj.stock}</span>
                  <span>销量:{obj.sales}</span>
                </div>
              </div>
              <div className='change-info' onClick={() => {
                setVisible2(true)
              }}>
                已选择： <span className='attrNmae'>{obj.suk}</span>
                <div className='right-chan'><Arrow /></div>
              </div>
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane key='b' title={`评价`}>
            <div className='coment'>
              <div className='title'>用户评价(1)</div>
              <div className='coment-mine'></div>
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane key='c' title={`推荐`}>
            <div className='rec'>
              <div className='title'>优品推荐</div>
              {goods.length > 0 && <Swiper autoplay={4000}>
                {goods.map((item) => (
                  <Swiper.Item key={item.length}>
                    <div className='rec-good'>
                      {item.map((a, b) =>
                        <div className='rec-item' key={b}>
                          <Lazyimg className='lazy' src={a.image} placeholder={<Loading style={{ minHeight: '90px', lineHeight: '90px' }} type='spinner' />}></Lazyimg>
                          <p className='storeName'>{a.storeName}</p>
                          <p className='price'>￥{a.price}</p>
                        </div>
                      )}
                    </div>
                  </Swiper.Item>
                ))}
              </Swiper>}
            </div>
          </Tabs.TabPane >
          <Tabs.TabPane key='d' title={`详情`}>
            <div className='details' >
              <div className='title'>商品详情</div>
              <div dangerouslySetInnerHTML={{ __html: content }} onClick={(e) => {
                // console.log(imgList);
                // console.log(e.target.currentSrc);
                let index = imgList.findIndex((item) => {
                  return item === e.target.currentSrc
                })
                ImagePreview.open({
                  images: imgList,
                  startPosition: index,
                })
              }} ></div>
            </div>
          </Tabs.TabPane>
        </Tabs >

        <div className='demo-action-bar'>
          <ActionBar>
            <ActionBar.Icon icon={<CartO />} badge={{ content: cartNum }} text='购物车'
              onClick={() => {
                navigate('/index/cart')
              }}
            />
            <ActionBar.Icon icon={isShow ? <StarO /> : <Star color='red' />} text='收藏' onClick={async () => {
              // console.log(productValue[skname].productId);
              //'application/x-www-form-urlencoded'
              Show()

            }} />
            <ActionBar.Button
              onClick={() => setVisible2(true)}
              type='warning' text='加入购物车' />
            <ActionBar.Button
              onClick={() => setVisible2(true)}
              type='danger' text='立即购买' />
          </ActionBar>
        </div>
        <>
          <ShareSheet
            visible={visible}
            options={options}
            title='立即分享给好友'
            onCancel={() => setVisible(false)}
            onSelect={async ({ id, name }) => {
              plusReady(() => {
                plus.share.getServices((services) => {
                  services.forEach(item => {
                    serverList[item.id] = item
                  })
                  serverList[id].send({
                    type: 'web',
                    title: '浪&傻？！',
                    content: productInfo.storeName,
                    thumbs: productInfo.image,
                    href: 'http://119.3.122.213:9090/dome/shop_app/#/index/home',
                    extra: name === '朋友圈' ? {
                      scene: 'WXSceneTimeline'
                    } : ''
                  })
                })
              })
            }}
          />
        </>
        <Popup
          visible={visible2}
          closeable
          style={{ maxHeight: '70%' }}
          position='bottom'
          round
          onClose={() => setVisible2(false)}
        >
          <div className='pop-content'>
            <div className='pop-header'>
              <div className='left'>
                <img src={obj.image}></img>
              </div>
              <div className='right'>
                <p className='rit-name'>{obj.storeName}</p>
                <p className='rit-price'>￥{obj.price}</p>
                <p className='rit-stock'>库存:{obj.stock}</p>
              </div>
            </div>
            <div className='pop-info'>
              {productAttr.map((item, index) => <div key={index} className='popItem'>
                <div className='pop-name'>{item.attrName}:</div>
                <div className='pop-list'>
                  {item.attrValues.split(',').map((c, d) =>
                    <div key={d} className={(skuList[index] === d) ? 'pop-value active' : 'pop-value'}
                      onClick={() => {
                        //666
                        skuList[index] = d
                        // console.log(skuList);
                        setSkuList([...skuList])
                        let skname = []
                        // console.log(skuList);
                        skuList.forEach((item, index) => {
                          let attr = (productAttr[index].attrValues).split(',')[item]
                          skname.push(attr)
                        })
                        skname = skname.join(',')
                        // console.log(productValue[skname]);
                        setObj(productValue[skname])
                      }}
                    >{c}</div>)}
                </div>
              </div>)}
            </div>
            <Cell title='数量' center >
              <Stepper
                min={1}
                defaultValue={1}
                buttonSize='17px'
                theme='round'
                onOverlimit={() => console.log('overlimit')}
                // onMinus={() => console.log('minus')}
                // onPlus={() => console.log('plus')}
                onChange={value => {
                  console.log(value)
                  setNum(value)
                }}
              />
            </Cell>
            <div className='demo-action-bar'>
              <ActionBar>
                <ActionBar.Icon icon={<CartO />} badge={{ content: cartNum }} text='购物车'
                  onClick={() => {
                    navigate('/index/cart')
                  }}
                />
                <ActionBar.Icon icon={isShow ? <StarO /> : <Star color='red' />} text='收藏' onClick={() => {
                  Show()
                }} />
                <ActionBar.Button
                  onClick={async () => {
                    let { id, productId } = obj
                    // let id = productValue[skname].id
                    // let productId = productValue[skname].productId
                    let dataList = {
                      "cartNum": num,
                      "isNew": false,
                      "productAttrUnique": id,
                      "productId": productId
                    }
                    // console.log(dataList);
                    let res = await http('/cart/save', 'post', dataList)
                    let res2 = await http('/cart/count?numType=true&type=total')
                    if (res.data.code === 200) {
                      Toast.success('添加成功')
                      setVisible2(false)
                    } else {
                      Toast.fail('添加失败')
                    }
                    if (res2.data.code === 200) {
                      setCartNum(res2.data.data.count)
                    }
                  }}
                  type='warning' text='加入购物车' />
                <ActionBar.Button
                  type='danger' text='立即购买' onClick={async () => {
                    let { id, productId, price } = obj
                    let list = {
                      "orderDetails": [
                        {
                          "attrValueId": id,
                          "productId": productId,
                          "productNum": num
                        }
                      ],
                      "preOrderType": "buyNow"
                    }
                    let { data } = await http('/order/pre/order', 'post', list)
                    // console.log(data);
                    if (data.code === 200) {
                      navigate('/conorder', {
                        replace: true,
                        state: {
                          preOrderNo: data.data.preOrderNo,
                          totalPrice: price * num * 100
                        },
                      })
                    }
                  }} />
              </ActionBar>
            </div>
          </div>
        </Popup>

      </div >
    </Skeleton>

  )
}
export default memo(Info) 
