// Libraries
import { NextPage } from 'next';
import React, { useRef } from 'react';
import DatePicker from "react-datepicker";

type TProps = {
    dateSeleted?: any,
    minDate?: any,
    onChangeDate: (date: Date | null) => void,
}
export const InputDate: NextPage<TProps> = ({ dateSeleted, onChangeDate, minDate }) => {
  const datePickerRef = useRef<DatePicker | null>(null);
  
  const handleOpenDate = () => {
    if(datePickerRef.current) {
      datePickerRef.current.setOpen(true);
    }
  }

  return (
    <div className="flex items-center p-2 border rounded focus:outline-none h-[50px]">
      <DatePicker
        selected={dateSeleted}
        onChange={onChangeDate}
        className="mx--2 border-none focus:outline-none focus:shadow-none shadow-none"
        ref={datePickerRef}
        locale="en"
        minDate={minDate}
        dateFormat="dd/MM/yyyy"
        placeholderText='dd/mm/yyyy'
      />
      <span className="ml-2 mr-4 cursor-pointer" onClick={handleOpenDate}>
        <i className='far fa-calendar text-[#6f7287] text-[24px]' />
      </span>
    </div>
  );
}
