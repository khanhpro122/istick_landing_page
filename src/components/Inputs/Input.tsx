// Libraries
import { NextPage } from 'next';
import React, { ChangeEvent, useState, useRef } from 'react';

// Hooks
import { useDebounce, useUpdateEffect } from '@/hooks';

type TProps = {
    type?: string,
    name?: string,
    placeholder?: string,
    value?: string,
    disabled?: boolean,
    className?: string,
    onChange?: (type:string, value:string) => void,
    rest?: any,
    errorText?: string,
    id?: string,
    styleInput?: React.CSSProperties
}
export const Input: NextPage<TProps> = ({ type, placeholder, value, disabled, className, onChange, name, errorText, id, styleInput, ...rest}) => {
  const [isFocused, setIsFocused] = useState(false)
 
  const handleOnBlur = () => {
    setIsFocused(true)
  }
  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    // setValueInput(e.target.value)
    onChange && onChange(name || '', e.target.value)
  }
  
  return (
    <div className="flex flex-col gap-[2px]">
      <input
        name={name}
        type={type}
        id={id}
        className={className}
        style={{
          border: errorText && isFocused ? '2px solid red' : '',
          boxShadow: errorText && isFocused ? 'none' : '',
          ...styleInput
        }}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChangeInput(e)}
        disabled={disabled}
        onBlur={handleOnBlur}
      />
      {isFocused && (
        <div className="text-[red] text-[12px]">{errorText}</div>
      )}
    </div>
  );
}
