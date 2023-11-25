// Libraries
import { useUpdateEffect } from '@/hooks';
import { NextPage } from 'next';
import React, { ChangeEvent, useRef, useState } from 'react';

type TProps = {
    type?: string,
    name?: string,
    placeholder?: string,
    value?: string,
    disabled?: boolean,
    className?: string,
    onChange?: (value:string) => void,
    onHandleAddOption?: (value: string) => void,
    rest?: any,
    errorText?: string,
    setFocusInput?:React.Dispatch<React.SetStateAction<boolean>>,
    classIcon?: string,
    isFull?: boolean,
    borderColorSearch?: string,
    isAdd?: boolean,
}
export const InputSearch: NextPage<TProps> = ({ type, placeholder, value, disabled, className, onChange, 
  name, errorText, setFocusInput, classIcon, isFull, borderColorSearch, isAdd, onHandleAddOption }) => {
  const [isFocus, setIsFocus] = useState(false)
  const refInput = useRef<HTMLInputElement>(null)

  useUpdateEffect(() => {
    if(setFocusInput) {
      setFocusInput(isFocus)
    }
  }, [isFocus])

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    onChange && onChange(e.target.value)
  }

  const handleFocus = () => {
    setIsFocus(true)
    if(refInput.current) {
      refInput.current.focus()
    }
  }
 
  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab' || e.key === 'Enter') {
      if(isAdd && onHandleAddOption && value?.trim()) {
        onHandleAddOption(value.trim())
      }
    }
  }

  return (
    <div className={
      "h-[50px] px-5 md:px-4 lg:h-auto flex items-center border-solid border-[1px] rounded-md ease-linear transition-all duration-150" + 
        (isFocus ? 'w-full md:w-auto' : 'w-auto') + (` border-[${borderColorSearch || '#313541'}]`)
    }>
      <span onClick={handleFocus}>
        <i 
          className={`fas fa-search ${classIcon}` + (
            isFocus ? 'text-[16px]' : 'text-[14px] lg:text-[12px]'
          )}  
        ></i>
      </span>
      <input
        name={name}
        type={type}
        ref={refInput}
        className={className + (isFocus ? ' w-full px-2' : `${isFull ? 'w-full' : ' w-[0px] '} md:w-full px-[0px] md:px-2`)}
        style={{
          border: errorText ? '2px solid red' : 'unset',
          boxShadow: errorText ? 'none' : 'unset',
        }}
        placeholder={placeholder}
        value={value}
        onFocus={() => setIsFocus(true)} 
        onBlur={() => setIsFocus(false)}
        onChange={(e) => onChangeInput(e)}
        disabled={disabled}
        onKeyDown={handleOnKeyDown}
      />
      {isFocus && (
        <span onClick={() => setIsFocus(false)}><i className="fas fa-times text-white text-[14px] cursor-pointer"></i></span>
      )}
    </div>
  );
}
