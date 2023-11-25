// Libraries
import { NextPage } from 'next';
import React, { ReactNode } from 'react';

type TProps = {
    isLoading?: boolean,
    closeModal?: () => void,
    afterOpenModal?: () => void,
    isOpen: boolean,
    children: ReactNode
}

const Modal: NextPage<TProps> = ({ closeModal, isOpen, children }) => {
  return (
    <>
      {isOpen  && (
        <div className="modal fixed inset-0 flex items-center justify-center z-[100]">
          <div className="modal-overlay absolute inset-0 opacity-50"
            style={{
              background: 'rgba(81, 94, 123, 0.5)'
            }}
          ></div>
          <div className='container mx-auto px-4 h-full animate-slide-dow z-50'>
            <div className='flex content-center items-center justify-center h-full'>
              <div className='w-[100%] md:w-auto md:min-w-[400px] lg:w-auto lg:min-w-[400px]'>
                {children}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Modal