// Libraries
import { NextPage } from 'next';
import React from 'react';

type TProps = {
    iconBtn?: string,
    textBtn?: string,
    classBtn?: string,
    disabled?: boolean,
    onClick?: (e:any) => void,
    styleBtn?: React.CSSProperties,
    rest?: any,
}
export const Button: NextPage<TProps> = ({ iconBtn, textBtn, classBtn, disabled, styleBtn, ...rests }) => {

  return (
    <button
      style={{
        backgroundColor: Boolean(disabled) ? '#eeedf2' : '',
        color: Boolean(disabled) ? '#a9a8b3' : '',
        cursor: Boolean(disabled) ? 'not-allowed' : 'pointer',
        ...styleBtn,
      }}
      disabled={Boolean(disabled)}
      className={classBtn}
      {...rests}
    >{iconBtn && <i className={iconBtn} />} <span>{textBtn && textBtn}</span></button>
  );
}
