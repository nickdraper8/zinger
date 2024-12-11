import {useEffect, useState} from "react";
import Image from "next/image.js";

const fallbackImage = '/ffl-shield-shield.svg';

const ImageWithFallback = ({
                               fallback = fallbackImage,
                               alt,
                               src,
                               ...props
                           }) => {
    const [error, setError] = useState(null)

    useEffect(() => {
        setError(null)
    }, [src])

    return (
        <Image
            alt={alt}
            onError={setError}
            src={error ? fallbackImage : src}
            {...props}
        />
    )
}

export default ImageWithFallback;