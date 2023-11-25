// Libraries
import { NextPage } from 'next';
import React, { ChangeEvent, useState } from 'react';


type TOptions = {
  label: string,
  value: string,
}

type TProps = {
    name?: string,
    value?: string,
    onChange?: (type:string, value:string[]) => void,
    rest?: any,
    selectedSkills: string[],
    optiosSkill: TOptions[],
    optiosTypeJob: TOptions[],
    selectedTypeJobs: string[],
    handleOnchangeSearchKey: (values: string[]) => void,
    listSearch: string[],
}
export const Filter: NextPage<TProps> = ({ listSearch, handleOnchangeSearchKey, onChange, selectedSkills, optiosSkill, optiosTypeJob, selectedTypeJobs}) => {
  const [search, setSearch] = useState('')

  const handleOnchangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }
  
  const handleOnchange = (type:string, value:string) => {
    if(onChange) {
      if(type === 'skill') {
        let result = [...selectedSkills]
        const isExisted = result?.find((item) => item === value)
        if(isExisted) {
          result = result.filter((item) => item !== value);
          onChange('skill', result)
        }else {
          onChange('skill', [...result, value])
        }
      }else if(type === 'typeJob') {
        let result = [...selectedTypeJobs]
        const isExisted = result?.find((item) => item === value)
        if(isExisted) {
          result = result.filter((item) => item !== value);
          onChange('typeJob', result)
        }else {
          onChange('typeJob', [...result, value])
        }
      }
    }
  }

  const handleKeyDownSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab' || e.key === 'Enter') {
      if(search?.trim() && !listSearch.includes(search?.trim())) {
        handleOnchangeSearchKey([...listSearch, search?.trim()])
        setSearch('')
      }
    }
  }

  const handleDeleteKeyWord = (key:string) => {
    if(listSearch.includes(key)) {
      const filterKeys = listSearch?.filter(item => item !== key)
      handleOnchangeSearchKey([...filterKeys])
    }
  }

  return (
    <div className="flex flex-col p-8 border-solid border-[#e7e7e9] border-[1px] rounded-md">
      <label htmlFor="filters" className="text-[16px] text-black font-medium mb-[10px] cursor-pointer">Filters</label>
      <input
        id="filters"
        value={search}
        className="outline-none focus:outline-none border-[2px] text-black border-[#e7e7e9] border-solid rounded-md py-[10px] px-4"
        placeholder="Company, skill, tag..."
        onChange={handleOnchangeSearch}
        onKeyDown={handleKeyDownSearch}
      />
      <div className={"flex gap-2 flex-wrap items-center" + (listSearch.length > 0 ? ' mt-2': ' mt-0')}>
        {listSearch?.map(((key) => {
          return (
            <span 
              key={key}
              className={`max-w-[200px] text-left border-[#2b6fdf] border-solid border-[1px] 
                overflow-hidden text-ellipsis whitespace-nowrap bg-[#e5eeff] px-2 py-1 rounded-[4px]`}
            >
              <span>{key}{' '}</span>
              <span onClick={() => handleDeleteKeyWord(key)}><i className="fas fa-times cursor-pointer text-[black] text-[14px]"></i></span>
            </span>
          )
        }))}
      </div>
      <div className="h-[1px] bg-[#e7e7e9] w-full my-6"></div>
      <label className="text-[16px] text-black font-medium mb-[10px]">Skills</label>
      <div className="flex flex-col gap-4">
        {optiosSkill?.map((opt) => {
          return (
            <div key={opt?.value} className="flex items-center gap-3">
              <input
                id={opt?.value}
                type="checkbox"
                className="h-5 w-5 outline-none focus:outline-none border-[1px] shadow cursor-pointer border-solid"
                style={{
                  boxShadow: 'none',
                  borderRadius: '4px',
                  color: '#3659e3',
                  borderColor: '#e7e7e9'
                }}
                checked={selectedSkills?.includes(opt?.value)}
                onChange={(e) => handleOnchange('skill', opt?.value)}
              />
              <label className="text-[14px] text-black cursor-pointer" htmlFor={opt?.value}>{opt?.label}</label>
            </div>
          )
        })}
      </div>
      <div className="h-[1px] bg-[#e7e7e9] w-full my-6"></div>
      {/* <label htmlFor="filters" className="text-[16px] text-black font-medium mb-[10px] cursor-pointer">Locations</label>
      <input
        id="filters"
        className="outline-none focus:outline-none border-[2px] border-[#e7e7e9] text-black border-solid rounded-md py-[10px] px-4"
        placeholder="Enter location..."
      /> */}
      {/* <div className="flex items-center gap-3 mt-3">
        <input
          id="remote"
          type="checkbox"
          className="h-5 w-5 outline-none focus:outline-none border-[1px] shadow cursor-pointer border-solid"
          placeholder="Company, skill, tag..."
          style={{
            boxShadow: 'none',
            borderRadius: '4px',
            color: '#3659e3',
            borderColor: '#e7e7e9'
          }}
        />
        <label className="text-[14px] text-black cursor-pointer" htmlFor="remote">Open to remote</label>
      </div> */}
      {/* <div className="h-[1px] bg-[#e7e7e9] w-full my-6"></div> */}
      <div className="flex flex-col gap-4">
        {optiosTypeJob?.map((opt) => {
          return (
            <div className="flex items-center gap-3" key={opt?.value}>
              <input
                id={opt?.value}
                type="checkbox"
                className="h-5 w-5 outline-none focus:outline-none border-[1px] shadow cursor-pointer border-solid"
                style={{
                  boxShadow: 'none',
                  borderRadius: '4px',
                  color: '#3659e3',
                  borderColor: '#e7e7e9'
                }}
                checked={selectedTypeJobs?.includes(opt?.value)}
                onChange={(e) => handleOnchange('typeJob', opt?.value)}
              />
              <label className="text-[14px] text-black cursor-pointer" htmlFor={opt?.value} >{opt?.label}</label>
            </div>
          )
        })}
      </div>
      {/* <Button
        classBtn="h-[40px] whitespace-nowrap w-auto bg-[#2b6fdf] text-white rounded-md px-4 font-medium mt-8"
        textBtn="Filter"
      /> */}
    </div>
  );
}
