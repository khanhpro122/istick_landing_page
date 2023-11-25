// Libraries
import React from "react";

// Components
import Footer from "@/components/Footers/Footer";
import Navbar from "@/components/Navbars/IndexNavbar";

// Services
import Head from "next/head";
import Link from "next/link";

function Index() {

  return (
    <>
      <Head>
        <title>Support Istick</title>
      </Head>
      <Navbar fixed isShowAuth />
      <div id="container" className="bg-[#dbe0e1]">
        <section className="bg-white header px-4 pt-20 items-center flex h-auto md:min-h-[700px]">
          <div className="container mx-auto">
            <div className="px[0] py-8 md:px-4 md:py-8 lg:px-4">
              <h4 className="text-[32px] text-black">Please contact us through the following methods:</h4>
              <div className="mt-4 flex items-center gap-4">
                <i className="fab fa-facebook-square text-[#2b6fdf] text-[40px]" />
                <span className="text-[#000] text-[24px]">
                  {" "}
                  <Link href="https://www.facebook.com/istick.io" target="_blank">Istick.io</Link>
                </span>
              </div>
              <div className="mt-4 flex items-center gap-4">
                <i className="fas fa-envelope text-[#2b6fdf] text-[40px]" />
                <span className="text-[#000] text-[24px]">
                  {" "}
                  <div>support@istick.io</div>
                </span>
              </div>
            </div>
          </div>
        </section>
        <Footer hiddenDecord />
      </div>
    </>
  );
}

export default Index;
