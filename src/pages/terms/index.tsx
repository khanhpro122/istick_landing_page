// Libraries
import Footer from '@/components/Footers/Footer';
import Navbar from '@/components/Navbars/IndexNavbar';
import Link from 'next/link';
import React from 'react';

function Index() {

  return (
    <>
      <Navbar fixed isShowAuth />
      <div id="container" className="bg-[#dbe0e1]"
      >
        <section className='bg-white header px-12 md:px-4 pt-20 items-center flex h-auto lg:min-h-[760px] flex-wrap'>
          <div className="container mx-auto my-6">
            <h4 className='text-[#313e5b] text-[26px] font-bold mt-4'>Terms & Conditions</h4>
            <p className="text-[#525f81] text-[16px] mt-4">
              Welcome to iStick! These terms and conditions outline the rules and regulations for the use of our website located at{' '} 
              <Link className="underline text-[#2b6fdf]" href='https://istick.io/' target='_blank'>
                https://istick.io
              </Link>.
            </p>
            <p className="text-[#525f81] text-[16px] mt-2">
              By accessing this website, we assume you accept these terms and conditions in full. 
              Do not continue to use iStick&lsquo;s website if you do not accept all of the terms and conditions stated on this page.
            </p>
            <h4 className='text-[#313e5b] text-[26px] font-bold mt-4'>License</h4>
            <p className="text-[#525f81] text-[16px] mt-4">
              Unless otherwise stated, iStick and/or its licensors own the intellectual property rights for all material on this website. 
              All intellectual property rights are reserved. 
              You may view and/or print pages from{' '}
              <Link className="underline text-[#2b6fdf]" href='https://istick.io/' target='_blank'>
                https://istick.io
              </Link>
              {' '}for your own personal use, subject to restrictions set in these terms and conditions.
            </p>
            <ul>
              <div className="text-[#313e5b] text-[16px] my-2">You must not:</div>
              <li>
                1. Republish material from{' '}
                <Link className="underline text-[#2b6fdf]" href='https://istick.io/' target='_blank'>
                  https://istick.io
                </Link>
              </li>
              <li>
                2. Sell, rent, or sub-license material from{' '}
                <Link className="underline text-[#2b6fdf]" href='https://istick.io/' target='_blank'>
                  https://istick.io
                </Link>
                .</li>
              <li>
                3. Reproduce, duplicate, or copy material from{' '}
                <Link className="underline text-[#2b6fdf]" href='https://istick.io/' target='_blank'>
                  https://istick.io
                </Link>
                .
              </li>
            </ul>
            <h4 className='text-[#313e5b] text-[26px] font-bold mt-4'>User Content</h4>
            <p className="text-[#525f81] text-[16px] mt-4">
              Our website allows users to post, link, store, share, and otherwise make available certain information, text, graphics, videos, or other material. 
              You are responsible for the content you post on iStick.
            </p> 
            <p className="text-[#525f81] text-[16px] mt-4">
              By posting content on our website, you grant iStick a non-exclusive, royalty-free, perpetual, 
              and worldwide license to use, reproduce, modify, adapt, publish, translate, and distribute it in any media.
            </p>
            <h4 className='text-[#313e5b] text-[26px] font-bold mt-4'>Disclaimer</h4>
            <p className="text-[#525f81] text-[16px] mt-4">
              The materials on iStick&lsquo;s website are provided on an &ldquo;as is&ldquo; basis. iStick makes no warranties, expressed or implied, 
              and hereby disclaims and negates all other warranties, including without limitation, implied warranties or conditions of merchantability, 
              fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p> 
            <p className="text-[#525f81] text-[16px] mt-4">
              Further, iStick does not warrant or make any representations concerning the accuracy, likely results, 
              or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.
            </p> 
            <h4 className='text-[#313e5b] text-[26px] font-bold mt-4'>Limitations</h4>
            <p className="text-[#525f81] text-[16px] my-4">
              In no event shall iStick or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, 
              or due to business interruption) arising out of the use or inability to use the materials on iStick&lsquo;s website, 
              even if iStick or a iStick authorized representative has been notified orally or in writing of the possibility of such damage.
            </p> 
          </div>
        </section>
        <Footer hiddenDecord />
      </div>
    </>
  );
}


export default Index