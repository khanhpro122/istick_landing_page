// Libraries
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

// Services
import * as ServiceJob from "@/services/job";
import * as ServiceAuth from "@/services/auth";
import * as ServiceSystem from '@/services/system'

// Components
import { Button } from "@/components/Buttons/Button";
import { Filter } from "@/components/Filters/Filter";
import Footer from "@/components/Footers/Footer";
import Navbar from "@/components/Navbars/IndexNavbar";
import DropdownCheckbox from "@/components/Dropdowns/DropdownCheckbox";
import { Slider } from "@/components/Inputs/Slider";
import { Loading } from "@/components/Loading/Loading";
import { ModalMatch } from "@/components/Modals/ModalMatch";
import Dropdown from "@/components/Dropdowns/Dropdown";

// utils
import {
  convertToUserTag,
  convertToUserTagLocal,
  convertValues,
  convertValuesToOption,
  formatStringToDate,
  getCookie,
  getLocalUserData,
  uniqueArray,
} from "@/utils";

// Hooks
import { useUpdateEffect } from "@/hooks";

// contants
import { JOB_TYPES, OFFICES, SKILLS, TITLES } from "@/components/contants";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import { LoadingChild } from "@/components/Loading/LoadingChild";
import { useAuth } from "@/hooks/useAuth";

