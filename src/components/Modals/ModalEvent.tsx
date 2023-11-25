// Libraries
import { NextPage } from 'next';
import React, { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useMutation } from '@tanstack/react-query';
import 'react-phone-input-2/lib/style.css'
import { MutipleInput } from '../Inputs/MultipleInput';
import PhoneInput from 'react-phone-input-2';

// Services
import * as ServiceEvent from '@/services/event';

// Components
import { Input } from '@/components/Inputs/Input';
import { Loading } from '@/components/Loading/Loading';
import { Button } from '../Buttons/Button';

// Utils
import { processPhoneNumber, validateForms, validateFormsEventRegister } from '@/utils';
import { TQuestion } from '@/pages/events/[eventId]';
import Swal from 'sweetalert2';



type TProps = {
    isLoading?: boolean,
    closeModal?: () => void,
    afterOpenModal?: () => void,
    isOpen: boolean,
    eventQuestions?: TQuestion[],
    answers?: any[]
    setAnswers?: React.Dispatch<React.SetStateAction<any[]>>,
    eventId: number,
}

type TDataEvent = {
  userInfo?: {
    email: string,
    company: string,
    firstName: string,
    lastName: string,
    jobTitle: string,
    phoneNumber: string,
  }
  eventId?:number,
  source: string,
}

type ResponseData = {
  
}

