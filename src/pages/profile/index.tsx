// Libraries
import Image from 'next/image';
import React, { useState, useRef, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Router from 'next/router';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'

// Components
import { Button } from '@/components/Buttons/Button';
import Footer from '@/components/Footers/Footer';
import Navbar from '@/components/Navbars/IndexNavbar';
import Modal from '@/components/Modals';
import { Input } from '@/components/Inputs/Input';
import Dropdown from '@/components/Dropdowns/Dropdown';
import { InputDate } from '@/components/Inputs/InputDate';
import { Loading } from '@/components/Loading/Loading';

// Services
import * as ServiceAuth from '@/services/auth';
import * as ServiceSystem from  '@/services/system'

// Utils
import { convertIosToDatetime, convertLocalPhone, getCookie, getLocalUserData } from '@/utils';

// Types
import { TUser } from '@/types/type';
import Head from 'next/head';
import { useAuth } from '@/hooks/useAuth';

function Index() {
  const refInputFile = useRef<null | HTMLInputElement>(null)
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  
  const [userInfoCreate, setUserInfoCreate] = useState<TUser>({
    avatar: null,
    email: '',
    fullname: '',
    socialTitle: '',
    jobTitle: '',
    phoneNumber: '',
    username: '',
    address: '',
    dateOfBirth: null,
    codePhone: 'vn',
    seekingStatus: "",
  })

  const [locations, setLocations] = useState<any>({});

  const { accessToken } = getLocalUserData();

  const fetchUpdateInfoUser = async (data: any) => {
    const response = await ServiceAuth.updateUserInfo(String(userInfo?.id) || '', data)
    return response.data;
  }

  const fetchListLocation = async () => {
    const res = await ServiceSystem.getListCities(1);
    const objectMap:any = {}
    res?.data?.list?.forEach((item:any) => {
      objectMap[item.id] = item?.name
    })
    setLocations(objectMap);
  }

  const uploadFile = async (data:any) => {
    const res = await ServiceAuth.uploadFile(data)
    return res.data
  }

  const mutationUpdateUser = useMutation(['updateUser'], fetchUpdateInfoUser);
  const mutationUpdateAvatar = useMutation(['updateAvatar'], uploadFile);
  const { user: userInfo } = useAuth()
  
  const queryClient = useQueryClient()

  const { isLoading } = mutationUpdateUser
  const { isLoading: isLoadingAvatar }  = mutationUpdateAvatar

  useEffect(() => {
    if(userInfo) {
      setUserInfoCreate({
        avatar: userInfo.avatar,
        email: userInfo.email,
        fullname: userInfo.fullname,
        socialTitle: userInfo.socialTitle,
        jobTitle: userInfo.jobTitle,
        phoneNumber: convertLocalPhone(userInfo.phoneNumber || '') || '',
        userType: userInfo.userType,
        address: userInfo?.address,
        dateOfBirth: userInfo?.dateOfBirth,
        status: userInfo?.status,
        seekingStatus: userInfo?.seekingStatus ? userInfo?.seekingStatus : ""
      })
    }
  }, [userInfo])

  useEffect(() => {
    if(!accessToken) {
      Router.replace('/')
    }
    fetchListLocation()
  }, [])

  // handle
  const handleUpdateUser = () => {
    mutationUpdateUser.mutate(
      {...userInfoCreate,
        phoneNumber: userInfoCreate?.phoneNumber ? `+84${userInfoCreate?.phoneNumber}` : undefined,
      }, {
        onSuccess: () => {
          setIsEdited(!isEdited)
          queryClient.invalidateQueries(['user']);
          toast.success('Update user info is successed!', {
            position: toast.POSITION.BOTTOM_LEFT,
          });
        },
        onError:() => {
          toast.error('Update user info is failed, Please try again!', {
            position: toast.POSITION.BOTTOM_LEFT,
          });
        }
      })
  }

  const onCloseModal = () => {
    setIsOpenModal(false);
  };

  const toggleStatusSeeking = () => {
    setIsOpenModal(true)
  }

  const handleChangeBirthday = (date: any) => {
    setUserInfoCreate({
      ...userInfoCreate,
      dateOfBirth: date
    })
  }

  const handleOnchangeInput = (name: string, value: string) => {
    setUserInfoCreate({
      ...userInfoCreate,
      [name]: value
    })
  }

  const handleSocialTitle = (title:string) => {
    setUserInfoCreate({
      ...userInfoCreate,
      socialTitle: title
    })
  }

  const onChangeCodeCountry = (code:string) => {
    setUserInfoCreate({
      ...userInfoCreate,
      codePhone: code,
    })
  }

  const handleClickBtnFile = () => {
    if (refInputFile.current) {
      refInputFile.current.click();
    }
  };

  const handleOnchangeAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedImage = e.target.files?.[0];
    if(selectedImage) {
      const formData = new FormData()
      formData.append(`${'key1'}.data`, selectedImage)
      formData.append(`${'key1'}.name`, selectedImage?.name)
      formData.append(`${'key1'}.is_public`, 'true')
      mutationUpdateAvatar.mutate(
        formData, {
          onSuccess: (data: any) => {
            setUserInfoCreate({
              ...userInfoCreate,
              avatar: data?.urls[0]?.url
            })
          },
          onError:() => {
            toast.error('Update avatar is failed, Please try again!', {
              position: toast.POSITION.BOTTOM_LEFT,
            });
          }
        })
    }
  }

  const handleDeleteAvatar = () => {
    setUserInfoCreate({
      ...userInfoCreate,
      avatar: null
    })
    if (refInputFile.current) {
      refInputFile.current.value = '';
    }
  }

  const handleChangeStatus = () => {
    mutationUpdateUser.mutate(
      {...userInfoCreate,
        phoneNumber: userInfoCreate?.phoneNumber ? `+84${userInfoCreate?.phoneNumber}` : undefined,
        seekingStatus: userInfoCreate?.seekingStatus === 'OPEN' ? 'CLOSE' : 'OPEN',
      }, {
        onSuccess: () => {
          queryClient.invalidateQueries(['user']);
          toast.success('Update user info is successed!', {
            position: toast.POSITION.BOTTOM_LEFT,
          });
        },
        onError:() => {
          toast.error('Update user info is failed, Please try again!', {
            position: toast.POSITION.BOTTOM_LEFT,
          });
        },
        onSettled: () => {
          onCloseModal()
        }
      })
  }

  const listSkill = userInfo?.userTags?.filter((tag: any) => tag?.tagType === "SKILL");
  const listTitle = userInfo?.userTags?.filter((tag: any) => tag?.tagType === "TITLE");
  const listLocation = userInfo?.userTags?.filter((tag: any) => tag?.tagType === "LOCATION");

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <Navbar fixed isShowAuth />
      <ToastContainer />
      <Loading isLoading={isLoading || isLoadingAvatar} />
      <Modal isOpen={isOpenModal} closeModal={onCloseModal}>
        <div className="bg-white p-5 rounded-md">
          <div className='text-right'>
            <Button
              iconBtn="fas fa-times text-[20px]"
              classBtn="h-[32px] w-[32px] text-black outline-[none] border-none focus:outline-none"
              onClick={onCloseModal}
            />
          </div>
          <h2 className="text-[20px] text-center text-black font-medium mt-2">Are your sure {userInfo?.seekingStatus !== 'OPEN' ? (
            <span className="text-[#0ab305]"> TURN ON</span>
          ) : (
            <span className="text-[#ff9119]">TURN OFF</span>
          )} your job seeking status?
          </h2>
          <div className="flex items-center gap-4 justify-end mt-4">
            <Button
              textBtn="Cancel"
              onClick={onCloseModal}
              classBtn="w-auto text-[#6f7287] outline-[none] border-[#e7e7e9] border-solid border-[2px] focus:outline-none bg-white font-bold h-[44px] rounded-md py-2 px-4"
            />
            <Button
              textBtn="Confirm"
              onClick={handleChangeStatus}
              classBtn="w-auto text-black outline-[none] border-none focus:outline-none bg-[#2b6fdf] text-white font-bold h-[44px] rounded-md py-2 px-4"
            />
          </div>
        </div>
      </Modal>
      <div id="container" className="bg-[#dbe0e1]"
      >
        <section className='bg-white header px-4 pt-20 items-center flex h-auto md:min-h-[800px]'>
          <div className="container mx-auto">
            <div className="px[0] pb-[0] md:px-4 md:pd-8 lg:px-4">
              {isEdited ? (
                <div className="py-[8px] px-[8px] md:py-10 md:px-12 rounded-[20px] shadow-lg my-4 border-[1px] border-solid border-[#e7e7e9]">
                  <div className="flex items-center gap-4 md:gap-8 lg:gap-12 flex-wrap w-full">
                    <div className="flex flex-col justify-center items-center gap-1 md:w-auto w-[100%]">
                      <Image
                        src={userInfoCreate?.avatar || ''}
                        alt='profile'
                        placeholder='blur'
                        blurDataURL={'@/public/img/placeholder.png'}
                        className='align-middle border-none max-w-full w-[160px] rounded-[50%] object-cover max-h-[x] h-[160px]'
                        width={0}
                        height={0}
                        sizes="100vw"
                      />
                      <div className="flex items-center gap-8">
                        <input ref={refInputFile} type="file" accept="image/*" onChange={handleOnchangeAvatar} className="hidden"/>
                        <Button
                          classBtn="h-[30px] w-auto text-[#414042] focus:outline-none"
                          iconBtn='fas fa-camera text-[24px] text-[#3659e3]'
                          textBtn="Edit"
                          onClick={handleClickBtnFile}
                        />
                        {userInfoCreate?.avatar && (
                          <Button
                            classBtn="h-[30px] w-auto text-[#414042] focus:outline-none"
                            iconBtn='fas fa-trash-alt text-[16px] text-[#ed1b2f]'
                            textBtn="Delete"
                            onClick={handleDeleteAvatar}
                          />
                        )}
                      </div>
                    </div>
                    <div className='flex-1'>
                      <div>
                        <div className='overflow-auto px-4 lg:px-10'>
                          <div className="flex items-center gap-4 flex-col lg:flex-row">
                            <div className='w-full mb-6'>
                              <label
                                className='block uppercase text-[#000] text-xs font-bold mb-2'
                                htmlFor='fullname'
                              >
                                Full name
                              </label>
                              <Input
                                name='fullname'
                                id='fullname'
                                type='text'
                                className='border-1 px-3 py-3 placeholder-blueGray-300 text-[#000] bg-white rounded text-sm shadow outline-none focus:outline-none w-full ease-linear transition-all duration-150'
                                placeholder='Enter your full name'
                                styleInput={{
                                  borderColor: '#e4e4e7'
                                }}
                                value={userInfoCreate?.fullname}
                                onChange={handleOnchangeInput}
                              // errorText={memoValidate ? memoValidate.email : ''}
                              />
                            </div>
                          </div>
                          <div className='w-full mb-6'>
                            <label
                              className='block uppercase text-[#000] text-xs font-bold mb-2'
                              htmlFor='jobTitle'
                            >
                              Job Title
                            </label>
                            <Input
                              name='jobTitle'
                              type='text'
                              id="jobTitle"
                              className='border-1 px-3 py-3 placeholder-blueGray-300 text-[#000] bg-white rounded text-sm shadow focus:shadow outline-none focus:outline-none w-full ease-linear transition-all duration-150'
                              placeholder='Enter your job title'
                              styleInput={{
                                borderColor: '#e4e4e7'
                              }}
                              value={userInfoCreate?.jobTitle}
                              onChange={handleOnchangeInput}
                              // errorText={memoValidate ? memoValidate.phoneNumber : ''}
                            />
                          </div>
                          <div className="flex items-center gap-4 flex-col lg:flex-row">
                            <div className='relative w-full mb-6'>
                              <label
                                className='block uppercase text-[#000] text-xs font-bold mb-2'
                                htmlFor='phoneNumber'
                              >
                                Phone number
                              </label>
                              <PhoneInput
                                country={'vn'}
                                containerStyle={{
                                  height: '46px',
                                  width: '100%',
                                  display: 'flex'
                                }}
                                onlyCountries={['vn','us', 'jp']}
                                inputStyle={{
                                  flex: 1,
                                  height: '46px'
                                }}
                                value={userInfoCreate?.phoneNumber}
                                onChange={(phone) => handleOnchangeInput('phoneNumber', phone)}
                              />
                            </div>
                            <div className='w-full mb-6'>
                              <label
                                className='block uppercase text-[#000] text-xs font-bold mb-2'
                                htmlFor='email'
                              >
                               Email
                              </label>
                              <Input
                                name='email'
                                type='email'
                                id="email"
                                className='border-1 px-3 py-3 placeholder-blueGray-300 text-[#000] bg-white rounded text-sm shadow focus:shadow outline-none focus:outline-none w-full ease-linear transition-all duration-150'
                                placeholder='Enter your email'
                                styleInput={{
                                  borderColor: '#e4e4e7'
                                }}
                                value={userInfoCreate?.email}
                                onChange={handleOnchangeInput}
                              // errorText={memoValidate ? memoValidate.phoneNumber : ''}
                              />
                            </div>
                          </div>
                          <div className="flex flex-col lg:flex-row items-center gap-4">
                            <div className='w-full mb-6'>
                              <label
                                className='block uppercase text-[#000] text-xs font-bold mb-2'
                              >
                                Social title
                              </label>
                              <Dropdown
                                options={[
                                  {label: 'Mr', value: 'Mr'},
                                  {label: 'Mrs', value: 'Ms'},
                                  {label: 'Mdm', value: 'Mdm'},
                                  {label: 'Dr', value: 'Dr'},

                                ]}
                                mode="light"
                                label="Select your social title"
                                value={userInfoCreate?.socialTitle}
                                onChange={handleSocialTitle}
                              />
                            </div>
                            <div className='w-full mb-6'>
                              <label
                                className='block uppercase text-[#000] text-xs font-bold mb-2'
                                htmlFor='birthday'
                              >
                               Birthday
                              </label>
                              <InputDate 
                                onChangeDate={handleChangeBirthday} 
                                dateSeleted={userInfoCreate?.dateOfBirth ? new Date(userInfoCreate?.dateOfBirth) : null}
                              />
                            </div>
                          </div>
                          <div className='w-full mb-6'>
                            <label
                              className='block uppercase text-[#000] text-xs font-bold mb-2'
                              htmlFor='address'
                            >
                              Address
                            </label>
                            <Input
                              name='address'
                              type='text'
                              id="address"
                              className='border-1 px-3 py-3 placeholder-blueGray-300 text-[#000] bg-white rounded text-sm shadow focus:shadow outline-none focus:outline-none w-full ease-linear transition-all duration-150'
                              placeholder='Enter your address'
                              styleInput={{
                                borderColor: '#e4e4e7'
                              }}
                              value={userInfoCreate?.address}
                              onChange={handleOnchangeInput}
                              // errorText={memoValidate ? memoValidate.phoneNumber : ''}
                            />
                          </div>
                          
                        </div>
                      </div>
                      {/* <div className="flex justify-center w-full">
                        <div className="flex gap-2 flex-col items-center">
                          <input ref={refInputResume} type="file" accept=".pdf,.doc,.docx" onChange={handleOnchangeResume} className="hidden"/>
                          <Button
                            classBtn="h-[40px] w-[250px] text-white bg-[#3659e3] font-bold focus:outline-none border-[1px] border-solid border-[#e7e7e9] py-2 px-3 rounded-md"
                            iconBtn='fas fa-upload text-[16px] text-white'
                            textBtn="Upload resume"
                            onClick={handleClickBtnFileResume}
                          />
                          {resume && (
                            <div className="text-[#d1410c] text-[14px] font-bold">
                              <span>{resume.name}</span>{' '}
                              <span onClick={handleRemoveResume}><i className="fas fa-times cursor-pointer text-black text-[18px]"></i></span>
                            </div>
                          )}
                        </div>
                      </div> */}
                    </div>
                  </div>
                  <div className="h-[1px] bg-[#e7e7e9] w-full my-6"></div>
                  <div className="flex gap-2 justify-end">
                    <Button
                      classBtn="h-[40px] w-auto text-black focus:outline-none font-medium hover:bg-[#f7f7f7] rounded-md py-2 px-6"
                      textBtn='Discard'
                      onClick={() => setIsEdited(!isEdited)}
                    />
                    <Button
                      classBtn="h-[40px] w-auto text-white font-bold focus:outline-none bg-[#3659e3] rounded-md py-2 px-6"
                      textBtn='Save'
                      onClick={handleUpdateUser}
                    />
                  </div>
                </div>
              ) : (
                <div className="py-10 px-12 rounded-[20px] shadow-lg my-4 border-[1px] border-solid border-[#e7e7e9]">
                  <div className="flex items-center gap-4 md:gap-8 lg:gap-12 flex-wrap w-full">
                    <Image
                      src={userInfo?.avatar || ""}
                      alt='profile'
                      placeholder='blur'
                      blurDataURL={'@/public/img/placeholder.png'}
                      className='align-middle border-none max-w-full w-[160px] rounded-[50%] object-cover max-h-[x] h-[160px]'
                      width={0}
                      height={0}
                      sizes="100vw"
                    />
                    <div className='flex-1'>
                      <div className='flex items-center justify-between'>
                        <h3 className="text-[32px] text-black font-bold">{userInfo?.fullname}</h3>
                        <Button
                          classBtn="h-[30px] w-auto text-[#2b6fdf] focus:outline-none"
                          iconBtn='far fa-edit text-[24px]'
                          onClick={() => setIsEdited(!isEdited)}
                        />
                      </div>
                      <h5 className="text-[16px] text-black font-bold mb-2">{userInfo?.jobTitle}</h5>
                      <div className='grid lg:grid-cols-3 gap-1 md:gap-1 lg:gap-0'>
                        <p className="text-[16px] text-black flex items-center gap-1 mt-[4px] lg:mt-2">
                          <span><i className="far fa-envelope text-black text-[16px]"></i></span>
                          <span>{'  '}{userInfo?.email}</span>
                        </p>
                        <p className="text-[16px] text-black flex items-center gap-1 mt-[4px] lg:mt-2">
                          <span><i className="fas fa-birthday-cake text-black text-[16px]"></i></span>
                          <span>{'  '}{userInfo?.dateOfBirth ? convertIosToDatetime(userInfo?.dateOfBirth) : ''}</span>
                        </p>
                        <p className="text-[16px] text-black flex items-center gap-1 mt-[4px] lg:mt-2">
                          <span><i className="fas fa-user text-black text-[16px]"></i></span>
                          <span>{'  '}{userInfo?.socialTitle}</span>
                        </p>
                        <p className="text-[16px] text-black flex items-center gap-1 mt-[4px] lg:mt-2">
                          <span><i className="fas fa-map-marker-alt text-black text-[16px]"></i></span>
                          <span>{'  '}{userInfo?.address}</span>
                        </p>
                        <p className="text-[16px] text-black flex items-center gap-1 mt-[4px] lg:mt-2">
                          <span><i className="fas fa-phone-alt text-black text-[16px]"></i></span>
                          <span>{'  '}{userInfo?.phoneNumber}</span>
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 mt-4">
                        {!!listSkill?.length && (
                          <div className="flex items-center mt-4 gap-2">
                            <h6 className="text-[16px] text-black font-bold">Your skills: </h6>
                            <div className='flex flex-wrap items-center gap-2'>
                              {listSkill?.map((skill: any) => {
                                return (
                                  <span key={skill?.id} className="text-sm text-[#2b6fdf] px-2 py-1 rounded-[20px] border-solid border-[1px] border-[#2b6fdf]">
                                    {skill?.tag?.name}
                                  </span>
                                )
                              })}
                            </div>
                          </div>
                        )}
                        {!!listTitle?.length && (
                          <div className="flex items-center mt-4 gap-2">
                            <h6 className="text-[16px] text-black font-bold">Your titles: </h6>
                            <div className='flex flex-wrap items-center gap-2'>
                              {listTitle?.map((title: any) => {
                                return (
                                  <span key={title?.id} className="text-sm text-[#2b6fdf] px-2 py-1 rounded-[20px] border-solid border-[1px] border-[#2b6fdf]">
                                    {title?.tag?.name}
                                  </span>
                                )
                              })}
                            </div>
                          </div>
                        )}
                        {!!listLocation?.length && (
                          <div className="flex items-center mt-4 gap-2">
                            <h6 className="text-[16px] text-black font-bold">Your location: </h6>
                            <div className='flex flex-wrap items-center gap-2'>
                              {listLocation?.map((location: any) => {
                                const item = locations?.[location?.tag?.name]
                                return (
                                  <span key={location?.id} className="text-sm text-[#2b6fdf] px-2 py-1 rounded-[20px] border-solid border-[1px] border-[#2b6fdf]">
                                    {item}
                                  </span>
                                )
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="h-[1px] bg-[#e7e7e9] w-full my-6"></div>
                  {userInfo?.userType === 'TALENT' && (
                    <div>
                      {userInfo?.seekingStatus === 'OPEN' ? (
                        <span className="text-[20px] text-[#0ab305] font-bold"><i className="fas fa-unlock"></i></span>
                      ) : (
                        <span className="text-[20px] text-[#ff9119] font-bold"><i className="fas fa-lock"></i></span>
                      )}
                      {' '}Your job seeking status:{' '}
                      {userInfo?.seekingStatus === 'OPEN'  ? (
                        <span className="text-[16px] text-[#0ab305] font-bold">ON</span>
                      ) : (
                        <span className="text-[16px] text-[#ff9119] font-bold">OFF</span>
                      )}
                      <Button
                        classBtn="text-[#2b6fdf] focus:outline-none ml-4 font-medium"
                        textBtn={userInfo?.seekingStatus === 'OPEN' ? 'Turn off' : 'Turn on'}
                        onClick={toggleStatusSeeking}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
        <Footer hiddenDecord />
      </div>
    </>
  );
}


export default Index