function Index() {
  const [isShowFilter, setIsShowFilter] = useState(false);
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string[]>([]);
  const [isSorted, setIsSorted] = useState(false);
  const [salary, setSalary] = useState([0, 10000]);
  const [pageState, setPageState] = useState(1);
  const [isOpenModalMatch, setIsOpenModalMatch] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedTypeJobs, setSelectedTypeJob] = useState<string[]>([]);
  const [listSearch, setListSearch] = useState<string[]>([]);
  const [listCurrency, setListCurrency] = useState([]);
  const [listLevel, setListLevel] = useState([]);
  const [listCities, setListCities] = useState([]);
  const [currencyId, setCurrencyId] = useState(2);
  const [objectCurrency, setObjectCurency] = useState<any>({});
  const [jobsPublic, setJobsPublic] = useState([])
  const [isLoadingJob, setIsLoadingJob] = useState(false)

  const fetchCurrencies = async () => {
    const res = await ServiceSystem.getListCurrentCies(1, 10);
    const objectMap:any = {}
    res?.data?.list?.forEach((item: any) => {
      objectMap[item?.id] = item.code
    })
    setListCurrency(
      res?.data?.list?.map((item: any) => ({
        label: item?.code,
        value: item?.id,
      }))
    );
    setObjectCurency(objectMap)
  };

  const fetchListLevels = async () => {
    const res = await ServiceSystem.getListLevels();
    setListLevel(
      res?.data?.list?.map((item: any) => ({
        label: item?.name,
        value: String(item?.id),
      }))
    );
  }

  const fetchListCities = async () => {
    const res = await ServiceSystem.getListCities(1);
    setListCities(
      res?.data?.list?.map((item: any) => ({
        label: item?.name,
        value: String(item?.id),
      }))
    );
  }

  const [optionsJob, setOptionsJob] = useState(TITLES);
  const [optionsLocation, setOptionsLocation] = useState(OFFICES);
  const [optiosSkill, setOptionsSkill] = useState(SKILLS);

  const [optiosTypeJob, setOptionsTypeJob] = useState(JOB_TYPES);

  const { user: userInfo, loading: isLoadingUser } = useAuth()

  // fetch api
  const fetchListJobPublic = async (params: any) => {
    setIsLoadingJob(true)
    await ServiceJob.getListJobMatching(params).then((res) => {
      setIsLoadingJob(false)
      setJobsPublic(res?.data?.list)
    }).catch((e) => {
      setIsLoadingJob(false)
    })
    
  };

  const fetchUpdateInfoUser = async (data: any) => {
    const response = await ServiceAuth.updateUserInfo(String(userInfo?.id) || '', data)
    return response.data;
  }

  const mutationUpdateUser = useMutation(['updateUser'], fetchUpdateInfoUser);

  const handleOnchangeJob = (jobs: string[]) => {
    setSelectedJobs(jobs);
  };

  const handleOnchangeLevel = (level: string[]) => {
    setSelectedLevel(level);
  };

  const handleOnchangeLocation = (locations: string[]) => {
    setSelectedLocation(locations);
  };

  const handleOnchangeSalary = (values: number[]) => {
    setSalary(values);
  };

  const handleChangeFilter = (type: string, values: string[]) => {
    if (type === "skill") {
      setSelectedSkills(values);
    } else if (type === "typeJob") {
      setSelectedTypeJob(values);
    }
  };

  const handleOnchangeSearchKey = (values: string[]) => {
    setListSearch(values);
  };

  const handleMatching = (data: any) => {
    if (data) {
      const skill = convertValues(data, "SKILL");
      const titles = convertValues(data, "TITLE");
      const location = convertValues(data, "LOCATION");
      setSelectedJobs(Array.from(new Set([...selectedJobs, ...titles])));
      setSelectedLocation(
        Array.from(new Set([...selectedLocation, ...location]))
      );
      setSelectedSkills(Array.from(new Set([...selectedSkills, ...skill])));
      if (titles?.length) {
        const jobs = convertValuesToOption(titles);
        setOptionsJob(uniqueArray([...optionsJob, ...jobs]));
      }
      if (location?.length) {
        const locations = convertValuesToOption(location);
        setOptionsLocation(uniqueArray([...optionsLocation, ...locations]));
      }
      if (skill?.length) {
        const skills = convertValuesToOption(skill);
        setOptionsSkill(uniqueArray([...optiosSkill, ...skills]));
      }
    }
  };

  const handleChangePublicJob = () => {
    fetchListJobPublic({
      params: {
        limit: 10,
        page: pageState,
        isTotal: true,
        tags: [...listSearch,...selectedSkills,...selectedJobs,...selectedTypeJobs],
        salaryFrom: salary[0],
        salaryTo: salary[1],
        currencyId: currencyId,
        levelIDs: selectedLevel,
        cityIds: selectedLocation,
      },
      paramsSerializer: {
        indexes: null,
      }
    })
  }

  useEffect(() => {
    let result;
    const data: any = localStorage.getItem("matching");
    if (userInfo?.id) {
      // result = userInfo?.userTags;
    } else {
      result = JSON.parse(data);
    }
    if (!result && !userInfo?.id) {
      setIsOpenModalMatch(!result);
    } else {
      if (userInfo?.id && !result?.length) {
        setSelectedJobs([]);
        setSelectedLocation([]);
        setSelectedSkills([]);
      } else {
        const titles = convertValues(result, "TITLE");
        const skill = convertValues(result, "SKILL");
        const location = convertValues(result, "LOCATION");
        setSelectedJobs(Array.from(new Set([...selectedJobs, ...titles])));
        setSelectedLocation(
          Array.from(new Set([...selectedLocation, ...location]))
        );
        setSelectedSkills(Array.from(new Set([...selectedSkills, ...skill])));
        if (titles?.length) {
          const jobs = convertValuesToOption(titles);
          setOptionsJob(uniqueArray([...optionsJob, ...jobs]));
        }
        if (location?.length) {
          const locations = convertValuesToOption(location);
          setOptionsLocation(uniqueArray([...optionsLocation, ...locations]));
        }
        if (skill?.length) {
          const skills = convertValuesToOption(skill);
          setOptionsSkill(uniqueArray([...optiosSkill, ...skills]));
        }
      }
    }
  }, [userInfo]);

  useEffect(() => {
    fetchListJobPublic({
      params: {
        limit: 10,
        page: pageState,
        isTotal: true,
        tags: [...listSearch,...selectedSkills,...selectedJobs,...selectedTypeJobs],
        salaryFrom: salary[0],
        salaryTo: salary[1],
        currencyId: currencyId,
        levelIDs: selectedLevel,
        cityIds: selectedLocation,
      },
      paramsSerializer: {
        indexes: null,
      }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currencyId, listSearch, pageState, salary, selectedSkills, selectedTypeJobs])
  
  useEffect(() => {
    if(currencyId === 3) {
      handleOnchangeSalary([1, 10000 * 20000])
    }else {
      handleOnchangeSalary([1, 10000])
    }
  }, [currencyId])

  useEffect(() => {
    fetchCurrencies()
    fetchListLevels()
    fetchListCities()
  }, [])

  useUpdateEffect(() => {
    if(!userInfo?.id) {
      localStorage.setItem('matching', JSON.stringify(convertToUserTagLocal(selectedJobs, selectedLocation, selectedSkills)))
    }else {
      // mutationUpdateUser.mutate(
      //   {...userInfo,
      //     userTags: convertToUserTag(selectedJobs, selectedLocation, selectedSkills),
      //   })
    }
  }, [selectedJobs, selectedLocation, selectedSkills, userInfo])
  
  return (
    <>
      <Head>
        <title>Find job</title>
      </Head>
      <Navbar fixed isShowAuth />
      <ModalMatch
        isOpen={isOpenModalMatch}
        closeModal={() => setIsOpenModalMatch(false)}
        handleMatching={handleMatching}
      />
      <ToastContainer />
      <div id="container" className="bg-[#dbe0e1]">
        <section className="bg-white header px-4 pt-20 items-center flex h-auto flex-wrap">
          <div className="container mx-auto">
            <div className="px[0] pb-[0] md:px-4 md:pd-8 lg:px-4">
              <div className="p-2 bg-[#e5eeff] rounded-md my-2 flex flex-wrap items-center justify-between">
                <div className="w-[100%] md:w-[50%] lg:w-[25%] p-2 flex flex-col gap-1">
                  <h4 className="text-[16px] text-black font-medium">Job</h4>
                  <DropdownCheckbox
                    options={optionsJob}
                    label={"All jobs"}
                    value={selectedJobs}
                    onChange={handleOnchangeJob}
                    isShowSearch
                    handleBlur={handleChangePublicJob}
                  />
                </div>
                <div className="w-[100%] md:w-[50%] lg:w-[25%] p-2 flex flex-col gap-1">
                  <h4 className="text-[16px] text-black font-medium">Level</h4>
                  <DropdownCheckbox
                    options={listLevel}
                    label={"All Levels"}
                    value={selectedLevel}
                    onChange={handleOnchangeLevel}
                    isShowSearch
                    handleBlur={handleChangePublicJob}
                  />
                </div>
                <div className="w-[100%] md:w-[50%] lg:w-[25%] p-2 flex flex-col gap-1">
                  <h4 className="text-[16px] text-black font-medium">
                    Location
                  </h4>
                  <DropdownCheckbox
                    options={listCities}
                    label={"Location"}
                    value={selectedLocation}
                    onChange={handleOnchangeLocation}
                    isShowSearch
                    handleBlur={handleChangePublicJob}
                  />
                </div>
                <div className="w-[100%] md:w-[50%] lg:w-[25%] p-2 flex flex-col gap-1">
                  <h4 className="text-[16px] text-black font-medium">
                    Salary:{" "}
                    <span className="text-black">
                      {salary[0]?.toLocaleString()}
                      <span className="text-[#0ab305]">{" - "}</span>
                    </span>
                    <span className="text-black">
                      {salary[1]?.toLocaleString()}
                      <span className="text-[#0ab305]"></span>
                    </span>
                  </h4>
                  <div className="flex item-center">
                    <div className="w-[60px]">
                      <Dropdown
                        options={listCurrency}
                        mode="light"
                        value={currencyId}
                        heightBtn={"h-[40px]"}
                        onChange={(value:string) => setCurrencyId(+value)}
                        isShowIcon={false}
                      />
                    </div>
                    <div className="flex-1 border-[1px] bg-white border-[#d9d9d9] border-solid h-[40px] px-2 py-3 w-full flex items-center justify-center rounded-md">
                      <Slider
                        min={1}
                        max={currencyId === 3 ? 10000 * 20000 : 10000}
                        minValue={salary[0]}
                        maxValue={salary[1]}
                        onChange={handleOnchangeSalary}
                      />
                    </div>
                  </div>
                </div>
               
              </div>
              <div className="flex gap-2 lg:gap-0 lg:items-center mb-2 md:mb-4 lg:mb-6 justify-between flex-col lg:flex-row">
                <div className="flex flex-col">
                  <h3 className="text-[#313e5b] text-[16px] md:text-[24px] lg:text-[30px] font-bold mb-[4px] md:mb-[4px] lg:mb-[4px]">
                    Recommeded jobs
                  </h3>
                  <span className="text-[#313e5b] text-[12px]">
                    5 new opportunities posted today!
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-black text-[14px]">Sort by:</span>
                  <span className="ml-1 text-black text-[14px] font-bold">
                    {isSorted ? "Last updated" : "First updated"}
                  </span>
                  <Button
                    classBtn="ml-3 w-auto text-[#000] border-none focus:outline-none"
                    iconBtn={isSorted ? "fas fa-sliders-h" : "fas fa-sliders-h"}
                    onClick={() => setIsSorted(!isSorted)}
                  />
                </div>
                <Button
                  classBtn="block lg:hidden h-[40px] whitespace-nowrap w-auto text-[#000] rounded-md px-4 border-[#e7e7e9] border-solid border-[1px] focus:outline-none"
                  textBtn="Filters"
                  iconBtn="fas fa-filter"
                  onClick={() => setIsShowFilter(!isShowFilter)}
                  styleBtn={{
                    width: "fit-content",
                  }}
                />
              </div>
              {isShowFilter && (
                <div className="block lg:hidden mb-6">
                  <Filter
                    selectedSkills={selectedSkills}
                    optiosSkill={optiosSkill}
                    optiosTypeJob={optiosTypeJob}
                    onChange={handleChangeFilter}
                    selectedTypeJobs={selectedTypeJobs}
                    handleOnchangeSearchKey={handleOnchangeSearchKey}
                    listSearch={listSearch}
                  />
                </div>
              )}
              <div className="flex gap-12">
                <div className="hidden lg:block">
                  <Filter
                    selectedSkills={selectedSkills}
                    optiosSkill={optiosSkill}
                    optiosTypeJob={optiosTypeJob}
                    onChange={handleChangeFilter}
                    selectedTypeJobs={selectedTypeJobs}
                    handleOnchangeSearchKey={handleOnchangeSearchKey}
                    listSearch={listSearch}
                  />
                </div>
                <div className="flex-1 relative">
                  <LoadingChild isLoading={isLoadingJob} />
                  <div className="w-full flex-row flex-wrap flex">
                    {jobsPublic?.map((job: any) => {
                      const listSkill = job?.jobTags?.filter(
                        (tag: any) => tag?.tagType === "SKILL"
                      );
                      const listLevel = job?.jobTags?.filter(
                        (tag: any) => tag?.tagType === "LEVEL"
                      );
                      return (
                        <Link
                          key={job.slug}
                          href={`/jobs/${job?.slug}`}
                          className="group relative w-full md:w-6/12 lg:w-6/12 min-w-[unset] lg:min-w-[300px] cursor-pointer px-2 py-2 md:py-2 lg:py-0"
                        >
                          <div className="rounded-xl border-[#e7e7e9] border-solid border-[1px] p-2 shadow w-full h-auto">
                            <div className="bg-[#eceff4] p-4 rounded-xl h-[2R0px]">
                              <div className="flex justify-between items-center mb-4">
                                <span className="text-sm text-black px-4 py-2 rounded-[20px] bg-white font-medium">
                                  {formatStringToDate(job?.createdAt, {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </span>
                                <Link href={`/companies/${job.companyId}`}>
                                  <Image
                                    src={job?.companyAvatar}
                                    alt="profile"
                                    placeholder="blur"
                                    blurDataURL={"@/public/img/placeholder.png"}
                                    className="align-middle border-none w-[50px] min-w-[50px] rounded-[50%] object-cover h-[50px]"
                                    width={0}
                                    height={0}
                                    sizes="100vw"
                                  />
                                </Link>
                              </div>
                              <div className="flex items-start w-full justify-between">
                                <div className="flex flex-col gap-1">
                                  <p className="text-[#3d3d4e] text-[16px] font-medium line-clamp-1">
                                    {job?.name}
                                  </p>
                                  <h4 className="text-black text-[20px] font-medium line-clamp-2">
                                    {job?.position}
                                  </h4>
                                </div>
                              </div>
                              <div className="text-[#2b6fdf] text-[20px] font-medium line-clamp-2">
                                {job?.salaryFrom?.toLocaleString()} - {job?.salaryTo?.toLocaleString()} 
                                <span className='text-black'>{' '}{objectCurrency[job?.currencyId]}</span>
                              </div>
                              {!!listSkill?.length && (
                                <div className="flex flex-nowrap max-w-[100%] no-scrollbar items-center gap-2 mt-4 overflow-x-auto">
                                  {listSkill.map((job: any) => {
                                    return (
                                      <span
                                        key={job?.id}
                                        className="text-sm text-[#2b6fdf] px-2 py-1 rounded-[20px] border-solid border-[1px] border-[#2b6fdf]"
                                      >
                                        {job?.tag?.name}
                                      </span>
                                    );
                                  })}
                                </div>
                              )}
                              {!!listLevel?.length ?  (
                                <div className="flex flex-nowrap no-scrollbar items-center gap-2 mt-2 overflow-x-auto">
                                  {listLevel.map((level: any) => {
                                    return (
                                      <span
                                        key={level?.id}
                                        className="text-[16x] text-[#2b6fdf] font-bold"
                                      >
                                        {level?.tag?.name}
                                      </span>
                                    );
                                  })}
                                </div>
                              ) : (
                                <div className="h-[32px]"></div>
                              )}
                            </div>
                            <div className="items-center justify-between flex m-4">
                              <div>
                                <i className="fas fa-map-marker-alt text-[#3d3d4e]" />
                                <span className="text-[#000] text-[14px]">
                                  {" "}
                                  {job?.companyAddress?.city?.name}
                                </span>
                              </div>
                              <Button
                                classBtn="h-auto whitespace-nowrap w-auto bg-[#2b6fdf] text-white px-4 py-2 rounded-[20px] font-medium focus:outline-none"
                                textBtn="View job"
                              />
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                    {!jobsPublic.length && <div className="w-full flex justify-center"><span>No data</span></div>}
                    {/* <Link
                    href='/jobs/2' 
                    className="group relative w-full md:w-6/12 lg:w-4/12 min-w-[unset] lg:min-w-[300px] cursor-pointer px-2 py-2 md:py-2 lg:py-0"
                  >
                    <div className="rounded-xl border-[#e7e7e9] border-solid border-[1px] p-2 shadow w-full h-auto">
                      <div className='bg-[#eceff4] p-4 rounded-xl'>
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-sm text-black px-4 py-2 rounded-[20px] bg-white font-medium">18 June, 2023</span>
                        </div>
                        <div className="flex items-start w-full justify-between">
                          <div className="flex flex-col gap-1">
                            <span className="text-[#3d3d4e] text-[14px] font-medium">Zerobroker</span>
                            <h4 className="text-black text-[20px] font-medium">Product Designer upto $2000</h4>
                          </div>
                          <Image
                            src="/img/profile.png"
                            alt='profile'
                            placeholder='blur'
                            blurDataURL={'@/public/img/placeholder.png'}
                            className='align-middle border-none max-w-full w-[50px] rounded-[50%] object-cover max-h-[x] h-[50px]'
                            width={0}
                            height={0}
                            sizes="100vw"
                          />
                        </div>
                        <div className='flex flex-wrap items-center gap-2 mt-4'>
                          <span className="text-sm text-[#2b6fdf] px-2 py-1 rounded-[20px] border-solid border-[1px] border-[#2b6fdf]">Part time</span>
                          <span className="text-sm text-[#2b6fdf] px-2 py-1 rounded-[20px] border-solid border-[1px] border-[#2b6fdf]">Project job</span>
                          <span className="text-sm text-[#2b6fdf] px-2 py-1 rounded-[20px] border-solid border-[1px] border-[#2b6fdf]">Junior level</span>
                        </div>
                      </div>
                      <div className="items-center justify-between flex m-4">
                        <div>
                          <i className="fas fa-map-marker-alt text-[#3d3d4e]" />
                          <span className="text-[#000] text-[14px]">{' '}Ho CHi Minh</span>
                        </div>
                        <Button
                          classBtn="h-auto whitespace-nowrap w-auto bg-[#2b6fdf] text-white px-4 py-2 rounded-[20px] font-medium focus:outline-none"
                          textBtn="View job"
                        />
                      </div>
                    </div>
                    <div className="absolute right-[8px] top-[18px] bg-[#f49e40] after:absolute after:h-0 after:w-0 after:border-[6px] 
                      after:border-l-transparent after:border-b-transparent after:border-solid after:border-r-[#f49e40] after:border-t-[#f49e40] 
                      after:right-0 :content-[''] py-1 px-3 rounded-tl-[4px] rounded-bl-[4px] after:top-[100%]"
                    >
                      <span className="text-[14px] uppercase text-white font-medium">HOT</span>
                    </div>
                  </Link>
                  <Link
                    href='/jobs/2' 
                    className="group relative w-full md:w-6/12 lg:w-4/12 min-w-[unset] lg:min-w-[300px] cursor-pointer px-2 py-2 md:py-2 lg:py-0"
                  >
                    <div className="rounded-xl border-[#e7e7e9] border-solid border-[1px] p-2 shadow w-full h-auto">
                      <div className='bg-[#eceff4] p-4 rounded-xl'>
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-sm text-black px-4 py-2 rounded-[20px] bg-white font-medium">18 June, 2023</span>
                        </div>
                        <div className="flex items-start w-full justify-between">
                          <div className="flex flex-col gap-1">
                            <span className="text-[#3d3d4e] text-[14px] font-medium">Zerobroker</span>
                            <h4 className="text-black text-[20px] font-medium">Product Designer upto $2000</h4>
                          </div>
                          <Image
                            src="/img/profile.png"
                            alt='profile'
                            placeholder='blur'
                            blurDataURL={'@/public/img/placeholder.png'}
                            className='align-middle border-none max-w-full w-[50px] rounded-[50%] object-cover max-h-[x] h-[50px]'
                            width={0}
                            height={0}
                            sizes="100vw"
                          />
                        </div>
                        <div className='flex flex-wrap items-center gap-2 mt-4'>
                          <span className="text-sm text-[#2b6fdf] px-2 py-1 rounded-[20px] border-solid border-[1px] border-[#2b6fdf]">Part time</span>
                          <span className="text-sm text-[#2b6fdf] px-2 py-1 rounded-[20px] border-solid border-[1px] border-[#2b6fdf]">Project job</span>
                          <span className="text-sm text-[#2b6fdf] px-2 py-1 rounded-[20px] border-solid border-[1px] border-[#2b6fdf]">Junior level</span>
                        </div>
                      </div>
                      <div className="items-center justify-between flex m-4">
                        <div>
                          <i className="fas fa-map-marker-alt text-[#3d3d4e]" />
                          <span className="text-[#000] text-[14px]">{' '}Ho CHi Minh</span>
                        </div>
                        <Button
                          classBtn="h-auto whitespace-nowrap w-auto bg-[#2b6fdf] text-white px-4 py-2 rounded-[20px] font-medium focus:outline-none"
                          textBtn="View job"
                        />
                      </div>
                    </div>
                    <div className="absolute right-[8px] top-[18px] bg-[#ed1b2f] after:absolute after:h-0 after:w-0 after:border-[6px] 
                      after:border-l-transparent after:border-b-transparent after:border-solid after:border-r-[#ed1b2f] after:border-t-[#ed1b2f] 
                      after:right-0 :content-[''] py-1 px-3 rounded-tl-[4px] rounded-bl-[4px] after:top-[100%]"
                    >
                      <span className="text-[14px] uppercase text-white font-medium">
                        <i className="fas fa-fire-alt text-[yellow]"></i>{' '}
                        SUPER HOT
                      </span>
                    </div>
                  </Link> */}
                  </div>
                  <div className="flex w-full justify-center gap-3">
                    <Button
                      classBtn="h-auto font-bold w-auto py-2 mb-4 px-0 px-4 bg-[#3659e3] text-white rounded-[50%] outline-[none] border-none focus:outline-none mt-4"
                      iconBtn="fas fa-chevron-left"
                      onClick={() => setPageState((prev) => prev - 1)}
                      disabled={pageState === 1}
                    />
                    <Button
                      classBtn="h-auto font-bold w-auto py-2 mb-4 px-0 px-4 bg-[#3659e3] text-white rounded-[50%] outline-[none] border-none focus:outline-none mt-4"
                      iconBtn="fas fa-chevron-right"
                      onClick={() => setPageState((prev) => prev + 1)}
                      disabled={
                        Number(jobsPublic?.length) < 6 || !jobsPublic?.length
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer hiddenDecord />
      </div>
    </>
  );
}

export default Index;
