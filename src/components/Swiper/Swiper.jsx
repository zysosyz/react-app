import { Swiper, Image, Loading } from 'react-vant';
import './Swiper.css'
function Swip(props) {
    return (
        <div className='Swip'>
            {props.data.length > 0 && <Swiper autoplay={true} duration={400}>
                {props.data.map((item) => (
                    <Swiper.Item key={item.id}>
                        <Image
                            loadingIcon={<Loading type='spinner' />}
                            Lazyload={true}
                            src={item.pic}
                            height='165px'
                        />
                    </Swiper.Item>
                ))}

            </Swiper>}
            {
                props.data.length === 0 && <Image  loadingIcon={<Loading type='spinner' />} width='100%' height='165px' />
            }
        </div>
    )
}
export default Swip

