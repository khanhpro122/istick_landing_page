// Libraries
import { NextPage } from 'next';
import React, { useEffect, useMemo, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

// Services
import * as ServiceAuth from '@/services/auth';
import * as ServiceSystem from '@/services/system'

// Components
import { Button } from '../Buttons/Button';
import Chips from '../Chips';
import { SKILLS, TITLES } from '../contants';
import { Loading } from '../Loading/Loading';
import { convertToUserTag } from '@/utils';
import Swal from 'sweetalert2';
import { useAuth } from '@/hooks/useAuth';

type TProps = {
  isLoading?: boolean,
  closeModal?: () => void,
  afterOpenModal?: () => void,
  isOpen: boolean,
}

export const ModalAuth: NextPage<TProps> = ({ closeModal, isOpen }) => {
  const [activeTab, setActiveTab] = useState(0)
  const [offices, setOffices] = useState<string[] | []>([])
  const [skills, setSkills] = useState<string[] | []>([])
  const [titles, setTitles] = useState<string[] | []>([])
  const [roleSelected, setRoleSelected] = useState('')
  const [packageSelected, setPackageSelected] = useState('')
  const queryClient = useQueryClient();
  const [listLocation, setListLocation] = useState([])
  const [saveResAuthGoogle, setSaveResAuthGoogle] = useState("")

  const {loading, login, user } = useAuth()
  
  const fetchListLocation = async () => {
    const res = await ServiceSystem.getListCities(1);
    setListLocation(
      res?.data?.list?.map((item: any) => ({
        label: item?.name,
        value: String(item?.id),
      }))
    );
  }

  useEffect(() => {
    if(user) {
      if(user?.userType && closeModal) {
        closeModal()
        handleReset()
      }else {
        handleNext()
      }
    }
  }, [user])

  useEffect(() => {
    fetchListLocation()
  }, [])

  const memoDisabledBtnNext = useMemo(() => {
    switch(activeTab) {
    case 1:
      return !roleSelected;
    case 2:
      return !titles.length;
    case 3:
      return !offices.length;
    case 4:
      return !skills.length;
    case 5:
      return false;
    default: 
      return true
    }
  }, [activeTab, roleSelected, titles, offices, skills, packageSelected])

  const fetchUpdateInfoUser = async (data: any) => {
    const response = await ServiceAuth.updateUserInfo(String(user?.id) || '', data)
    return response.data;
  }

  const mutationUpdateUser = useMutation(['updateUser'], fetchUpdateInfoUser);
  
  const handleReset = () => {
    setActiveTab(0)
    setRoleSelected('')
    setPackageSelected('')
  }

  const handleCredentialResponse = (response: any) => {
    setSaveResAuthGoogle(response)
    login({idToken: response.credential, userType: roleSelected})
  };

  const initializeGoogleOneTap = () => {
    (window as any).google.accounts?.id.initialize({
      client_id: '966559219908-vi9l0gblcq45ojq0f83c6rnhs122n3r1.apps.googleusercontent.com',
      callback: handleCredentialResponse,
    });

    (window as any).google.accounts.id.renderButton(
      document.getElementById('btnLoginGoogle')!,
      { theme: 'outline', size: 'large',locale: "en" }
    );

    (window as any).google.accounts.id.prompt();
  };

  useEffect(() => {
    if(activeTab === 0 && isOpen) {
      initializeGoogleOneTap()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, isOpen])


  const handleRole = (role: string) => {
    setRoleSelected(role)
    // handleNext()
  }

  const handleOnchangeTitles = (values: string[]) => {
    setTitles(values)
  }

  const handleOnchangeSkills= (values: string[]) => {
    setSkills(values)
  }

  const handleOnchangeOffices = (values: string[]) => {
    setOffices(values)
  }
  const handleSkip = () => {
    if(((activeTab === 4 && roleSelected === 'TALENT') || activeTab === 5) && closeModal) {
      closeModal()
      handleReset()
    }else if(roleSelected === 'RECRUITER' && activeTab === 1){
      setActiveTab(5)
    }else {
      setActiveTab(prev => prev + 1)
    }
  }
  const handleNext = (isDone = false) => {
    if(isDone) {
      mutationUpdateUser.mutate(
        {...user,
          userTags: convertToUserTag(titles, offices, skills),
          userType: roleSelected
        }, {
          onSuccess: () => {
            if(roleSelected) {
              handleCredentialResponse(saveResAuthGoogle)
            }
            toast.success('Update user info is successed!', {
              position: toast.POSITION.BOTTOM_LEFT,
            });
            Swal.fire({
              title: 'Congraturation!',
              text: 'Your matching is successed. Thanks!',
              timer: 1000,
              icon: 'success',
              timerProgressBar: true,
            })
            queryClient.invalidateQueries(['user'])
          },
          onError:() => {
            Swal.fire({
              title: 'Opps!',
              text: 'Your matching is failed!',
              timer: 1000,
              icon: 'error',
              timerProgressBar: true,
            })
          },
          onSettled: () => {
            if(closeModal) {
              closeModal();
              handleReset()
            }
          }
        })

    }else {
      if((activeTab === 5 || (activeTab === 4 && roleSelected === 'TALENT')) && closeModal) {
        closeModal()
        handleReset()
      }else if(roleSelected === 'RECRUITER' && activeTab === 1) {
        setActiveTab(5)
      } else {
        setActiveTab(prev => prev + 1)
      }
    }
  }

  const handlePreviousTab = () => {
    if(roleSelected === 'RECRUITER' && activeTab === 5) {
      setActiveTab(1)
    }else if(roleSelected === 'TALENT' && activeTab === 5) {
      setActiveTab(3)
    }else {
      setActiveTab(prev => prev - 1)
    }
  }

  const handleDetailsPackage = () => {
    window.open('/packages')
  }
  return (
    <>
      {isOpen  && (
        <div className="modal fixed inset-0 flex items-center justify-center z-[100]">
          <div className="modal-overlay absolute inset-0 opacity-50"
            style={{
              background: 'rgba(81, 94, 123, 0.5)'
            }}
          ></div>
          <div className='container mx-auto px-4 h-full animate-slide-dow'>
            <Loading isLoading={loading}></Loading>
            <div className='flex content-center items-center justify-center h-full'>
              <div className='w-[100%] md:min-w[400px] md:max-w-[600px] lg:min-w-[500px] lg:max-w-[700px]'>
                <div 
                  className='relative overflow-auto flex flex-col break-words w-auto shadow-lg rounded-lg bg-blueGray-200 border-0 p-8' 
                >
                  <div className='flex items-center justify-between mb-4'>
                    <h6 className='text-[#000] text-lg font-bold'>
                      {activeTab === 1 && 'Are you employer?'}
                      {activeTab === 2 && 'You need the job title!'}
                      {activeTab === 3 && 'What is your office?'}
                      {activeTab === 4 && 'How is your skill?'}
                      {activeTab === 5 && 'Select the packages'}
                      {activeTab === 0 && 'Sign in'}
                    </h6>
                    <Button
                      onClick={() => {
                        if(closeModal) {
                          closeModal()
                          handleReset()
                        }
                      }}
                      iconBtn="fas fa-times text-[18px]"
                      classBtn="h-[32px] w-[32px] text-black outline-[none] border-none focus:outline-none"
                    />
                  </div>
                  <div className={(activeTab === 0 ? 'flex flex-col items-center' : 'hidden')}>
                    <div id="btnLoginGoogle"></div>
                  </div>
                  <div className={(activeTab === 1 ? 'flex flex-col gap-4 items-center' : 'hidden')}>
                    <Button 
                      classBtn="mr-4 text-left flex flex-row-reverse gap-2 items-center h-auto bg-white py-2 px-12 rounded-md font-medium 
                      outline-[none] border-none focus:outline-none focus:border-none text-black hover:shadow-md ease-linear transition-all duration-150"
                      textBtn='Employer'
                      iconBtn={roleSelected === 'RECRUITER' ? 'fas fa-check text-[16px] text-[#03C03C]' : 'fas fa-plus text-[16px] text-[#6f7287]'}
                      onClick={() => handleRole('RECRUITER')}
                    />
                    <Button 
                      classBtn="mr-4 text-left flex flex-row-reverse gap-2 items-center h-auto bg-white py-2 px-12 rounded-md font-medium 
                      outline-[none] border-none focus:outline-none focus:border-none  text-black hover:shadow-md ease-linear transition-all duration-150"
                      textBtn='Candicate'
                      iconBtn={roleSelected === 'TALENT' ? 'fas fa-check text-[16px] text-[#03C03C]' : 'fas fa-plus text-[16px] text-[#6f7287]'}
                      onClick={() => handleRole('TALENT')}
                    />
                  </div>
                  <div className={(activeTab === 2 ? 'block' : 'hidden')}>
                    <Chips options={TITLES} optionsSelected={titles} onChange={handleOnchangeTitles}/>
                  </div>
                  <div className={(activeTab === 3 ? 'block' : 'hidden')}>
                    <Chips options={listLocation} isNoAddMore optionsSelected={offices} onChange={handleOnchangeOffices}/>
                  </div>
                  <div className={(activeTab === 4 ? 'block' : 'hidden')}>
                    <Chips options={SKILLS} optionsSelected={skills} onChange={handleOnchangeSkills}/>
                  </div>
                  <div className={(activeTab === 5 ? 'flex flex-col gap-8 max-h-[50vh] overflow-auto' : 'hidden')}>
                    <div 
                      className='w-full py-2 px-4 border-[2px] cursor-pointer border-solid  rounded-md shadow-md bg-[#eceff4] border-[#2b6fdf]'
                    >
                      <div className="w-full flex flex-col items-center">
                        <div className="flex flex-col items-center md:flex-row w-full md:justify-between">
                          <h2 className="text-black hover:opacity-[0.8] text-[20px] font-bold mb-[4px] text-center">Free package</h2>
                          <h3 className="text-[#2b6fdf] hover:opacity-[0.8] text-[18px] font-bold mb-[4px] text-center">Free</h3>
                        </div>
                        <div className="flex items-center w-full flex-col md:flex-row md:justify-between mt-2">
                          <div className="text-[16px] text-black mb-2">
                            <span>Number of jobs:</span>
                            <span className="text-[#2b6fdf] font-bold">{' '}3 jobs/month</span>
                          </div>
                          <div className="text-[16px] text-black mb-2">
                            <span>Number of applications:</span>
                            <span className="text-[#2b6fdf] font-bold">{' '}3 cv/job</span>
                          </div>
                        </div>
                        <div className="flex flex-col md:flex-row w-full md:justify-center">
                          <Button 
                            classBtn="w-[100%] lg:w-auto md:w-auto md:min-w-[180px] md:max-w-[200px] mt-4 mr-4 h-[40px] hover:bg-[#f8f7f4] 
                            rounded-[20px] px-3 font-medium outline-[none] border-none focus:outline-none text-black"
                            textBtn='View details'
                            onClick={handleDetailsPackage}
                          />
                          <Button 
                            classBtn="w-[100%] flex flex-row-reverse items-center justify-center lg:w-auto md:w-auto md:min-w-[180px] md:max-w-[200px] mt-4 mr-4 h-[40px] bg-[#2b6fdf] 
                            rounded-[20px] px-3 font-medium outline-[none] border-none focus:outline-none text-white gap-2"
                            textBtn='Selected'
                            iconBtn="fas fa-check text-[18px] text-[#03C03C]"
                            // onClick={() => handleSelectPackage('basic')}
                          />
                        </div>
                      </div>
                    </div>
                    <div 
                      className='w-full py-2 px-4 border-[2px] cursor-pointer border-solid rounded-md shadow-md bg-[#eceff4] border-[#e7e7e9]'
                    >
                      <div className="w-full flex flex-col items-center">
                        <div className="flex flex-col items-center md:flex-row w-full md:justify-between">
                          <h2 className="text-black hover:opacity-[0.8] text-[20px] font-bold mb-[4px] text-center">Basic package</h2>
                          <h3 className="text-[#2b6fdf] hover:opacity-[0.8] text-[18px] font-bold mb-[4px] text-center">500.000 VND/job</h3>
                        </div>
                        <div className="flex items-center w-full flex-col md:flex-row md:justify-between mt-2">
                          <div className="text-[16px] text-black mb-2">
                            <span>Number of jobs:</span>
                            <span className="text-[#2b6fdf] font-bold">{' '}Unlimited</span>
                          </div>
                          <div className="text-[16px] text-black mb-2">
                            <span>Number of applications:</span>
                            <span className="text-[#2b6fdf] font-bold">{' '}Unlimited</span>
                          </div>
                        </div>
                        <div className="flex flex-col md:flex-row w-full md:justify-center">
                          <Button 
                            classBtn="w-[100%] lg:w-auto md:w-auto md:min-w-[180px] md:max-w-[200px] mt-4 mr-4 h-[40px] hover:bg-[#f8f7f4] 
                            rounded-[20px] px-3 font-medium outline-[none] border-none focus:outline-none text-black"
                            textBtn='View details'
                            onClick={handleDetailsPackage}
                          />
                          <Button 
                            classBtn="w-[100%] lg:w-auto md:w-auto md:min-w-[180px] md:max-w-[200px] mt-4 mr-4 h-[40px] bg-[#2b6fdf]
                            rounded-[20px] px-3 font-medium outline-[none] border-none focus:outline-none text-white"
                            textBtn='Select'
                            disabled
                            // onClick={() => handleSelectPackage('medium')}
                          />
                        </div>
                      </div>
                    </div>
                    <div 
                      className='w-full py-2 px-4 border-[2px] cursor-pointer border-solid rounded-md shadow-md bg-[#eceff4] border-[#e7e7e9]'
                    >
                      <div className="w-full flex flex-col items-center">
                        <div className="flex flex-col items-center md:flex-row w-full md:justify-between">
                          <h2 className="text-black hover:opacity-[0.8] text-[20px] font-bold mb-[4px] text-center">Advanced package</h2>
                          <h3 className="text-[#2b6fdf] hover:opacity-[0.8] text-[18px] font-bold mb-[4px] text-center">1.000.000 VND/job</h3>
                        </div>
                        <div className="flex items-center w-full flex-col md:flex-row md:justify-between mt-2">
                          <div className="text-[16px] text-black mb-2">
                            <span>Number of jobs:</span>
                            <span className="text-[#2b6fdf] font-bold">{' '}Unlimited</span>
                          </div>
                          <div className="text-[16px] text-black mb-2">
                            <span>Number of applications:</span>
                            <span className="text-[#2b6fdf] font-bold">{' '}Unlimited</span>
                          </div>
                        </div>
                        <div className="flex flex-col md:flex-row w-full md:justify-center">
                          <Button 
                            classBtn="w-[100%] lg:w-auto md:w-auto md:min-w-[180px] md:max-w-[200px] mt-4 mr-4 h-[40px] hover:bg-[#f8f7f4] 
                            rounded-[20px] px-3 font-medium outline-[none] border-none focus:outline-none text-black"
                            textBtn='View details'
                            onClick={handleDetailsPackage}
                          />
                          <Button 
                            classBtn="w-[100%] lg:w-auto md:w-auto md:min-w-[180px] md:max-w-[200px] mt-4 mr-4 h-[40px] bg-[#2b6fdf]
                            rounded-[20px] px-3 font-medium outline-[none] border-none focus:outline-none text-white"
                            textBtn='Select'
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                    <div 
                      className='w-full py-2 px-4 border-[2px] cursor-pointer border-solid rounded-md shadow-md bg-[#eceff4] border-[#e7e7e9]'
                    >
                      <div className="w-full flex flex-col items-center">
                        <div className="flex flex-col items-center md:flex-row w-full md:justify-between">
                          <h2 className="text-black hover:opacity-[0.8] text-[20px] font-bold mb-[4px] text-center">Premium package</h2>
                          <h3 className="text-[#2b6fdf] hover:opacity-[0.8] text-[18px] font-bold mb-[4px] text-center">2.000.000 VND/job</h3>
                        </div>
                        <div className="flex items-center w-full flex-col md:flex-row md:justify-between mt-2">
                          <div className="text-[16px] text-black mb-2">
                            <span>Number of jobs:</span>
                            <span className="text-[#2b6fdf] font-bold">{' '}Unlimited</span>
                          </div>
                          <div className="text-[16px] text-black mb-2">
                            <span>Number of applications:</span>
                            <span className="text-[#2b6fdf] font-bold">{' '}Unlimited</span>
                          </div>
                        </div>
                        <div className="flex flex-col md:flex-row w-full md:justify-center">
                          <Button 
                            classBtn="w-[100%] lg:w-auto md:w-auto md:min-w-[180px] md:max-w-[200px] mt-4 mr-4 h-[40px] hover:bg-[#f8f7f4] 
                            rounded-[20px] px-3 font-medium outline-[none] border-none focus:outline-none text-black"
                            textBtn='View details'
                            onClick={handleDetailsPackage}
                          />
                          <Button 
                            classBtn="w-[100%] lg:w-auto md:w-auto md:min-w-[180px] md:max-w-[200px] mt-4 mr-4 h-[40px] bg-[#2b6fdf]
                            rounded-[20px] px-3 font-medium outline-[none] border-none focus:outline-none text-white"
                            textBtn='Select'
                            disabled
                            // onClick={() => handleSelectPackage('medium')}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row items-center justify-between mt-4">
                    {
                      (activeTab !== 0 && activeTab !== 1) ? (
                        <Button 
                          classBtn="w-[100%] mb-[16px] md:mb-0 md:w-auto h-auto bg-[#f3f3f4] py-2 px-4 rounded-md font-bold outline-[none] border-none focus:outline-none text-black"
                          textBtn='Previous'
                          iconBtn="fas fa-chevron-left text-[14px]"
                          onClick={handlePreviousTab}
                        />
                      ) : (
                        <span></span>
                      )
                    }
                    {activeTab !== 0 && (
                      <div className="flex flex-col w-[100%] md:w-auto md:flex-row items-center">
                        <Button 
                          classBtn="w-[100%] mb-[16px] md:mb-0 md:w-auto md:mr-4 h-auto bg-[#f3f3f4] py-2 px-4 rounded-md font-medium outline-[none] border-none focus:outline-none text-black"
                          textBtn='Skip now'
                          onClick={handleSkip}
                        />
                        <Button 
                          classBtn="w-[100%] md:w-auto justify-center items-center h-auto flex bg-[#2b6fdf] py-2 px-4 rounded-md font-medium outline-[none] border-none focus:outline-none 
                          items-center gap-2 flex-row-reverse text-white"
                          textBtn={
                            ((activeTab === 5 && roleSelected === 'RECRUITER') || (activeTab === 4 && roleSelected === 'TALENT')) 
                              ? 'Done' : 'Next to'
                          }
                          iconBtn="fas fa-chevron-right text-[14px]"
                          onClick={() => handleNext((activeTab === 5 && roleSelected === 'RECRUITER') || (activeTab === 4 && roleSelected === 'TALENT'))}
                          styleBtn={{
                            backgroundColor: memoDisabledBtnNext ? '#f3f3f4' : '#3659e3',
                            color: memoDisabledBtnNext ? '#3d3d4e': '#fff',
                            cursor: memoDisabledBtnNext ? 'not-allowed' : 'pointer',
                          }}
                          disabled={memoDisabledBtnNext}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
