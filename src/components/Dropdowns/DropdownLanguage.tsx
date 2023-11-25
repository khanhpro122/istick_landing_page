// Libraries
import React, { useRef } from 'react';
import { createPopper } from '@popperjs/core';
import { NextPage } from 'next';

type typeTProps = {
    placement?: 'bottom' | 'bottom-start' | 'bottom-end' | 'top' | 'top-start' | 'top-end' | 'right' | 'right-start' | 'right-end'
}
const DropdownLanguage:NextPage<typeTProps> = (props) => {
  const {placement = 'bottom-start' } = props
  // dropdown props
  const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
  const btnDropdownRef = useRef<any>();
  const popoverDropdownRef = useRef<any>();;
  const openDropdownPopover = () => {
    if(btnDropdownRef.current && popoverDropdownRef.current) {
      createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
        placement: placement,
      });
      setDropdownPopoverShow(true);
    }
  };
  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };
  return (
    <>
      <a
        className='hover:text-blueGray-500 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold'
        href='#pablo'
        ref={btnDropdownRef}
        onClick={(e) => {
          e.preventDefault();
          dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
        }}
      >
        Demo Pages
      </a>
      <div
        ref={popoverDropdownRef}
        className={
          (dropdownPopoverShow ? 'block ' : 'hidden ') +
          'bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48'
        }
      >
        <div
          className={
            'text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700'
          }
        >
          Profile
        </div>
      </div>
    </>
  );
};

export default DropdownLanguage;
