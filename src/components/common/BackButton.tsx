import { Button } from "react-bootstrap"
import { useNavigate } from "react-router-dom"

const BackButton = () => {
    const navigate = useNavigate();

    return (<Button variant={'warning'} onClick={() => navigate(-1)}>Go Back</Button>)
}
export default BackButton;