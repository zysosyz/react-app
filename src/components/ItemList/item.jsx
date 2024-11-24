import { useNavigate } from "react-router-dom";
import Lazyimg from "react-lazyimg-component";
import { Loading } from "react-vant";
import "./item.css";
const Item = (props) => {
  const { item, show } = props;

  const navigate = useNavigate();
  return (
    <div
      className="item"
      onClick={() => {
        navigate(`/info/${item.id}`);
      }}
    >
      <div className="list-img" style={{ minHeight: "375px" }}  >
        <Lazyimg
          src={item.image}
          placeholder={
            <Loading style={{ height: "100%" }} size={35} type="spinner" />
          }
        ></Lazyimg>
      </div>
      <div className="infor">
        <div className="name">{item.storeName}</div>
        {!show && <div className="oldprice">￥{item.otPrice}</div>}
        <div className="price">￥{item.price}</div>
        {show && <div>已售{item.sales + item.ficti}件</div>}
      </div>
    </div>
  );
};
export default Item;
