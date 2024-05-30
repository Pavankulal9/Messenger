import React, { useEffect, useState } from 'react'
import Loading from '../Pages/Loading';
const PreLoadImage = ({src}) => {
    const [ImageLoading,setImageLoading] = useState(true);

    useEffect(()=>{
      const image = new Image();
        image.onload = ()=>{
          setImageLoading(false);
        }
        image.src = src;
        return ()=>{setImageLoading(true)}
    },[src]);

  return (
    <>
    {
        ImageLoading && 
        <Loading/>
    }
    {
        !ImageLoading && 
        <img src={src} alt='images_sent_by_user'/>
    }
    </>
  )
}

export default PreLoadImage
