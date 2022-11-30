import Toast from "react-bootstrap/Toast";
import { useState } from "react";
const ToastComponent = ({
  message,
  type = "danger",
  duration = 5000,
  pauseOnHover = true,
  animate = true,
  extraClasses,
}) => {
  const [show, setShow] = useState(true);
  return (
    <Toast
      bg={type}
      show={show}
      onClose={() => {
        setShow(false);
      }}
      delay={duration}
      autohide={true}
      animation={animate}
      className={extraClasses}
      pauseOnHover={pauseOnHover}
    >
      <Toast.Header>
        <strong className="mr-auto">GStat Tracker</strong>
      </Toast.Header>
      <Toast.Body>{message}</Toast.Body>
    </Toast>
  );
};
export default ToastComponent;
