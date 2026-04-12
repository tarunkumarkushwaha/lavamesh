import { useEffect,useState } from 'react'
// ref is element and position is output 
const useElementIsVisible = (ref) => {
    const [position, setposition] = useState(false)
   
    let elementHeight = ref.current ? ref.current.clientHeight : 500 ;  // need fixing
    // console.log(elementHeight)  

    const trackPosition = function () {
        let currentposition = ref.current.getBoundingClientRect().top
        setposition(currentposition < window.innerHeight / 1.15 && currentposition + window.innerHeight > elementHeight)
    }

    useEffect(() => {
        trackPosition();
        window.removeEventListener('scroll', trackPosition);
        window.addEventListener('scroll', trackPosition, { passive: true });
        return () => window.removeEventListener('scroll', trackPosition);
    }, []);

    return position
}

export default useElementIsVisible