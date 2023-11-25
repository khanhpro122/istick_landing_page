// Libraries
import { NextPage } from 'next';
import React, { useState } from 'react';

type TProps = {
    question?: string,
    answer?: string,
}
export const ButtonQuestion: NextPage<TProps> = ({ question, answer }) => {
  const [isShow, setIsShow] = useState(false)
  return (
    <div className="border-b-[1px] border-b-[#EEEDF2] border-b-solid" style={{paddingBottom: isShow? '22px' : '0'}}>
      <div 
        className="flex items-center justify-between h-[68px] px-4 py-[22px] cursor-pointer"
        onClick={() => setIsShow(!isShow)}
      >
        <span>{question}</span>
        {isShow ? (
          <span><i className="fas fa-angle-down"></i></span>
        ) : (
          <span><i className="fas fa-angle-up"></i></span>
        )}
      </div>
      {isShow && (
        <p className="text-black py-[22px] px-4 w-full h-full inline-block rounded-lg text-blueGray-500 bg-[#f8f7fa]">
          {answer}
        </p>
      )}
    </div>
  );
}

