/* eslint-disable @next/next/no-img-element */
import Link from "next/link"
import { Fragment,useEffect,useState } from "react"
import { NextPage } from "next";
import Image from "next/image";

// Services
import * as ServiceEvent from '@/services/event';

// utils
import { formatStringToDate } from "@/utils";

// Components
import { Button } from "@/components/Buttons/Button";
import Footer from "@/components/Footers/Footer"
import Navbar from "@/components/Navbars/IndexNavbar"
import Head from "next/head";


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

type TProps = {
  events?: TPropEvent[],
  limit?: number,
}

const Events:NextPage<TProps> = (props) => {
  const [eventsData, setEventsData] = useState<[] | TPropEvent[]>([])
  const [limitState, setLimitState] = useState(6)
  const [isLoading, setIsLoading] = useState(false)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    setIsLoading(true)
    ServiceEvent.getEventList(1, limitState ? limitState : 0, true).then((res:any) => {
      if(res?.status === 200) {
        setEventsData(res.data.list)
        setTotal(res.data.total)
      }
      setIsLoading(false)
    })
  },[limitState])
  
  return (
    <Fragment>
      <Head>
        <title>Events</title>
      </Head>
      <Navbar fixed isShowAuth />
      <section className='block relative z-1 bg-blueGray-600 pt-28 min-h-[800px]'>
        <div className='container mx-auto'>
          <div className='justify-center flex flex-wrap'>
            <div className='w-full lg:w-12/12 px-4'>
              <div className='flex flex-wrap'>
                {eventsData?.map((event) => {
                  return (
                    <div key={event.slug} className='w-full lg:w-4/12 px-4'>
                      <Link href={`/events/${event?.slug}`}>
                        <div className='hover:-mt-4 relative rounded-[8px] flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg ease-linear transition-all duration-150'>
                          <Image
                            alt={event?.title}
                            placeholder='blur'
                            blurDataURL={'@/public/img/placeholder.png'}
                            className='align-middle border-none max-w-full w-full h-auto rounded-tl-[8px] rounded-tr-[8px]'
                            src={event?.bannerUrl}
                            width={0}
                            height={0}
                            sizes="100vw"
                          />
                          <div className='px-4 py-5'>
                            <h5 className='text-xl text-[#39364f] pb-1 text-left font-bold'>
                              {event?.title}
                            </h5>
                            <h6 className="text-[#d1410c] text-[14px] font-bold">{formatStringToDate(event?.startDate)}</h6>
                            <span className="text-[#6f7287] text-[14px] mt-1"> {event?.location}{' '}</span>
                            <div>
                              {event?.types.map((type, index) => {
                                return (
                                  <span key={type} className="text-[12px]">{index % 2 !== 0 && ' | '}{type}</span>
                                )
                              })}
                            </div>
                            <div className="font-bold">{' '}{event?.cost ? event?.cost : 'Free'}{' '}</div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  )
                })}
              </div>
              <div className="w-full text-center px-4 ">
                <Button 
                  classBtn="h-auto font-bold w-full md:w-auto py-2 mb-4 px-0 md:px-4 lg:w-auto xl:w-auto bg-[#3659e3] text-white rounded-md outline-[none] border-none focus:outline-none mt-4"
                  textBtn={isLoading ? '...Loading': 'Load more'}
                  styleBtn={{
                    backgroundColor: (isLoading || total <= eventsData.length)  ? '#f3f3f4' : '#3659e3',
                    color: (isLoading || total <= eventsData.length) ? '#3d3d4e': '#fff',
                    cursor: (isLoading || total <= eventsData.length) ? 'not-allowed' : 'pointer',
                  }}
                  disabled={isLoading || total <= eventsData.length}
                  onClick={() => setLimitState((prev) => Number(prev) + 3)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer hiddenDecord />
    </Fragment>
  )
}

export default Events

// export async function getStaticProps() {
//   try{
//     const response = await ServiceEvent.getEventList(1, 6);
//     const data = response?.data?.list
//     console.log('data', {data})
//     return {
//       props: {
//         events: data,
//         limit: 6
//       }
//     };
//   }catch(e) {
//     return {
//       notFound: true
//     }
//   }
  
// }