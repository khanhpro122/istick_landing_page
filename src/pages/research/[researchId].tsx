// Libraries
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Head from 'next/head';
import InfiniteScroll from 'react-infinite-scroll-component';

// Components
import Footer from '@/components/Footers/Footer';
import Navbar from '@/components/Navbars/IndexNavbar';

// Services
import * as ServiceResearch from '@/services/research';
import * as ServiceJob from '@/services/job'

// Utils
import { convertSecondsToTime, formatStringToDay, getTimeCreated } from '@/utils';


type TResearch = {
  id: number;
  slug: string;
  bannerUrl: string;
  title: string;
  type: string;
  description: string;
  status: 'DRAFT' | 'PUBLISHED';
  timeToRead?: number,
  createdAt: string
  author?: string,
  field?: string,
  authorAvatar?: string,
  overview?: string,
};

type TProps = {
  research?: TResearch;
};

const ResearchDetails: NextPage<TProps> = ({ research }) => {

  const [litmitState, setLimitState] = useState(6);
  const [relatedSearch, setRelatedSearch] = useState([]);

  // fetch api
  const fetchListJobPublic = async (litmitState: number) => {
    const res = await ServiceJob.getJobByCompanyId(litmitState, 1, 1, true)
    return res.data
  }
  const fetchListResearch = async () => {
    const res = await ServiceResearch.getListResearch(1, 3, true)
    setRelatedSearch(res?.data?.list)
  }

  const handleLoadMoreJob = () => {
    setLimitState((prev) => prev + 6)
  }

  const {data: jobs, isLoading, isPreviousData } = useQuery(['jobs', 'research' ,litmitState], 
    () => fetchListJobPublic(litmitState), 
    {staleTime: 1000 * 60, retryDelay: 2000, retry: 1, keepPreviousData: true }
  )

  useEffect(() => {
    fetchListResearch()
  }, [])

  return (
    <>
      <Head>
        <title>{research?.title}</title>
        <meta name="keywords" content={research?.title} />
        <meta name="author" content={research?.author} />
        <meta itemProp="name" content={research?.title}/>
        <meta itemProp="description" content={research?.overview}/>
        <meta itemProp="image" content={research?.bannerUrl}/>
        {/* facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:description" content={research?.overview} />
        <meta property="og:image" content={research?.bannerUrl} />
        <meta property="og:title" content={research?.title} />
        <meta property="og:url" content={"https://istick.io/research/" + research?.slug}/>
        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={research?.title}/>
        <meta name="twitter:description" content={research?.overview} />
        <meta name="twitter:image" content={research?.bannerUrl} />
      </Head>
      <Navbar fixed isShowAuth />
      <div id='container' className='bg-[#dbe0e1]'>
        <section className='bg-[#171721] header pt-20 h-auto'>
          <div className='container mx-auto'>
            <div className='w-full px-8 mt-10'>
              <div className='w-full flex flex-col justify-center'>
                <div className='flex items-center justify-between w-full pt-4'>
                  <div className='bg-[#2e2b2b] px-2 rounded-[12px] text-[14px] text-[#eeb74c] font-bold w-auto'>
                    <span className='text-sm'>{research?.field}</span>
                  </div>
                </div>
                <h3 className='text-white text-[30px] font-bold my-3'>
                  {research?.title}
                </h3>
              </div>
              <div className='flex items-center gap-2 pb-[160px] md:pb-60'>
                <Image
                  alt={research?.title || ''}
                  placeholder='blur'
                  blurDataURL={'@/public/img/placeholder.png'}
                  className='align-middle h-[40px] w-[40px] object-cover rounded-[50%] border-white border-solid border-[1px]'
                  src={research?.authorAvatar || '/img/user-default.png'}
                  width={0}
                  height={0}
                  sizes='100vw'
                />
                <div className='flex flex-col'>
                  <span className='text-[14px] text-white font-bold'>
                    {research?.author}
                  </span>
                  <div className='flex items-center gap-4'>
                    <span className='text-[14px] text-[#b9b9bc] font-medium'>
                      {formatStringToDay(research?.createdAt)}
                    </span>
                    <span className='text-[14px] text-[#b9b9bc] font-medium'>
                      {convertSecondsToTime(research?.timeToRead || 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className='bg-white mb-[-120px] md:mb-[-192px]'>
          <div className='container mx-auto relative top-[-120px] md:top-[-192px]'>
            <div className="w-full flex-col lg:flex-row gap-8 flex">
              <div className='w-auto px-8'>
                <Image
                  alt={research?.title || ''}
                  placeholder='blur'
                  blurDataURL={'@/public/img/placeholder.png'}
                  className='align-middle border-none max-w-full w-full object-cover max-h-[180px] md:max-h-[400px] lg:max-h-[450px] shadow-md h-auto rounded-lg'
                  src={research?.bannerUrl || ''}
                  width={0}
                  height={0}
                  sizes='100vw'
                />
                <div
                  className='text-[#4a4d57] text-[20px] my-4'
                  dangerouslySetInnerHTML={{
                    __html: research?.description ? research?.description : '',
                  }}
                ></div>
              </div>
              <div className="flex flex-col rounded-xl w-auto px-8">
                <div className="flex justify-between items-center">
                  <h4 className="text-[20px] font-medium text-black lg:text-white mb-4">Related research</h4>
                </div>
                <div className="flex flex-[row] pb-[16px] md:pb-2 lg:pb-0 lg:flex-col gap-4 overflow-auto max-h-[700px]">
                  {relatedSearch?.map((research: any) => {
                    return (
                      <div className='w-[260px] min-w-[240px] bg-white shadow p-2 border-[#e7e7e9] border-[1px] rounded-xl' key={research?.slug}>
                        <Link href={`/research/${research?.slug}`}>
                          <div className='relative rounded-[8px] flex flex-col min-w-0 break-wordsw-full mb-4'>
                            <Image
                              alt={research?.title}
                              placeholder='blur'
                              blurDataURL={'@/public/img/placeholder.png'}
                              className='align-middle hover:scale-[1.02] shadow-lg border-none max-w-full w-full h-[120px] rounded-[8px] ease-linear transition-all duration-150'
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
                              <p className='text-[#70737] text-[14px] hover:opacity-[0.8] line-clamp-2'>
                                {research?.overview}
                              </p>
                            </div>
                          </div>
                        </Link>
                      </div>
                    )
                  })}
                </div>
                <div className="flex justify-between items-center">
                  <h4 className="text-[20px] font-medium text-black mt-8 mb-4">Related jobs</h4>
                </div>
                <div id="scrollableDiv" className="flex flex-[row] pb-[16px] md:pb-2 lg:pb-0 lg:flex-col gap-4 overflow-auto max-h-[700px]">
                  <InfiniteScroll 
                    dataLength={jobs?.total || 0}
                    next={handleLoadMoreJob}
                    hasMore={jobs?.total > jobs?.list?.length}
                    className='no-scrollbar flex lg:flex-col gap-4'
                    loader={<h4>Loading...</h4>}
                    scrollableTarget="scrollableDiv"
                  >
                    {jobs?.list?.map((job: any) => {
                      const listSkill = job?.jobTags?.filter((tag: any) => tag?.tagType === "SKILL");
                      const listLevel = job?.jobTags?.filter((tag: any) => tag?.tagType === "LEVEL");
                      return (
                        <Link href={`/jobs/${job?.slug}`} key={job?.id} className="w-[260px] min-w-[240px] border-[#e7e7e9] border-[1px] rounded-xl p-2 bg-white shadow">
                          <div className="flex items-center">
                            <Image
                              src={job?.avatar || "/img/profile.png"}
                              alt='profile'
                              placeholder='blur'
                              blurDataURL={'@/public/img/placeholder.png'}
                              className='align-middle border-none max-w-full mr-2 w-[50px] object-cover max-h-[x] rounded-[50%] h-[50px]'
                              width={0}
                              height={0}
                              sizes="100vw"
                            />
                            <div className="flex flex-col w-full items-start">
                              <div className="flex items-center justify-between w-full">
                                <div className="overflow-hidden text-ellipsis whitespace-nowrap text-[16px] text-black font-bold text-center mb-2 max-w-[100px]">{job?.name}</div>
                                <div className="text-[14px] text-[#313541] font-medium text-center mb-2">{job?.position}</div>
                              </div>

                              <div className="flex items-center justify-between w-full">
                                <div className="text-[14px] text-[#6f7287] font-medium text-center mb-2">Istick</div>
                                <div className="text-[14px] text-[#313541] font-medium text-center mb-2">{getTimeCreated(job?.createdAt)} ago</div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-2">
                            <h4 className="text-black text-[20px] font-medium line-clamp-2">From ${job.salaryFrom} - to ${job.salaryTo}</h4>
                          </div>
                          <div className="w-full max-w-full overflow-hidden text-ellipse">
                            {!!listSkill?.length && (
                              <div className='flex items-center gap-2 mt-4 flex-nowrap no-scrollbar overflow-x-auto'>
                                {listSkill.map((job:any) => {
                                  return (
                                    <span key={job?.id} className="text-sm text-[#2b6fdf] px-2 py-1 rounded-[20px] border-solid border-[1px] border-[#2b6fdf]">{job?.tag?.name}</span>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                          {!!listLevel?.length && (
                            <div className='flex items-center gap-2 mt-4 flex-nowrap no-scrollbar overflow-x-auto'>
                              {listLevel.map((level:any) => {
                                return (
                                  <span key={level?.id} className="text-[16x] text-[#2b6fdf] font-bold">{level?.tag?.name}</span>
                                )
                              })}
                            </div>
                          )}
                        </Link>
                      )
                    })}
                  </InfiniteScroll>
                </div>
                <button
                  className="h-auto font-bold w-full md:w-auto py-2 px-0 md:px-4 
                  lg:w-auto xl:w-auto border-none 
                  rounded-md outline-[none] focus:outline-none lg:mt-4 mb-2 lg:mb-0"
                  style={{
                    color: (isLoading || isPreviousData || (Number(jobs?.total) <= Number(jobs?.list?.length))) ? '#ccc': '#2b6fdf',
                    cursor: (isLoading || isPreviousData || (Number(jobs?.total) <= Number(jobs?.list?.length))) ? 'not-allowed' : 'pointer',
                  }}
                  disabled={isLoading || isPreviousData || (Number(jobs?.total) <= Number(jobs?.list?.length))}
                  onClick={() => setLimitState((prev) => Number(prev) + 3)}
                >
                </button>
              </div>
            </div>
          </div>
        </section>
        <Footer hiddenDecord />
      </div>
    </>
  );
};

export default ResearchDetails;

export async function getServerSideProps(context: any) {
  const { params } = context;
  const researchId = params?.researchId as string;
  try {
    const response = await ServiceResearch.getDetailsResearch(researchId);
    const data = response?.data;
    if (!data.id) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        research: data,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}
