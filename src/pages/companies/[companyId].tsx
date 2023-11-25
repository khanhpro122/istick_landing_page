// Libraries
import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';

// Components
import Navbar from '@/components/Navbars/IndexNavbar';
import Footer from '@/components/Footers/Footer';
import { Button } from '@/components/Buttons/Button';
import { Loading } from '@/components/Loading/Loading';

// Services
import * as ServiceCompany from '@/services/company'
import * as ServiceJob from '@/services/job'

// Utils
import { formatStringToDate } from '@/utils';

type TTypeProps = {
  company: any
};

const Company: NextPage<TTypeProps> = ({company}) => {
  const [limitState, setLimitState] = useState(9);
  const divScrollRef = useRef<HTMLDivElement | null>(null);

  const fetchJobByCompany = async (limitState: number) => {
    const res = await ServiceJob.getJobByCompanyId(limitState, 1, company?.id, true)
    return res.data
  }

  const {data: jobs, isLoading } = useQuery(['jobs', company?.id, limitState], 
    () => fetchJobByCompany(limitState), 
    {staleTime: 1000 * 60, retryDelay: 2000, retry: 1, keepPreviousData: true }
  )
  // useEffect(() => {
  //   const handleScroll = () => {
  //     const div = divScrollRef.current;
  //     if (div) {
  //       const { scrollTop, scrollHeight, clientHeight } = div;
  //       if ((scrollTop + clientHeight + 30) >= scrollHeight) {
  //         console.log('call api ', isPreviousData)
  //         setLimitState((prev) => prev + 3)
  //       }
  //     }
  //   };

  //   const div = divScrollRef.current;
  //   if (div) {
  //     div.addEventListener('scroll', handleScroll);
  //   }

  //   return () => {
  //     if (div) {
  //       div.removeEventListener('scroll', handleScroll);
  //     }
  //   };
  // }, []);
  const memoCountries = useMemo(() => {
    const countries:any = [];
    const cities:any = [];
    const citiesExisted:any = [];
    const countriesExisted:any = [];
    company?.companyAddresses?.forEach((item:any) => {
      if(!countriesExisted?.includes(item?.country?.id)) {
        countries.push(item?.country)
      }
      if(!citiesExisted?.includes(item?.city?.id)) {
        cities.push({...item?.city, address: item?.address})
      }
      countriesExisted?.push(item?.country?.id)
      citiesExisted?.push(item?.city?.id)
    })
    return {
      countries,
      cities
    }
  }, [company?.companyAddresses])
  
  return (
    <>
      <Navbar fixed isShowAuth />
      <div id="container" className="bg-[#dbe0e1]"
      >
        <Loading isLoading={isLoading} />
        <section className='bg-[#e5eeff] header px-6 md:px-4 pt-20 items-center flex h-auto'>
          <div className="container mx-auto">
            <div className="px[0] pb-[0] md:px-4 md:pd-8 lg:px-4">
              <div className="py-8">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-8 lg:gap-12 p w-full">
                  <Image
                    src={company?.avatar}
                    alt='avatar'
                    placeholder='blur'
                    blurDataURL={'@/public/img/placeholder.png'}
                    className='align-middle border-none max-w-full w-[160px] rounded-md object-cover max-h-[x] h-[160px]'
                    width={0}
                    height={0}
                    sizes="100vw"
                  />
                  <div className='flex flex-col md:items-start'>
                    <div className="flex flex-col md:flex-row lg:items-center gap-4 ">
                      <div className="text-[16px] text-black font-medium text-center">
                        <span><i className="fas fa-map-marker-alt text-[#2b6fdf]"></i>{' '}</span>
                        {memoCountries?.cities?.map((item:any, index:number) => {
                          return (
                            <span key={item?.id} >{item?.name}{index < memoCountries?.cities?.length - 1 && ', '}</span>
                          )
                        })}
                      </div>
                      <div className="text-[16px] text-black font-medium text-center">
                        <span><i className="fas fa-suitcase text-[#2b6fdf]"></i>{' '}</span>
                        <span className="underline">
                          {jobs?.total > 0 ? `${jobs?.total} jobs` : `${jobs?.total || 0} job`} opening
                        </span>
                      </div>
                    </div>

                    <div className='flex items-center gap-4 mt-6'>
                      <Button
                        classBtn='h-[46px] w-[160px] md:w-[180px] bg-[#3659e3] text-white rounded-md font-bold px-7 '
                        textBtn='Write review'
                      />
                      <Button
                        classBtn='h-[46px] border-[1px] w-[160px] md:w-[180px] border-solid border-[#3659e3] bg-white text-[#3659e3] rounded-md font-bold px-7 '
                        textBtn='Follow'
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="bg-[#f7f7f7]">
          <div className="container mx-auto">
            <div className="px[0] pb-[0] md:px-4 md:pd-8 lg:px-4">
              <div className='flex flex-col lg:flex-row lg:gap-4'>
                <div className='w-[100%] lg:w-[70%] mt-8 lg:my-8'>
                  <div className='bg-white p-4 shadow rounded-md'>
                    <h2 className="text-black text-[22px] font-bold">General information</h2>
                    <div className="border-[#2b6fdf] border-dashed border-[1px] w-full my-4"></div>
                    <div className='grid grid-cols-3'>
                      <div>
                        <div className="text-[14px] text-[#6f7287] font-medium">
                          Job Type
                        </div>
                        {company?.companyTypes?.map((typeCompany: string) => {
                          return (
                            <div key={typeCompany} className="text-[16px] text-black font-medium mt-1">{typeCompany}</div>
                          )
                        })}
                      </div>
                      <div>
                        <div className="text-[14px] text-[#6f7287] font-medium">
                          Company size
                        </div>
                        <div className="text-[16px] text-black font-medium mt-1">{company?.companySizeFrom}{' - '}{company?.companySizeTo} employees</div>
                      </div>
                      <div>
                        <div className="text-[14px] text-[#6f7287] font-medium">
                          Country
                        </div>
                        {memoCountries?.countries?.map((item: any) => {
                          return (
                            <div className="flex items-center gap-1"  key={item?.id}>
                              <div className="text-[16px] text-black font-medium mt-1">{item?.name}</div>
                              <Image
                                src={item?.flagUrl}
                                alt='lag'
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
                      <div className='mt-6'>
                        <div className="text-[14px] text-[#6f7287] font-medium">
                          Working days
                        </div>
                        <div className="text-[16px] text-black font-medium mt-1">{company?.workingDays}</div>
                      </div>
                    </div>
                  </div>
                  <div className='bg-white p-4 shadow rounded-md mt-6'>
                    <h2 className="text-black text-[22px] font-bold">Company overview</h2>
                    <div className="border-[#2b6fdf] border-dashed border-[1px] w-full my-4"></div>
                    <div
                      className='my-4 text-[16px] text-black'
                      dangerouslySetInnerHTML={{
                        __html: company?.overview ? company?.overview : '',
                      }}
                    ></div>
                    <div className="border-[#2b6fdf] border-dashed border-[1px] w-full my-4"></div>
                    <Link className='text-[16px] text-[#2b6fdf] font-medium' href={company?.website || ''} target='_blank'>
                      <i className="fas fa-globe"></i>
                      <span>{' '} Company website</span>
                    </Link>
                  </div>
                  <div className='bg-white p-4 shadow rounded-md mt-6'>
                    <h2 className="text-black text-[22px] font-bold">Description</h2>
                    <div className="border-[#2b6fdf] border-dashed border-[1px] w-full my-4"></div>
                    <div
                      className='my-4 text-[16px] text-black'
                      dangerouslySetInnerHTML={{
                        __html: company?.description ? company?.overview : '',
                      }}
                    ></div>
                  </div>
                  <div className='bg-white p-4 shadow rounded-md mt-6'>
                    <h2 className="text-black text-[22px] font-bold">Why you&lsquo;ll love working heree</h2>
                    <div className="border-[#2b6fdf] border-dashed border-[1px] w-full my-6"></div>
                    <div
                      className='my-4 text-[16px] text-black'
                      dangerouslySetInnerHTML={{
                        __html: company?.culture ? company?.culture : '',
                      }}
                    ></div>
                  </div>
                  <div className='bg-white p-4 shadow rounded-md mt-6'>
                    <h2 className="text-black text-[22px] font-bold">Location</h2>
                    <div className="border-[#2b6fdf] border-dashed border-[1px] w-full my-6"></div>
                    <div className="flex flex-col gap-2">
                      {company?.companyAddresses?.map((item:any) => {
                        return (
                          <div key={item?.id} className='flex items-center gap-1 text-[16px] text-black font-medium  border-[1px] border-solid border-[#2b6fdf] rounded-md p-3'>
                            <span><i className="fas fa-map-marker-alt text-[#2b6fdf]"></i>{' '}</span>
                            <span key={item?.id}>{item?.address}, {item?.city?.name}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
                <div className='w-[100%] lg:w-[30%] my-6'>
                  <h2 className="text-black text-[22px] font-bold pl-2 mb-2">
                    {jobs?.total > 0 ? `${jobs?.total} jobs` : `${jobs?.total || 0} job`} opening
                  </h2>
                  <div className="flex flex-[row] overflow-auto lg:flex-col max-h-[100vh]" ref={divScrollRef}>
                    {jobs?.list?.map((job: any) => {
                      const listSkill = job?.jobTags?.filter((tag: any) => tag?.tagType === "SKILL")
                      const listLevel = job?.jobTags?.filter((tag: any) => tag?.tagType === "LEVEL")
                      return (
                        <Link
                          key={job?.slug}
                          href={`/jobs/${job?.slug}`}
                          className="min-w-[300px] group relative w-full cursor-pointer px-2 py-2 md:py-2 lg:py-0 lg:min-w-[300px] max-w-[400px]"
                        >
                          <div className="rounded-xl border-[#e7e7e9] border-solid border-[1px] p-2 shadow w-full h-auto">
                            <div className='bg-[#eceff4] p-4 rounded-xl'>
                              <div className="flex justify-between items-center mb-4">
                                <span className="text-sm text-black px-4 py-2 rounded-[20px] bg-white font-medium">
                                  {formatStringToDate(job?.createdAt, { 
                                    year: 'numeric', month: 'long', 
                                    day: 'numeric'
                                  })}
                                </span>
                              </div>
                              <div className="flex items-start w-full justify-between">
                                <div className="flex flex-col gap-1">
                                  <span className="text-[#3d3d4e] text-[14px] font-medium">{job?.name}</span>
                                  <h4 className="text-black text-[20px] font-medium">{job?.position} upto ${job?.salaryTo}</h4>
                                </div>
                                <Image
                                  src={job?.avatar || "/img/profile.png"}
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
                                {!!listSkill?.length && (
                                  <div className='flex flex-wrap items-center gap-2'>
                                    {listSkill.map((job:any) => {
                                      return (
                                        <span key={job?.id} className="text-sm text-[#2b6fdf] px-2 py-1 rounded-[20px] border-solid border-[1px] border-[#2b6fdf]">{job?.tag?.name}</span>
                                      )
                                    })}
                                  </div>
                                )}
                              </div>
                              {!!listLevel?.length && (
                                <div className='flex flex-wrap items-center gap-2 mt-2'>
                                  {listLevel.map((level:any) => {
                                    return (
                                      <span key={level?.id} className="text-[16x] text-[#2b6fdf] font-bold">{level?.tag?.name}</span>
                                    )
                                  })}
                              
                                </div>
                              )}
                            </div>
                            <div className="items-center justify-between flex m-4">
                              <div>
                                <i className="fas fa-map-marker-alt text-[#3d3d4e]" />
                                <span className="text-[#000] text-[14px]">{' '}{job?.location}</span>
                              </div>
                              <Button
                                classBtn="h-auto whitespace-nowrap w-auto bg-[#2b6fdf] text-white px-4 py-2 rounded-[20px] font-medium focus:outline-none"
                                textBtn="View job"
                              />
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                  
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
};

export default Company;

export async function getServerSideProps(context: any) {
  try {
    const { params } = context;
    const companyId = params?.companyId as string;
    const response = await ServiceCompany.getDetailCompany(companyId);
    const data = response?.data;
    if (!data?.id) {
      return {
        notFound: true,
      };
    }
    return {
      props: {
        company: data,
      },
    };
  }catch(e) {
    return {
      notFound: true,
    };
  }
}
