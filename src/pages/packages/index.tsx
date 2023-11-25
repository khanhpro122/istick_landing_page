// Libraries
import React from "react";
import { useQuery } from "@tanstack/react-query";

// Components
import { Button } from "@/components/Buttons/Button";
import Footer from "@/components/Footers/Footer";
import Navbar from "@/components/Navbars/IndexNavbar";
import { Loading } from "@/components/Loading/Loading";

// Services
import * as ServicePackage from "@/services/package";
import Head from "next/head";
import { useRouter } from "next/router";

function Index() {
  const fetchListPackage = async () => {
    const res = await ServicePackage.getPackageList(1, 10);
    return res.data;
  };

  const { data, isLoading } = useQuery(["packages"], fetchListPackage, {
    staleTime: 1000 * 60,
    keepPreviousData: true,
    retry: 1,
  });

  const router = useRouter()

  return (
    <>
      <Head>
        <title>Packages</title>
      </Head>
      <Loading isLoading={isLoading} />
      <Navbar fixed isShowAuth />
      <div id="container" className="bg-[#dbe0e1]">
        <section className="bg-white header px-4 pt-20 items-center flex h-auto md:min-h-[700px]">
          <div className="container mx-auto">
            <div className="px[0] py-8 md:px-4 md:py-8 lg:px-4">
              <div className="w-full hidden lg:flex gap-4">
                <div className="w-[40%]">
                  <div className="border-[1px] border-solid rounded-tl-[8px] rounded-tr-[8px] border-[#e7e7e9] min-h-[78px] flex items-center pl-4">
                    <h4 className="text[18px] text-black font-bold">
                      Name
                    </h4>
                  </div>
                  <div className="border-b-[1px] border-l-[1px] border-r-[1px] border-solid border-[#e7e7e9] min-h-[46px] flex items-center pl-4">
                    <p className="text[14px] text-black font-bold">Expiration period</p>
                  </div>
                  <div className="border-b-[1px] border-l-[1px] border-r-[1px] border-solid border-[#e7e7e9] min-h-[46px] flex items-center pl-4">
                    <p className="text[14px] text-black font-bold">Number of jobs:</p>
                  </div>
                  <div className="border-b-[1px] border-l-[1px] border-r-[1px] border-solid border-[#e7e7e9] min-h-[46px] flex items-center pl-4">
                    <p className="text[14px] text-black font-bold">
                      Number of applications:
                    </p>
                  </div>
                  <div className="border-b-[1px] border-l-[1px] border-r-[1px] border-solid border-[#e7e7e9] min-h-[46px] flex items-center pl-4">
                    <p className="text[14px] text-black font-bold">
                      Create, manage jobs, and manage application CVs
                    </p>
                  </div>
                  <div className="border-b-[1px] border-l-[1px] border-r-[1px] border-solid border-[#e7e7e9] min-h-[46px] h-[80px] flex items-center pl-4">
                    <p className="text[14px] text-black font-bold">
                      Receive notification emails from the platform when
                      candidates apply
                    </p>
                  </div>
                  <div className="border-b-[1px] border-l-[1px] border-r-[1px] border-solid border-[#e7e7e9] min-h-[46px] flex items-center pl-4">
                    <p className="text[14px] text-black font-bold">
                      View profiles of candidates who have applied
                    </p>
                  </div>
                  <div className="border-b-[1px] border-l-[1px] border-r-[1px] border-solid border-[#e7e7e9] min-h-[46px] flex items-center pl-4">
                    <p className="text[14px] text-black font-bold">
                      Create company profile
                    </p>
                  </div>
                  <div className="border-b-[1px] border-l-[1px] border-r-[1px] border-solid border-[#e7e7e9] min-h-[46px] flex items-center pl-4">
                    <p className="text[14px] text-black font-bold">
                      Utilize various other basic features
                    </p>
                  </div>
                  <div className="border-b-[1px] border-l-[1px] border-r-[1px] border-solid border-[#e7e7e9] min-h-[46px] h-[80px] flex items-center pl-4">
                    <p className="text[14px] text-black font-bold">
                      Receive email notifications when candidates switch their
                      job-seeking status
                    </p>
                  </div>
                  <div className="border-b-[1px] border-l-[1px] border-r-[1px] border-solid border-[#e7e7e9] min-h-[46px] h-[80px] flex items-center pl-4">
                    <p className="text[14px] text-black font-bold">
                      Display in the section
                    </p>
                  </div>
                  <div className="border-b-[1px] border-l-[1px] border-r-[1px] border-solid border-[#e7e7e9] min-h-[46px] h-[100px] flex items-center pl-4">
                    <p className="text[14px] text-black font-bold">Display order</p>
                  </div>
                  <div className="border-b-[1px] border-l-[1px] border-r-[1px] border-solid border-[#e7e7e9] min-h-[46px] h-[100px] flex items-center pl-4">
                    <p className="text[14px] text-black font-bold">
                      The display position:
                    </p>
                  </div>
                  <div className="border-b-[1px] border-l-[1px] border-r-[1px] border-solid border-[#e7e7e9] min-h-[46px] flex items-center pl-4">
                    <p className="text[14px] text-black font-bold">Re-post job:</p>
                  </div>
                  <div className="border-b-[1px] border-l-[1px] border-r-[1px] border-solid border-[#e7e7e9] min-h-[46px] h-[80px] flex items-center pl-4"></div>
                </div>
                {data?.list?.map((pack: any) => {
                  return (
                    <div className="w-[15%]" key={pack?.id}>
                      <div
                        className="border-[1px] border-solid rounded-tl-[8px] rounded-tr-[8px] border-[#e7e7e9] 
                        min-h-[78px] flex flex-col justify-center items-center"
                      >
                        <h4 className="text[18px] text-[#2b6fdf] font-bold line-clamp-2 text-center">
                          {pack?.name}
                        </h4>
                        <h4 className="text[18px] text-black font-bold text-center">
                          {pack?.price === 0 ? "Free" : `${pack?.price} VND`}
                        </h4>
                      </div>
                      <div className="border-b-[1px] border-l-[1px] border-r-[1px] border-solid border-[#e7e7e9] min-h-[46px] flex items-center">
                        <p className="text[14px] text-black w-full text-center">
                          Permanent
                        </p>
                      </div>
                      <div className="border-b-[1px] border-l-[1px] border-r-[1px] border-solid border-[#e7e7e9] min-h-[46px] flex items-center">
                        <p
                          className={
                            "text-[14px] w-full text-center " +
                            (pack?.jobQuantity === -1
                              ? "text-[#2b6fdf] font-medium"
                              : "text-black")
                          }
                        >
                          {pack?.jobQuantity === -1
                            ? `Unlimited`
                            : `${pack?.jobQuantity} jobs/month`}
                        </p>
                      </div>
                      <div className="border-b-[1px] border-l-[1px] border-r-[1px] border-solid border-[#e7e7e9] min-h-[46px] flex items-center">
                        <p
                          className={
                            "text[14px] w-full text-center " +
                            (pack?.appQuantity === -1
                              ? "text-[#2b6fdf] font-medium"
                              : "text-black")
                          }
                        >
                          {pack?.appQuantity === -1
                            ? `Unlimited`
                            : `${pack?.jobQuantity} cv/job`}
                        </p>
                      </div>
                      <div className="border-b-[1px] border-l-[1px] border-r-[1px] border-solid border-[#e7e7e9] min-h-[46px] flex items-center">
                        <p className="text[14px] text-black w-full text-center">
                          <i className="fas fa-check text-[18px] text-[#03C03C]"></i>
                        </p>
                      </div>
                      <div className="border-b-[1px] border-l-[1px] border-r-[1px] border-solid border-[#e7e7e9] min-h-[46px] h-[80px] flex items-center">
                        <p className="text[14px] text-black w-full text-center">
                          <i className="fas fa-check text-[18px] text-[#03C03C]"></i>
                        </p>
                      </div>
                      <div className="border-b-[1px] border-l-[1px] border-r-[1px] border-solid border-[#e7e7e9] min-h-[46px] flex items-center">
                        <p className="text[14px] text-black w-full text-center">
                          <i className="fas fa-check text-[18px] text-[#03C03C]"></i>
                        </p>
                      </div>
                      <div className="border-b-[1px] border-l-[1px] border-r-[1px] border-solid border-[#e7e7e9] min-h-[46px] flex items-center">
                        <p className="text[14px] text-black w-full text-center">
                          <i className="fas fa-check text-[18px] text-[#03C03C]"></i>
                        </p>
                      </div>
                      <div className="border-b-[1px] border-l-[1px] border-r-[1px] border-solid border-[#e7e7e9] min-h-[46px] flex items-center">
                        <p className="text[14px] text-black w-full text-center">
                          <i className="fas fa-check text-[18px] text-[#03C03C]"></i>
                        </p>
                      </div>
                      <div className="border-b-[1px] border-l-[1px] border-r-[1px] border-solid border-[#e7e7e9] min-h-[46px] h-[80px] flex items-center">
                        <p className="text[14px] text-black w-full text-center">
                          {pack?.emailNotification ? (
                            <i className="fas fa-check text-[18px] text-[#03C03C]"></i>
                          ) : (
                            <span className="h-[3px] w-[20px] bg-[#dde5e8] inline-block"></span>
                          )}
                        </p>
                      </div>
                      <div className="border-b-[1px] border-l-[1px] border-r-[1px] border-solid border-[#e7e7e9] min-h-[46px] h-[80px] flex items-center">
                        <p className="text[14px] text-black w-full text-center line-clamp-2">
                          {pack?.displayInSection ? (
                            pack?.displayInSection
                          ) : (
                            <span className="h-[3px] w-[20px] bg-[#dde5e8] inline-block"></span>
                          )}
                        </p>
                      </div>
                      <div className="border-b-[1px] border-l-[1px] border-r-[1px] border-solid border-[#e7e7e9] min-h-[46px] h-[100px] flex items-center">
                        <p className="text[14px] text-black w-full text-center line-clamp-3">
                          {pack?.displayOrder ? (
                            pack?.displayOrder
                          ) : (
                            <span className="h-[3px] w-[20px] bg-[#dde5e8] inline-block"></span>
                          )}
                        </p>
                      </div>
                      <div className="border-b-[1px] border-l-[1px] border-r-[1px] border-solid border-[#e7e7e9] min-h-[46px] h-[100px] flex items-center">
                        <p className="text[14px] text-black w-full text-center line-clamp-3">
                          {pack?.displayPosition ? (
                            pack?.displayPosition
                          ) : (
                            <span className="h-[3px] w-[20px] bg-[#dde5e8] inline-block"></span>
                          )}
                        </p>
                      </div>
                      <div className="border-b-[1px] border-l-[1px] border-r-[1px] border-solid border-[#e7e7e9] min-h-[46px] flex items-center">
                        <p className="text[14px] text-black w-full text-center">
                          {pack?.repostJob ? (
                            pack?.repostJob
                          ) : (
                            <span className="h-[3px] w-[20px] bg-[#dde5e8] inline-block"></span>
                          )}
                        </p>
                      </div>
                      <div
                        className="border-b-[1px] border-l-[1px] border-r-[1px] border-solid border-[#e7e7e9] min-h-[46px] 
                        h-[80px] justify-center flex items-center"
                      >
                        {pack?.name === "Free package" ? (
                          <Button
                            classBtn="mt-4 mr-4 h-[40px] bg-[#2b6fdf] rounded-md px-3 font-medium outline-[none] border-none focus:outline-none text-white"
                            textBtn="Actived"
                            disabled={true}
                          />
                        ) : (
                          <Button
                            classBtn="mt-4 mr-4 h-[40px] bg-[#2b6fdf] rounded-md px-3 font-medium outline-[none] border-none focus:outline-none text-white"
                            textBtn="Upgrade now"
                            onClick={() => router.push("/contact")}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex lg:hidden lg:items-start gap-6 justify-center md:gap-12 md:justify-between lg:gap-12 flex-wrap">
                {data?.list?.map((pack: any) => {
                  return (
                    <div
                      key={pack?.id}
                      className="w-[320px] py-6 px-4 border-[1px] border-solid border-[#e7e7e9] rounded-md shadow-md bg-[#eceff4]"
                    >
                      <div className="w-full flex flex-col justify-center">
                        <h2 className="text-black hover:opacity-[0.8] text-[24px] font-bold mb-[4px] text-center">
                          {pack?.name}
                        </h2>
                        <h3 className="text-[#2b6fdf] hover:opacity-[0.8] text-[24px] font-bold mb-[4px] text-center">
                          {pack?.price === 0 ? "Free" : `${pack?.price} VND`}
                        </h3>
                        <div className="text-[16px] text-black mb-2">
                          <span>Expiration period:</span>
                          <span className="text-[#2b6fdf] font-bold">
                            {" "}
                            Permanent
                          </span>
                        </div>
                        <div className="text-[16px] text-black mb-2">
                          <span>Number of jobs:</span>
                          <span className="text-[#2b6fdf] font-bold">
                            {" "}
                            {pack?.jobQuantity === -1
                              ? `Unlimited`
                              : `${pack?.jobQuantity} jobs/month`}
                          </span>
                        </div>
                        <div className="text-[16px] text-black mb-2">
                          <span>Number of applications:</span>
                          <span className="text-[#2b6fdf] font-bold">
                            {" "}
                            {pack?.appQuantity === -1
                              ? `Unlimited`
                              : `${pack?.appQuantity} cv/month`}
                          </span>
                        </div>
                        <ul className="marker:text-[#2b6fdf] list-disc pl-4">
                          <h4 className="text-black text-[20px] font-medium">
                            The features:
                          </h4>
                          <li className="text-[16px] mt-2">
                            Create, manage jobs, and manage application CVs{" "}
                            <i className="fas fa-check text-[16px] text-[#03C03C]"></i>
                          </li>
                          <li className="text-[16px] mt-2">
                            Receive notification emails from the platform when
                            candidates apply{" "}
                            {pack?.emailNotification ? (
                              <i className="fas fa-check text-[18px] text-[#03C03C]"></i>
                            ) : (
                              <span className="h-[3px] w-[20px] bg-[#dde5e8] inline-block"></span>
                            )}
                          </li>
                          <li className="text-[16px] mt-2">
                            View profiles of candidates who have applied{" "}
                            <i className="fas fa-check text-[16px] text-[#03C03C]"></i>
                          </li>
                          <li className="text-[16px] mt-2">
                            Create company profile{" "}
                            <i className="fas fa-check text-[16px] text-[#03C03C]"></i>
                          </li>
                          <li className="text-[16px] mt-2">
                            Utilize various other basic features{" "}
                            <i className="fas fa-check text-[16px] text-[#03C03C]"></i>
                          </li>
                        </ul>
                        {pack?.name == "Free package" ? (
                          <Button
                            classBtn="mt-4 mr-4 h-[40px] bg-[#fff] rounded-[20px] px-3 font-medium outline-[none] border-none focus:outline-none text-black"
                            textBtn="Free"
                          />
                        ) : (
                          <Button
                            classBtn="mt-4 mr-4 h-[40px] bg-[#2b6fdf] rounded-[20px] px-3 font-medium outline-[none] border-none focus:outline-none text-white"
                            textBtn="Upgrade now"
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
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
