// Libraries
import Footer from '@/components/Footers/Footer';
import Navbar from '@/components/Navbars/IndexNavbar';
import Head from 'next/head';
import React from 'react';


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

  return (
    <>
      <Head>
        <title>About</title>
      </Head>
      <Navbar fixed isShowAuth />
      <div id="container" className="bg-[#dbe0e1]"
      >
        <section className='bg-white header px-12 md:px-4 pt-20 items-center flex h-auto lg:min-h-[760px] flex-wrap'>
          <div className="container mx-auto my-6">
            <h3 className='text-[#313e5b] text-[30px] font-bold'>Who we are</h3>
            <p className="text-[#525f81] text-[16px] mt-6">
              Welcome to iStick - where we accompany you on your career journey.
              We take pride in being a specialized IT recruitment company, with the goal of helping you search for and attain the most suitable job.
            </p>
            <p className="text-[#525f81] text-[16px] mt-6">
              iStick provides a modern, convenient, and secure recruitment platform, 
              making it easy for users to search for and apply to job positions in the information technology industry. 
              We consistently update thousands of new and diverse jobs from reputable employers.
            </p>
            <p className="text-[#525f81] text-[16px] mt-6">
              The operation of iStick is very straightforward. You just need to create an account, 
              including your work skills and career preferences. 
              Our intelligent Matching will accompany you in the process of finding suitable jobs and suggesting positions that align with your potential. 
              We prioritize the safety and security of your data, allowing you to fully focus on exploring exciting and fitting opportunities based on your potential.
            </p>
            <p className="text-[#525f81] text-[16px] mt-6">
              At iStick, we always respect the value of each candidate and employer. 
              We are committed to delivering the best recruitment experience and accompanying you on your career journey. 
              Let&lsquo;s explore amazing opportunities together and reach the pinnacle of your success!
            </p>
            <p className="text-[#525f81] text-[16px] mt-6">
              Thank you for choosing iStick as your recruitment partner. 
              Let&lsquo;ss begin your new career journey with us today
            </p>
          </div>
        </section>
        <Footer hiddenDecord />
      </div>
    </>
  );
}


export default Index