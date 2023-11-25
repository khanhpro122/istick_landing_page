// Libraries
import { NextPage } from "next";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

// Services
import * as ServiceAuth from "@/services/auth";
import * as ServiceSystem from "@/services/system";
import * as ServiceCompany from "@/services/company";

// Components
import Editor from "../Editors";
import DropdownCheckbox from "../Dropdowns/DropdownCheckbox";
import { Input } from "../Inputs/Input";
import { Button } from "../Buttons/Button";
import DropdownRadio from "../Dropdowns/DropdownRadio";
import { Loading } from "../Loading/Loading";
import Dropdown from "../Dropdowns/Dropdown";

// Utils
import { checkAndConvertValue, validateEmpty } from "@/utils";

// Contants
import { JOB_TYPES, LEVELS, SKILLS } from "../contants";
import { InputDate } from "../Inputs/InputDate";

type TProps = {
  jobTypes: string[];
  avatar?: string | null;
  description: string;
  skills: string[];
  qualification: string;
  overview: string;
  name: string;
  position: string;
  workingDays: string;
  website: string;
  companyAddressId: any;
  onChange?: (type: string, value: any) => void;
  salaryFrom: string;
  salaryTo: string;
  levelIds: string[];
  currencyId?: number;
  mode?: string;
  optionAddress: any,
  deadline: any,
  companyId: any,
};
export const FormPostJob: NextPage<TProps> = ({
  jobTypes,
  mode,
  description,
  skills,
  levelIds,
  qualification,
  overview,
  onChange,
  salaryFrom,
  salaryTo,
  position,
  name,
  companyAddressId,
  website,
  workingDays,
  currencyId,
  optionAddress,
  deadline,
  companyId,
}) => {
  const [listCurrency, setListCurrency] = useState([]);
  const [skillOptions, setSkillOptions] = useState(SKILLS);
  const [levelOptions, setLevelOptions] = useState<any[]>([]);
  const [jobTypeOptions, setJobTypeOptions] = useState(JOB_TYPES);

  const uploadFile = async (data: any) => {
    const res = await ServiceAuth.uploadFile(data);
    return res.data;
  };

  const fetchListCompanies = async (isPrivate: boolean) => {
    const res = await ServiceCompany.getListCompany(10, 1, isPrivate);
    return res.data;
  };

  const mutationUpdateAvatar = useMutation(["updateAvatar"], uploadFile);
  const { isLoading } = mutationUpdateAvatar;

  const {
    data: companiesPrivate,
    isLoading: isLoadingCompaniesPrivate,
  } = useQuery(["companies", "isPrivate"], () => fetchListCompanies(true), {
    staleTime: 1000 * 60,
    retryDelay: 2000,
    retry: 1,
  });

  const fetchCurrencies = async () => {
    const res = await ServiceSystem.getListCurrentCies(1, 10);
    setListCurrency(
      res?.data?.list?.map((item: any) => ({
        label: item?.code,
        value: item?.id,
      }))
    );
  };

  const fetchListLevels = async () => {
    const res = await ServiceSystem.getListLevels();
    setLevelOptions(
      res?.data?.list?.map((item: any) => ({
        label: item?.name,
        value: String(item?.id),
      }))
    );
  }

  const memoCompany = useMemo(() => {
    const result: any = [];
    companiesPrivate?.list?.forEach((item: any) => {
      result.push({
        label: item?.name,
        value: item?.id,
      });
    });
    return result;
  }, [companiesPrivate]);

  useEffect(() => {
    fetchCurrencies();
    fetchListLevels()
  }, []);

  useEffect(() => {
    if(skills?.length) {
      const newOptions = checkAndConvertValue(skills, skillOptions)
      if(newOptions) {
        setSkillOptions([...newOptions])
      }
    }
  }, [skills, skillOptions])

  useEffect(() => {
    if(levelIds?.length) {
      const newOptions:any = checkAndConvertValue(levelIds, levelOptions)
      if(newOptions) {
        setLevelOptions([...newOptions])
      }
    }
  }, [levelIds, levelOptions])

  const handleChangeDescription = (des: string) => {
    if (onChange) {
      onChange("description", des);
    }
  };

  const handleChangeOverview = (overview: string) => {
    if (onChange) {
      onChange("overview", overview);
    }
  };

  const handleChangeQualication = (qua: string) => {
    if (onChange) {
      onChange("qualification", qua);
    }
  };

  const handleChangeBenefits = (benefit: string) => {
    if (onChange) {
      onChange("benefits", benefit);
    }
  };

  const handleJobType = (types: string[]) => {
    if (onChange) {
      onChange("jobTypes", types);
    }
  };

  const handleOnchangeCompany = (companyId: string) => {
    if (onChange) {
      onChange("companyId", companyId);
    }
  };

  const handleAddNewOption = (type: string, value: string) => {
    switch (type) {
    case "skills": {
      const isExisted = skillOptions?.find(
        (item: any) => item?.label?.toLowerCase() === value?.toLowerCase()
      );
      if (!isExisted) {
        setSkillOptions([...skillOptions, { value: value, label: value }]);
        onChange && onChange("skills", [...skills, value]);
      } else {
        toast.error("The word is already!", {
          position: toast.POSITION.BOTTOM_LEFT,
        });
      }
      break;
    }
    // case "levelIds": {
    //   const isExisted = levelOptions?.find(
    //     (item: any) => item?.label?.toLowerCase() === value?.toLowerCase()
    //   );
    //   if (!isExisted) {
    //     setLevelOptions([...levelOptions, { value: value, label: value }]);
    //     onChange && onChange("levelIds", [...levelIds, value]);
    //   } else {
    //     toast.error("The word is already!", {
    //       position: toast.POSITION.BOTTOM_LEFT,
    //     });
    //   }
    //   break;
    // }
    case "jobTypes": {
      const isExisted = jobTypeOptions?.find(
        (item: any) => item?.label?.toLowerCase() === value?.toLowerCase()
      );
      if (!isExisted) {
        setJobTypeOptions([
          ...jobTypeOptions,
          { value: value, label: value },
        ]);
        onChange && onChange("jobTypes", [...jobTypes, value]);
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

  const handleOnchangeSkills = (skills: string[]) => {
    if (onChange) {
      onChange("skills", skills);
    }
  };

  const handleOnchangeLevels = (levels: string[]) => {
    if (onChange) {
      onChange("levelIds", levels);
    }
  };

  const onChangeCurrency = (currency: string) => {
    if (onChange) {
      onChange("currencyId", currency);
    }
  };

  const handleOnchangeCompanyAddres = (value: string) => {
    if (onChange) {
      onChange("companyAddressId", value);
    }
  }

  const handleChangeDeadline = (date: any) => {
    if(onChange) {
      onChange("deadline", date);
    }
  }
  const memoValidate = useMemo(() => {
    const errors = validateEmpty({
      jobTypes,
      description,
      skills,
      qualification,
      overview,
      salaryFrom,
      salaryTo,
      position,
      name,
      website,
      workingDays,
      companyId,
      deadline,
    });
    return errors;
  }, [jobTypes, description, skills, qualification, overview, salaryFrom, salaryTo, position, name, website, workingDays, companyId, deadline]);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return (
    <div className="flex gap-4 md:gap-8 lg:gap-4 flex-col w-full">
      <Loading isLoading={isLoading || isLoadingCompaniesPrivate} />
      {/* <div className="flex flex-col justify-center items-center gap-1 md:w-auto w-[100%]">
        <Image
          src={avatar || "/img/user-default.png"}
          alt='profile'
          placeholder='blur'
          blurDataURL={'@/public/img/placeholder.png'}
          className='align-middle border-none max-w-full w-[160px] rounded-[50%] object-cover h-[160px]'
          width={0}
          height={0}
          sizes="100vw"
        />
        <div className="flex items-center gap-8">
          <input ref={refInputFile} type="file" accept="image/*" onChange={handleOnchangeAvatar} className="hidden"/>
          <Button
            classBtn="h-[30px] w-auto text-[#414042] focus:outline-none"
            iconBtn='fas fa-camera text-[24px] text-[#3659e3]'
            textBtn="Edit"
            onClick={handleClickBtnFile}
          />
          {avatar && (
            <Button
              classBtn="h-[30px] w-auto text-[#414042] focus:outline-none"
              iconBtn='fas fa-trash-alt text-[16px] text-[#ed1b2f]'
              textBtn="Delete"
              onClick={handleDeleteAvatar}
            />
          )}
        </div>
      </div> */}
      <h1 className="text-[#2b6fdf] text-[24px] font-bold text-center">
        {mode !== "edit" ? "Create new " : "Edit a "} job
      </h1>
      <div className="flex-1">
        <div className="px-2 md:px-4">
          <div
            className={
              "flex lg:gap-4 flex-col lg:flex-row" +
              (memoValidate.company || memoValidate.position
                ? " items-start"
                : " items-center")
            }
          >
            <div className="w-full mb-6">
              <label
                className="block uppercase text-[#000] text-xs font-bold mb-2"
                htmlFor="name"
              >
                Your name&lsquo;s company <span className='text-[red]'> *</span>
              </label>
              <DropdownRadio
                options={memoCompany}
                label="Select company"
                heightBtn={"h-[46px]"}
                value={companyId}
                onChange={handleOnchangeCompany}
              />
            </div>
            <div className="w-full mb-6">
              <label
                className="block uppercase text-[#000] text-xs font-bold mb-2"
                htmlFor="position"
              >
                Position job <span className='text-[red]'> *</span>
              </label>
              <Input
                name="position"
                type="text"
                id="position"
                className="border-1 px-3 py-3 placeholder-blueGray-300 text-[#000] bg-white rounded text-sm shadow focus:shadow outline-none focus:outline-none w-full ease-linear transition-all duration-150"
                placeholder="Enter position"
                styleInput={{
                  borderColor: "#e4e4e7",
                }}
                value={position}
                onChange={onChange}
                errorText={memoValidate ? memoValidate.position : ""}
              />
            </div>
          </div>
          <div className={
            "flex flex-col lg:flex-row lg:gap-4" +
              (memoValidate.name || memoValidate.deadline
                ? " items-start"
                : " items-center")
          }>
            <div className="w-full mb-6">
              <label className="block uppercase text-[#000] text-xs font-bold mb-2">
                Job&apos;s name <span className='text-[red]'> *</span>
              </label>
             
              <Input
                name="name"
                type="text"
                id="name"
                className="border-1 px-3 py-3 placeholder-blueGray-300 text-[#000] bg-white rounded text-sm shadow focus:shadow outline-none focus:outline-none w-full ease-linear transition-all duration-150"
                placeholder="Enter job's name"
                styleInput={{
                  borderColor: "#e4e4e7",
                }}
                value={name}
                onChange={onChange}
                errorText={memoValidate ? memoValidate.name : ""}
              />
            </div>
            <div className='w-full mb-6'>
              <label
                className='block uppercase text-[#000] text-xs font-bold mb-2'
                htmlFor='birthday'
              >
                Deadline <span className='text-[red]'> *</span>
              </label>
              <InputDate
                onChangeDate={handleChangeDeadline} 
                dateSeleted={deadline ? new Date(deadline) : null}
                minDate={tomorrow}
              />
            </div>
          </div>
          <div className="w-full mb-6">
            <label
              className="block uppercase text-[#000] text-xs font-bold mb-2"
              htmlFor="address"
            >
              Location <span className='text-[red]'> *</span>
            </label>
            <DropdownRadio
              options={optionAddress}
              label="Select location"
              heightBtn={"h-[46px]"}
              value={companyAddressId}
              onChange={handleOnchangeCompanyAddres}
            />
          </div>
          <div className="w-full mb-6">
            <label className="block uppercase text-[#000] text-xs font-bold mb-2">
              Skill required <span className='text-[red]'> *</span>
            </label>
            <div className="w-[100%]">
              <DropdownCheckbox
                options={skillOptions}
                label={"Select skills"}
                value={skills}
                heightBtn={"h-[46px]"}
                onChange={handleOnchangeSkills}
                isShowSearch
                errorText={memoValidate ? memoValidate.tags : ""}
                handleAddNewOption={handleAddNewOption}
                type="skills"
              />
            </div>
          </div>
          <div className="w-full mb-6">
            <label className="block uppercase text-[#000] text-xs font-bold mb-2">
              Level <span className='text-[red]'> *</span>
            </label>
            <div className="w-[100%]">
              <DropdownCheckbox
                options={levelOptions}
                label={"Select levels"}
                value={levelIds}
                heightBtn={"h-[46px]"}
                onChange={handleOnchangeLevels}
                isShowSearch
                errorText={memoValidate ? memoValidate.levels : ""}
              />
            </div>
          </div>
          <div
            className={
              "flex flex-col lg:flex-row lg:gap-4" +
              (memoValidate.jobType || memoValidate.website
                ? " items-start"
                : " items-center")
            }
          >
            <div className="w-full mb-6">
              <label className="block uppercase text-[#000] text-xs font-bold mb-2">
                Job Type <span className='text-[red]'> *</span>
              </label>
              <DropdownCheckbox
                options={jobTypeOptions}
                label="Select your job type"
                heightBtn={"h-[46px]"}
                value={jobTypes}
                onChange={handleJobType}
                isShowSearch
                errorText={memoValidate ? memoValidate.jobType : ""}
                handleAddNewOption={handleAddNewOption}
                type="jobTypes"
              />
            </div>
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
                errorText={memoValidate ? memoValidate.website : ""}
              />
            </div>
          </div>
          <div
            className={
              "flex flex-col lg:flex-row lg:gap-4" +
              (memoValidate.salaryFrom || memoValidate.salaryTo
                ? " items-start"
                : " items-center")
            }
          >
            <div className="w-full mb-6">
              <label className="block uppercase text-[#000] text-xs font-bold mb-2">
                Salary from <span className='text-[red]'> *</span>
              </label>
              <div className="flex item-center">
                <div className="w-[60px]">
                  <Dropdown
                    options={listCurrency}
                    mode="light"
                    value={currencyId}
                    heightBtn={"h-[46px]"}
                    onChange={onChangeCurrency}
                    isShowIcon={false}
                  />
                </div>
                <div className="flex-1">
                  <Input
                    name="salaryFrom"
                    type="number"
                    id="salaryFrom"
                    className="border-1 px-3 py-3 placeholder-blueGray-300 text-[#000] bg-white rounded text-sm shadow focus:shadow outline-none focus:outline-none w-full ease-linear transition-all duration-150"
                    placeholder="Enter your salary from"
                    styleInput={{
                      borderColor: "#e4e4e7",
                    }}
                    value={salaryFrom}
                    onChange={onChange}
                    errorText={memoValidate ? memoValidate.salaryFrom : ""}
                  />
                </div>
              </div>
            </div>
            <div className="w-full mb-6">
              <label
                className="block uppercase text-[#000] text-xs font-bold mb-2"
                htmlFor="salaryTo"
              >
                Salary To <span className='text-[red]'> *</span>
              </label>
              <div className="flex items-center">
                <div className="w-[60px]">
                  <Dropdown
                    options={listCurrency}
                    mode="light"
                    value={currencyId}
                    heightBtn={"h-[46px]"}
                    onChange={onChangeCurrency}
                    isShowIcon={false}
                  />
                </div>
                <div className="flex-1">
                  <Input
                    name="salaryTo"
                    type="number"
                    id="salaryTo"
                    className="border-1 px-3 py-3 placeholder-blueGray-300 text-[#000] bg-white rounded text-sm shadow focus:shadow outline-none focus:outline-none w-full ease-linear transition-all duration-150"
                    placeholder="Enter your salary to"
                    styleInput={{
                      borderColor: "#e4e4e7",
                    }}
                    value={salaryTo}
                    onChange={onChange}
                    errorText={memoValidate ? memoValidate.salaryTo : ""}
                  />
                </div>
              </div>
            </div>
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
              errorText={memoValidate ? memoValidate.workingDays : ""}
            />
          </div>
          <div className="w-full mb-6">
            <label className="block uppercase text-[#000] text-xs font-bold mb-2">
              Overview <span className='text-[red]'> *</span>
            </label>
            <Editor
              value={overview}
              onChange={(value:string) => handleChangeOverview(value)}
              placeholder="Enter your overview..."
              errorText={memoValidate ? memoValidate.overview : ""}
            />
          </div>
          <div className="w-full mb-6">
            <label className="block uppercase text-[#000] text-xs font-bold mb-2">
              Description <span className='text-[red]'> *</span>
            </label>
            <Editor
              value={description}
              onChange={(value: string) => handleChangeDescription(value)}
              placeholder="Enter your description..."
              errorText={memoValidate ? memoValidate.description : ""}
            />
          </div>
          <div className="w-full mb-6">
            <label className="block uppercase text-[#000] text-xs font-bold mb-2">
              Qualication <span className='text-[red]'> *</span>
            </label>
            <Editor
              value={qualification}
              onChange={(value: string) => handleChangeQualication(value)}
              placeholder="Enter your qualication..."
              errorText={memoValidate ? memoValidate.qualification : ""}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
