import { useSelector } from 'react-redux';
import { Alert } from 'react-bootstrap';

const Error = () => {
  const errorMessage = useSelector((state) => state.error);

  if (!errorMessage || errorMessage === '') return;

  return <Alert variant="danger">{errorMessage}</Alert>;
};

export default Error;
