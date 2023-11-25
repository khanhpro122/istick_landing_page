/* eslint-disable @next/next/no-img-element */
// Libraries
import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { NextPage } from 'next';
import { createPopper } from '@popperjs/core';

// eslint-disable-next-line @next/next/no-img-element

// Services
import * as ServiceAuth from '@/services/auth'

// Components
import { Button } from '../Buttons/Button';
import { ModalAuth } from '../Modals/ModalAuth';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { clearCookie, getCookie } from '@/utils';
import { useAuth } from '@/hooks/useAuth';

type TProps = {
  fixed?: boolean;
  isShowAuth?: boolean;
}
interface User {
  username: string;
}

const Navbar:NextPage<TProps> = (props) => {
  const [navbarOpen, setNavbarOpen] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false)
  const router = useRouter()
  const btnDropdownRef = useRef<HTMLDivElement>(null)
  const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
  const popoverDropdownRef = useRef<HTMLDivElement>(null);
  const btnDropdownRefDesk = useRef<HTMLDivElement>(null)
  const [dropdownPopoverShowDesk, setDropdownPopoverShowDesk] = React.useState(false);
  const { user, logout } = useAuth()

  const onCloseModal = () => {
    setOpenModal(false)
  }

  const handleSignIn = () => {
    setOpenModal(true)
    setNavbarOpen(false)
  }

  const handlePostJob = () => {
    router.push('/hiring')
  }
  
  const handleDropdownToggle = () => {
    if(btnDropdownRef.current && popoverDropdownRef.current) {
      createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
        placement: "bottom-start"
      });
      setDropdownPopoverShow(true);
    }
  };

  const handleDropdownToggleDesk = () => {
    if(btnDropdownRefDesk.current) {
      setDropdownPopoverShowDesk(true);
    }
  };

  const handleLogout = (device: string | undefined) => {
    if(device === 'mobile') {
      setNavbarOpen(false)
    }
    logout()
  }

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (
        dropdownPopoverShow &&
        popoverDropdownRef.current &&
        !popoverDropdownRef.current.contains(event.target as Node) &&
        !btnDropdownRef.current?.contains(event.target as Node)
      ) {
        setDropdownPopoverShow(false);
      }
    };

    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [dropdownPopoverShow]);

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (
        dropdownPopoverShowDesk &&
        !btnDropdownRefDesk.current?.contains(event.target as Node)
      ) {
        setDropdownPopoverShowDesk(false);
      }
    };

    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [dropdownPopoverShowDesk]);
  
  return (
    <>
      <ModalAuth isOpen={openModal} closeModal={onCloseModal} />
      <nav className='top-0 fixed z-50 w-full flex flex-wrap items-center justify-between px-2 py-2 navbar-expand-lg bg-blueGray-200 shadow'>
        <div className='container px-4 mx-auto flex flex-wrap items-center justify-between'>
          <div className='w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start'>
            <Link
              href='/'
            >
              <div
                className="bg-cover w-[120px] h-[60px] bg-center"
                style={{
                  backgroundImage: 'url(/img/logo.png)'
                }}
              ></div>
            </Link>
            <button
              className='cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none'
              type='button'
              onClick={() => setNavbarOpen(!navbarOpen)}
            >
              <i className='fas fa-bars'></i>
            </button>
          </div>
          <div
            className={'hidden lg:flex flex-grow items-center bg-[#000] lg:bg-opacity-0 lg:shadow-none'}
            id='example-navbar-warning'
          >
            <ul className='flex flex-row list-none ml-auto' >
              <li className='text-black flex items-center font-medium text-lg px-3 py-4 lg:py-2 cursor-pointer'>
                <Link href='/events'>Events</Link>
              </li>
              <li className='text-black text-left text-lg ml-6 py-2 w-full font-medium cursor-pointer'>
                <Link href='/research'>Research</Link>
              </li>
              <li className='text-black flex items-center ml-6 font-medium text-lg px-3 py-4 lg:py-2 cursor-pointer whitespace-nowrap'>
                <Link
                  href='/jobs'
                >
                  Find job
                </Link>
              </li>
              {/* <li className='text-black flex items-center ml-6 font-medium text-lg px-3 py-4 lg:py-2 cursor-pointer whitespace-nowrap'>
                <Link
                  href='/talents'
                >
                  Find talent
                </Link>
              </li> */}
              <li className='text-black flex items-center ml-6 font-medium text-lg px-3 py-4 lg:py-2 cursor-pointer whitespace-nowrap'>
                <Link
                  href='/about'
                >
                  About us
                </Link>
              </li>
            </ul>
            {props?.isShowAuth && (

              <div className="ml-6 flex items-center relative">
                {user?.username ? (
                  <>
                    <div 
                      className="flex items-center gap-2 cursor-pointer"
                      ref={btnDropdownRefDesk}
                      onClick={handleDropdownToggleDesk}
                    >
                      <Image
                        src={user?.avatar || ""}
                        alt='profile'
                        placeholder='blur'
                        blurDataURL={'@/public/img/placeholder.png'}
                        className='align-middle border-none max-w-full w-[40px] rounded-[50%] object-cover max-h-[x] h-[40px]'
                        width={0}
                        height={0}
                        sizes="100vw"
                      />
                      <span className="font-medium text-black text-[16px]">
                        <span className="inline-block max-w-[140px] whitespace-nowrap text-ellipsis overflow-hidden">{user?.fullname || user?.username}{' '}</span>
                        <span className="text-[14px] ml-[2px] relative top-[-6px]"><i className="fas fa-chevron-down"></i></span> 
                      </span>
                    </div>
                    <div
                      className={
                        (dropdownPopoverShowDesk ? 'block ' : 'hidden ') +
                      'text-base z-50 absolute top-[50px] min-w-[140px] py-2 list-none text-left border-solid border-[1px] shadow-lg rounded-md bg-white text-black'
                      }
                      style={{
                        width: btnDropdownRefDesk.current ? btnDropdownRefDesk.current.clientWidth : '300px',
                      }}
                    >
                      <div className="">
                        <div className="border-b-[1px] border-solid">
                          <Link
                            className='mx-2 text-sm flex py-2 px-2 rounded-md font-normal items-center gap-1 w-full whitespace-nowrap cursor-pointer text-black'
                            href='/profile'
                          >
                            <span className="text-[16px] inline-block w-[20px]"><i className="far fa-user"></i></span>
                            <span>Profile User</span>
                          </Link>
                        </div>
                        {user?.userType === 'RECRUITER' && (
                          <div className="border-b-[1px] border-solid">
                            <Link
                              className='mx-2 text-sm flex py-2 px-2 rounded-md font-normal items-center gap-1 w-full whitespace-nowrap cursor-pointer text-black'
                              href='/packages'
                            >
                              <span className="text-[16px] inline-block w-[20px]"><i className="fas fa-cube"></i></span>
                              <span>Your package</span>
                            </Link>
                          </div>
                        )}
                        {user?.userType === 'RECRUITER' && (
                          <div className="border-b-[1px] border-solid">
                            <Link
                              className='mx-2 text-sm flex py-2 px-2 rounded-md font-normal items-center gap-1 w-full whitespace-nowrap cursor-pointer text-black'
                              href='/hiring'
                            >
                              <span className="text-[16px] inline-block w-[20px]"><i className="fas fa-cloud-upload-alt"></i></span>
                              <span>Manage job</span>
                            </Link>
                          </div>
                        )}
                        <div className="border-b-[1px] border-solid">
                          <div
                            className='mx-2 text-sm flex py-2 px-2 rounded-md font-normal items-center gap-1 w-full whitespace-nowrap cursor-pointer text-black'
                            onClick={() => handleLogout(undefined)}
                          >
                            <span className="text-[16px] inline-block w-[20px]"><i className="fas fa-sign-out-alt"></i></span>
                            <span>Log out</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <Button 
                    classBtn="h-auto bg-[#2b6fdf] py-2 px-6 rounded-md font-bold outline-[none] border-none focus:outline-none text-white"
                    textBtn='Sign in'
                    onClick={() => setOpenModal(true)}
                  />
                )}
              </div>
            )}
          </div>
          <div
            className={
              'flex flex-grow items-center bg-[#000] lg:bg-opacity-0 lg:shadow-none lg:hidden ' 
              // + (navbarOpen ? ' block' : ' hidden')
            }
            id='example-navbar-warning'
          >
            <div 
              onClick={() => setNavbarOpen(!navbarOpen)} 
              className={"w-full h-full fixed top-0 right-0 left-0" + (navbarOpen ? ' block' : ' hidden')}
              style={{
                background: 'rgba(0, 0, 0, 0.2)'
              }}
            ></div>
            <ul 
              className={
                'flex flex-col list-none bg-white fixed top-0 left-0 w-[60vw] translate-x-[-100%] h-[100vh] transition-transform'
              }
              style={{
                // left: navbarOpen ? 'left-0': 'left-[-250px]'
                transform: navbarOpen ? 'translateX(0%)' : 'translateX(-100%)'
              }}
            >
              <div className="flex items-center justify-between pr-4">
                <Link
                  href='/'
                >
                  <img src="/img/logo.png" alt="logo" className='h-[40px]'  />
                </Link>
                <button
                  className='cursor-pointer text-xl leading-none border border-solid
                  text-right
                  border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none'
                  type='button'
                  onClick={() => setNavbarOpen(!navbarOpen)}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="pl-4 flex flex-col md:flex-row gap-4 mt-4 pr-4 md:pr-0">
                {user?.id ? (
                  <>
                    <div 
                      className="flex items-center gap-2 cursor-pointer"
                      ref={btnDropdownRef}
                      onClick={handleDropdownToggle}
                    >
                      <Image
                        src={user?.avatar || ''}
                        alt='profile'
                        placeholder='blur'
                        blurDataURL={'@/public/img/placeholder.png'}
                        className='align-middle border-none max-w-full w-[40px] rounded-[50%] object-cover max-h-[x] h-[40px]'
                        width={0}
                        height={0}
                        sizes="100vw"
                      />
                      <span className="font-medium text-black">
                        <span className="inline-block whitespace-nowrap max-w-[100px] text-ellipsis overflow-hidden">{user?.fullname ? `${user?.fullname}{' '}` :  user?.email}</span>
                        <span className="text-[14px] relative top-[-4px]"><i className="fas fa-chevron-down"></i></span> 
                      </span>
                    </div>
                    <div
                      ref={popoverDropdownRef}
                      className={
                        (dropdownPopoverShow ? 'block ' : 'hidden ') +
                    'text-base z-50 float-left py-2 list-none text-left border-solid border-[1px] shadow-lg rounded-md bg-white text-black'
                      }
                      style={{
                        width: btnDropdownRef.current ? btnDropdownRef.current.clientWidth : '300px'
                      }}
                    >
                      <div className="">
                        <div className="border-b-[1px] border-solid">
                          <Link
                            className='mx-2 text-sm flex py-2 px-2 rounded-md font-normal items-center gap-1 w-full whitespace-nowrap cursor-pointer text-black'
                            href='/profile'
                          >
                            <span className="text-[16px] inline-block w-[20px]"><i className="far fa-user"></i></span>
                            <span>Profile User</span>
                          </Link>
                        </div>
                        {user?.userType === 'RECRUITER' && (
                          <div className="border-b-[1px] border-solid">
                            <Link
                              className='mx-2 text-sm flex py-2 px-2 rounded-md font-normal items-center gap-1 w-full whitespace-nowrap cursor-pointer text-black'
                              href='/packages'
                            >
                              <span className="text-[16px] inline-block w-[20px]"><i className="fas fa-cube"></i></span>
                              <span>Your package</span>
                            </Link>
                          </div>
                        )}
                        {user?.userType === 'RECRUITER' && (
                          <div className="border-b-[1px] border-solid">
                            <Link
                              className='mx-2 text-sm flex py-2 px-2 rounded-md font-normal items-center gap-1 w-full whitespace-nowrap cursor-pointer text-black'
                              href='/hiring'
                            >
                              <span className="text-[16px] inline-block w-[20px]"><i className="fas fa-cloud-upload-alt"></i></span>
                              <span>Manage job</span>
                            </Link>
                          </div>
                        )}
                        <div className="border-b-[1px] border-solid">
                          <div
                            className='mx-2 text-sm flex py-2 px-2 rounded-md font-normal items-center gap-1 w-full whitespace-nowrap cursor-pointer text-black'
                            onClick={() => handleLogout('mobile')}
                          >
                            <span className="text-[16px] inline-block w-[20px]"><i className="fas fa-sign-out-alt"></i></span>
                            <span>Log out</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <Button 
                    classBtn="h-auto font-bold outline-[none] border-none focus:outline-none text-white bg-[#2b6fdf] py-2 px-6 rounded-md"
                    textBtn='Sign in'
                    onClick={handleSignIn}
                  />
                )}
              </div>
              <li className='text-black text-left pl-4 text-lg py-2 w-full font-medium cursor-pointer hover:text-[#f65e39]'>
                <Link href='/events'>Events</Link>
              </li>
              <li className='text-black text-left text-lg pl-4 py-2 w-full font-medium cursor-pointer hover:text-[#f65e39]'>
                <Link href='/research'>Research</Link>
              </li>
              <li className='text-black text-left text-lg pl-4 py-2 w-full font-medium cursor-pointer hover:text-[#f65e39]'>
                {/* {t(translations.header.aboutUs.title)} */}
                <Link
                  href='/jobs'
                >
                  Find job
                </Link>
              </li>
              {/* <li className='text-black text-left text-lg pl-4 py-2 w-full font-medium cursor-pointer hover:text-[#f65e39]'>
                <Link
                  href='/talents'
                >
                  Find talent
                </Link>
              </li> */}
              <li className='text-black text-left text-lg pl-4 py-2 w-full font-medium cursor-pointer hover:text-[#f65e39]'>
                <Link
                  href='/about'
                >
                  About us
                </Link>
              </li>
              
            </ul>
            
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar
