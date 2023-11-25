// Libraries
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

// Components
import { Button } from '@/components/Buttons/Button';
import Footer from '@/components/Footers/Footer';
import Navbar from '@/components/Navbars/IndexNavbar';

type TPropTalent = {
}

function Index() {

  const [activeType, setActiveType] = useState('all');
  const [isSorted, setIsSorted] = useState(false)

  const handleActiveType = (type:string) => {
    setActiveType(type)
  }

  return (
    <>
      <Navbar fixed isShowAuth />
      <div id="container" className="bg-[#dbe0e1]"
      >
        <section className='bg-white header px-4 pt-[96px] md:pt-20 lg:pt-20 items-center flex h-auto flex-wrap'>
          <div className="container mx-auto">
            <div className="px-0 py-0 md:px-4 md:py-8">
              <div className="gap-4 pb-4 text-[#3d3d4e] flex overflow-x-auto">
                <button 
                  onClick={() => handleActiveType('all')}
                  className={'px-4 py-2 rounded-[20px] border-[#e7e7e9] border-[1px] border-solid cursor-pointer whitespace-nowrap outline-none focus:outline-none' + (
                    activeType === 'all' ? ' bg-[#2b6fdf] text-white font-medium' : ' text-[#3d3d4e] bg-white'
                  )}
                >Fulltime Job</button>
                <button 
                  onClick={() => handleActiveType('ui')}
                  className={'px-4 py-2 rounded-[20px] border-[#e7e7e9] border-[1px] border-solid cursor-pointer whitespace-nowrap outline-none focus:outline-none' + (
                    activeType === 'ui' ? ' bg-[#2b6fdf] text-white font-medium' : ' text-[#3d3d4e] bg-white'
                  )}
                >UI</button>
                <button 
                  onClick={() => handleActiveType('post')}
                  className={'px-4 py-2 rounded-[20px] border-[#e7e7e9] border-[1px] border-solid cursor-pointer whitespace-nowrap outline-none focus:outline-none' + (
                    activeType === 'post' ? ' bg-[#2b6fdf] text-white font-medium' : ' text-[#3d3d4e] bg-white'
                  )}
                >Post</button>
              </div>
              <div className="flex flex-col-reverse lg:flex-row items-start gap-8">
                <div className="flex shadow flex-col mb-[16px] md:mb-0 py-4 px-4 border-solid border-[#e7e7e9] border-[1px] rounded-xl w-[100%] lg:w-auto min-w-[230px]">
                  <div className="flex justify-between items-center">
                    <h4 className="text-[20px] font-medium text-black">Related talents</h4>
                    <Button
                      classBtn="ml-3 flex gap-1 items-center flex-row-reverse f w-auto text-[#000] border-solid border-[#e7e7e9] border-[1px] focus:outline-none py-[4px] px-2 rounded-[20px]"
                      textBtn="Filter"
                      iconBtn={isSorted ? "fas fa-sort-amount-down-alt" : 'fas fa-sort-amount-up'}
                      onClick={() => setIsSorted(!isSorted)}
                    />
                  </div>
                  <div className="h-[1px] bg-[#e7e7e9] w-full my-4"></div>
                  <div className="flex flex-[row] lg:flex-col gap-4 overflow-auto pb-[16px] md:pb-2 lg:pb-0">
                    <div className="w-[240px] min-w-[240px] border-[#e7e7e9] border-[1px] rounded-xl p-2">
                      <div className="flex items-center ">
                        <Image
                          src="/img/profile.png"
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
                            <div className="text-[16px] text-black font-bold text-center mb-2">Designer</div>
                            <span>
                              <i className="fas fa-star text-[#ffd43b] text-[14px]"></i>
                              <span className="text-black font-medium text-[14px]">{' '}4.9</span>
                              <span className="text-[#3d3d4e] text-[14px] font-medium">{' '} (15)</span>
                            </span>
                          </div>
                          <div className="flex items-center justify-between w-full">
                            <div className="text-[14px] text-[#3d3d4e] font-medium text-center mb-2">Messi</div>
                            <div className="text-center mb-2">
                              <span>
                                <i className="fas fa-dollar-sign text-black text-[14px]"></i>
                                <span className="text-black font-medium text-[14px]">50</span>
                                <span className="text-[#3d3d4e] text-[14px] font-medium">/1 hours</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <i className="fas fa-map-marker-alt text-[#3d3d4e] mt-2" />
                        <span className="text-[#000] text-[14px]">{' '}Ho CHi Minh</span>
                      </div>
                      <div className='flex flex-wrap items-center gap-2 mt-2'>
                        <span className="text-sm text-[#2b6fdf] px-2 py-1 rounded-[20px] border-solid border-[1px] border-[#2b6fdf]">Figma</span>
                        <span className="text-sm text-[#2b6fdf] px-2 py-1 rounded-[20px] border-solid border-[1px] border-[#2b6fdf]">UI/UX</span>
                        <span className="text-sm text-[#2b6fdf] px-2 py-1 rounded-[20px] border-solid border-[1px] border-[#2b6fdf]">Adobe</span>
                      </div>
                    </div>
                    <div className="w-[240px] min-w-[240px] border-[#e7e7e9] border-[1px] rounded-xl p-2">
                      <div className="flex items-center ">
                        <Image
                          src="/img/profile.png"
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
                            <div className="text-[16px] text-black font-bold text-center mb-2">Designer</div>
                            <span>
                              <i className="fas fa-star text-[#ffd43b] text-[14px]"></i>
                              <span className="text-black font-medium text-[14px]">{' '}4.9</span>
                              <span className="text-[#3d3d4e] text-[14px] font-medium">{' '} (15)</span>
                            </span>
                          </div>
                          <div className="flex items-center justify-between w-full">
                            <div className="text-[14px] text-[#3d3d4e] font-medium text-center mb-2">Messi</div>
                            <div className="text-center mb-2">
                              <span>
                                <i className="fas fa-dollar-sign text-black text-[14px]"></i>
                                <span className="text-black font-medium text-[14px]">50</span>
                                <span className="text-[#3d3d4e] text-[14px] font-medium">/1 hours</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <i className="fas fa-map-marker-alt text-[#3d3d4e] mt-2" />
                        <span className="text-[#000] text-[14px]">{' '}Ho CHi Minh</span>
                      </div>
                      <div className='flex flex-wrap items-center gap-2 mt-2'>
                        <span className="text-sm text-[#2b6fdf] px-2 py-1 rounded-[20px] border-solid border-[1px] border-[#2b6fdf]">Figma</span>
                        <span className="text-sm text-[#2b6fdf] px-2 py-1 rounded-[20px] border-solid border-[1px] border-[#2b6fdf]">UI/UX</span>
                        <span className="text-sm text-[#2b6fdf] px-2 py-1 rounded-[20px] border-solid border-[1px] border-[#2b6fdf]">Adobe</span>
                      </div>
                    </div>
                    <div className="w-[240px] min-w-[240px] border-[#e7e7e9] border-[1px] rounded-xl p-2">
                      <div className="flex items-center ">
                        <Image
                          src="/img/profile.png"
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
                            <div className="text-[16px] text-black font-bold text-center mb-2">Designer</div>
                            <span>
                              <i className="fas fa-star text-[#ffd43b] text-[14px]"></i>
                              <span className="text-black font-medium text-[14px]">{' '}4.9</span>
                              <span className="text-[#3d3d4e] text-[14px] font-medium">{' '} (15)</span>
                            </span>
                          </div>
                          <div className="flex items-center justify-between w-full">
                            <div className="text-[14px] text-[#3d3d4e] font-medium text-center mb-2">Messi</div>
                            <div className="text-center mb-2">
                              <span>
                                <i className="fas fa-dollar-sign text-black text-[14px]"></i>
                                <span className="text-black font-medium text-[14px]">50</span>
                                <span className="text-[#3d3d4e] text-[14px] font-medium">/1 hours</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <i className="fas fa-map-marker-alt text-[#3d3d4e] mt-2" />
                        <span className="text-[#000] text-[14px]">{' '}Ho CHi Minh</span>
                      </div>
                      <div className='flex flex-wrap items-center gap-2 mt-2'>
                        <span className="text-sm text-[#2b6fdf] px-2 py-1 rounded-[20px] border-solid border-[1px] border-[#2b6fdf]">Figma</span>
                        <span className="text-sm text-[#2b6fdf] px-2 py-1 rounded-[20px] border-solid border-[1px] border-[#2b6fdf]">UI/UX</span>
                        <span className="text-sm text-[#2b6fdf] px-2 py-1 rounded-[20px] border-solid border-[1px] border-[#2b6fdf]">Adobe</span>
                      </div>
                    </div>
                    <div className="w-[240px] min-w-[240px] border-[#e7e7e9] border-[1px] rounded-xl p-2">
                      <div className="flex items-center ">
                        <Image
                          src="/img/profile.png"
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
                            <div className="text-[16px] text-black font-bold text-center mb-2">Designer</div>
                            <span>
                              <i className="fas fa-star text-[#ffd43b] text-[14px]"></i>
                              <span className="text-black font-medium text-[14px]">{' '}4.9</span>
                              <span className="text-[#3d3d4e] text-[14px] font-medium">{' '} (15)</span>
                            </span>
                          </div>
                          <div className="flex items-center justify-between w-full">
                            <div className="text-[14px] text-[#3d3d4e] font-medium text-center mb-2">Messi</div>
                            <div className="text-center mb-2">
                              <span>
                                <i className="fas fa-dollar-sign text-black text-[14px]"></i>
                                <span className="text-black font-medium text-[14px]">50</span>
                                <span className="text-[#3d3d4e] text-[14px] font-medium">/1 hours</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <i className="fas fa-map-marker-alt text-[#3d3d4e] mt-2" />
                        <span className="text-[#000] text-[14px]">{' '}Ho CHi Minh</span>
                      </div>
                      <div className='flex flex-wrap items-center gap-2 mt-2'>
                        <span className="text-sm text-[#2b6fdf] px-2 py-1 rounded-[20px] border-solid border-[1px] border-[#2b6fdf]">Figma</span>
                        <span className="text-sm text-[#2b6fdf] px-2 py-1 rounded-[20px] border-solid border-[1px] border-[#2b6fdf]">UI/UX</span>
                        <span className="text-sm text-[#2b6fdf] px-2 py-1 rounded-[20px] border-solid border-[1px] border-[#2b6fdf]">Adobe</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-1 border-[#e7e7e9] border-[1px] rounded-xl shadow w-full">
                  <div className="flex items-center w-full p-5 border-solid border-b-[#e7e7e9] border-b-[1px]">
                    <div className="p-[4px] min-w-[60px] border-[#e7e7e9] border-[1px] rounded-md mr-2">
                      <Image
                        src="/img/profile.png"
                        alt='profile'
                        placeholder='blur'
                        blurDataURL={'@/public/img/placeholder.png'}
                        className='align-middle border-none w-[50px] object-cover rounded-[50%] h-[50px] '
                        width={0}
                        height={0}
                        sizes="100vw"
                      />
                    </div>
                    <div className="flex flex-col w-full items-start">
                      <div className="flex items-center justify-between w-full">
                        <div className="text-[16px] text-black font-bold text-center mb-2">Designer</div>
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
                      
                      <div className="flex items-center justify-between w-full">
                        <div className="text-[14px] text-[#313541] font-medium text-center mb-2">Istick</div>
                        <div className="text-[14px] text-[#313541] font-medium text-center mb-2">
                          <span>
                            <i className="fas fa-star text-[#ffd43b] text-[14px]"></i>
                            <span className="text-black font-medium text-[14px]">{' '}4.9</span>
                            <span className="text-black text-[14px] font-medium">{' '} (15 reviewers)</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row p-5 w-[100%] md:w-auto min-w-[230px] justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-col gap-2">
                        <h4 className="text-black font-bold text-[16px]">Experiences: </h4>
                        <p>Description api</p>
                      </div>
                      <div className="flex flex-col gap-2 mt-4">
                        <h4 className="text-black font-bold text-[16px]">Skills:</h4>
                        <div className='flex flex-wrap items-center gap-4'>
                          <span className="text-sm text-[#6f7287] font-medium px-2 py-1 rounded-[20px] bg-[#f8fafb]">Part time</span>
                          <span className="text-sm text-[#6f7287] font-medium px-2 py-1 rounded-[20px] bg-[#f8fafb]">Project job</span>
                          <span className="text-sm text-[#6f7287] font-medium px-2 py-1 rounded-[20px] bg-[#f8fafb]">Junior level</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 mt-4">
                        <h4 className="text-black font-bold text-[16px]">Projects: </h4>
                        <p>Qualications api</p>
                      </div>
                      <div className="flex flex-col gap-2 mt-4">
                        <h4 className="text-black font-bold text-[16px]">Ratings: </h4>
                        <p>Ratings api</p>
                      </div>
                    </div>
                    <div className="flex flex-col p-8 border-solid border-[#e7e7e9] border-[1px] rounded-md w-[100%] md:w-auto min-w-[230px]">
                      <div className="flex justify-center w-full mb-3">
                        <Image
                          src="/img/profile.png"
                          alt='profile'
                          placeholder='blur'
                          blurDataURL={'@/public/img/placeholder.png'}
                          className='align-middle border-none max-w-full w-[72px] object-cover max-h-[x] rounded-[50%] h-[72px]'
                          width={0}
                          height={0}
                          sizes="100vw"
                        />
                      </div>
                      <div className="text-[24px] text-black font-bold text-center mb-2">Istick</div>
                      <Link href='/https://istick.io/' target='_blank' className="text-black text-[14px] text-center mb-3">Visit Portfolio</Link>
                      <Button
                        classBtn="h-[40px] whitespace-nowrap w-auto bg-[#2b6fdf] hidden md:block text-white rounded-md px-4 font-medium"
                        textBtn="Book for this talent"
                      />
                      <div className="h-[1px] bg-[#e7e7e9] w-full my-6"></div>
                      <div className="text-[14px] text-black">
                        <i className="fas fa-users text-[#3d3d4e]"></i>
                        <span>{' '}Customers</span>
                      </div>
                      <div className="text-[14px] text-black font-bold mt-1">200</div>
                      <div className="text-[14px] text-black mt-4">
                        <i className="fas fa-dollar-sign text-[#3d3d4e]" />
                        <span>{' '}Price</span>
                      </div>
                      <div className="text-[14px] text-black font-bold mt-1">
                        <span>
                          <i className="fas fa-dollar-sign text-black text-[14px]"></i>
                          <span className="text-black font-medium text-[14px]">50</span>
                          <span className="text-[#3d3d4e] text-[14px] font-medium">/1 hours</span>
                        </span>
                      </div>
                      <div className="text-[14px] text-black mt-4">
                        <i className="fas fa-map-marker-alt text-[#3d3d4e]" />
                        <span>{' '}Location</span>
                      </div>
                      <div className="text-[14px] text-black font-bold mt-1">Ho Chi Minh</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="w-full bg-white sticky bottom-0 md:hidden flex justify-center px-8 py-3 border-t-[1px] border-solid border-[#e7e7e9]">
          <Button
            classBtn="h-[40px] whitespace-nowrap w-full bg-[#2b6fdf] text-white rounded-md font-medium"
            textBtn="Book for this talent"
          />
        </div>
        <Footer hiddenDecord />
      </div>
    </>
  );
}


export default Index