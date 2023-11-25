// Libraries
import { NextPage } from 'next';
import React, { Fragment, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';

// Components
import { Button } from '../Buttons/Button';
import Modal from '../Modals';

// Services
import * as ServiceCompany from '@/services/company'
import { useMutation, useQueryClient } from '@tanstack/react-query';


type TProps = {
  item: any,
  companyAddresses: any[]
}
export const CardCompany: NextPage<TProps> = ({item, companyAddresses}) => {
  const [isDeleted, setIsDeleted] = useState(false);

  const queryClient = useQueryClient();
  const router = useRouter();

  // fetch api

  const fetchDeleteCompany= async (id: string) => {
    const response = await ServiceCompany.deleteCompany(id)
    return response.data;
  }

  const mutationDeleteCompany = useMutation(['deleteCompany'], fetchDeleteCompany)

  // handles
  const handleDeleteCompany = () => {
    mutationDeleteCompany.mutate(item?.id , {
      onSuccess: () => {
        queryClient.invalidateQueries(['companies', 'isPrivate'])
        toast.success('Delete company is successed!', {
          position: toast.POSITION.BOTTOM_LEFT,
        });
      },
      onError:() => {
        toast.error('Delete company is failed, Please try again!', {
          position: toast.POSITION.BOTTOM_LEFT,
        });
      },
      onSettled: () => {
        onCloseModalDelete()
      }
    })
  }
  
  const handleClickDelete = () => {
    setIsDeleted(!isDeleted)
  }

  const onCloseModalDelete = () => {
    setIsDeleted(false)
  }

  const memoCountries = useMemo(() => {
    const countries:any = [];
    const cities:any = [];
    const citiesExisted:any = [];
    const countriesExisted:any = [];
    companyAddresses?.forEach((item:any) => {
      if(!countriesExisted?.includes(item?.country?.id)) {
        countries.push(item?.country)
      }
      if(!citiesExisted?.includes(item?.city?.id)) {
        cities.push(item?.city)
      }
      countriesExisted?.push(item?.country?.id)
      citiesExisted?.push(item?.city?.id)
    })
    return {
      countries,
      cities
    }
  }, [companyAddresses])
  return (
    <>
      <Modal isOpen={isDeleted} closeModal={onCloseModalDelete}>
        <div className="py-4 px-4 rounded-[20px] shadow-lg my-4 border-[1px] bg-white border-solid border-[#e7e7e9] max-h-[90vh] overflow-auto">
          <div className='flex items-center justify-between'>
            <h4 className="text-black font-bold text-[20px]">Delete Company</h4>
            <Button
              iconBtn="fas fa-times text-[20px]"
              classBtn="h-[32px] w-[32px] text-black outline-[none] border-none focus:outline-none"
              onClick={onCloseModalDelete}
            />
          </div>
          <h4 className="text-black font-medium text-[16px] my-4">Are you sure to delete this company?</h4>
          <div className="h-[1px] bg-[#e7e7e9] w-full my-2"></div>
          <div className="flex gap-2 justify-end">
            <Button
              classBtn="h-[40px] w-auto text-black focus:outline-none font-medium hover:bg-[#f7f7f7] rounded-md py-2 px-6"
              textBtn='Cancel'
            />
            <Button
              classBtn="h-[40px] w-auto text-white font-bold focus:outline-none bg-[#3659e3] rounded-md py-2 px-6"
              textBtn='Delete'
              onClick={handleDeleteCompany}
            />
          </div>
        </div>
      </Modal>
      <div className="h-full w-full">
        <div className="py-10 px-12 rounded-[20px] shadow-lg my-4 border-[1px] border-solid border-[#e7e7e9]">
          <div className="flex items-center gap-4 md:gap-8 lg:gap-12 flex-wrap w-full">
            <Link href='/companies/istick'>
              <Image
                src={item?.avatar}
                alt='profile'
                placeholder='blur'
                blurDataURL={'@/public/img/placeholder.png'}
                className='align-middle border-none max-w-full w-[160px] rounded-[50%] object-cover max-h-[x] h-[160px]'
                width={0}
                height={0}
                sizes="100vw"
              />
            </Link>
            <div className='flex-1'>
              <div className='flex items-center justify-between'>
                <Link href='/companies/istick' className="text-[32px] text-black font-bold">{item?.name}</Link>
                <Button
                  classBtn="h-[30px] w-auto text-[#2b6fdf] focus:outline-none"
                  iconBtn='far fa-edit text-[24px]'
                  onClick={() => router.push(`/hiring/edit/company/${item?.id}`)}
                />
              </div>
              <div className='grid lg:grid-cols-3 gap-1 md:gap-1 lg:gap-0'>
                <p className="text-[16px] text-black flex items-center gap-1 mt-[4px] lg:mt-2">
                  <span><i className="fas fa-users text-black text-[16px]"></i></span>
                  <span>{'  '}{item?.companySizeFrom}-{item?.companySizeTo} employees</span>
                </p>
                <p className="text-[16px] text-black flex items-center gap-1 mt-[4px] lg:mt-2">
                  <span><i className="fas fa-calendar-alt text-black text-[16px]"></i></span>
                  <span>{'  '}{item?.workingDays}</span>
                </p>
                <p className="text-[16px] text-black flex items-center gap-1 mt-[4px] lg:mt-2">
                  <span><i className="fas fa-globe text-black text-[16px]"></i></span>
                  {memoCountries?.countries?.map((item: any) => {
                    const existCityIds:any[] = []
                    existCityIds?.push(item?.country?.id)
                    return (
                
                      <div key={item?.id} className="flex items-center gap-1">
                        <span>{'  '}{item?.name}</span>
                        <Image
                          src={item?.flagUrl || "/img/profile.png"}
                          alt='lag'
                          placeholder='blur'
                          blurDataURL={'@/public/img/placeholder.png'}
                          className='align-middle border-none max-w-full w-[24px] rounded-[50%] object-cover max-h-[x] h-[24px]'
                          width={0}
                          height={0}
                          sizes="100vw"
                        />
                      </div>
                    )
                  })}
                </p>
                <p className="text-[16px] text-black flex items-center gap-1 mt-[4px] lg:mt-2">
                  <span><i className="fas fa-map-marker-alt text-black text-[16px]"></i></span>
                  {memoCountries?.countries?.map((item: any) => {
                    return (
                      <span key={item?.id}>{'  '}{item?.name} city</span>
                    )
                  })}
                </p>
              </div>
            </div>
          </div>
          <div className="h-[1px] bg-[#e7e7e9] w-full my-6"></div>
          {/* <div className="flex justify-end">
            <Button
              classBtn="mt-4 md:mt-0 h-[40px] w-auto focus:outline-none rounded-md border-[1px] py-1 px-2 text-white"
              iconBtn='fas fa-trash text-[16px]'
              onClick={handleClickDelete}
              textBtn="Delete"
              styleBtn={{
                backgroundColor: !item?.owner ? '#f3f3f4' : '#ed1b2f',
                color: !item?.owner ? '#3d3d4e': '#2b6fdf',
                cursor: !item?.owner ? 'not-allowed' : 'pointer',
              }}
              disabled={!item?.owner}
            />
          </div> */}
                  
        </div>
      </div>
    </>
  );
}
