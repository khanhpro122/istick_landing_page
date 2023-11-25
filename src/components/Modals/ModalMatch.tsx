// Libraries
import { NextPage } from 'next';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { useCookies } from 'react-cookie';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

// Services
import * as ServiceAuth from '@/services/auth';

// Components
import { Button } from '../Buttons/Button';
import Chips from '../Chips';
import { SKILLS, TITLES } from '../contants';
import { Loading } from '../Loading/Loading';
import { convertToUserTagLocal } from '@/utils';
import Swal from 'sweetalert2';
import * as ServiceSystem from "@/services/system"

type TProps = {
  isLoading?: boolean,
  closeModal?: () => void,
  afterOpenModal?: () => void,
  isOpen: boolean,
  handleMatching: (data: any) => void,
}

export const ModalMatch: NextPage<TProps> = ({ closeModal, isOpen, handleMatching }) => {
  const [activeTab, setActiveTab] = useState(0)
  const [offices, setOffices] = useState<string[] | []>([])
  const [skills, setSkills] = useState<string[] | []>([])
  const [titles, setTitles] = useState<string[] | []>([])
  const [listLocation, setListLocation] = useState([])

  const memoDisabledBtnNext = useMemo(() => {
    switch(activeTab) {
    case 0:
      return !titles.length;
    case 1:
      return !offices.length;
    case 2:
      return !skills.length;
    default: 
      return true
    }
  }, [activeTab, titles, offices, skills])

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
    fetchListLocation()
  }, [])

  // const fetchUpdateInfoUser = async (data: any) => {
  //   const response = await ServiceAuth.updateUserInfo(String(user?.id) || '', data)
  //   return response.data;
  // }

  // const mutationUpdateUser = useMutation(['updateUser'], fetchUpdateInfoUser);



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
    setActiveTab(prev => prev + 1)
    handleMatching({})
  }

  const handleNext = (isDone = false) => {
    if(isDone) {
      localStorage.setItem('matching', JSON.stringify(convertToUserTagLocal(titles, offices, skills)))
      handleMatching(convertToUserTagLocal(titles, offices, skills))
      closeModal && closeModal()
      if(offices.length || titles.length || skills?.length) {
        Swal.fire({
          title: 'Congraturation!',
          text: 'Auto matching job is actived!',
          timer: 1000,
          icon: 'success',
          timerProgressBar: true,
        })
      }
    }else {
      setActiveTab(prev => prev + 1)
    }
  }

  const handlePreviousTab = () => {
    setActiveTab(prev => prev - 1)
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
            <Loading isLoading={false}></Loading>
            <div className='flex content-center items-center justify-center h-full'>
              <div className='w-[100%] md:min-w[400px] md:max-w-[600px] lg:min-w-[500px] lg:max-w-[700px]'>
                <div 
                  className='relative overflow-auto flex flex-col break-words w-auto shadow-lg rounded-lg bg-blueGray-200 border-0 p-8' 
                >
                  <div className='flex items-center justify-between mb-4'>
                    <h6 className='text-[#000] text-lg font-bold'>
                      {activeTab === 0 && 'You need the job title!'}
                      {activeTab === 1 && 'What is your office?'}
                      {activeTab === 2 && 'How is your skill?'}
                    </h6>
                    <Button
                      onClick={closeModal}
                      iconBtn="fas fa-times text-[18px]"
                      classBtn="h-[32px] w-[32px] text-black outline-[none] border-none focus:outline-none"
                    />
                  </div>
                  <div className={(activeTab === 0 ? 'block' : 'hidden')}>
                    <Chips options={TITLES} optionsSelected={titles} onChange={handleOnchangeTitles}/>
                  </div>
                  <div className={(activeTab === 1 ? 'block' : 'hidden')}>
                    <Chips options={listLocation} isNoAddMore isValue optionsSelected={offices} onChange={handleOnchangeOffices}/>
                  </div>
                  <div className={(activeTab === 2 ? 'block' : 'hidden')}>
                    <Chips options={SKILLS} optionsSelected={skills} onChange={handleOnchangeSkills}/>
                  </div>
                  <div className="flex flex-col md:flex-row items-center justify-between mt-4">
                    {
                      activeTab !== 0? (
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
                    <div className="flex flex-col w-[100%] md:w-auto md:flex-row items-center">
                      <Button 
                        classBtn="w-[100%] mb-[16px] md:mb-0 md:w-auto md:mr-4 h-auto bg-[#f3f3f4] py-2 px-4 rounded-md font-medium outline-[none] border-none focus:outline-none text-black"
                        textBtn='Skip now'
                        onClick={handleSkip}
                      />
                      <Button 
                        classBtn="w-[100%] md:w-auto justify-center items-center h-auto flex bg-[#2b6fdf] py-2 px-4 rounded-md font-medium outline-[none] border-none focus:outline-none 
                        items-center gap-2 flex-row-reverse text-white"
                        textBtn={activeTab === 2 ? 'Done' : 'Next to'}
                        iconBtn="fas fa-chevron-right text-[14px]"
                        onClick={() => handleNext(activeTab === 2)}
                        styleBtn={{
                          backgroundColor: memoDisabledBtnNext ? '#f3f3f4' : '#3659e3',
                          color: memoDisabledBtnNext ? '#3d3d4e': '#fff',
                          cursor: memoDisabledBtnNext ? 'not-allowed' : 'pointer',
                        }}
                        disabled={memoDisabledBtnNext}
                      />
                    </div>
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
