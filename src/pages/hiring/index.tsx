// Libraries
import React, { useEffect, useState } from 'react';
import Router, { useRouter } from 'next/router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useQuery } from '@tanstack/react-query';


// Services
import * as ServiceJob from '@/services/job'
import * as ServiceCompany from '@/services/company'

// Components
import Footer from '@/components/Footers/Footer';
import Navbar from '@/components/Navbars/IndexNavbar';
import { CardPostJob } from '@/components/Cards/CardPostJob';
import { Button } from '@/components/Buttons/Button';
import { InputSearch } from '@/components/Inputs/InputSearch';
import { CardCompany } from '@/components/Cards/CardCompany';
import { Loading } from '@/components/Loading/Loading';

// Utils
import Head from 'next/head';
import { getLocalUserData } from '@/utils';

function Index() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(1);

  const {accessToken} = getLocalUserData()

  const tabs = [
    {
      label: 'Manage jobs',
      key: '1',
    },
    {
      label: 'Manage companies',
      key: '2',
    },
  ]

  // fetch api
  const fetchListJob = async () => {
    const res = await ServiceJob.getListJob(10, 1)
    return res.data
  }

  const fetchListCompanies= async (isPrivate: boolean) => {
    const res = await ServiceCompany.getListCompany(10, 1, isPrivate)
    return res.data
  }

  // query
  const { data: jobs, isLoading: isLoadingJobs } = useQuery(['jobs'], fetchListJob, {staleTime: 1000 * 60, retryDelay: 2000, retry: 1 })
  const { data: companiesPrivate, isLoading: isLoadingCompaniesPrivate } = useQuery(['companies', 'isPrivate'], () => fetchListCompanies(true), {staleTime: 1000 * 60, retryDelay: 2000, retry: 1, })
  // handle
  const handleNavigatePackage = () => {
    router.push('/packages')
  }
  
  useEffect(() => {
    if(!accessToken) {
      Router.push('/') 
    }
  }, [])

  
  return (
    <>
      <Head>
        <title>Manage job</title>
      </Head>
      <Navbar fixed isShowAuth />
      <div id="container" className="bg-[#dbe0e1]"
      >
        <Loading isLoading={isLoadingCompaniesPrivate || isLoadingJobs}></Loading>
        <ToastContainer />
        <section className='bg-white header px-6 md:px-4 pt-20 items-center flex h-auto'>
          <div className="container mx-auto">
            <div className="px[0] pb-[0] md:px-4 md:pd-8 lg:px-4">
              <div className="flex mt-4">
                {tabs.map((tab, index) => (
                  <button
                    key={index}
                    className={`px-4 py-2 ${
                      activeTab === Number(tab?.key)
                        ? 'bg-[#3659e3] text-white font-semibold'
                        : 'bg-[#f8f7fa] text-black'
                    } transition-all duration-300 ease-in-out border-b-4 focus:outline-none outline-none border-transparent whitespace-nowrap overflow-auto`}
                    onClick={() => setActiveTab(Number(tab?.key))}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="flex flex-col md:flex-row items-center justify-between mt-4">
                <div className='w-[100%] md:w-auto'>
                  <InputSearch 
                    placeholder={activeTab === 1 ? "Search job..." : activeTab === 2 ?  'Search resume...' : 'Search company...'}
                    className={"border-none outline-none focus:border-none focus:outline-none py-2 bg-white ease-linear transition-all duration-150"}
                    classIcon="text-black cursor-pointer"
                    isFull
                  />
                </div>
                <div className="w-[100%] md:w-auto flex justify-between md:justify-center gap-4">
                  <Button
                    classBtn="mt-4 md:mt-0 h-[40px] border-[#3659e3] font-bold rounded-md w-auto :outline-none rounded-md border-[1px] py-1 px-2 text-[#3659e3]"
                    iconBtn='fas fa-user-plus text-[16px]'
                    textBtn="Upgrade"
                    onClick={handleNavigatePackage}
                  />
                  {activeTab === 1 && (
                    <Button
                      classBtn="mt-4 md:mt-0 h-[40px] bg-[#3659e3] w-auto text-white focus:outline-none rounded-md border-[1px] py-1 px-2"
                      iconBtn='fas fa-plus text-[16px]'
                      textBtn="Create new a job"
                      onClick={() => router.push(`/hiring/create/job`)}
                    />
                  )}
                  {activeTab === 2 && (
                    <Button
                      classBtn="mt-4 md:mt-0 h-[40px] bg-[#3659e3] w-auto text-white focus:outline-none rounded-md border-[1px] py-1 px-2"
                      iconBtn='fas fa-plus text-[16px]'
                      textBtn="Create company"
                      onClick={() => router.push('/hiring/create/company')}
                    />
                  )}
                </div>
              </div>
              <div className="md:min-h-[500px]">
                <div className={"flex-col my-4 gap-6" + (activeTab === 1 ? ' flex' : ' hidden')}>
                  {jobs && jobs?.list?.map((job: any) => {
                    return (
                      <CardPostJob key={job?.id} item={job} />
                    )
                  })}
                </div>
                <div className={"flex-col my-4 gap-6" + (activeTab === 2 ? ' flex' : ' hidden')}>
                  {companiesPrivate && companiesPrivate?.list?.map((company: any) => {
                    return (
                      <CardCompany key={company?.id} item={company} companyAddresses={company?.companyAddresses} />
                    )
                  })}
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


export default Index