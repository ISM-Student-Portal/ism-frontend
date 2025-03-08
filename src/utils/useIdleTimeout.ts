import { useContext, useState } from "react"
import { useIdleTimer } from "react-idle-timer"
import { setAuthentication } from "@app/store/reducers/auth";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
/**
 * @param onIdle - function to notify user when idle timeout is close
 * @param idleTime - number of seconds to wait before user is logged out
 */
const useIdleTimeout = ({ onIdle, idleTime = 1 }: {onIdle: any, idleTime: any}) => {
    const idleTimeout = 1000 * idleTime;
    const [isIdle, setIdle] = useState(false)
  const dispatch = useDispatch();
  const navigate = useNavigate();


    const handleIdle = () => {
        setIdle(true)
        logOut()
    }

    const logOut = async () => {
    
        dispatch(setAuthentication(undefined));
        navigate('/login');
    
        localStorage.removeItem('authentication');
        localStorage.removeItem('profile');
    
      };
    const idleTimer = useIdleTimer({
        timeout: idleTimeout,
        promptTimeout: idleTimeout / 2,
        onPrompt: onIdle,
        onIdle: handleIdle,
        debounce: 500
    })
    return {
        isIdle,
        setIdle,
        idleTimer
    }
}
export default useIdleTimeout;