// Libraries
import { NextPage } from "next";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

// Services
import * as ServiceAuth from "@/services/auth";
import * as ServiceSystem from '@/services/system'

// Components
import Editor from "../Editors";
import DropdownCheckbox from "../Dropdowns/DropdownCheckbox";
import { Input } from "../Inputs/Input";
import { Button } from "../Buttons/Button";
import { Loading } from "../Loading/Loading";
import { ItemLocation } from "./components/ItemLocation";

// Contants
import { COMPANY_TYPES } from "../contants";

// Utils
import { findMaxId, generateString } from "@/utils";

type TProps = {
  avatar: string | null;
  culture: string;
  companyTypes: string[];
  overview: string;
  description: string;
  name: string;
  country: string;
  workingDays: string;
  website: string;
  companyAddresses: any[];
  onChange?: (type: string, value: any) => void;
  companySizeTo: string;
  companySizeFrom: string;
  mode?: string;
};
export const FormCompany: NextPage<TProps> = ({
  mode,
  avatar,
  culture,
  overview,
  description,
  onChange,
  companyTypes,
  name,
  companyAddresses,
  website,
  workingDays,
  companySizeTo,
  companySizeFrom,
}) => {
  const refInputFile = useRef<null | HTMLInputElement>(null);
  const uploadFile = async (data: any) => {
    const res = await ServiceAuth.uploadFile(data);
    return res.data;
  };

  const [companyTypeOptions, setCompanyTypeOptions] = useState(COMPANY_TYPES);

  const mutationUpdateAvatar = useMutation(["updateAvatar"], uploadFile);
  const { isLoading } = mutationUpdateAvatar;
  const handleOnchangeEditor = (type: string, value: string) => {
    if (onChange) {
      onChange(type, value);
    }
  };

  const handleClickBtnFile = () => {
    if (refInputFile.current) {
      refInputFile.current.click();
    }
  };

  const handleOnchangeAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedImage = e.target.files?.[0];
    if (selectedImage) {
      const formData = new FormData();
      formData.append(`${"key1"}.data`, selectedImage);
      formData.append(`${"key1"}.name`, selectedImage?.name);
      formData.append(`${"key1"}.is_public`, "true");
      mutationUpdateAvatar.mutate(formData, {
        onSuccess: (data: any) => {
          if (onChange) {
            onChange("avatar", data?.urls[0]?.url);
          }
        },
        onError: () => {
          toast.error("Update avatar is failed, Please try again!", {
            position: toast.POSITION.BOTTOM_LEFT,
          });
        },
      });
    }
  };

  const handleDeleteAvatar = () => {
    if (onChange) {
      onChange("avatar", null);
    }
    if (refInputFile.current) {
      refInputFile.current.value = "";
    }
  };

  const handleOnchangeCompanyType = (type: string[]) => {
    if (onChange) {
      onChange("companyTypes", type);
    }
  };

  const handleAddNewOption = (type: string, value: string) => {
    switch (type) {
    case "companyTypes": {
      const isExisted = companyTypeOptions?.find(
        (item: any) => item?.label?.toLowerCase() === value?.toLowerCase()
      );
      if (!isExisted) {
        setCompanyTypeOptions([
          ...companyTypeOptions,
          { value: value, label: value },
        ]);
        onChange && onChange("companyTypes", [...companyTypes, value]);
      } else {
        toast.error("The word is already!", {
          position: toast.POSITION.BOTTOM_LEFT,
        });
      }
      break;
    }
    default:
      return;
    }
  };

  const handleAddMoreLocation = () => {
    const newId = findMaxId(companyAddresses)
    const newOptions = {
      id: newId + 1,
      address: '',
      mapAddress: '',
      cityId: 1,
      countryId: 1
    }
    if(onChange) {
      onChange('companyAddresses', [...companyAddresses, newOptions])
    }
  }

  const handleClearOptionLocation = (id: string) => {
    const newOptions = companyAddresses?.filter((item) => item.id !== id)
    if(onChange) {
      onChange('companyAddresses', newOptions)
    }
  }

  const onChangeOptionLocation = (value: string, type:string , id: string) => {
    const cloneData = [...companyAddresses]
    const findOption:any = cloneData?.find((item:any) => item?.id === id)
    if(findOption && type) {
      findOption[type] = value
    }
    if(onChange) {
      onChange('companyAddresses', cloneData)
    }
  }

  return (
    <div className="flex gap-4 md:gap-8 lg:gap-4 flex-col w-full">
      <Loading isLoading={isLoading} />
      <h1 className="text-[#2b6fdf] text-[24px] font-bold text-center">
        {mode !== "edit" ? "Create new " : "Edit a "} company
      </h1>
      <div className="flex flex-col justify-center items-center gap-1 md:w-auto w-[100%]">
        <Image
          src={avatar || ''}
          alt="profile"
          placeholder="blur"
          blurDataURL={"@/public/img/placeholder.png"}
          className="align-middle border-none max-w-full w-[160px] rounded-[50%] object-cover h-[160px]"
          width={0}
          height={0}
          sizes="100vw"
        />
        <div className="flex items-center gap-8">
          <input
            ref={refInputFile}
            type="file"
            accept="image/*"
            onChange={handleOnchangeAvatar}
            className="hidden"
          />
          <Button
            classBtn="h-[30px] w-auto text-[#414042] focus:outline-none"
            iconBtn="fas fa-camera text-[24px] text-[#3659e3]"
            textBtn="Edit"
            onClick={handleClickBtnFile}
          />
          {avatar && (
            <Button
              classBtn="h-[30px] w-auto text-[#414042] focus:outline-none"
              iconBtn="fas fa-trash-alt text-[16px] text-[#ed1b2f]"
              textBtn="Delete"
              onClick={handleDeleteAvatar}
            />
          )}
        </div>
      </div>
      <div className="flex-1">
        <div className="px-2 md:px-4">
          <div className="flex items-center lg:gap-4 flex-col lg:flex-row">
            <div className="w-full mb-6">
              <label
                className="block uppercase text-[#000] text-xs font-bold mb-2"
                htmlFor="name"
              >
                Your name&lsquo;s company <span className='text-[red]'> *</span>
              </label>
              <Input
                name="name"
                id="name"
                type="text"
                className="border-1 px-3 py-3 placeholder-blueGray-300 text-[#000] bg-white rounded text-sm shadow outline-none focus:outline-none w-full ease-linear transition-all duration-150"
                placeholder="Enter your name's company"
                styleInput={{
                  borderColor: "#e4e4e7",
                }}
                value={name}
                onChange={onChange}
                // errorText={memoValidate ? memoValidate.email : ''}
              />
            </div>
          </div>
          {/* companyAddresses */}
          <div className="w-full mb-6">
            <label
              className="block uppercase text-[#000] text-xs font-bold mb-2"
              htmlFor="address"
            >
              Location <span className='text-[red]'> *</span>
            </label>
            <div className="flex flex-col gap-4">
              {companyAddresses?.map((item, index) => {
                return (
                  <ItemLocation item={item} companyAddresses={companyAddresses} key={item?.id} onChangeOptionLocation={onChangeOptionLocation} handleClearOptionLocation={handleClearOptionLocation} />
                )
              })}
            </div>
            <Button
              classBtn="h-[30px] w-auto text-[#3659e3] focus:outline-none mt-2"
              iconBtn="fas fa-plus text-[14px] text-[#3659e3]"
              textBtn="Add new location"
              onClick={handleAddMoreLocation}
            />
          </div>
          <div className="flex flex-col lg:flex-row items-center lg:gap-4">
            <div className="w-full mb-6">
              <label
                className="block uppercase text-[#000] text-xs font-bold mb-2"
                htmlFor="website"
              >
                Website <span className='text-[red]'> *</span>
              </label>
              <Input
                name="website"
                type="text"
                id="website"
                className="border-1 px-3 py-3 placeholder-blueGray-300 text-[#000] bg-white rounded text-sm shadow focus:shadow outline-none focus:outline-none w-full ease-linear transition-all duration-150"
                placeholder="Enter your website"
                styleInput={{
                  borderColor: "#e4e4e7",
                }}
                value={website}
                onChange={onChange}
                // errorText={memoValidate ? memoValidate.phoneNumber : ''}
              />
            </div>
          </div>
          <div className="flex flex-col lg:flex-row items-center lg:gap-4">
            <div className="w-full mb-6">
              <label className="block uppercase text-[#000] text-xs font-bold mb-2">
                Company type <span className='text-[red]'> *</span>
              </label>
              <DropdownCheckbox
                options={companyTypeOptions}
                label="Select your company type"
                value={companyTypes}
                onChange={handleOnchangeCompanyType}
                heightBtn={"h-[50px]"}
                handleAddNewOption={handleAddNewOption}
                type="companyTypes"
                isShowSearch
              />
            </div>
            <div className="w-full mb-6">
              <label
                className="block uppercase text-[#000] text-xs font-bold mb-2"
                htmlFor="workingDays"
              >
                Working days <span className='text-[red]'> *</span>
              </label>
              <Input
                name="workingDays"
                type="text"
                id="workingDays"
                className="border-1 px-3 py-3 placeholder-blueGray-300 text-[#000] bg-white rounded text-sm shadow focus:shadow outline-none focus:outline-none w-full ease-linear transition-all duration-150"
                placeholder="Enter your working day"
                styleInput={{
                  borderColor: "#e4e4e7",
                }}
                value={workingDays}
                onChange={onChange}
                // errorText={memoValidate ? memoValidate.phoneNumber : ''}
              />
            </div>
          </div>
          <div className="flex flex-col lg:flex-row items-center lg:gap-4">
            <div className="w-full mb-6">
              <label className="block uppercase text-[#000] text-xs font-bold mb-2">
                Company size from <span className='text-[red]'> *</span>
              </label>
              <Input
                name="companySizeFrom"
                type="number"
                id="companySizeFrom"
                className="border-1 px-3 py-3 placeholder-blueGray-300 text-[#000] bg-white rounded text-sm shadow focus:shadow outline-none focus:outline-none w-full ease-linear transition-all duration-150"
                placeholder="Enter your company size from"
                styleInput={{
                  borderColor: "#e4e4e7",
                }}
                value={companySizeFrom}
                onChange={onChange}
                // errorText={memoValidate ? memoValidate.phoneNumber : ''}
              />
            </div>
            <div className="w-full mb-6">
              <label
                className="block uppercase text-[#000] text-xs font-bold mb-2"
                htmlFor="dayWorking"
              >
                Company size to <span className='text-[red]'> *</span>
              </label>
              <Input
                name="companySizeTo"
                type="number"
                id="companySizeTo"
                className="border-1 px-3 py-3 placeholder-blueGray-300 text-[#000] bg-white rounded text-sm shadow focus:shadow outline-none focus:outline-none w-full ease-linear transition-all duration-150"
                placeholder="Enter your company size to"
                styleInput={{
                  borderColor: "#e4e4e7",
                }}
                value={companySizeTo}
                onChange={onChange}
                // errorText={memoValidate ? memoValidate.phoneNumber : ''}
              />
            </div>
          </div>
          <div className="w-full mb-6">
            <label className="block uppercase text-[#000] text-xs font-bold mb-2">
              Overview <span className='text-[red]'> *</span>
            </label>
            <Editor
              value={overview}
              onChange={(value: string) =>
                handleOnchangeEditor("overview", value)
              }
              placeholder="Enter your overview..."
            />
          </div>
          <div className="w-full mb-6">
            <label className="block uppercase text-[#000] text-xs font-bold mb-2">
              Description <span className='text-[red]'> *</span>
            </label>
            <Editor
              value={description}
              onChange={(value: string) =>
                handleOnchangeEditor("description", value)
              }
              placeholder="Enter your description..."
            />
          </div>
          <div className="w-full mb-6">
            <label className="block uppercase text-[#000] text-xs font-bold mb-2">
              Why you will love working here <span className='text-[red]'> *</span>
            </label>
            <Editor
              value={culture}
              onChange={(value: string) =>
                handleOnchangeEditor("culture", value)
              }
              placeholder="Enter your reason working..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};
