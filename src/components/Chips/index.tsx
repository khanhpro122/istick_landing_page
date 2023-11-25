// Libraries
import { NextPage } from 'next';
import React, { Fragment, useEffect, useState } from 'react';

// Components
import { Button } from '../Buttons/Button';
import { Input } from '../Inputs/Input';

// Utils
import { convertStringToObject } from '@/utils';
import { toast } from 'react-toastify';

type TOption = {
  label: string,
  value: string
}
type TProps = {
  options?: TOption[],
  optionsSelected: string[],
  onChange?: (opts: string[]) => void,
  isNoAddMore?: boolean,
  isValue?: boolean
}

const Chips: NextPage<TProps> = ({ options, optionsSelected, onChange, isNoAddMore, isValue }) => {

  const [optionsState, setOptionsState] = useState<TOption[] | undefined>(options)
  const [name, setName] = useState('')
  const [isError,setIsError] = useState('')
  const [isAddMore, setIsAddMore] = useState(false)
  
  const handleChangeName = (name:string, value:string) => {
    setIsError('')
    setName(value)
  }

  const handleAddMore = () => {
    const isCheckExist = optionsState?.find((opt) => opt?.label?.trim()?.toLowerCase() === name?.trim()?.toLowerCase())
    if(isCheckExist?.label) {
      setIsError('The text is already')
    }else {
      const newOpt = convertStringToObject(name?.trim())
      if(newOpt.label && optionsState) {
        setOptionsState([...optionsState, newOpt])
        handleSelected(newOpt.value)
        setName('')
      }
    }
    setIsAddMore(false)
  }

  const handleSelected = (opt:string) => {
    let newOptSelected = []
    if(optionsSelected?.includes(opt)) {
      newOptSelected = optionsSelected.filter((ele) => ele !== opt)
    }else {
      newOptSelected = [...optionsSelected, opt]
    }
    if(onChange) {
      onChange(newOptSelected)
    }
  }

  useEffect(() => {
    if(isError) {
      toast.error(isError)
      setIsError("")
      setName("")
    }
  }, [isError])

  useEffect(() => {
    setOptionsState(options)
  }, [options])

  return (
    <Fragment>
      <div className="flex gap-4 flex-wrap items-center">
        {optionsState?.map((opt) => {
          return (
            <span 
              key={opt?.value} 
              className={(optionsSelected?.includes(opt?.value) ? 'bg-[#2b6fdf] text-white' 
                : 'bg-transparent border-[1px] border-solid border-[#6f7287] text-[#6f7287]') + 
                " text-sm h-[30px] font-medium cursor-pointer px-2 py-1 rounded-[20px] "
              }
              onClick={() => handleSelected(opt?.value)}
            >
              {opt.label}{' '}
              {optionsSelected?.includes(opt?.value) ? (
                <i className="fas fa-check text-[12px]"></i>
              ): (
                <i className="fas fa-plus text-[12px]"></i> 
              )}
            </span>
          )
        })}
        {isAddMore && (
          <>
            <Input
              type='text'
              className='mr-4 max-w-[130px] h-[30px] rounded-[20px] bg-transparent px-3 font-medium outline-[none] border-none focus:outline-none text-black'
              placeholder='Enter new key'
              styleInput={{
                borderColor: '#e4e4e7',
                borderRadius: '20px'
              }}
              value={name}
              onChange={handleChangeName}
              errorText={isError}
            />
            <Button
              textBtn="Apply"
              onClick={handleAddMore}
              classBtn="mr-4 h-[30px] bg-[#2b6fdf] rounded-[20px] px-3 font-medium outline-[none] border-none focus:outline-none text-white"
            />
          </>
        )}
        {!isAddMore && !isNoAddMore && (
          <Button 
            classBtn="mr-4 h-[30px] bg-[#2b6fdf] rounded-[20px] px-3 font-medium outline-[none] border-none focus:outline-none text-white"
            textBtn='Add more'
            iconBtn="fas fa-plus text-[12px]"
            onClick={() => setIsAddMore(true)}
          />
        )}
      </div>
    </Fragment>
  );
}

export default Chips