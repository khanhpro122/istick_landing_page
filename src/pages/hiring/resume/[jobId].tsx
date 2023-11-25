// Libraries
import React, { use, useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Services
import * as ServiceJob from "@/services/job";

// Components
import Footer from "@/components/Footers/Footer";
import Navbar from "@/components/Navbars/IndexNavbar";
import { CardResume } from "@/components/Cards/CardResume";
import { Loading } from "@/components/Loading/Loading";

function Index() {
  const router = useRouter().query;
  const { jobId } = router;
  // fetch api
  const fetchListResumeByJobId = async (jobId: string) => {
    const res = await ServiceJob.getListResumeByJobId(jobId, {
      params: { limit: 10, page: 1 },
    });
    return res?.data;
  };

  // query
  const { data: resumes, isLoading: isLoadingResume } = useQuery(
    ["resume"],
    () => fetchListResumeByJobId(String(jobId)),
    { staleTime: 1000 * 60, retryDelay: 2000, retry: 1, enabled: !!jobId }
  );
  return (
    <>
      <Navbar fixed isShowAuth />
      <div id="container" className="bg-[#dbe0e1]">
        <Loading isLoading={isLoadingResume}></Loading>
        <ToastContainer />

        <section className="bg-white header px-6 md:px-4 pt-20 items-center flex h-auto">
          <div className="container mx-auto">
            <div className="px[0] pb-[0] md:px-4 md:pd-8 lg:px-4">
              <div className="md:min-h-[500px]">
                <div className="flex-col my-4 gap-6 flex">
                  {resumes?.list?.map((resume: any) => {
                    return (
                      <CardResume
                        key={resume?.id}
                        avatar={resume?.user?.avatar}
                        lastName={resume?.user?.lastname}
                        firstName={resume?.user?.firstname}
                        position={resume?.job?.position}
                        cvUrl={resume?.cvUrl}
                        createdAt={resume?.job?.createdAt}
                        location={resume?.job?.location}
                      />
                    );
                  })}
                </div>
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
