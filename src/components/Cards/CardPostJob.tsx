// Libraries
import { NextPage } from 'next';
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

// Component
import Image from 'next/image';
import { Button } from '../Buttons/Button';
import Modal from '../Modals';

// Services
import * as ServiceJob from '@/services/job';
import * as ServiceCompany from '@/services/company';
import * as ServiceSystem from "@/services/system"

// Utils
import { formatStringToDate, getTimeCreated } from '@/utils';
import { useRouter } from 'next/router';

type TProps = {
  item: any
}
export const CardPostJob: NextPage<TProps> = ({item}) => {
  const [isSeeking, setIsSeeking] = useState(false);
  const [isOpenModalReview, setIsOpenModalReview] = useState(false);
  const [isOpenModalStatus, setIsOpenModalStatus] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [company, setCompany] = useState<any>({});
  const [objectCurrency, setObjectCurency] = useState<any>({})

  const router = useRouter();

  const queryClient = useQueryClient()

  // fetch api

  const fetchDeleteJob = async (id: string) => {
    const response = await ServiceJob.deleteJob(id)
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

  useEffect(() => {
    if(item?.companyId) {
      fetchDetailCompany(item?.companyId)
    }
  }, [item?.companyId])

  useEffect(() => {
    fetchCurrencies()
  }, [])

  const mutationDeleteJob = useMutation(['deleteJob'], fetchDeleteJob)

  const onCloseModalReview = () => {
    setIsOpenModalReview(false);
  };
  
  const onCloseModalStatus = () => {
    setIsOpenModalStatus(false)
    setIsSeeking(!isSeeking)
  }
  
  const toggleStatusSeeking = () => {
    setIsOpenModalStatus(!isOpenModalStatus)
  }

  const handleClickDelete = () => {
    setIsDeleted(!isDeleted)
  }

  const onCloseModalDelete = () => {
    setIsDeleted(false)
  }

  const handleViewListResumeApply = () => {
    router.push(`/hiring/resume/${item?.id}`)
  }

  const handleConfirmDeleteJob = () => {
    mutationDeleteJob.mutate(item?.id, {
      onSuccess: () => {
        queryClient.invalidateQueries(['jobs'])
        toast.success('Delete job is successed!', {
          position: toast.POSITION.BOTTOM_LEFT,
        });
      },
      onError:() => {
        toast.error('Delete job is failed, Please try again!', {
          position: toast.POSITION.BOTTOM_LEFT,
        });
      },
      onSettled: () => {
        onCloseModalDelete()
      }
    })
  }

  const listSkill = item?.jobTags?.filter((tag: any) => tag?.tagType === "SKILL");
  const listLevel = item?.jobLevels

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

  return (
    <>
      <Modal isOpen={isOpenModalReview} closeModal={onCloseModalReview}>
        <div className="bg-white p-5 rounded-md lg:min-w-[800px] overflow-auto" style={{maxHeight: '80vh'}}>
          <div className='text-right'>
            <Button
              iconBtn="fas fa-times text-[20px]"
              classBtn="h-[32px] w-[32px] text-black outline-[none] border-none focus:outline-none"
              onClick={onCloseModalReview}
            />
          </div>
          <div className="flex items-center w-full p-5 border-solid border-b-[#e7e7e9] border-b-[1px]">
            <div className="p-[4px] min-w-[60px] border-[#e7e7e9] border-[1px] rounded-md mr-2">
              <div>
                <Image
                  src={item?.companyAvatar}
                  alt='companyAvatar'
                  placeholder='blur'
                  blurDataURL={'@/public/img/placeholder.png'}
                  className='align-middle border-none w-[50px] object-cover rounded-[50%] h-[50px] '
                  width={0}
                  height={0}
                  sizes="100vw"
                />
              </div>
            </div>
            <div className="flex flex-col w-full items-start">
              <div className="flex flex-col-reverse md:flex-row items-start md:items-center justify-between w-full">
                <div className="text-[18px] text-black font-bold text-center mb-2">{item?.position}</div>
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
                <div className="text-[16px] text-[#6f7287] font-medium text-center mb-2">{item?.name}</div>
                <div className="text-[14px] text-[#313541] font-medium text-center mb-2">Posted about <b>{getTimeCreated(item?.createdAt)}</b> ago</div>
              </div>
            </div>
          </div>
          <Button
            textBtn="Apply now"
            classBtn="mb-4 w-full outline-[none] border-none focus:outline-none bg-[#2b6fdf] text-white font-bold h-[44px] rounded-md py-2 px-12"
          />
          <div className='grid lg:grid-cols-3 md:grid-cols-3 gap-2'>
            <div className='flex md:flex-col flex-row items-start gap-2'>
              <div className="text-[14px] text-black">
                <i className="fas fa-briefcase text-[#3d3d4e]"></i>
                <span>{' '}Job Type</span>
              </div>
              <div className="text-[14px] text-[#2b6fdf] font-bold">{item?.jobTypes?.join(', ')}</div>
            </div>
            <div className='flex md:flex-col flex-row items-start gap-2'>
              <div className="text-[14px] text-black">
                <i className="fas fa-globe text-[#3d3d4e]" />
                <span>{' '}Country</span>
              </div>
              <div className='flex items-center gap-1'>
                <div className="text-[14px] text-[#2b6fdf] font-bold">{item?.companyAddress?.country?.name}</div>
                <Image
                  src={item?.companyAddress?.country?.flagUrl}
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
            <div className='flex md:flex-col flex-row items-start gap-2'>
              <div className="text-[14px] text-black">
                <i className="fas fa-dollar-sign text-[#3d3d4e]" />
                <span>{' '}Salary</span>
              </div>
              <div className="text-[14px] text-[#2b6fdf] font-bold">
                <span>
                  <span className="text-[#2b6fdf] font-medium text-[14px]">
                    {item?.salaryFrom?.toLocaleString()}
                    {' - '}
                  </span>
                  <span className="text-[#2b6fdf] font-medium text-[14px]">{item?.salaryTo?.toLocaleString()}</span>
                  {' '}
                  <span className='text-black'>{objectCurrency[item?.currencyId]}</span>
                </span>
              </div>
            </div>
            <div className='flex md:flex-col flex-row items-start gap-2'>
              <div className="text-[14px] text-black">
                <i className="fas fa-calendar-times text-[#3d3d4e]"></i>
                <span>{' '}Deadline</span>
              </div>
              <div className="text-[14px] text-[#2b6fdf] font-bold">
                {formatStringToDate(item?.deadline, { 
                  year: 'numeric', month: 'long', 
                  day: 'numeric'
                })}
              </div>
            </div>
            <div className='flex md:flex-col flex-row items-start gap-2'>
              <div className="text-[14px] text-black">
                <i className="fas fa-calendar-day text-[#3d3d4e]"></i>
                <span>{' '}Day working</span>
              </div>
              <div className="text-[14px] text-[#2b6fdf] font-bold">
                {item?.workingDays}
              </div>
            </div>
          </div>
          <div className="border-t-[1px] border-dashed border-[#e7e7e9] w-full my-6"></div>
          <div>
            <h2 className="text-black text-[18px] font-bold">Your skills and experience</h2>
            <div className="flex flex-col gap-2">
              <h4 className="text-black font-bold text-[16px]">Skills:</h4>
              {!!listSkill?.length && (
                <div className='flex flex-wrap items-center gap-4'>
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
                <div className='flex flex-wrap items-center gap-4'>
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
          <div className="flex flex-col gap-2 mt-4">
            <h4 className="text-black font-bold text-[18px]">Overview</h4>
            <div
              className='pb-4 mt-4'
              dangerouslySetInnerHTML={{
                __html: item?.overview ? item?.overview : '',
              }}
            ></div>
          </div>
          <div className="border-t-[1px] border-dashed border-[#e7e7e9] w-full my-6"></div>
          <div className="flex flex-col gap-2 mt-4">
            <h4 className="text-black font-bold text-[18px]">Description</h4>
            <div
              className='pb-4 mt-4'
              dangerouslySetInnerHTML={{
                __html: item?.description ? item?.description : '',
              }}
            ></div>
          </div>
          <div className="border-t-[1px] border-dashed border-[#e7e7e9] w-full my-6"></div>
          <div className="flex flex-col gap-2 mt-4">
            <h4 className="text-black font-bold text-[18px]">Qualications: </h4>
            <div
              className='pb-4 mt-4'
              dangerouslySetInnerHTML={{
                __html: item?.qualification ? item?.qualification : '',
              }}
            ></div>
          </div>
          <div className="h-[1px] bg-[#e7e7e9] w-full my-6"></div>
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-[24px] text-black font-bold">{company?.name}</h3>
              <div className="text-[#2b6fdf] underline">Visit website</div>
            </div>
            <div className='grid lg:grid-cols-3 md:grid-cols-3 gap-4 mt-2'>
              <p className="text-[14px] text-black flex flex-row md:flex-col font-medium gap-2">
                <span className="text-[#6f7287]">Company type</span>
                {company?.companyTypes?.map((typeCompany: string) => {
                  return (
                    <span key={typeCompany} className="text-[16px]">{typeCompany}</span>
                  )
                })}
              </p>
              <p className="text-[14px] text-black flex flex-row md:flex-col font-medium gap-2">
                <span className="text-[#6f7287]">Company size</span>
                <span className="text-[16px]">{company?.companySizeFrom}-{company?.companySizeTo}</span>
              </p>
              <p className="text-[14px] text-black flex flex-row md:flex-col font-medium gap-2">
                <span className="text-[#6f7287]">Country</span>
                <div className='flex items-center gap-2'>
                  {memoCountries?.map((item: any) => {
                    return (
                      <div key={item?.id} className="flex items-center gap-1">
                        <div className="text-[16px] text-black font-medium mt-1">{item?.country?.name}</div>
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
      </Modal>
      <Modal isOpen={isOpenModalStatus} closeModal={onCloseModalStatus}>
        <div className="bg-white p-5 rounded-md">
          <div className='text-right'>
            <Button
              iconBtn="fas fa-times text-[20px]"
              classBtn="h-[32px] w-[32px] text-black outline-[none] border-none focus:outline-none"
              onClick={onCloseModalStatus}
            />
          </div>
          <h2 className="text-[20px] text-center text-black font-medium mt-2">Your cadicate seeking status is now{' '}
            {!isSeeking ? (
              <span className="text-[#0ab305]">ON</span>
            ) : (
              <span className="text-[#ff9119]">OFF</span>
            )}
          </h2>
          <div className="flex flex-col items-center mt-4">
            <Button
              textBtn="OK"
              onClick={onCloseModalStatus}
              classBtn="w-auto text-black outline-[none] border-none focus:outline-none bg-[#2b6fdf] text-white font-bold h-[44px] rounded-md py-2 px-12"
            />
          </div>
        </div>
      </Modal>
      {/* <Modal isOpen={isDeleted} closeModal={onCloseModalDelete}>
        <div className="py-4 px-4 rounded-[20px] shadow-lg my-4 border-[1px] bg-white border-solid border-[#e7e7e9] max-h-[90vh] overflow-auto">
          <div className='flex items-center justify-between'>
            <h4 className="text-black font-bold text-[20px]">Delete Job</h4>
            <Button
              iconBtn="fas fa-times text-[20px]"
              classBtn="h-[32px] w-[32px] text-black outline-[none] border-none focus:outline-none"
              onClick={onCloseModalDelete}
            />
          </div>
          <h4 className="text-black font-medium text-[16px] my-4">Are you sure to delete this item?</h4>
          <div className="h-[1px] bg-[#e7e7e9] w-full my-2"></div>
          <div className="flex gap-2 justify-end">
            <Button
              classBtn="h-[40px] w-auto text-black focus:outline-none font-medium hover:bg-[#f7f7f7] rounded-md py-2 px-6"
              textBtn='Cancel'
              onClick={() => setIsEdited(!isEdited)}
            />
            <Button
              classBtn="h-[40px] w-auto text-white font-bold focus:outline-none bg-[#3659e3] rounded-md py-2 px-6"
              textBtn='Delete'
              onClick={handleConfirmDeleteJob}
            />
          </div>
        </div>
      </Modal> */}
      <div className="h-full w-full">
        <div className="py-10 px-12 rounded-[20px] shadow-lg my-4 border-[1px] border-solid border-[#e7e7e9]">
          <div className="flex items-center gap-4 md:gap-8 lg:gap-12 flex-wrap w-full">
            <Link href={`/companies/${item?.slug}`}>
              <Image
                src={item?.companyAvatar}
                alt='companyAvatar'
                placeholder='blur'
                blurDataURL={'@/public/img/placeholder.png'}
                className='align-middle border-none max-w-full w-[160px] rounded-[50%] object-cover max-h-[x] h-[160px]'
                width={0}
                height={0}
                sizes="100vw"
              />
            </Link>
            <div className='flex-1'>
              <div className='flex items-center justify-between'>
                <Link href={`/companies/${item?.slug}`} className="text-[32px] text-black font-bold">{item?.position}</Link>
                <Button
                  classBtn="h-[30px] w-auto text-[#2b6fdf] focus:outline-none"
                  iconBtn='far fa-edit text-[24px]'
                  onClick={() => router.push(`/hiring/edit/job/${item?.slug}`)}
                />
              </div>
              <h5 className="text-[16px] text-black font-bold mb-2">{item?.name}</h5>
              <div className='grid lg:grid-cols-3 gap-1 md:gap-1 lg:gap-0'>
                <p className="text-[16px] text-black flex items-center gap-1 mt-[4px] lg:mt-2">
                  <span><i className="far fa-clock text-black text-[16px]"></i></span>
                  <span>{'  '}<b>{getTimeCreated(item?.createdAt)}</b> ago</span>
                </p>
                <p className="text-[16px] text-black flex items-center gap-1 mt-[4px] lg:mt-2">
                  <span><i className="fas fa-globe text-black text-[16px]"></i></span>
                  <div className='flex items-center gap-1'>
                    <div className="text-[14px] text-black font-bold">{item?.companyAddress?.country?.name}</div>
                    <Image
                      src={item?.companyAddress?.country?.flagUrl}
                      alt='flag'
                      placeholder='blur'
                      blurDataURL={'@/public/img/placeholder.png'}
                      className='align-middle border-none max-w-full w-[20px] rounded-[50%] object-cover max-h-[x] h-[20px]'
                      width={0}
                      height={0}
                      sizes="100vw"
                    />
                  </div>
                </p>
                <p className="text-[16px] text-black flex items-center gap-1 mt-[4px] lg:mt-2">
                  <span><i className="fas fa-dollar-sign text-black text-[16px]"></i></span>
                  <span>{'  '}{item?.salaryFrom?.toLocaleString()} - {item?.salaryTo?.toLocaleString()}</span>
                  <span className='text-black'>{objectCurrency[item?.currencyId]}</span>
                </p>
                <p className="text-[16px] text-black flex items-center gap-1 mt-[4px] lg:mt-2">
                  <span><i className="fas fa-map-marker-alt text-black text-[16px]"></i></span>
                  <span>{'  '}{item?.companyAddress?.address}{'  '}{item?.companyAddress?.city?.name}</span>
                </p>
              </div>
            </div>
          </div>
          <div className="h-[1px] bg-[#e7e7e9] w-full my-6"></div>
          <div className="flex justify-between flex-col md:flex-row">
            <div>
              <div>
                <span className="text-[20px] text-[#0ab305] font-bold"><i className="fas fa-eye"></i></span>
                {' '}Review your job:
                <Button
                  classBtn="text-[#2b6fdf] focus:outline-none ml-4 font-medium"
                  textBtn={'Review'}
                  onClick={() => setIsOpenModalReview(true)}
                />
              </div>
              <div className="mt-2">
                {isSeeking ? (
                  <span className="text-[20px] text-[#0ab305] font-bold"><i className="fas fa-unlock"></i></span>
                ) : (
                  <span className="text-[20px] text-[#ff9119] font-bold"><i className="fas fa-lock"></i></span>
                )}
                {' '}Your job candicate status:{' '}
                {isSeeking ? (
                  <span className="text-[16px] text-[#0ab305] font-bold">ON</span>
                ) : (
                  <span className="text-[16px] text-[#ff9119] font-bold">OFF</span>
                )}
                <Button
                  classBtn="text-[#2b6fdf] focus:outline-none ml-4 font-medium"
                  textBtn={isSeeking ? 'Turn off' : 'Turn on'}
                  onClick={toggleStatusSeeking}
                />
              </div>
            </div> 
            <Button
              classBtn="mt-4 md:mt-0 h-[40px] bg-[#2b6fdf] w-auto focus:outline-none rounded-md border-[1px] py-1 px-2 text-white"
              iconBtn='fas fa-eye text-[16px]'
              onClick={handleViewListResumeApply}
              textBtn="View CV applied"
            />
          </div>
                  
        </div>
      </div>
    </>
  );
}
