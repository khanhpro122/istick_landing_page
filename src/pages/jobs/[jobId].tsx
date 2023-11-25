// Libraries
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { NextPage } from 'next';
import Swal from 'sweetalert2';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ToastContainer, toast } from 'react-toastify';
import InfiniteScroll from 'react-infinite-scroll-component';

// Services
import * as ServiceJob from '@/services/job';
import * as ServiceAuth from '@/services/auth';
import * as ServiceCompany from '@/services/company';
import * as ServiceSystem from '@/services/system';

// Components
import { Button } from '@/components/Buttons/Button';
import Footer from '@/components/Footers/Footer';
import Navbar from '@/components/Navbars/IndexNavbar';

import { Loading } from '@/components/Loading/Loading';
import { convertLocalPhone, formatStringToDate, getCookie, getTimeCreated } from '@/utils';
import Modal from '@/components/Modals';
import { ModalAuth } from '@/components/Modals/ModalAuth';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '@/hooks/useAuth';

type TPropJob = {
  job: any
}

const JobDetail:NextPage<TPropJob> = ({job}) => {

  const [isSorted, setIsSorted] = useState(false);
  const [isOpenApply, setIsOpenApply] = useState(false);
  const refInputResume = useRef<null | HTMLInputElement>(null);
  const [cvUrl, setCvUrl] = useState<File | null | undefined | any>(null);
  const [nameResume, setNameResume] = useState('');
  const [openModalAuth, setOpenModalAuth] = useState(false);
  const [company, setCompany] = useState<any>({});
  const [limitRelated, setLimitRelated] = useState(10);
  const [objectCurrency, setObjectCurency] = useState<any>({});

  const fetchApplyJob = async (data: any) => {
    const response = await ServiceJob.applyJob(data?.jobId, data)
    return response.data;
  }

  const fetchDetailCompany = async (companyId: string) => {
    const response = await ServiceCompany.getDetailCompany(companyId);
    setCompany(response?.data)
  }

  const fetchCurrencies = async () => {
    const res = await ServiceSystem.getListCurrentCies(1, 10);
    const objectMap:any = {}
    res?.data?.list?.forEach((item: any) => {
      objectMap[item?.id] = item.code
    })
    setObjectCurency(objectMap)
  };

  const fetchJobRelatedById = async (jobId:string, limit: number) => {
    const res = await ServiceJob.getJobRelatedById(jobId, limit, 1, true)
    return res?.data
  }

  useEffect(() => {
    if(job?.companyId) {
      fetchDetailCompany(job?.companyId)
    }
  }, [job?.companyId])

  useEffect(() => {
    fetchCurrencies()
  },[])

  const uploadFile = async (data:any) => {
    const res = await ServiceAuth.uploadFile(data)
    return res.data
  }

  const memoCountries = useMemo(() => {
    if(company?.companyAddresses && !!company?.companyAddresses.length) {
      const result:any = []
      const uniqueIds:any = []
      company?.companyAddresses?.forEach((item:any) => {
        if(!uniqueIds?.includes(item?.country?.id)) {
          result.push(item)
          uniqueIds.push(item?.country?.id)
        }
      })
      return result
    }
    return []
  }, [company])
  
  const mutationApplyJob = useMutation(['applyJob'], fetchApplyJob)
  const { user: userInfo } = useAuth()
  const mutationUpdateResume = useMutation(['updateCV'], uploadFile);
  const { data: relatedJob } =  useQuery(['jobRelated', limitRelated, job?.id], 
    () => fetchJobRelatedById(job?.id, limitRelated)
    , {staleTime: 1000 * 60, retryDelay: 2000, retry: 1, enabled: !!job?.id, keepPreviousData: true  }
  )

  const { isLoading } = mutationApplyJob

  const handleOpenApplyJob = () => {
    if(!userInfo?.id) {
      setOpenModalAuth(true);
    }else {
      setIsOpenApply(true);
    }
  }
  const onCloseModalAuth = () => {
    setOpenModalAuth(false);
  }

  const handleLoadMore = () => {
    setLimitRelated(prev => prev + 4)
  }

  const handleApplyJob = () => {
    mutationApplyJob.mutate({jobId: job?.id, cvUrl}, {
      onSuccess: () => {
        setIsOpenApply(false)
        Swal.fire({
          title: 'Congraturation!',
          text: 'Apply job is successed!',
          icon: 'success',
          confirmButtonColor: '#2b6fdf',
        })
      },
      onError:() => {
        Swal.fire({
          title: 'Opps!',
          text: 'Apply job is failed!',
          icon: 'error',
          confirmButtonColor: '#2b6fdf',
        })
      }
    })
  }

  const handleRemoveResume = () => {
    setCvUrl(null);
    setNameResume('');
    if (refInputResume.current) {
      refInputResume.current.value = '';
    }
  }

  const handleReviewCV = () => {
    window.open(`/hiring/resume/review/${encodeURIComponent(cvUrl)}`);
  };

  const size = 30000000;
  const listAcceptFile = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: acceptedFiles => {
      const MAX_SIZE = 1000000 * 300;
      acceptedFiles.forEach(item => {
        if (item.size > MAX_SIZE) {
          toast.error('Size does not exceed 30Mb' )
        }
      });
      if (listAcceptFile?.includes(acceptedFiles?.[0]?.type)) {
        if (acceptedFiles?.[0]?.size < size) {
          const fileSelected = acceptedFiles?.[0];
          if(fileSelected) {
            const formData = new FormData()
            formData.append(`${'key1'}.data`, fileSelected)
            formData.append(`${'key1'}.name`, fileSelected?.name)
            formData.append(`${'key1'}.is_public`, 'false')
            mutationUpdateResume.mutate(
              formData, {
                onSuccess: (data: any) => {
                  setCvUrl(data?.urls[0]?.url)
                  setNameResume(fileSelected?.name)
                },
                onError:() => {
                  toast.error('Update resume is failed, Please try again!', {
                    position: toast.POSITION.BOTTOM_LEFT,
                  });
                }
              })
          }
        } else {
          toast.error('You need choose file that has correct size' )
        }
      } else {
        toast.error('You need choose file that has correct type .pdf, .docx or .doc' )
      }
    },
  });

  const onCloseModalApply = () => {
    setIsOpenApply(false)
  }

  const listSkill = job?.jobTags?.filter((tag: any) => tag?.tagType === "SKILL");
  const listLevel = job?.jobLevels

  return (
    <>
      <Navbar fixed isShowAuth />
      <div id="container" className="bg-[#dbe0e1]"
      >
        <Loading isLoading={isLoading}></Loading>
        <ToastContainer />
        <ModalAuth isOpen={openModalAuth} closeModal={onCloseModalAuth} />
        <Modal isOpen={isOpenApply} closeModal={onCloseModalApply}>
          <div className="bg-white p-5 rounded-md w-auto md:w-[600px]">
            <div className="flex items-start">
              <div className="flex items-center w-full mb-2">
                <div className="p-[4px] mr-2">
                  <Image
                    src={job?.companyAvatar}
                    alt='profile'
                    placeholder='blur'
                    blurDataURL={'@/public/img/placeholder.png'}
                    className='align-middle border-none w-[60px] object-cover rounded-[50%] h-[60px] '
                    width={0}
                    height={0}
                    sizes="100vw"
                  />
                </div>
                <div className="flex flex-col items-start">
                  <div className="text-[16px] text-black font-bold text-center mb-1 line-clamp-1">
                    {job?.position}{' '}
                  </div>
                  <div className="text-[14px] text-[#6f7287] font-medium text-center mb-1 line-clamp-1">{job?.name}</div>
                  <div className="text-[14px] text-black line-clamp-3">{job?.companyAddress?.address}{', '}{job?.companyAddress?.city?.name}</div>
                </div>
              </div>
              <Button
                iconBtn="fas fa-times text-[20px]"
                classBtn="h-[32px] w-[32px] text-black outline-[none] border-none focus:outline-none"
                onClick={onCloseModalApply}
              />
            </div>
            <div className="border-[#2b6fdf] p-4 rounded-[8px]  border-solid border-[1px]">
              <div className="flex w-full gap-4 items-center flex-col md:flex-row">
                <Image
                  src={userInfo?.avatar || "/img/profile.png"}
                  alt='profile'
                  placeholder='blur'
                  blurDataURL={'@/public/img/placeholder.png'}
                  className='align-middle border-none w-[80px] object-cover rounded-[50%] h-[80px] min-w-[80px]'
                  width={0}
                  height={0}
                  sizes="100vw"
                />
                <div className="w-full flex-col gap-2 flex flex-1">
                  <div className="text-[16px] text-black font-medium capitalize">{userInfo?.fullname}</div>
                  <input
                    type='text'
                    className='border-none shadow-md px-3 py-3 placeholder-blueGray-300 text-[#000] bg-white rounded text-sm 
                    outline-none focus:outline-none w-full ease-linear transition-all duration-150'
                    placeholder='Enter your position'
                    value={userInfo?.jobTitle}
                    // onChange={handleOnchangeInput}
                  />
                  <input
                    type='text'
                    className='border-none shadow-md px-3 py-3 placeholder-blueGray-300 text-[#000] bg-white rounded text-sm 
                    outline-none focus:outline-none w-full ease-linear transition-all duration-150'
                    placeholder='Enter your phone'
                    value={convertLocalPhone(userInfo?.phoneNumber || "")}
                    // onChange={handleOnchangeInput}
                  />
                </div>
              </div>
              {cvUrl && (
                <div className="flex justify-center w-full mt-4">
                  <div className="h-[60px] flex items-center bg-[#f2f7ff] p-4 w-full border-[1px] border-solid border-[#3659e3] rounded-md">
                    <div className="text-[#6f72987] text-[14px] font-medium flex justify-between w-full">
                      <div className="flex gap-2 items-center">
                        <input
                          type="radio"
                          checked={true}
                          className="outline-none focus:outline-none border-[1px] rounded-full shadow cursor-pointer border-solid"
                          style={{
                            boxShadow: 'none',
                            color: '#3659e3',
                            borderColor: '#e7e7e9'
                          }}
                        />
                        <span onClick={handleReviewCV} className="inline-block line-clamp-1 max-w-[180px] md:max-w-[440px] text-ellipsis overflow-hidden">{nameResume}</span>{' '}
                      </div>
                      <span onClick={handleRemoveResume}><i className="fas fa-times cursor-pointer text-[#d1410c] text-[20px]"></i></span>
                    </div>
                  
                  </div>
                </div>
              )}
              <div {...getRootProps({className: "dropzone"})} className="flex flex-col items-center w-full mt-4 border-[1px] border-dashed border-[#3659e3] py-2 px-3 rounded-md">
                <input {...getInputProps()}
                />
                <h5 className='text-black text-[18px]'>Click here to upload file</h5>
                <p className='text-black text-[18px]'>
                  Or drag and drop or{' '}
                  <Link className='underline text-[#2b6fdf] text-[18px] font-bold' href="/" onClick={e => e.preventDefault()}>Click</Link>
                </p>
                {/* <Button
                  classBtn="h-[80px] w-full text-black font-bold focus:outline-none border-[1px] border-dashed border-[#3659e3] py-2 px-3 rounded-md"
                  iconBtn='fas fa-upload text-[16px] text-black'
                  textBtn="Upload resume from your desktop"
                  onClick={handleClickBtnFileResume}
                /> */}
              </div>
            </div>
            <div className="flex flex-col items-center mt-4">
              <Button
                textBtn="Apply"
                onClick={handleApplyJob}
                classBtn="w-full text-black outline-[none] border-none focus:outline-none bg-[#2b6fdf] text-white font-bold h-[44px] rounded-md py-2 px-12"
              />
            </div>
          </div>
        </Modal>
        <section className='bg-white header px-4 pt-[96px] md:pt-20 lg:pt-20 items-center flex h-auto flex-wrap'>
          <div className="container mx-auto">
            <div className="px-0 py-0 md:px-4 md:py-8">
              <div className="flex flex-col-reverse lg:flex-row items-start gap-8">
                <div className="flex shadow flex-col mb-[16px] md:mb-0 py-4 px-4 border-solid border-[#e7e7e9] border-[1px] rounded-xl w-[100%] lg:w-auto min-w-[230px]">
                  <div className="flex justify-between items-center">
                    <h4 className="text-[20px] font-medium text-black">Related jobs</h4>
                    <Button
                      classBtn="ml-3 flex gap-1 items-center flex-row-reverse f w-auto text-[#000] border-solid border-[#e7e7e9] border-[1px] focus:outline-none py-[4px] px-2 rounded-[20px]"
                      textBtn="Filter"
                      iconBtn={isSorted ? "fas fa-sort-amount-down-alt" : 'fas fa-sort-amount-up'}
                      onClick={() => setIsSorted(!isSorted)}
                    />
                  </div>
                  <div className="h-[1px] bg-[#e7e7e9] w-full my-4"></div>
                  <div id="scrollableDiv" className="flex pb-[16px] md:pb-2 lg:pb-0 lg:flex-col gap-4 overflow-auto h-[auto] lg:h-[500px]">
                    <InfiniteScroll
                      dataLength={relatedJob?.total || 0}
                      next={handleLoadMore}
                      hasMore={relatedJob?.total > relatedJob?.list?.length}
                      className='no-scrollbar flex lg:flex-col'
                      loader={<h4>Loading...</h4>}
                      scrollableTarget="scrollableDiv"
                    >
                      {relatedJob?.list?.map((reJob: any) => {
                        const listSkillRelated = reJob?.jobTags?.filter((tag: any) => tag?.tagType === "SKILL");
                        const listLevelRelated = reJob?.jobLevels
                        return (
                          <Link
                            key={reJob.slug }
                            href={`/jobs/${reJob?.slug}`} 
                            className="group relative w-[300px] cursor-pointer px-2 py-2 md:py-2 lg:py-0"
                          >
                            <div className="rounded-xl border-[#e7e7e9] border-solid border-[1px] p-2 shadow w-full h-auto">
                              <div className='bg-[#e5eeff] p-4 rounded-xl h-auto'>
                                <div className="flex justify-between items-center mb-4">
                                  <span className="text-sm text-black px-4 py-2 rounded-[20px] bg-white font-medium">
                                    {formatStringToDate(reJob?.createdAt, { 
                                      year: 'numeric', month: 'long', 
                                      day: 'numeric'
                                    })}
                                  </span>
                                  <Link href={`/companies/${reJob.id}`}>
                                    <Image
                                      src={reJob?.avatar}
                                      alt='profile'
                                      placeholder='blur'
                                      blurDataURL={'@/public/img/placeholder.png'}
                                      className='align-middle border-none w-[50px] min-w-[50px] rounded-[50%] object-cover h-[50px]'
                                      width={0}
                                      height={0}
                                      sizes="100vw"
                                    />
                                  </Link>
                                </div>
                                <div className="flex items-start w-full justify-between">
                                  <div className="flex flex-col gap-1">
                                    <span className="text-[#3d3d4e] text-[14px] font-medium line-clamp-1">{reJob?.name}</span>
                                    <h4 className="text-black text-[20px] font-medium line-clamp-2">{reJob?.position}</h4>
                                  </div>
                                  
                                </div>
                                <div className="text-[#2b6fdf] text-[20px] font-medium line-clamp-2">
                                  {reJob?.salaryFrom?.toLocaleString()} - {job?.salaryTo?.toLocaleString()} 
                                  <span className='text-black'>{' '}{objectCurrency[job?.currencyId]}</span>
                                </div>
                                <div className='mt-1'>
                                  <i className="fas fa-map-marker-alt text-[#2b6fdf]" />
                                  <span className="text-[#000] text-[14px]">{' '}{reJob?.companyAddress?.country?.name}</span>
                                </div>
                                <div className="w-full max-w-full overflow-hidden text-ellipse">
                                  {!!listSkillRelated?.length && (
                                    <div className='flex flex-nowrap items-center gap-2 mt-2 no-scrollbar overflow-x-auto'>
                                      {listSkillRelated.map((job:any) => {
                                        return (
                                          <span key={job?.id} className="text-sm text-[#2b6fdf] px-2 py-1 rounded-[20px] border-solid border-[1px] border-[#2b6fdf]">{job?.tag?.name}</span>
                                        )
                                      })}
                                    </div>
                                  )}
                                </div>
                                {!!listLevelRelated?.length && (
                                  <div className='flex flex-nowrap items-center gap-2 mt-1 no-scrollbar overflow-x-auto'>
                                    {listLevelRelated.map((level:any) => {
                                      return (
                                        <span key={level?.id} className="text-[16x] text-[#2b6fdf] font-bold">{level?.level?.name}</span>
                                      )
                                    })}
                                  </div>
                                )}
                              </div>
                            </div>
                          </Link>
                        )
                      })}
                      {!relatedJob?.list && <span>No data</span>}
                    </InfiniteScroll>
                  </div>
                </div>
                <div className="flex-1 border-[#e7e7e9] border-[1px] rounded-xl shadow w-full">
                  <div className="bg-[#e5eeff] flex items-center w-full p-5 border-[4px] border-b-transparent border-solid border-t-[#2b6fdf] border-r-[#2b6fdf] border-l-[#2b6fdf] rounded-tr-xl rounded-tl-xl">
                    <div className="p-[4px] bg-white min-w-[60px] border-[#2b6fdf] border-[1px] rounded-md mr-2">
                      <Link href={`/companies/${job?.companyId}`}>
                        <Image
                          src={job?.companyAvatar}
                          alt='profile'
                          placeholder='blur'
                          blurDataURL={'@/public/img/placeholder.png'}
                          className='align-middle border-none w-[50px] border-[1px] object-cover h-[50px]'
                          width={0}
                          height={0}
                          sizes="100vw"
                        />
                      </Link>
                    </div>
                    <div className="flex flex-col w-full items-start">
                      <div className="flex flex-col-reverse md:flex-row items-start md:items-center justify-between w-full">
                        <div className="text-[16px] text-black font-bold text-center mb-2">{job?.position}</div>
                        <div className="text-[14px] text-[#6f7287] font-medium text-center mb-2 flex items-center gap-[4px]">
                          <span>Contact:</span>
                          <div className="w-[30px] cursor-pointer h-[30px] flex items-center justify-center p-[2px] border-[#e7e7e9] border-[1px] rounded-full">
                            <i className="fab fa-facebook text-lightBlue-600 text-[20px]"></i>
                          </div>
                          <div className="w-[30px] cursor-pointer h-[30px] flex items-center justify-center p-[2px] border-[#e7e7e9] border-[1px] rounded-full">
                            <i className="fab fa-twitter text-lightBlue-600 text-[20px]"></i>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full">
                        <div className="text-[14px] text-[#6f7287] font-medium text-center mb-2">{job?.name}</div>
                        <div className="text-[14px] text-[#313541] font-medium text-center mb-2">Posted about <b>{getTimeCreated(job?.createdAt)}</b> ago</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-5 w-[100%] md:w-auto min-w-[230px]">
                    <div className='w-full hidden md:flex justify-center'>
                      <Button
                        classBtn="h-[40px] max-w-[600px] mb-4 whitespace-nowrap w-full bg-[#2b6fdf] text-white rounded-md font-medium outline-none focus:outline-none"
                        textBtn="Apply for this position"
                        styleBtn={{
                          boxShadow: 'none'
                        }}
                        disabled={userInfo?.userType === 'RECRUITER'}
                        onClick={handleOpenApplyJob}
                      />
                    </div>
                    <div className='grid lg:grid-cols-3 md:grid-cols-3 gap-2'>
                      <div className='flex md:flex-col flex-row md:items-start gap-2'>
                        <div className="text-[14px] text-black">
                          <i className="fas fa-briefcase text-[#3d3d4e]"></i>
                          <span>{' '}Job Type</span>
                        </div>
                        <div className="text-[14px] text-[#2b6fdf] font-medium">{job?.jobTypes?.join(', ')}</div>
                      </div>
                      <div className='flex md:flex-col flex-row items-start gap-2'>
                        <div className="text-[14px] text-black">
                          <i className="fas fa-globe text-[#3d3d4e]" />
                          <span>{' '}Country</span>
                        </div>
                        <div className='flex items-center gap-1'>
                          <div className="text-[14px] text-[#2b6fdf] font-bold">{job?.companyAddress?.country?.name}</div>
                          <Image
                            src={job?.companyAddress?.country?.flagUrl}
                            alt='flag'
                            placeholder='blur'
                            blurDataURL={'@/public/img/placeholder.png'}
                            className='align-middle border-none max-w-full w-[20px] rounded-[50%] object-cover max-h-[x] h-[20px]'
                            width={0}
                            height={0}
                            sizes="100vw"
                          />
                        </div>
                      </div>
                      <div className='flex md:flex-col flex-row md:items-start gap-2'>
                        <div className="text-[14px] text-black">
                          <i className="fas fa-dollar-sign text-[#3d3d4e]" />
                          <span>{' '}Salary</span>
                        </div>
                        <div className="text-[14px] text-[#2b6fdf] font-bold">
                          <span>
                            <span className="text-[#2b6fdf] font-medium text-[14px]">
                              {job?.salaryFrom?.toLocaleString()}
                              {' - '}
                            </span>
                            <span className="text-[#2b6fdf] font-medium text-[14px]">{job?.salaryTo?.toLocaleString()}</span>
                            {' '}
                            <span className='text-black'>{objectCurrency[job?.currencyId]}</span>
                          </span>
                        </div>
                      </div>
                      <div className='flex md:flex-col flex-row md:items-start gap-2'>
                        <div className="text-[14px] text-black">
                          <i className="fas fa-calendar-times text-[#3d3d4e]"></i>
                          <span>{' '}Deadline</span>
                        </div>
                        <div className="text-[14px] text-[#2b6fdf] font-medium">
                          {formatStringToDate(job?.deadline, { 
                            year: 'numeric', month: 'long', 
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                      <div className='flex md:flex-col flex-row md:items-start gap-2'>
                        <div className="text-[14px] text-black">
                          <i className="fas fa-calendar-day text-[#3d3d4e]"></i>
                          <span>{' '}Day working</span>
                        </div>
                        <div className="text-[14px] text-[#2b6fdf] font-medium">
                          {job?.workingDays}
                        </div>
                      </div>
                    </div>
                    <div className="border-t-[1px] border-dashed border-[#2b6fdf] w-full my-6"></div>
                    <div>
                      <h2 className="text-black text-[18px] font-bold">Your skills and experience</h2>
                      <div className="flex flex-col gap-2">
                        <h4 className="text-black font-bold text-[16px]">Skills:</h4>
                        {!!listSkill?.length && (
                          <div className='flex flex-nowrap items-center gap-2 mt-2 no-scrollbar overflow-x-auto'>
                            {listSkill.map((skill:any) => {
                              return (
                                <span key={skill?.id} className="text-sm text-white font-medium px-2 py-1 rounded-[20px] bg-[#2b6fdf]">
                                  {skill?.tag?.name}
                                </span>
                              )
                            })}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 mt-4">
                        <h4 className="text-black font-bold text-[16px]">Levels:</h4>
                        {!!listLevel?.length && (
                          <div className='flex flex-nowrap items-center gap-2 mt-1 no-scrollbar overflow-x-auto'>
                            {listLevel.map((level:any) => {
                              return (
                                <span key={level?.id} className="text-sm text-[#6f7287] font-medium px-2 py-1 rounded-[20px] bg-blueGray-200">
                                  {level?.level?.name}
                                </span>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="border-t-[1px] border-dashed border-[#2b6fdf] w-full my-6"></div>
                    <div className="flex flex-col gap-2">
                      <h4 className="text-black font-bold text-[18px]">Overview</h4>
                      <div
                        className='pb-4 mt-4'
                        dangerouslySetInnerHTML={{
                          __html: job?.overview ? job?.overview : '',
                        }}
                      ></div>
                    </div>
                    <div className="border-t-[1px] border-dashed border-[#2b6fdf] w-full my-6"></div>
                    <div className="flex flex-col gap-2 mt-4">
                      <h4 className="text-black font-bold text-[18px]">Description</h4>
                      <div
                        className='pb-4 mt-4'
                        dangerouslySetInnerHTML={{
                          __html: job?.description ? job?.description : '',
                        }}
                      ></div>
                    </div>
                    <div className="border-t-[1px] border-dashed border-[#2b6fdf] w-full my-6"></div>
                    <div className="flex flex-col gap-2 mt-4">
                      <h4 className="text-black font-bold text-[18px]">Qualications: </h4>
                      <div
                        className='pb-4 mt-4'
                        dangerouslySetInnerHTML={{
                          __html: job?.qualification ? job?.qualification : '',
                        }}
                      ></div>
                    </div>  
                    <div className="h-[1px] bg-[#2b6fdf] w-full my-6"></div>
                    <div>
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <h3 className="text-[24px] text-black font-bold line-clamp-2">{company?.name}</h3>
                        <Link href={job?.website || ''} target='_blank' className="text-[#2b6fdf] underline whitespace-nowrap">Visit website</Link>
                      </div>
                      <div className='grid lg:grid-cols-3 md:grid-cols-3 gap-4 mt-2'>
                        <p className="text-[14px] text-black flex flex-row md:flex-col font-medium gap-2">
                          <span className="text-[#6f7287]">Company type</span>
                          <span className="text-[16px]">{company?.companyTypes?.join(', ')}</span>
                        </p>
                        <p className="text-[14px] text-black flex flex-row md:flex-col font-medium gap-2">
                          <span className="text-[#6f7287]">Company size</span>
                          <span className="text-[16px]">{company?.companySizeFrom}-{company?.companySizeFrom}</span>
                        </p>
                        <p className="text-[14px] text-black flex flex-row items-center md:flex-col font-medium gap-2">
                          <span className="text-[#6f7287]">Country</span>
                          <div className='flex items-center gap-2'>
                            {memoCountries?.map((item: any) => {
                              return (
                                <div key={item?.id} className="flex items-center gap-1">
                                  <div className="text-[16px] text-black font-medium">{item?.country?.name}</div>
                                  <Image
                                    src={item?.country?.flagUrl}
                                    alt='flag'
                                    placeholder='blur'
                                    blurDataURL={'@/public/img/placeholder.png'}
                                    className='align-middle border-none max-w-full w-[20px] rounded-[50%] object-cover max-h-[x] h-[20px]'
                                    width={0}
                                    height={0}
                                    sizes="100vw"
                                  />
                                </div>
                              )
                            })}
                          </div>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="w-full bg-white sticky bottom-0 md:hidden flex justify-center px-8 py-3 border-t-[1px] border-solid border-[#e7e7e9]">
          <Button
            classBtn="h-[40px] whitespace-nowrap w-full bg-[#2b6fdf] text-white rounded-md font-medium outline-none focus:outline-none"
            textBtn="Apply for this position"
            styleBtn={{
              boxShadow: 'none'
            }}
            disabled={userInfo?.userType === 'RECRUITER'}
            onClick={handleOpenApplyJob}
          />
        </div>
        <Footer hiddenDecord />
      </div>
    </>
  );
}

export default JobDetail

export async function getServerSideProps(context: any) {
  try {
    const { params } = context;
    const jobId = params?.jobId as string;
    const response = await ServiceJob.getJobDetailsPublic(jobId);
    const data = response?.data;

    if (!data?.id) {
      return {
        notFound: true,
      };
    }
    return {
      props: {
        job: data,
      },
    };
  }catch(e) {
    return {
      notFound: true,
    };
  }
}