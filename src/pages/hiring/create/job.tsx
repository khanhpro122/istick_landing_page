// Libraries
import React, { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

// Services
import * as ServiceJob from "@/services/job";
import * as ServiceCompany from "@/services/company";

// Components
import Footer from "@/components/Footers/Footer";
import Navbar from "@/components/Navbars/IndexNavbar";
import { Button } from "@/components/Buttons/Button";
import { FormPostJob } from "@/components/Forms/FormPostJob";
import { Loading } from "@/components/Loading/Loading";

// Utils
import { convertArrayToTags, getCookie, getLocalUserData, getNamCompanyById } from "@/utils";
import Head from "next/head";

function Index() {
  const router = useRouter();
  const [stateFormJob, setStateFormJob] = useState({
    jobTypes: [],
    avatar: null,
    description: "",
    skills: [],
    salaryFrom: "",
    salaryTo: "",
    qualification: "",
    overview: "",
    position: "",
    workingDays: "",
    website: "",
    name: "",
    companyId: "",
    companyAddressId: '',
    levelIds: [],
    currencyId: 2,
    deadline: null,
  });
  const [company, setCompany] = useState<any>({})
  const [optionAddress, setOptionAddress] = useState([])

  const { accessToken } = getLocalUserData();

  const fetchListCompanies = async (isPrivate: boolean) => {
    const res = await ServiceCompany.getListCompany(10, 1, isPrivate);
    return res.data;
  };

  const fetchCreateJob = async (data: any) => {
    const res = await ServiceJob.createJob(data);
    return res.data;
  };

  const fetchDetailCompany = async (companyId: string) => {
    const response = await ServiceCompany.getDetailCompany(companyId);
    if(response?.data) {
      setCompany(response?.data)
      setStateFormJob({
        ...stateFormJob,
        website: response?.data?.website,
        workingDays: response?.data?.workingDays,
      })
    }
  };

  useEffect(() => {
    if (stateFormJob?.companyId) {
      fetchDetailCompany(stateFormJob?.companyId);
    }
  }, [stateFormJob?.companyId]);

  useEffect(() => {
    if(company) {
      setOptionAddress(company?.companyAddresses?.map((item: any) => {
        return {
          label: `${item?.address} (${item?.city?.name}, ${item?.country?.name})`,
          value: item?.id
        }
      }))
    }
  }, [company])

  // query
  const queryClient = useQueryClient();
  const {
    data: companiesPrivate,
    isLoading: isLoadingCompaniesPrivate,
  } = useQuery(["companies", "isPrivate"], () => fetchListCompanies(true), {
    staleTime: 1000 * 60,
    retryDelay: 2000,
    retry: 1,
  });

  const mutationCreateJob = useMutation(["createJob"], fetchCreateJob);

  const { isLoading: isLoadingCreateJob } = mutationCreateJob;

  const handleCreateNewAjob = () => {
    const nameCompany = getNamCompanyById(
      companiesPrivate?.list,
      +stateFormJob?.name
    );
    const data = {
      salaryFrom: +stateFormJob.salaryFrom,
      salaryTo: +stateFormJob.salaryTo,
      openStatus: "OPEN",
      companyId: stateFormJob.companyId,
      mapLocation: JSON.stringify({ ent: 2132 }),
      name: stateFormJob.name,
      jobTags: convertArrayToTags(stateFormJob?.skills),
      jobTypes: stateFormJob?.jobTypes,
      avatar: stateFormJob?.avatar,
      overview: stateFormJob?.overview,
      workingDays: stateFormJob?.workingDays,
      position: stateFormJob?.position,
      qualification: stateFormJob?.qualification,
      description: stateFormJob?.description,
      website: stateFormJob?.website,
      companyAddressId: stateFormJob?.companyAddressId,
      currencyId: +stateFormJob?.currencyId,
      levelIds: stateFormJob?.levelIds?.map((item) => +item),
    };
    mutationCreateJob.mutate(data, {
      onSuccess: () => {
        toast.success("Create job is successed!", {
          position: toast.POSITION.BOTTOM_LEFT,
        });
        queryClient.invalidateQueries(["jobs"], { exact: true });
        setTimeout(() => {
          router.push("/hiring");
        }, 1000);
      },
      onError: () => {
        toast.error("Create job is failed, Please try again!", {
          position: toast.POSITION.BOTTOM_LEFT,
        });
      },
    });
  };

  const handleOnchangePostFormJob = (type: string, value: any) => {
    setStateFormJob({
      ...stateFormJob,
      [type]: value,
    });
  };
  
  useEffect(() => {
    if (!accessToken) {
      Router.push("/");
    }
  }, []);

  const disabledCreateJob =
    !stateFormJob.name ||
    !stateFormJob.workingDays ||
    !stateFormJob.description ||
    !stateFormJob.jobTypes?.length ||
    !stateFormJob.qualification ||
    !stateFormJob.skills?.length ||
    !stateFormJob.salaryFrom ||
    !stateFormJob.salaryTo ||
    !stateFormJob.deadline ||
    !stateFormJob.levelIds

  return (
    <>
      <Head>
        <title>Create job</title>
      </Head>
      <Navbar fixed isShowAuth />
      <div id="container" className="bg-[#dbe0e1]">
        <Loading
          isLoading={
            isLoadingCompaniesPrivate ||
            isLoadingCreateJob
          }
        ></Loading>
        <ToastContainer />
        <section className="header pt-20">
          <div className="container mx-auto">
            <div className="md:px-8 lg:px-4 my-4">
              <Link href="/hiring">
                <span className="text-[#3659e3] text-[16px] mb-2">
                  <i className="far fa-arrow-alt-circle-left text-[30px]"></i>
                </span>
              </Link>
              <div className="p-4 rounded-[20px] shadow-lg border-[1px] bg-white border-solid border-[#e7e7e9]">
                <FormPostJob
                  jobTypes={stateFormJob.jobTypes}
                  description={stateFormJob.description}
                  skills={stateFormJob.skills}
                  salaryFrom={stateFormJob.salaryFrom}
                  salaryTo={stateFormJob.salaryTo}
                  qualification={stateFormJob.qualification}
                  overview={stateFormJob.overview}
                  onChange={handleOnchangePostFormJob}
                  name={stateFormJob.name}
                  position={stateFormJob.position}
                  workingDays={stateFormJob.workingDays}
                  website={stateFormJob.website}
                  companyAddressId={stateFormJob.companyAddressId}
                  levelIds={stateFormJob.levelIds}
                  currencyId={+stateFormJob?.currencyId}
                  optionAddress={optionAddress}
                  deadline={stateFormJob.deadline}
                  companyId={stateFormJob?.companyId}
                />
                <div className="h-[1px] bg-[#e7e7e9] w-full my-6"></div>
                <div className="flex gap-2 justify-end px-2 md:px-4">
                  <Button
                    classBtn="h-[40px] w-auto text-white font-bold focus:outline-none bg-[#3659e3] rounded-md py-2 px-6"
                    textBtn="Create"
                    disabled={Boolean(disabledCreateJob)}
                    onClick={handleCreateNewAjob}
                  />
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
