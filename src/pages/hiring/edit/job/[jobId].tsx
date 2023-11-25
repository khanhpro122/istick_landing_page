// Libraries
import { NextPage } from "next";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";

// Services
import * as ServiceJob from "@/services/job";
import * as ServiceCompany from "@/services/company";

// Utils
import { convertArrayToTags, convertValues, convertValuesLevel, getNamCompanyById } from "@/utils";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbars/IndexNavbar";
import { Loading } from "@/components/Loading/Loading";
import Footer from "@/components/Footers/Footer";
import { Button } from "@/components/Buttons/Button";
import { FormPostJob } from "@/components/Forms/FormPostJob";
import Head from "next/head";

type TProps = {
  item: any;
};
const Index: NextPage<TProps> = ({ item }) => {
  const [company, setCompany] = useState<any>({});
  const [optionAddress, setOptionAddress] = useState([])
  const [stateForm, setStateForm] = useState({
    jobTypes: [],
    avatar: null,
    description: "",
    skills: [],
    qualification: "",
    overview: "",
    position: "",
    workingDays: "",
    website: "",
    name: "",
    companyAddressId: '',
    salaryFrom: "",
    salaryTo: "",
    levelIds: [],
    currencyId: 2,
    deadline: "",
    companyId: "",
  });
  const router = useRouter();
  const refInitNameJob = useRef<null | any>(null)
  
  const queryClient = useQueryClient();

  // fetch api
  const fetchUpdateInfoJob = async (data: any) => {
    const response = await ServiceJob.updateJob(item?.id || "", data);
    return response.data;
  };

  const fetchDetailCompany = async (companyId: string) => {
    const response = await ServiceCompany.getDetailCompany(companyId);

    setCompany(response?.data);
  };

  useEffect(() => {
    if (item?.companyId) {
      fetchDetailCompany(item?.companyId);
    }
  }, [item?.companyId]);

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

  const mutationUpdateJob = useMutation(["updateJob"], fetchUpdateInfoJob);
  const { isLoading } = mutationUpdateJob;

  const handleOnchangePostForm = (type: string, value: any) => {
    setStateForm({
      ...stateForm,
      [type]: value,
    });
  };

  const handleUpdateJob = () => {
    // const nameObject = refInitNameJob.current === stateForm.name ? {} : {name: stateForm.name}
    mutationUpdateJob.mutate(
      {
        companyId: +stateForm?.companyId,
        jobTags: convertArrayToTags(stateForm?.skills),
        name: stateForm.name,
        mapLocation: "maplocaton",
        openStatus: "OPEN",
        jobTypes: stateForm?.jobTypes,
        avatar: stateForm?.avatar,
        overview: stateForm?.overview,
        workingDays: stateForm?.workingDays,
        position: stateForm?.position,
        qualification: stateForm?.qualification,
        description: stateForm?.description,
        website: stateForm?.website,
        companyAddressId: stateForm?.companyAddressId,
        salaryFrom: stateForm?.salaryFrom,
        salaryTo: stateForm?.salaryTo,
        currencyId: +stateForm?.currencyId,
        levelIds: stateForm?.levelIds?.map((item) => +item),
        deadline: stateForm.deadline,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["jobs"]);
          toast.success("Update job info is success!", {
            position: toast.POSITION.BOTTOM_LEFT,
          });
          queryClient.invalidateQueries(["jobs"], { exact: true });
          setTimeout(() => {
            router.push("/hiring");
          }, 1000);
        },
        onError: () => {
          toast.error("Update job info is failed, Please try again!", {
            position: toast.POSITION.BOTTOM_LEFT,
          });
        },
      }
    );
  };

  useEffect(() => {
    refInitNameJob.current =  item.name
    setStateForm({
      avatar: item?.avatar,
      jobTypes: item?.jobTypes,
      name: item?.name,
      overview: item?.overview,
      description: item?.description,
      position: item?.position,
      workingDays: item?.workingDays,
      website: item?.website,
      qualification: item?.qualification,
      companyAddressId: item?.companyAddressId,
      salaryTo: item?.salaryTo,
      salaryFrom: item?.salaryFrom,
      levelIds: convertValuesLevel(item?.jobLevels),
      skills: convertValues(item?.jobTags, "SKILL"),
      currencyId: item?.currencyId || 2,
      deadline: item?.deadline,
      companyId: item?.companyId,
    });
  }, [item]);

  const disabledEditJob =
  !stateForm.name ||
  !stateForm.workingDays ||
  !stateForm.description ||
  !stateForm.jobTypes?.length ||
  !stateForm.qualification ||
  !stateForm.skills?.length ||
  !stateForm.salaryFrom ||
  !stateForm.salaryTo ||
  !stateForm.deadline ||
  !stateForm.levelIds

  return (
    <>
      <Head>
        <title>Edit job</title>
      </Head>
      <Navbar fixed isShowAuth />
      <div id="container" className="bg-[#dbe0e1]">
        <Loading isLoading={isLoading}></Loading>
        <ToastContainer />
        <section className="header pt-20">
          <div className="container mx-auto">
            <div className="md:px-8 lg:px-4 my-4">
              <Link href="/hiring">
                <span className="text-[#3659e3] text-[16px] mb-2">
                  <i className="far fa-arrow-alt-circle-left text-[30px]"></i>
                </span>
              </Link>
              <div className="py-4 px-4 rounded-[20px] shadow-lg my-4 border-[1px] bg-white border-solid border-[#e7e7e9] h-auto overflow-auto">
                <FormPostJob
                  jobTypes={stateForm.jobTypes}
                  description={stateForm.description}
                  skills={stateForm.skills}
                  salaryFrom={stateForm.salaryFrom}
                  salaryTo={stateForm.salaryTo}
                  qualification={stateForm.qualification}
                  overview={stateForm.overview}
                  onChange={handleOnchangePostForm}
                  name={stateForm.name}
                  position={stateForm.position}
                  workingDays={stateForm.workingDays}
                  website={stateForm.website}
                  companyAddressId={stateForm.companyAddressId}
                  levelIds={stateForm.levelIds}
                  currencyId={stateForm?.currencyId}
                  mode="edit"
                  optionAddress={optionAddress}
                  deadline={stateForm?.deadline}
                  companyId={stateForm?.companyId}
                />
                <div className="h-[1px] bg-[#e7e7e9] w-full my-6"></div>
                <div className="flex gap-2 justify-end px-2 md:px-4">
                  <Button
                    classBtn="h-[40px] w-auto text-white font-bold focus:outline-none bg-[#3659e3] rounded-md py-2 px-6"
                    textBtn="Apply"
                    onClick={handleUpdateJob}
                    disabled={Boolean(disabledEditJob)}
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
};

export default Index;

export async function getServerSideProps(context: any) {
  try {
    const { params } = context;
    const jobId = params?.jobId as string;
    const response = await ServiceJob.getJobDetailsPublic(jobId);
    const data = response?.data;
    if (!data?.id) {
      return {
        notFound: true,
      };
    }
    return {
      props: {
        item: data,
      },
    };
  } catch (e) {
    return {
      notFound: true,
    };
  }
}
