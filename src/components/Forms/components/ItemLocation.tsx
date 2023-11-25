// Libraries
import { NextPage } from "next";
import React, { useEffect, useState } from "react";

// Services
import * as ServiceAuth from "@/services/auth";
import * as ServiceSystem from '@/services/system'

// Components
import Dropdown from "@/components/Dropdowns/Dropdown";
import { Input } from "@/components/Inputs/Input";

type TProps = {
  companyAddresses: any[];
  onChangeOptionLocation?: (value: string, type: string, id: any) => void;
  handleClearOptionLocation?: (id: any) => void;
  item: any;
};
export const ItemLocation: NextPage<TProps> = ({
  onChangeOptionLocation,
  handleClearOptionLocation,
  item,
  companyAddresses
}) => {
  const [listCountries, setListCountries] = useState([]);
  const [listCities, setListCities] = useState([])
  
  const fetchListCountries = async () => {
    const res = await ServiceSystem.getListCountry(1, 10);
    setListCountries(
      res?.data?.list?.map((item: any) => ({
        label: item?.name,
        value: item?.id,
      }))
    );
  };

  const fetchListCities = async (countryId: any) => {
    const res = await ServiceSystem.getListCities(countryId)
    setListCities(
      res?.data?.list?.map((item: any) => ({
        label: item?.name,
        value: item?.id,
      }))
    );
  };

  useEffect(() => {
    fetchListCountries()
  }, [])

  useEffect(() => {
    fetchListCities(item?.countryId)
  }, [item?.countryId])

  return (
    <div className="flex item-center" key={item?.id}>
      <div className="w-[100px]">
        <Dropdown
          options={listCountries}
          mode="light"
          value={item?.countryId || 1}
          heightBtn={"h-[46px]"}
          onChange={(value) => onChangeOptionLocation && onChangeOptionLocation(value, 'countryId' , item.id)}
          isShowIcon={false}
          disabledOption={[2, 3]}
        />
      </div>
      <div className="w-[120px]">
        <Dropdown
          options={listCities}
          mode="light"
          value={item?.cityId || 1}
          heightBtn={"h-[46px]"}
          onChange={(value) => onChangeOptionLocation && onChangeOptionLocation(value, 'cityId' , item.id)}
          isShowIcon={false}
          disabledOption={[]}
        />
      </div>
      <div className="flex-1">
        <Input
          name="address"
          type="text"
          id="address"
          className="border-1 px-3 py-3 placeholder-blueGray-300 text-[#000] bg-white rounded text-sm shadow focus:shadow outline-none focus:outline-none w-full ease-linear transition-all duration-150"
          placeholder="Enter your address"
          styleInput={{
            borderColor: "#e4e4e7",
          }}
          value={item?.address}
          onChange={(name: any, value: string) => onChangeOptionLocation && onChangeOptionLocation(value, name , item.id)}
          // errorText={memoValidate ? memoValidate.phoneNumber : ''}
        />
      </div>
      {companyAddresses?.length > 1 && (
        <span onClick={() => handleClearOptionLocation && handleClearOptionLocation(item?.id)} className="text-[#3659e3] cursor-pointer ml-4 leading-[46px]"><i className="far fa-times-circle"></i></span>
      )}
    </div>
  );
};
