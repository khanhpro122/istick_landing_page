// Libraries
import Footer from '@/components/Footers/Footer';
import Navbar from '@/components/Navbars/IndexNavbar';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';

function Index() {

  return (
    <>
      <Head>
        <title>Privacy</title>
      </Head>
      <Navbar fixed isShowAuth />
      <div id="container" className="bg-[#dbe0e1]"
      >
        <section className='bg-white header px-12 md:px-4 pt-20 items-center flex h-auto lg:min-h-[760px] flex-wrap'>
          <div className="container mx-auto my-6">
            <h4 className='text-[#313e5b] text-[26px] font-bold mt-4'>Privacy Policy</h4>
            <p className="text-[#525f81] text-[16px] mt-4">
              Your privacy is important to us. It is iStick&lsquo;s policy to respect your privacy regarding any information we may collect from you across our website,{' '} 
              <Link className="underline text-[#2b6fdf]" href='https://istick.io/' target='_blank'>
                https://istick.io
              </Link>, and other sites we own and operate.
            </p>
            <p className="text-[#525f81] text-[16px] mt-2">
              We only ask for personal information when we truly need it to provide a service to you. 
              We collect it by fair and lawful means, with your knowledge and consent. 
              We also let you know why we&lsquo;re collecting it and how it will be used.
            </p>
            <p className="text-[#525f81] text-[16px] mt-2">
              We only retain collected information for as long as necessary to provide you with your requested service. 
              What data we store, we&lsquo;ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use, or modification.
              We don&lsquo;t share any personally identifying information publicly or with third-parties, except when required to by law.
            </p>
            <p className="text-[#525f81] text-[16px] mt-2">
              Our website may link to external sites that are not operated by us. 
              Please be aware that we have no control over the content and practices of these sites and cannot accept responsibility or liability for their respective privacy policies.
            </p>
            <p className="text-[#525f81] text-[16px] mt-2">
              By using our website, you consent to our privacy policy.
            </p>
            <h4 className='text-[#313e5b] text-[26px] font-bold mt-4'>Contact</h4>
            <p className="text-[#525f81] text-[16px] mt-4">
              If you have any questions about these terms & conditions or privacy policy, 
              please contact us at <span className="underline text-[#2b6fdf]">support@istick.io.</span>
            </p>
            <h4 className='text-[#313e5b] text-[26px] font-bold mt-4'>Changes to Terms & Conditions and Privacy Policy</h4>
            <p className="text-[#525f81] text-[16px] mt-4">
              We reserve the right to update these terms & conditions and privacy policy at any time. 
              We will notify you of any changes by posting the new terms on this page. It is your responsibility to check this page periodically for changes. 
              Your continued use of or access to the website following the posting of any changes constitutes acceptance of those changes.
            </p>
          </div>
        </section>
        <Footer hiddenDecord />
      </div>
    </>
  );
}


export default Index