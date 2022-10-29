import { Dropdown, Menu, Space } from "antd";
import React from "react";
import { useNetwork } from "../hooks/useNetwokr";

function SwitchNetwork({ url }) {
  const { changeNetwork } = useNetwork();
  const menu = (
    <Menu
      selectable
      defaultSelectedKeys={[80001]}
      onClick={(key) => {
        console.log(key.key);
        changeNetwork(parseInt(key.key));
      }}
      items={[
        {
          label: <div>ETH</div>,
          key: 5,
        },
        {
          label: <div>Polygon</div>,
          key: 80001,
        },
        {
          label: <div>Binance</div>,
          key: 97,
        },
      ]}
    />
  );
  return (
    <div>
      {" "}
      <Dropdown overlay={menu} trigger={["click"]}>
        {/* <a
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          Click me
        </a> */}
        <img
          src={url}
          alt={"fhsdkjfhj"}
          width="30"
          style={{ margin: "0 20px" }}
        />
        {/* Click me */}
      </Dropdown>
    </div>
  );
}

export default SwitchNetwork;
