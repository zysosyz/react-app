import React, { useState } from 'react'
import './Gooditem.css'
function Gooditem(props) {
    const [activeIndex, setIndex] = useState(0)
    // const div = document.querySelector('.somelist')

    return (
        <div className='gooditem'>
            {props.data.map((item, index) =>
                <div className='gooditem_con' key={item.id} onClick={() => {
                    // console.log(div.getBoundingClientRect().top);
                    // console.log(div.offsetTop - 60);
                    // // const div = document.querySelector('.somelist')
                    // if (div.getBoundingClientRect().top < 0) {
                    //     //     console.log(div.offsetTop - div.getBoundingClientRect().top);
                    //     //     window.scrollTo(0, (div.offsetTop - div.getBoundingClientRect().top))
                    //     // } else {
                    //     window.scrollTo(0, div.offsetTop - 60)
                    // }
                    setIndex(index)
                    props.sendIndex(index)
                }}>
                    <div className={activeIndex === index ? 'name active2' : 'name'}>{item.name}</div>
                    <div className={activeIndex === index ? 'good-info active1' : 'good-info'}>{item.info}</div>
                </div>
            )}
        </div>
    )
}

export default Gooditem
