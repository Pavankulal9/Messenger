import React, { useEffect, useState } from 'react'
import LoadingImg from '../Assets/loadingImg.jpeg'
const PreLoadImage = ({src}) => {
    const [ImageLoading,setImageLoading] = useState(true);

    useEffect(()=>{
      const image = new Image();
      image.onload = ()=>{
        setImageLoading(false);
      }
      image.src = src;
    },[src])
  return (
    <>
    {
        ImageLoading && 
        <img src={LoadingImg} alt='Loading_image'/>
    }
    {
        !ImageLoading && 
        <img src={src} alt='images_sent_by_user'/>
    }
    </>
  )
}

export default PreLoadImage
