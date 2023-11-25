import { NextPage } from "next";
import React from "react";

type TProps = {
    classIcon?: string
}
const Icon: NextPage<TProps> = ({ classIcon }) => {

  return (
    <span className="bg-[#f8f7fa] h-[40px] w-[40px] flex items-center justify-center rounded-md">
      <i className={classIcon}></i>
    </span>
  )
}

export default Icon;