export const ModalEvent: NextPage<TProps> = ({ closeModal,isOpen, eventQuestions, answers, setAnswers, eventId}) => {


  const [inputState, setInputState] = useState({
    email: '',
    company: '',
    fullname: '',
    jobTitle: '',
    phoneNumber: ''
  })
  const [isPrivacy, setIsPrivacy] = useState(false)
  const [isFocusPhone, setIsFocusPhone] = useState(false);

  const fetchCreateEvent = async (data: TDataEvent):Promise<ResponseData> => {
    const response = await ServiceEvent.registerEvent(data)
    return response.data;
  }

  const mutationCreateEvent = useMutation(['createEvent'], fetchCreateEvent)

  const { isLoading } = mutationCreateEvent


  const memoValidate = useMemo(() => {
    const errors = validateForms(inputState)
    return errors
  },[inputState])

  const otherFormValidate = useMemo(() => {
    const errors = validateFormsEventRegister(answers, eventQuestions)
    return errors
  },[answers, eventQuestions])

  const handleOnchangeInput = (type:string, value:string)=> {
    if(type) {
      setInputState({
        ...inputState,
        [type]: value,
      })
    }
  }

  const onCloseModalAndReset = () => {
    if(closeModal) {
      closeModal()
      setIsFocusPhone(false)
      setInputState({
        email: '',
        company: '',
        fullname: '',
        jobTitle: '',
        phoneNumber: ''
      })
      if(setAnswers) {
        setAnswers({} as any)
      }
    }
  }

  const confirm = () => {
    let data:any = {
      eventId: eventId,
      userInfo: {...inputState, phoneNumber: processPhoneNumber(inputState.phoneNumber)},
      source: 'Others',
      answers: answers ? Object.values(answers) : []
    };
    mutationCreateEvent.mutate(data, {
      onSuccess: () => {
        onCloseModalAndReset()
        Swal.fire({
          title: 'Congraturation!',
          text: 'Sign up event is successed!',
          icon: 'success',
          confirmButtonColor: '#2b6fdf',
        })
      },
      onError:() => {
        Swal.fire({
          title: 'Opps!',
          text: 'Sign up event is failed!',
          icon: 'error',
          confirmButtonColor: '#2b6fdf',
        })
      }
    })
  }


  const errorFormCustom = Object?.values(otherFormValidate)?.some((item) => item)
  const isErrorForm = memoValidate.company || memoValidate.email || memoValidate.phoneNumber 
  || memoValidate.jobTitle || memoValidate.fullname || !isPrivacy || errorFormCustom

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
            <div className='flex content-center items-center justify-center h-full'>
              <div className='w-full lg:w-6/12'>
                <div className='relative  flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0'>
                  <div className='rounded-t mb-0 px-4 lg:px-10  py-6'>
                    <div className='flex items-center justify-between mb-3'>
                      <h6 className='text-[#000] text-lg font-bold'>
                        Reserve a slot
                      </h6>
                      <Button
                        onClick={onCloseModalAndReset}
                        iconBtn="fas fa-times text-[18px]"
                        classBtn="h-[32px] w-[32px] text-black outline-[none] border-none focus:outline-none"
                      />
                    </div>
                    <hr className='mt-6 border-b-1 border-blueGray-300' />
                  </div>
                  <div className='flex-auto pb-6 pt-0'>
                    <form>
                      <div className='overflow-auto px-4 lg:px-10 ' style={{maxHeight: 'calc(80vh - 200px)'}}>
                        <div className='relative w-full mb-3'>
                          <label
                            className='block uppercase text-[#000] text-xs font-bold mb-2'
                            htmlFor='email'
                          >
                           Email <span className='text-[red]'> *</span>
                          </label>
                          <Input
                            name='email'
                            id='email'
                            type='email'
                            className='border-0 px-3 py-3 placeholder-blueGray-300 text-[#000] bg-white rounded text-sm shadow outline-none focus:outline-none w-full ease-linear transition-all duration-150'
                            placeholder='Enter your email'
                            value={inputState.email}
                            onChange={handleOnchangeInput}
                            errorText={memoValidate ? memoValidate.email : ''}
                          />
                        </div>
                        <div className='relative w-full mb-3'>
                          <label
                            className='block uppercase text-[#000] text-xs font-bold mb-2'
                            htmlFor='phoneNumber'
                          >
                           Phone Number <span className='text-[red]'> *</span> 
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
                            onBlur={() => setIsFocusPhone(true)}
                            value={inputState?.phoneNumber}
                            onChange={(phone) => handleOnchangeInput('phoneNumber', phone)}
                          />
                          {isFocusPhone && (
                            <div className="text-[red] text-[12px]">{memoValidate ? memoValidate.phoneNumber : ''}</div>
                          )}
                        </div>
  
                        <div className='relative w-full mb-3'>
                          <label
                            className='block uppercase text-[#000] text-xs font-bold mb-2'
                            htmlFor='fullname'
                          >
                            Full Name <span className='text-[red]'> *</span>
                          </label>
                          <Input
                            type='text'
                            name='fullname'
                            id='fullname'
                            className='border-0 px-3 py-3 placeholder-blueGray-300 text-[#000] bg-white rounded text-sm shadow outline-none focus:outline-none w-full ease-linear transition-all duration-150'
                            placeholder='Enter your full name'
                            value={inputState.fullname}
                            onChange={handleOnchangeInput}
                            errorText={memoValidate ? memoValidate.fullname : ''}
                          />
                        </div>
  
                        <div className='relative w-full mb-3'>
                          <label
                            className='block uppercase text-[#000] text-xs font-bold mb-2'
                            htmlFor='jobTitle'
                          >
                            Job Title <span className='text-[red]'> *</span>
                          </label>
                          <Input
                            type='text'
                            name='jobTitle'
                            id='jobTitle'
                            className='border-0 px-3 py-3 placeholder-blueGray-300 text-[#000] bg-white rounded text-sm shadow outline-none focus:outline-none w-full ease-linear transition-all duration-150'
                            placeholder='Enter your job'
                            value={inputState.jobTitle}
                            onChange={handleOnchangeInput}
                            errorText={memoValidate ? memoValidate.jobTitle : ''}
                          />
                        </div>
                        <div className='relative w-full mb-3'>
                          <label
                            className='block uppercase text-[#000] text-xs font-bold mb-2'
                            htmlFor='company'
                          >
                            Company <span className='text-[red]'> *</span>
                          </label>
                          <Input
                            type='text'
                            name='company'
                            id='company'
                            className='border-0 px-3 py-3 placeholder-blueGray-300 text-[#000] bg-white rounded text-sm shadow outline-none focus:outline-none w-full ease-linear transition-all duration-150'
                            placeholder='Confirm your company'
                            value={inputState.company}
                            onChange={handleOnchangeInput}
                            errorText={memoValidate ? memoValidate.company : ''}
                          />
                        </div>
                        {eventQuestions && eventQuestions?.length > 0 && (
                          <>
                            {eventQuestions?.map((question: TQuestion) => {
                              return (
                                <MutipleInput errorQuestions={otherFormValidate} question={question} key={question?.id} answers={answers} setAnswers={setAnswers} />
                              )
                            })}
                          </>
                        )}
                        <div>
                          <label className='inline-flex items-center cursor-pointer'>
                            <input
                              id='customCheckLogin'
                              type='checkbox'
                              checked={isPrivacy}
                              style={{
                                boxShadow: 'none'
                              }}
                              onChange={(e) => setIsPrivacy(e.target.checked)}
                              className='form-checkbox border-[1px] border-[#c3c6d1] cursor-pointer rounded text-[#3659e3] ml-1 w-5 h-5 ease-linear transition-all duration-150'
                            />
                            <span className='ml-2 text-sm font-semibold text-[#000]'>
                                I agree with the{' '}
                              <a
                                href='#pablo'
                                className='text-lightBlue-500'
                                onClick={(e) => e.preventDefault()}
                              >
                                Privacy Policy
                              </a>
                            </span>
                          </label>
                        </div>
                      </div>
  
                      <div className='text-center mt-6 px-4 lg:px-10'>
                        <Loading isLoading={isLoading}></Loading>
                        <button
                          className='bg-[#3659e3] text-white text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150'
                          style={{
                            backgroundColor: isErrorForm ? '#dddddd' : '#3659e3',
                            color: isErrorForm ? '#f5f5f5' : '#fff'
                          }}
                          type='button'
                          onClick={confirm}
                          disabled={Boolean(isErrorForm)}
                        >
                          Confirm
                        </button>
                      </div>
                    </form>
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
