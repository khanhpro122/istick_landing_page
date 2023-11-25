// Libraries
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

// Components
import { Button } from '@/components/Buttons/Button';
import Footer from '@/components/Footers/Footer';
import Navbar from '@/components/Navbars/IndexNavbar';
import Dropdown from '@/components/Dropdowns/Dropdown'
import { InputSearch } from '@/components/Inputs/InputSearch';

// Services
import * as ServiceResearch from '@/services/research'
import { convertSecondsToTime } from '@/utils';
import Head from 'next/head';

type TDataList = {
  id: number;
  slug: string;
  bannerUrl: string;
  title: string;
  type: string;
  description: string;
  status: 'DRAFT' | 'PUBLISHED',
  field?: string,
  overview?:string,
  timeToRead?:number,
}

type ResponseData = {
  list: TDataList[],
  total: number,
}


function Index() {
  const [focusInput, setFocusInput] = useState(false);
  const [activeType, setActiveType] = useState('all');
  const [limitState, setLimitState] = useState(6)

  const handleActiveType = (type:string) => {
    setActiveType(type)
  }
  
  const fetchListResearch = async (limitState: number):Promise<ResponseData> => {
    const res = await ServiceResearch.getListResearch(1, limitState, true)
    return res.data
  }

  const {data, isLoading, isPreviousData} = useQuery(['researchs', limitState], () => fetchListResearch(limitState), {staleTime: 1000 * 60,keepPreviousData: true})
  return (
    <>
      <Head>
        <title>Research</title>
      </Head>
      <Navbar fixed isShowAuth />
      <div id="container" className="bg-[#dbe0e1]"
      >
        <section className='bg-[#171721] header px-0 md:px-8 pt-20 h-auto'>
          <div className="container mx-auto">
            <div className="flex items-center justify-between px-8">
              <div className="gap-4 text-black hidden lg:flex flex-wrap mt-4 mb-8">
                <div 
                  onClick={() => handleActiveType('all')}
                  className={'text-white px-2 py-1 rounded-[4px] cursor-pointer  font-medium' + (
                    activeType === 'all' ? ' bg-[#45454d]' : ' bg-transparent'
                  )}
                >All posts</div>
                <div 
                  onClick={() => handleActiveType('engineer')}
                  className={'text-white px-2 py-1 rounded-[4px] cursor-pointer  font-medium' + (
                    activeType === 'engineer' ? ' bg-[#45454d]' : ' bg-transparent'
                  )}
                >Engineer</div>
                <div 
                  onClick={() => handleActiveType('product')}
                  className={'text-white px-2 py-1 rounded-[4px] cursor-pointer  font-medium' + (
                    activeType === 'product' ? ' bg-[#45454d]' : ' bg-transparent'
                  )}
                >Product</div>
              </div>
              <div className="flex items-center gap-4 md:gap-8 lg:gap-0 w-full lg:w-auto justify-between mt-[16px] mb-8 lg:mt-0 lg:mb-0">
                <div className={"flex-[1] md:flex-[unset] w-auto" + (
                  focusInput ? ' hidden md:block lg:hidden' : ' block lg:hidden'
                )}>
                  <Dropdown
                    options={[
                      {label: 'All posts', value: 'all'},
                      {label: 'Engineer', value: 'engineer'},
                      {label: 'Product', value: 'product'},
                    ]}
                    mode="dark"
                    value={activeType}
                    onChange={handleActiveType}
                  />
                </div>
                <div className={(focusInput ? " w-[100%] md:w-auto md:min-w-[300px] lg:w-auto lg:min-w[330px]" : ' w-auto')}>
                  <InputSearch 
                    placeholder="Search"
                    className={"border-none focus:border-none focus:outline-none py-2 bg-[#171721] ease-linear transition-all duration-150"}
                    setFocusInput={setFocusInput}
                    classIcon="text-white cursor-pointer"
                  />
                </div>
              </div>
            </div>
            <Link href={`/research/${data?.list?.[0]?.slug}` || ''} className="flex flex-col md:flex-row gap-[40px] px-8 mb-12">
              <div className="w-full md:w-8/12 lg:w-6/12 xl:w-6/12">
                <Image
                  alt={data?.list[0]?.title || ''}
                  placeholder='blur'
                  blurDataURL={'@/public/img/placeholder.png'}
                  className='align-middle border-none max-w-full w-full object-cover max-h-[330px] h-auto rounded-lg hover:scale-[1.02] ease-linear transition-all duration-150'
                  src={data?.list[0]?.bannerUrl || ''}
                  width={0}
                  height={0}
                  sizes="100vw"
                />
              </div>
              <div className="w-full md:w-8/12 lg:w-6/12 xl:w-6/12 flex flex-col justify-center">
                <div className="flex items-center justify-between w-full">
                  <div className="bg-[#2e2b2b] px-2 rounded-[12px] text-[14px] text-[#eeb74c] font-bold">
                    <span className="text-sm">{data?.list?.[0]?.field}</span>
                  </div>
                  <span className="text-[14px] text-[#524f6a]">{convertSecondsToTime(data?.list?.[0]?.timeToRead || 0)}</span>
                </div>
                <div>
                  <h3 className="text-white text-[30px] font-bold my-3 line-clamp-2">{data?.list[0]?.title}</h3>
                </div>
                <div>
                  <p className='text-[#b9b9bc] text-[20px] line-clamp-6'>
                    {data?.list?.[0]?.overview}
                  </p>
                </div>
              </div>
            </Link>
            <div className="px-8 pb-60">
              <div className="flex items-center bg-[#23232c] p-6 lg:px-12 lg:py-8 rounded-lg flex-col lg:flex-row">
                <div className="mr-0 md:mr-[40px] w-full lg:w-6/12">
                  <h4 className="text-white text-[28px] font-bold">Get the newsletter</h4>
                  <p className="text-[#b9b9bc] text-[20px]">News on istick, product updates</p>
                </div>
                <input 
                  className='border-[1px] mt-6 lg:mt-0 flex-1 w-full lg:w-auto px-3 py-3 placeholder-blueGray-400 text-black h-[40px]
                    bg-white rounded-md text-sm shadow outline-none focus:outline-none 
                    ease-linear transition-all duration-150'
                  style={{
                    boxShadow: 'none',
                    border: '1px solid #313541'
                  }}
                  placeholder='Enter your email address' 
                  type="email" 
                  required
                  aria-required
                />  
                <Button
                  classBtn="h-[40px] w-full lg:w-auto bg-white ml-0 mt-6 lg:mt-0 lg:ml-4 md:px-4 
                  lg:w-auto xl:w-auto text-black border-none 
                  border-solid rounded-md outline-[none] focus:outline-none"
                  textBtn='Subscribe'
                />
              </div>
            </div>
          </div>
        </section>
        <section className="px-0 md:px-4 bg-white mb-[-192px]">
          <div className="container mx-auto relative top-[-192px]">
            <h3 className="text-[32px] text-white font-bold px-8 mb-8">Recent posts</h3>
            <div className='flex flex-wrap px-4'>
              {data?.list?.map((research: TDataList) => {
                return (
                  <div className='w-full md:w-6/12 lg:w-4/12 px-4' key={research?.slug}>
                    <Link href={`/research/${research?.slug}`}>
                      <div className='relative rounded-[8px] flex flex-col min-w-0 break-wordsw-full mb-12'>
                        <Image
                          alt={research?.title}
                          placeholder='blur'
                          blurDataURL={'@/public/img/placeholder.png'}
                          className='align-middle hover:scale-[1.02] shadow-lg border-none max-w-full w-full h-[230px] max-h-[230px] rounded-[8px] ease-linear transition-all duration-150'
                          src={research?.bannerUrl}
                          width={0}
                          height={0}
                          sizes="100vw"
                        />
                        <div className="w-full flex flex-col justify-center">
                          <div className="flex items-center justify-between w-full pt-4">
                            <div className="bg-[#2e2b2b] px-2 rounded-[12px] text-[14px] text-[#eeb74c] font-bold">
                              <span className="text-sm">{research?.field}</span>
                            </div>
                            <span className="text-[14px] text-[#524f6a]">{convertSecondsToTime(research?.timeToRead || 0)}</span>
                          </div>
                          <h3 className="text-black hover:opacity-[0.8] text-[20px] font-bold mb-[4px] line-clamp-2">{research?.title}</h3>
                          <p className='text-[#70737] text-[14px] hover:opacity-[0.8] line-clamp-4'>
                            {research?.overview}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                )
              })}
            </div>
            <div className="w-full text-center px-8">
              <Button
                classBtn="h-auto font-bold w-full md:w-auto py-2 mb-4 px-0 md:px-4 
                lg:w-auto xl:w-auto border-[#d1d2d9] text-black border-[1px] 
                border-solid rounded-md outline-[none] shadow focus:outline-none"
                textBtn={(isLoading || isPreviousData)  ? '...Loading': 'Load more researches'}
                styleBtn={{
                  backgroundColor: (isLoading || isPreviousData || (Number(data?.total) <= Number(data?.list?.length)))  ? '#f3f3f4' : '#3659e3',
                  color: (isLoading || isPreviousData || (Number(data?.total) <= Number(data?.list?.length))) ? '#3d3d4e': '#fff',
                  cursor: (isLoading || isPreviousData || (Number(data?.total) <= Number(data?.list?.length))) ? 'not-allowed' : 'pointer',
                }}
                disabled={isLoading || isPreviousData || (Number(data?.total) <= Number(data?.list?.length))}
                onClick={() => setLimitState((prev) => Number(prev) + 3)}
              />
            </div>
          </div>
        </section>
        <Footer hiddenDecord />
      </div>
    </>
  );
}


export default Index