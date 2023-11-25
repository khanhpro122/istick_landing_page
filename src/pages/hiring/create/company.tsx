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
import { Loading } from "@/components/Loading/Loading";
import { FormCompany } from "@/components/Forms/FormCompany";

// Utils
import { getLocalUserData } from "@/utils";
import Head from "next/head";

function Index() {
  const router = useRouter();
  const [stateFormCompany, setStateFormCompany] = useState({
    avatar: null,
    culture: "",
    companyTypes: [],
    overview: "",
    description: "",
    name: "",
    workingDays: "T2-T6",
    website: "",
    country: "",
    companyAddresses: [
      {
        id: 1,
        address: '',
        mapAddress: '',
        cityId: 1,
        countryId: 1
      }
    ],
    companySizeTo: "",
    companySizeFrom: "",
  });

  const { accessToken } = getLocalUserData()

  const fetchCreateCompany = async (data: any) => {
    const res = await ServiceCompany.createCompany(data);
    return res.data;
  };

  // query
  const queryClient = useQueryClient();

  const mutationCreateCompany = useMutation(
    ["createCompany"],
    fetchCreateCompany
  );

  const { isLoading: isLoadingCreateCompany } = mutationCreateCompany;

  const handleOnchangePostFormCompany = (type: string, value: any) => {
    setStateFormCompany({
      ...stateFormCompany,
      [type]: value,
    });
  };

  const handleCreateCompany = () => {
    const data = {
      avatar: stateFormCompany.avatar,
      culture: stateFormCompany.culture,
      companyTypes: stateFormCompany.companyTypes,
      overview: stateFormCompany.overview,
      description: stateFormCompany.description,
      name: stateFormCompany.name,
      workingDays: stateFormCompany.workingDays,
      website: stateFormCompany.website,
      companyAddresses: stateFormCompany.companyAddresses,
      companySizeTo: +stateFormCompany.companySizeTo,
      companySizeFrom: +stateFormCompany.companySizeFrom,
      countryId: 1,
    };
    mutationCreateCompany.mutate(data, {
      onSuccess: () => {
        toast.success("Create company is successed!", {
          position: toast.POSITION.BOTTOM_LEFT,
        });
        queryClient.invalidateQueries(["companies", "isPrivate"]);
        setTimeout(() => {
          router.push("/hiring");
        }, 1000);
      },
      onError: () => {
        toast.error("Create company is failed, Please try again!", {
          position: toast.POSITION.BOTTOM_LEFT,
        });
      },
    });
  };

  useEffect(() => {
    if (!accessToken) {
      Router.push("/");
    }
  }, []);
  
  const disabledCreateCompany =
    !stateFormCompany.avatar ||
    !stateFormCompany.companyAddresses ||
    !stateFormCompany.companySizeFrom ||
    !stateFormCompany.companySizeTo ||
    !stateFormCompany.companyTypes.length ||
    !stateFormCompany.culture ||
    !stateFormCompany.description ||
    !stateFormCompany.name ||
    !stateFormCompany.overview ||
    !stateFormCompany.website ||
    !stateFormCompany.workingDays

  return (
    <>
      <Head>
        <title>Create company</title>
      </Head>
      <Navbar fixed isShowAuth />
      <div id="container" className="bg-[#dbe0e1]">
        <Loading
          isLoading={
            isLoadingCreateCompany
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
              <div className="py-4 px-4 rounded-[20px] shadow-lg my-4 border-[1px] bg-white border-solid border-[#e7e7e9] h-auto">
                <FormCompany
                  avatar={stateFormCompany.avatar}
                  culture={stateFormCompany.culture}
                  companyTypes={stateFormCompany.companyTypes}
                  overview={stateFormCompany.overview}
                  description={stateFormCompany.description}
                  onChange={handleOnchangePostFormCompany}
                  name={stateFormCompany.name}
                  country={stateFormCompany.country}
                  workingDays={stateFormCompany.workingDays}
                  website={stateFormCompany.website}
                  companyAddresses={stateFormCompany.companyAddresses}
                  companySizeFrom={stateFormCompany.companySizeFrom}
                  companySizeTo={stateFormCompany.companySizeTo}
                />
                <div className="h-[1px] bg-[#e7e7e9] w-full my-6"></div>
                <div className="flex gap-2 justify-end px-2 md:px-4">
                  <Button
                    classBtn="h-[40px] w-auto text-white font-bold focus:outline-none bg-[#3659e3] rounded-md py-2 px-6"
                    textBtn="Create"
                    onClick={handleCreateCompany}
                    disabled={Boolean(disabledCreateCompany)}
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
