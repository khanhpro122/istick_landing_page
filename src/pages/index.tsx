/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-no-target-blank */
// Libraries
import React, { useEffect,useState } from 'react';
import Link from 'next/link';
import { appWithTranslation } from 'next-i18next';
import { useQuery, useQueryClient } from '@tanstack/react-query';

// Services
import * as ServiceEvent from '@/services/event';
import * as ServiceAuth from '@/services/auth';

// Components
import Footer from '@/components/Footers/Footer.js';
import Navbar from '@/components/Navbars/IndexNavbar';
import { Loading } from '@/components/Loading/Loading';

// Utils
import { formatStringToDate, getCookie, } from '@/utils';
import { useRouter } from 'next/router';
import { ModalAuth } from '@/components/Modals/ModalAuth';
import Head from 'next/head';
import { useAuth } from '@/hooks/useAuth';

type TPropEvent = {
  id: number,
  slug: string,
  bannerUrl: string,
  title: string,
  host: string,
  types: string[],
  cost: number,
  registrationDeadline: string,
  startDate: string,
  endDate: string,
  description: string,
  location?:string,
}

function Index() {
  const [newEvent, setNewEvent] = useState<TPropEvent[] | []>([]);
  const router = useRouter();
  const [openModalAuth, setOpenModalAuth] = useState(false);

  const fetchNewEvent = async () => {
    const response = await ServiceEvent.getEventList(1, 1, false);
    setNewEvent(response?.data?.list)
  }

  const { user } = useAuth()

  const handlePostAJob = () => {
    if(!user?.id) {
      setOpenModalAuth(true)
    }else {
      router.push('/hiring')
    }
  }

  useEffect(() => {
    fetchNewEvent()
  }, []);

  return (
    <>
      <Head>
        <meta name="author" content="istick" />
        <title>istick - Đồng hành cùng bạn trên con đường sự nghiệp</title>
        <meta name="keywords" content="istick - Đồng hành cùng bạn trên con đường sự nghiệp" />
        <meta name="description" content="istick - Đồng hành cùng bạn trên con đường sự nghiệp" />
        <meta itemProp="name" content="istick - Đồng hành cùng bạn trên con đường sự nghiệp"/>
        <meta itemProp="image" content="https://istick.io/img/profile.png"/>
        {/* facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="istick - Đồng hành cùng bạn trên con đường sự nghiệp" />
        <meta property="og:image" content="https://istick.io/img/profile.png" />
        <meta property="og:description" content="istick - Đồng hành cùng bạn trên con đường sự nghiệp" />
        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="istick - Đồng hành cùng bạn trên con đường sự nghiệp"/>
        <meta name="twitter:description" content="istick - Đồng hành cùng bạn trên con đường sự nghiệp" />
        <meta name="twitter:image" content="https://istick.io/img/profile.png" />
      </Head>
      <Navbar fixed isShowAuth />
      <div id="container" className="bg-[#dbe0e1]"
      >
        {/* <Loading isLoading={isFetching} /> */}
        <ModalAuth isOpen={openModalAuth} closeModal={() => setOpenModalAuth(false)} />
        <section className='bg-white header relative pt-16 items-center flex h-screen md:h-auto lg:h-auto xl:h-auto max-h-[800px] lg:max-h-[760px] flex-wrap'>
          <div className="container mx-auto">
            <div className="items-center flex flex-wrap justify-center flex-col-reverse lg:flex-row">
              <div className='w-full md:w-8/12 lg:w-6/12 xl:w-6/12 px-4'>
                <div className="mt-8 md:mt-8 lg:mt-0 xl:mt-0">
                  <h2 className='font-semibold text-4xl text-black'>
                    {/* {t(translations.banner.title.title)} */}
                    Let Matching know your dream job.
                  </h2>
                  <p className='mt-4 text-lg leading-relaxed text-black'>
                    {/* {t(translations.banner.title.description)} */}
                    Enjoy new experiences, discover thousands of job opportunities, and get trusted support to reach your career goals. 
                    We are always here, ready to help you succeed.
                  </p>
                  <button
                    onClick={() => router.push('/jobs')}
                    className='w-full md:w-auto lg:w-auto xl:w-auto mt-8 get-started text-white font-bold px-6 py-4 rounded outline-none focus:outline-none mr-1 mb-1 bg-[#2b6fdf] active:bg-blueGray-500 text-sm shadow hover:shadow-lg ease-linear transition-all duration-150'
                  >
                    {/* {t(translations.banner.chatNow.title)} */}
                    Match now
                  </button>
                  <p className='mt-4 text-black text-ts leading-relaxed text-blueGray-500'>
                    {/* {t(translations.banner.lookingInstead.title)} */}
                    Looking hire to instead?
                    {(user?.userType === 'RECRUITER' ||!user?.userType) && (
                      <span
                        onClick={handlePostAJob}
                        className='text-[#2b6fdf] font-bold cursor-pointer'
                      >
                        {' '}Post a job
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className='mt-8 md:mt-8 lg:mt-0 xl:mt-0 w-full md:w-8/12 lg:w-6/12 xl:w-6/12 max-h-860-px px-4'>
                <img
                  className='w-full h-full rounded-xl'
                  src='/img/hiring.jpg'
                  alt='...'
                />
              </div>
            </div>
          </div>
        </section>

        <section className='mt-48 md:mt-40 pb-40 relative bg-blueGray-100'>
          <div
            className='-mt-20 top-0 bottom-auto left-0 right-0 w-full absolute h-20'
            style={{ transform: 'translateZ(0)' }}
          >
            <svg
              className='absolute bottom-0 overflow-hidden'
              xmlns='http://www.w3.org/2000/svg'
              preserveAspectRatio='none'
              version='1.1'
              viewBox='0 0 2560 100'
              x='0'
              y='0'
            >
              <polygon
                className='text-blueGray-100 fill-current'
                points='2560 0 2560 100 0 100'
              ></polygon>
            </svg>
          </div>
          <div className='container mx-auto'>
            <div className='flex flex-wrap items-center'>
              <div className='w-10/12 md:w-6/12 lg:w-4/12 px-12 md:px-4 mr-auto ml-auto -mt-32'>
                <div className='relative top-[30px] sm:top-[0] flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-lg bg-blueGray-700'>
                  <img
                    alt='...'
                    src='https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=80'
                    className='w-full align-middle rounded-t-lg'
                  />
                  <blockquote className='relative p-8 mb-4'>
                    <svg
                      preserveAspectRatio='none'
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 583 95'
                      className='absolute left-0 w-full block h-95-px -top-94-px'
                    >
                      <polygon
                        points='-30,95 583,95 583,65'
                        className='text-blueGray-700 fill-current'
                      ></polygon>
                    </svg>
                    <h4 className='text-xl font-bold text-white'>
                      Faster process your jobs
                    </h4>
                    <p className='text-md font-light mt-2 text-white'>
                      Let us help you find a job more quickly and move towards a successful professional future. 
                      Start today and explore the new opportunities that we bring to you.
                    </p>
                  </blockquote>
                </div>
              </div>

              <div className='w-full md:w-6/12 px-4'>
                <div className='flex flex-wrap'>
                  <div className='w-full md:w-6/12 px-4'>
                    <div className='relative flex flex-col mt-4'>
                      <div className='px-4 py-5 flex-auto'>
                        <div className='text-blueGray-500 p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-white'>
                          <i className='fas fa-sitemap'></i>
                        </div>
                        <h6 className='text-xl mb-1 font-semibold'>
                          Find jobs with matching
                        </h6>
                        <p className='mb-4 text-blueGray-500'>
                          Explore the opportunities to conquer the future
                        </p>
                      </div>
                    </div>
                    <div className='relative flex flex-col min-w-0'>
                      <div className='px-4 py-5 flex-auto'>
                        <div className='text-blueGray-500 p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-white'>
                          <i className='fas fa-drafting-compass'></i>
                        </div>
                        <h6 className='text-xl mb-1 font-semibold'>
                          Select job
                        </h6>
                        <p className='mb-4 text-blueGray-500'>
                          Shape your career, create your own unique mark!
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className='w-full md:w-6/12 px-4'>
                    <div className='relative flex flex-col min-w-0 mt-4'>
                      <div className='px-4 py-5 flex-auto'>
                        <div className='text-blueGray-500 p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-white'>
                          <i className='fas fa-newspaper'></i>
                        </div>
                        <h6 className='text-xl mb-1 font-semibold'>Apply jobs</h6>
                        <p className='mb-4 text-blueGray-500'>
                          Submit a job application once, open countless doors to success!
                        </p>
                      </div>
                    </div>
                    <div className='relative flex flex-col min-w-0'>
                      <div className='px-4 py-5 flex-auto'>
                        <div className='text-blueGray-500 p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-white'>
                          <i className='fas fa-file-alt'></i>
                        </div>
                        <h6 className='text-xl mb-1 font-semibold'>
                          Interview
                        </h6>
                        <p className='mb-4 text-blueGray-500'>
                          Encounter opportunities, showcase your talents, conquer employers!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='container mx-auto overflow-hidden pb-0 md:pb-20'>
            <div className='flex flex-wrap items-center'>
              <div className='w-full md:w-4/12 px-12 md:px-4 ml-auto mr-auto mt-16 md:mt-48'>
                <div className='text-blueGray-500 p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg rounded-full bg-white'>
                  <i className='fas fa-sitemap text-xl'></i>
                </div>
                <h3 className='text-3xl mb-2 font-semibold leading-normal'>
                  Why should you choose us?
                </h3>
                <p className='text-lg font-light leading-relaxed mt-4 mb-4 text-blueGray-600'>
                  Quick and convenient matching, job suggestions, and guidance on the path to finding your dream job. 
                  Safe and secure: We believe that safeguarding your personal information is of utmost importance. 
                  Strong community: Supporting you on your career journey and providing a friendly and motivating environment.
                </p>
                <div className='block pb-6'>
                  <span className='text-xs font-semibold inline-block py-1 px-2 rounded-full text-blueGray-500 bg-white uppercase last:mr-0 mr-2 mt-2'>
                    Buttons
                  </span>
                  <span className='text-xs font-semibold inline-block py-1 px-2 rounded-full text-blueGray-500 bg-white uppercase last:mr-0 mr-2 mt-2'>
                    Inputs
                  </span>
                  <span className='text-xs font-semibold inline-block py-1 px-2 rounded-full text-blueGray-500 bg-white uppercase last:mr-0 mr-2 mt-2'>
                    Labels
                  </span>
                  <span className='text-xs font-semibold inline-block py-1 px-2 rounded-full text-blueGray-500 bg-white uppercase last:mr-0 mr-2 mt-2'>
                    Menus
                  </span>
                  <span className='text-xs font-semibold inline-block py-1 px-2 rounded-full text-blueGray-500 bg-white uppercase last:mr-0 mr-2 mt-2'>
                    Navbars
                  </span>
                  <span className='text-xs font-semibold inline-block py-1 px-2 rounded-full text-blueGray-500 bg-white uppercase last:mr-0 mr-2 mt-2'>
                    Pagination
                  </span>
                  <span className='text-xs font-semibold inline-block py-1 px-2 rounded-full text-blueGray-500 bg-white uppercase last:mr-0 mr-2 mt-2'>
                    Progressbars
                  </span>
                  <span className='text-xs font-semibold inline-block py-1 px-2 rounded-full text-blueGray-500 bg-white uppercase last:mr-0 mr-2 mt-2'>
                    Typography
                  </span>
                </div>
                <a
                  href=''
                  target='_blank'
                  className='font-bold text-blueGray-700 hover:text-blueGray-500 ease-linear transition-all duration-150'
                >
                  View All{' '}
                  <i className='fa fa-angle-double-right ml-1 leading-relaxed'></i>
                </a>
              </div>

              <div className='w-full md:w-5/12 px-4 mr-auto ml-auto mt-32'>
                <div className='relative flex flex-col min-w-0 w-full mb-6 mt-48 md:mt-0'>
                  <img
                    alt='...'
                    src='/img/component-btn.png'
                    className='w-full align-middle rounded absolute shadow-lg max-w-100-px left-145-px -top-29-px z-3'
                  />
                  <img
                    alt='...'
                    src='/img/component-profile-card.png'
                    className='w-full align-middle rounded-lg absolute shadow-lg max-w-210-px left-260-px -top-160-px'
                  />
                  <img
                    alt='...'
                    src='/img/component-info-card.png'
                    className='w-full align-middle rounded-lg absolute shadow-lg max-w-180-px left-40-px -top-225-px z-2'
                  />
                  <img
                    alt='...'
                    src='/img/component-info-2.png'
                    className='w-full align-middle rounded-lg absolute shadow-2xl max-w-200-px -left-50-px top-25-px'
                  />
                  <img
                    alt='...'
                    src='/img/component-menu.png'
                    className='w-full align-middle rounded absolute shadow-lg max-w-580-px -left-20-px top-210-px'
                  />
                  <img
                    alt='...'
                    src='/img/component-btn-pink.png'
                    className='w-full align-middle rounded absolute shadow-xl max-w-120-px left-195-px top-95-px'
                  />
                </div>
              </div>
            </div>

            <div className='flex flex-wrap items-center pt-0 lg:pt-32'>
              <div className='w-full md:w-6/12 px-4 mr-auto ml-auto mt-32'>
                <div className='justify-center flex flex-wrap relative'>
                  <div className='my-4 w-full lg:w-6/12 px-4'>
                    <a
                      href=''
                      target='_blank'
                    >
                      <div className='bg-red-600 shadow-lg rounded-lg text-center p-8'>
                        <img
                          alt='...'
                          className='shadow-md rounded-full max-w-full w-16 mx-auto p-2 bg-white'
                          src='https://raw.githubusercontent.com/creativetimofficial/public-assets/master/logos/svelte.jpg'
                        />
                        <p className='text-lg text-white mt-4 font-semibold'>
                          Svelte
                        </p>
                      </div>
                    </a>
                    <a
                      href=''
                      target='_blank'
                    >
                      <div className='bg-lightBlue-500 shadow-lg rounded-lg text-center p-8 mt-8'>
                        <img
                          alt='...'
                          className='shadow-md rounded-full max-w-full w-16 mx-auto p-2 bg-white'
                          src='https://raw.githubusercontent.com/creativetimofficial/public-assets/master/logos/react.jpg'
                        />
                        <p className='text-lg text-white mt-4 font-semibold'>
                          ReactJS
                        </p>
                      </div>
                    </a>
                    <a
                      href=''
                      target='_blank'
                    >
                      <div className='bg-blueGray-700 shadow-lg rounded-lg text-center p-8 mt-8'>
                        <img
                          alt='...'
                          className='shadow-md rounded-full max-w-full w-16 mx-auto p-2 bg-white'
                          src='https://raw.githubusercontent.com/creativetimofficial/public-assets/master/logos/nextjs.jpg'
                        />
                        <p className='text-lg text-white mt-4 font-semibold'>
                          NextJS
                        </p>
                      </div>
                    </a>
                  </div>
                  <div className='my-4 w-full lg:w-6/12 px-4 lg:mt-16'>
                    <a
                      href=''
                      target='_blank'
                    >
                      <div className='bg-yellow-500 shadow-lg rounded-lg text-center p-8'>
                        <img
                          alt='...'
                          className='shadow-md rounded-full max-w-full w-16 mx-auto p-2 bg-white'
                          src='https://raw.githubusercontent.com/creativetimofficial/public-assets/master/logos/js.png'
                        />
                        <p className='text-lg text-white mt-4 font-semibold'>
                          JavaScript
                        </p>
                      </div>
                    </a>
                    <a
                      href=''
                      target='_blank'
                    >
                      <div className='bg-red-700 shadow-lg rounded-lg text-center p-8 mt-8'>
                        <img
                          alt='...'
                          className='shadow-md rounded-full max-w-full w-16 mx-auto p-2 bg-white'
                          src='https://raw.githubusercontent.com/creativetimofficial/public-assets/master/logos/angular.jpg'
                        />
                        <p className='text-lg text-white mt-4 font-semibold'>
                          Angular
                        </p>
                      </div>
                    </a>
                    <a
                      href=''
                      target='_blank'
                    >
                      <div className='bg-emerald-500 shadow-lg rounded-lg text-center p-8 mt-8'>
                        <img
                          alt='...'
                          className='shadow-md rounded-full max-w-full w-16 mx-auto p-2 bg-white'
                          src='https://raw.githubusercontent.com/creativetimofficial/public-assets/master/logos/vue.jpg'
                        />
                        <p className='text-lg text-white mt-4 font-semibold'>
                          Vue.js
                        </p>
                      </div>
                    </a>
                  </div>
                </div>
              </div>

              <div className='w-full md:w-4/12 px-12 md:px-4 ml-auto mr-auto mt-16 md:mt-48'>
                <div className='text-blueGray-500 p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg rounded-full bg-white'>
                  <i className='fas fa-drafting-compass text-xl'></i>
                </div>
                <h3 className='text-3xl mb-2 font-semibold leading-normal'>
                  Browse job by category
                </h3>
                <p className='text-lg font-light leading-relaxed mt-4 mb-4 text-blueGray-600'>
                  Expand your horizons, explore jobs. From creative programming to groundbreaking design, 
                  from exciting project management to magical data analysis, we create a diverse and captivating array. 
                  Take time to heed your career calling, to discover a world of bold and inspiring jobs. 
                  Why not step into a new adventure and explore the awaiting opportunities?
                </p>
                <p className='text-lg font-light leading-relaxed mt-4 mb-4 text-blueGray-600'>
                  We created a set of Components that are dynamic and come to help
                  you.
                </p>
                <div className='block pb-6'>
                  <span className='text-xs font-semibold inline-block py-1 px-2  rounded-full text-blueGray-500 bg-white uppercase last:mr-0 mr-2 mt-2'>
                    Alerts
                  </span>
                  <span className='text-xs font-semibold inline-block py-1 px-2  rounded-full text-blueGray-500 bg-white uppercase last:mr-0 mr-2 mt-2'>
                    Dropdowns
                  </span>
                  <span className='text-xs font-semibold inline-block py-1 px-2  rounded-full text-blueGray-500 bg-white uppercase last:mr-0 mr-2 mt-2'>
                    Menus
                  </span>
                  <span className='text-xs font-semibold inline-block py-1 px-2  rounded-full text-blueGray-500 bg-white uppercase last:mr-0 mr-2 mt-2'>
                    Modals
                  </span>
                  <span className='text-xs font-semibold inline-block py-1 px-2  rounded-full text-blueGray-500 bg-white uppercase last:mr-0 mr-2 mt-2'>
                    Navbars
                  </span>
                  <span className='text-xs font-semibold inline-block py-1 px-2  rounded-full text-blueGray-500 bg-white uppercase last:mr-0 mr-2 mt-2'>
                    Popovers
                  </span>
                  <span className='text-xs font-semibold inline-block py-1 px-2  rounded-full text-blueGray-500 bg-white uppercase last:mr-0 mr-2 mt-2'>
                    Tabs
                  </span>
                  <span className='text-xs font-semibold inline-block py-1 px-2  rounded-full text-blueGray-500 bg-white uppercase last:mr-0 mr-2 mt-2'>
                    Tooltips
                  </span>
                </div>
                <a
                  href=''
                  target='_blank'
                  className='font-bold text-blueGray-700 hover:text-blueGray-500 ease-linear transition-all duration-150'
                >
                  View all{' '}
                  <i className='fa fa-angle-double-right ml-1 leading-relaxed'></i>
                </a>
              </div>
            </div>
          </div>

          <div className='container mx-auto px-4 pb-0 md:pb-32 pt-16 md:pt-48'>
            <div className='items-center flex flex-wrap'>
              <div className='w-full md:w-5/12 ml-auto px-12 md:px-4'>
                <div className='md:pr-12'>
                  <div className='text-blueGray-500 p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg rounded-full bg-white'>
                    <i className='fas fa-file-alt text-xl'></i>
                  </div>
                  <h3 className='text-3xl font-semibold'>
                    New event
                  </h3>
                  <p className='mt-4 text-lg leading-relaxed text-blueGray-500'>
                    Welcome to the upcoming event! We are delighted to announce an amazing event taking place in the near future. 
                    This is a fantastic opportunity for you to connect, learn, and experience new things in your industry.
                    You&lsquo;re good to go.
                  </p>
                  <ul className='list-none mt-6'>
                    <li className='py-2'>
                      <div className='flex items-center'>
                        <div>
                          <span className='text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blueGray-500 bg-blueGray-50 mr-3'>
                            <i className='fas fa-fingerprint'></i>
                          </span>
                        </div>
                        <div>
                          <h4 className='text-blueGray-500'>
                            {newEvent[0]?.title}
                          </h4>
                        </div>
                      </div>
                    </li>
                    <li className='py-2'>
                      <div className='flex items-center'>
                        <div>
                          <span className='text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blueGray-500 bg-blueGray-50 mr-3'>
                            <i className='fab fa-html5'></i>
                          </span>
                        </div>
                        <div>
                          <h4 className='text-blueGray-500'>
                            {formatStringToDate(newEvent[0]?.startDate)}
                          </h4>
                        </div>
                      </div>
                    </li>
                    <li className='py-2'>
                      <div className='flex items-center'>
                        <div>
                          <span className='text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blueGray-500 bg-blueGray-50 mr-3'>
                            <i className='far fa-paper-plane'></i>
                          </span>
                        </div>
                        <div>
                          <h4 className='text-blueGray-500'>
                            {newEvent[0]?.location}
                          </h4>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className='w-full md:w-6/12 mr-auto px-4 pt-24 md:pt-0'>
                <Link href={`/events/${newEvent[0]?.slug}`}>
                  <img
                    alt='banner'
                    className='max-w-full rounded-lg shadow-xl'
                    style={{
                      transform:
                      'scale(1) perspective(1040px) rotateY(-11deg) rotateX(2deg) rotate(2deg)',
                    }}
                    src={newEvent[0]?.bannerUrl}
                  />
                </Link>
              </div>
            </div>
          </div>

          {/* <div className='justify-center text-center flex flex-wrap mt-24'>
            <div className='w-full md:w-6/12 px-12 md:px-4'>
              <h2 className='font-semibold text-4xl'>Latest posts from istick</h2>
              <p className='text-lg leading-relaxed mt-4 mb-4 text-blueGray-500'>
                With diversity and quality, we bring you in-depth articles and the latest research information in the field relevant to your job
              </p>
            </div>
          </div> */}
        </section>

        {/* <section className='block relative z-1 bg-blueGray-600'>
          <div className='container mx-auto'>
            <div className='justify-center flex flex-wrap'>
              <div className='w-full lg:w-12/12 px-4  -mt-24'>
                <div className='flex flex-wrap'>
                  <div className='w-full lg:w-4/12 px-4'>
                    <h5 className='text-xl font-semibold pb-4 text-center'>
                      Login Page
                    </h5>
                    <div>
                      <div className='hover:-mt-4 relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-lg ease-linear transition-all duration-150'>
                        <img
                          alt='...'
                          className='align-middle border-none max-w-full h-auto rounded-lg'
                          src='/img/login.jpg'
                        />
                      </div>
                    </div>
                  </div>

                  <div className='w-full lg:w-4/12 px-4 text-[#fff] lg:text-black'>
                    <h5 className='text-xl font-semibold pb-4 text-center'>
                      Profile Page
                    </h5>
                    <div>
                      <div className='hover:-mt-4 relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-lg ease-linear transition-all duration-150'>
                        <img
                          alt='...'
                          className='align-middle border-none max-w-full h-auto rounded-lg'
                          src='/img/profile.jpg'
                        />
                      </div>
                    </div>
                  </div>

                  <div className='w-full lg:w-4/12 px-4 text-[#fff] lg:text-black'>
                    <h5 className='text-xl font-semibold pb-4 text-center'>
                      Landing Page
                    </h5>
                    <div>
                      <div className='hover:-mt-4 relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-lg ease-linear transition-all duration-150'>
                        <img
                          alt='...'
                          className='align-middle border-none max-w-full h-auto rounded-lg'
                          src='/img/landing.jpg'
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section> */}

        <section className='py-4 md:py-20 bg-blueGray-600 overflow-hidden'>
          <div className='w-full md:w-4/12 px-4 mr-auto ml-auto mt-32 relative'>
            <i className='fab fa-github text-blueGray-700 absolute text-55 -top-150-px -right-100 left-auto opacity-80'></i>
          </div>
        </section>

        <section className='pb-0 md:pb-16 bg-blueGray-200 relative pt-32'>
          <div
            className='-mt-20 top-0 bottom-auto left-0 right-0 w-full absolute h-20'
            style={{ transform: 'translateZ(0)' }}
          >
            <svg
              className='absolute bottom-0 overflow-hidden'
              xmlns='http://www.w3.org/2000/svg'
              preserveAspectRatio='none'
              version='1.1'
              viewBox='0 0 2560 100'
              x='0'
              y='0'
            >
              <polygon
                className='text-blueGray-200 fill-current'
                points='2560 0 2560 100 0 100'
              ></polygon>
            </svg>
          </div>

          <div className='container mx-auto'>
            <div className='flex flex-wrap justify-center bg-white shadow-xl rounded-lg -mt-64 py-4 md:py-16 px-12 relative z-10'>
              <div className='w-full text-center lg:w-8/12'>
                <p className='text-4xl text-center'>
                  <span role='img' aria-label='love'>
                    😍
                  </span>
                </p>
                <h3 className='font-semibold text-3xl'>
                  Do you love this istick?
                </h3>
                <p className='text-blueGray-500 text-lg leading-relaxed mt-4 mb-4'>
                  iStick feels your empathy and appreciation. That&lsquo;s why we continuously provide the best recruitment solutions. 
                  It&lsquo;s all thanks to our passion and love for your success. 
                  Keep journeying with iStick, and together we will build a fantastic future!
                </p>
                <div className='sm:block flex flex-col mt-10'>
                  <a
                    // href=''
                    // target='_blank'
                    className='get-started text-white font-bold px-6 py-4 rounded outline-none focus:outline-none mr-1 mb-2 bg-blueGray-400 active:bg-blueGray-500 uppercase text-sm shadow hover:shadow-lg ease-linear transition-all duration-150'
                  >
                    LOGIN NOW
                  </a>
                  <a
                    // href=''
                    // target='_blank'
                    className='github-star sm:ml-1 text-white font-bold px-6 py-4 rounded outline-none focus:outline-none mr-1 mb-1 bg-blueGray-700 active:bg-blueGray-600 uppercase text-sm shadow hover:shadow-lg'
                  >
                    <i className='fab fa-github text-lg mr-1'></i>
                    <span>Receive emails from iStick.</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
}


export default  appWithTranslation(Index)