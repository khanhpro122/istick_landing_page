import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import {useEffect, useState} from 'react';
// Services
import * as ServiceSystem from '@/services/system'

const PDFViewer = dynamic(() => import('@/components/PDF/PDFViewer'), {
  ssr: false, // Vô hiệu hóa server-side rendering cho trình xem PDF
});


function Index() {
  const router = useRouter()
  const cvUrl = router?.query?.reviewId
  const [urlPresigned, setUrlPresigned] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if(cvUrl) {
      setIsLoading(true)
      ServiceSystem.preSignedFile({list: [
        {
          durationTimeInSecond: 60 * 1000 * 5,
          filePath: cvUrl
        }
      ]}).then((res) => {
        setIsLoading(false)
        setUrlPresigned(res?.data?.urls?.[0])
      }).catch(() => {
        setIsLoading(false)
      })
    }
  }, [cvUrl])

  if(!urlPresigned || isLoading) {
    return 'Loading pdf file';
  }
  return <PDFViewer pdfUrl={String(urlPresigned)} />;;
}

export default Index