// Libraries
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

// Components
import { Button } from '@/components/Buttons/Button';
import { Filter } from '@/components/Filters/Filter';
import Footer from '@/components/Footers/Footer';
import Navbar from '@/components/Navbars/IndexNavbar';
import DropdownCheckbox from '@/components/Dropdowns/DropdownCheckbox';
import DropdownRadio from '@/components/Dropdowns/DropdownRadio';

function Index() {
  const [isShowFilter, setIsShowFilter] = useState(false);
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [isSorted, setIsSorted] = useState(false)

  const handleOnchangeJob = (jobs:string[]) => {
    setSelectedJobs(jobs)
  }

  const handleOnchangeLevel = (level:string) => {
    setSelectedLevel(level)
  } 

  const handleOnchangeLocations = (locations:string[]) => {
    setSelectedLocations(locations)
  } 

  return (
    <>
      <Navbar fixed isShowAuth />
      <div id="container" className="bg-[#dbe0e1]"
      >
        <section className='bg-white header px-4 pt-20 items-center flex h-auto flex-wrap'>
          <div className="container mx-auto">
            <div className="px[0] pb-[0] md:px-4 md:pd-8 lg:px-4">
              <div className="p-2 bg-[#e5eeff] rounded-md my-2 flex flex-wrap items-center justify-between">
                <div className="w-[100%] md:w-[50%] lg:w-[25%] p-2"> 
                  <DropdownCheckbox
                    options={[
                      {label: 'Designer', value: 'designer'},
                      {label: 'Frontend', value: 'frontend'},
                      {label: 'Backend', value: 'backend'},
                      {label: 'Fullstack developer', value: 'fullstack'},
                    ]}
                    label={'All topics'}
                    value={selectedJobs}
                    onChange={handleOnchangeJob}
                  />
                </div>
                <div className="w-[100%] md:w-[50%] lg:w-[25%] p-2"> 
                  <DropdownRadio
                    options={[
                      {label: 'Fresher', value: 'fresher'},
                      {label: 'Junior', value: 'junior'},
                      {label: 'Intership', value: 'intership'},
                    ]}
                    label={'All Levels'}
                    value={selectedLevel}
                    onChange={handleOnchangeLevel}
                  />
                </div>
                <div className="w-[100%] md:w-[50%] lg:w-[25%] p-2"> 
                  <DropdownCheckbox
                    options={[
                      {label: 'Ho Chi Minh', value: 'hcm'},
                      {label: 'Hà Nôi', value: 'dn'},
                      {label: 'Đà Nẵng', value: 'dn'},
                    ]}
                    label={'Location'}
                    value={selectedLocations}
                    onChange={handleOnchangeLocations}
                  />
                </div>
              </div>
              <div className="flex gap-2 lg:gap-0 lg:items-center mb-2 md:mb-4 lg:mb-6 justify-between flex-col lg:flex-row">
                <div className="flex flex-col">
                  <h3 className='text-[#313e5b] text-[16px] md:text-[24px] lg:text-[30px] font-bold mb-[4px] md:mb-[4px] lg:mb-[4px]'>Recommeded talent</h3>
                  <span className="text-[#313e5b] text-[12px]">5 new opportunities posted today!</span>
                </div>
                <div className='flex items-center'>
                  <span className='text-black text-[14px]'>Sort by:</span>
                  <span className='ml-1 text-black text-[14px] font-bold'>{isSorted ? 'Last updated' : 'First updated'}</span>
                  <Button
                    classBtn="ml-3 w-auto text-[#000] border-none focus:outline-none"
                    iconBtn={isSorted ? "fas fa-sliders-h" : 'fas fa-sliders-h'}
                    onClick={() => setIsSorted(!isSorted)}
                  />
                </div>
                <Button
                  classBtn="block lg:hidden h-[40px] whitespace-nowrap text-[#000] rounded-md px-4 border-[#e7e7e9] border-solid border-[1px] focus:outline-none"
                  textBtn="Filters"
                  iconBtn="fas fa-filter"
                  onClick={() => setIsShowFilter(!isShowFilter)}
                  styleBtn={{
                    width: 'fit-content'
                  }}
                />
              </div>
              {isShowFilter && (
                <div className="block lg:hidden mb-6">
                  {/* <Filter /> */}
                </div>
              )}
              <div className="flex gap-12">
                <div className="hidden lg:block">
                  {/* <Filter /> */}
                </div>
                <div className="w-full flex-row flex-wrap flex">
                  <Link
                    href='/talents/2' 
                    className="group relative w-full md:w-6/12 lg:w-4/12 cursor-pointer px-2 py-2 md:py-2 lg:py-0"
                  >
                    <div className="rounded-xl border-[#e7e7e9] border-solid border-[1px] p-2 shadow w-full h-auto">
                      <div className='p-4 rounded-xl bg-[#eceff4]'>
                        <div className="flex items-center gap-2">
                          <Image
                            src="/img/profile.png"
                            alt='profile'
                            placeholder='blur'
                            blurDataURL={'@/public/img/placeholder.png'}
                            className='align-middle border-none max-w-full w-[80px] rounded-[50%] object-cover max-h-[x] h-[80px]'
                            width={0}
                            height={0}
                            sizes="100vw"
                          />
                          <div className="flex flex-col gap-1">
                            <span className="text-[#3d3d4e] text-[14px] font-medium">Zerobroker</span>
                            <span>
                              <i className="fas fa-star text-[#ffd43b] text-[14px]"></i>
                              <span className="text-black font-medium text-[14px]">{' '}4.9</span>
                              <span className="text-[#3d3d4e] text-[14px] font-medium">{' '} (15)</span>
                            </span>
                            <span>
                              <i className="fas fa-dollar-sign text-black text-[14px]"></i>
                              <span className="text-black font-medium text-[14px]">50</span>
                              <span className="text-[#3d3d4e] text-[14px] font-medium">/1 hours</span>
                            </span>
                          </div>
                        </div>
                        <div className='mt-2'>
                          <h4 className="text-black text-[20px] font-medium whitespace-nowrap">Product Designer</h4>
                        </div>
                        <div className='flex flex-wrap items-center gap-2 mt-4'>
                          <span className="text-sm text-[#2b6fdf] px-2 py-1 rounded-[20px] border-solid border-[1px] border-[#2b6fdf]">Figma</span>
                          <span className="text-sm text-[#2b6fdf] px-2 py-1 rounded-[20px] border-solid border-[1px] border-[#2b6fdf]">UI/UX</span>
                          <span className="text-sm text-[#2b6fdf] px-2 py-1 rounded-[20px] border-solid border-[1px] border-[#2b6fdf]">Adobe</span>
                        </div>
                      </div>
                      <div className="items-center justify-between flex m-4">
                        <div>
                          <i className="fas fa-map-marker-alt text-[#3d3d4e]" />
                          <span className="text-[#000] text-[14px]">{' '}Ho CHi Minh</span>
                        </div>
                        <Button
                          classBtn="h-auto whitespace-nowrap w-auto bg-[#2b6fdf] text-white px-4 py-2 rounded-[20px] font-medium focus:outline-none"
                          textBtn="View talent"
                        />
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
              <div className="flex w-full justify-center gap-3">
                <Button
                  classBtn="h-auto font-bold w-auto py-2 mb-4 px-0 px-4 bg-[#3659e3] text-white rounded-[50%] outline-[none] border-none focus:outline-none mt-4"
                  iconBtn="fas fa-chevron-left"
                />
                <Button
                  classBtn="h-auto font-bold w-auto py-2 mb-4 px-0 px-4 bg-[#e4e4e7] text-white rounded-[50%] outline-[none] border-none focus:outline-none mt-4"
                  iconBtn="fas fa-chevron-right"
                />
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