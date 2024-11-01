import React from "react";
import "./Gird.css";
import { Grid, Loading } from "react-vant";
import Lazyimg from "react-lazyimg-component";
export default function (props) {
  return (
    <div className="z-gird">
      <Grid columnNum={5} border={false} square={true}>
        {props.data.length > 0 &&
          props.data.map((item) => (
            <Grid.Item
              icon={
                <Lazyimg
                  className="lazy"
                  src={item.pic}
                  placeholder={<Loading type="spinner" />}
                />
              }
              key={item.id}
              text={item.name}
              style={{ fontSize: "12px" }}
            />
          ))}
        {props.data.length === 0 &&
          Array.from({ length: 10 }).map((item, index) => (
            <Grid.Item key={index} icon={<Loading type="spinner" />} />
          ))}
      </Grid>
    </div>
  );
}
