// Libraries
import React, {useEffect, useMemo, useRef} from 'react';
import { createPopper, Instance } from '@popperjs/core';
import { NextPage } from 'next';
import Image from 'next/image';

type TOptions = {
  label?:string,
  value?:string | number,
  url?: string,
}

type TProps = {
  options?: TOptions[],
  value?: string | number,
  onChange?: (type: string) => void,
  mode: 'light' | 'dark',
  label?:string;
  heightBtn?: string,
  isShowIcon?: boolean,
  isShowImage?: boolean,
  disabledOption?: any[],
}

const Dropdown:NextPage<TProps> = ({options, value, onChange, mode, label, heightBtn, isShowIcon = true, isShowImage, disabledOption}) => {
  // dropdown props

  const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
  const btnDropdownRef = useRef<HTMLButtonElement>(null);
  const popoverDropdownRef = useRef<HTMLDivElement>(null);
  const memoLabel = useMemo(() => {
    const optionSelected = options?.find((opt) => opt.value === value)
    if(optionSelected?.label && !isShowImage) {
      return optionSelected?.label
    }else if(optionSelected?.value && isShowImage) {
      return optionSelected?.url
    }
    return label || 'Select a field'
  }, [options, label, value])
  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (
        dropdownPopoverShow &&
        popoverDropdownRef.current &&
        !popoverDropdownRef.current.contains(event.target as Node) &&
        !btnDropdownRef.current?.contains(event.target as Node)
      ) {
        setDropdownPopoverShow(false);
      }
    };

    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [dropdownPopoverShow]);
 
  const handleDropdownToggle = () => {
    if(btnDropdownRef.current && popoverDropdownRef.current) {
      createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
        placement: "bottom-start",
        strategy: 'fixed'
      });
      setDropdownPopoverShow(true);
    }
  };

  const handleOnchange = (type: any) => {
    if(onChange && !disabledOption?.includes(type) && type) {
      onChange(type || '')
      setDropdownPopoverShow(false);
    }
  }

  return (
    <>
      <button 
        className={(heightBtn ? heightBtn : 'h-[50px] ') + (mode === 'light' ? ' bg-white text-black' : ' bg-[#171721] border-[#313541] text-white') + ` px-3 py-4 w-full lg:py-2 gap-2 md:gap-6 flex items-center rounded-md
        justify-between border-[1px]  border-solid text-[14px] font-medium focus:outline-none`}
        ref={btnDropdownRef}
        onClick={handleDropdownToggle}
      >
        {isShowImage ? (
          <div>
            <Image
              src={memoLabel || "/img/user-default.png"}
              alt='profile'
              placeholder='blur'
              blurDataURL={'@/public/img/placeholder.png'}
              className='align-middle border-none max-w-full w-[40px] object-cover h-[40px]'
              width={0}
              height={0}
              sizes="100vw"
            />
          </div>
        ) : (
          <>
            <span className="max-w-[200px] text-left md:max-w-[400px] min-w=[unset] md:min-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap">{memoLabel}</span>
            {isShowIcon && <span><i className="fas fa-chevron-down"></i></span>}
          </>
        )}
      </button>
      <div
        ref={popoverDropdownRef}
        className={
          (dropdownPopoverShow ? 'block ' : 'hidden ') +
          (!isShowImage ? ' my-2 ' : ' ') + 
          (mode === 'light' ? 'bg-white text-black' : 'bg-[#171721] border-[#313541] text-white') + 
          ' text-base z-50 float-left list-none text-left border-solid border-[1px] shadow-lg rounded-md'
        }
        style={{
          width: btnDropdownRef.current ? btnDropdownRef.current.clientWidth : '300px'
        }}
      >
        {options?.map((option) => {
          return (
            <div className={!isShowImage ? "mx-2" : ""} key={option?.value} onClick={() => handleOnchange(option?.value || '')}>
              {isShowImage ? (
                <div className={
                  value === option?.value ? 'bg-[#2b6fdf]' : '' +
                  ' flex items-center justify-center cursor-pointer bg-[#cfebfc] hover:bg-[#3eaef4] py-1'}
                >
                  <Image
                    src={option?.url || "/img/user-default.png"}
                    alt='profile'
                    placeholder='blur'
                    blurDataURL={'@/public/img/placeholder.png'}
                    className='align-middle rounded-[50%] object-cover w-[30px] h-[30px]'
                    width={0}
                    height={0}
                  />
                </div>
              ) : (
                <span
                  className={
                    'text-sm py-2 px-2 rounded-md font-normal block w-full whitespace-nowrap cursor-pointer' +
                    (mode === 'light' ? ' text-black' : 'text-white') + 
                    (value === option?.value ? mode === 'dark' ? ' bg-[#45454d] text-white' 
                      : ' bg-[#2b6fdf] text-white uppercase' : ' bg-transparent text-[#8b8b90]')
                  }
                  style={{
                    cursor: disabledOption?.includes(option?.value) ? 'not-allowed' : 'pointer'
                  }}
                >
                  <span>{option?.label}</span>
                </span>
              )}
            </div>
          )
        })}
      </div>
    </>
  );
};

export default Dropdown;
