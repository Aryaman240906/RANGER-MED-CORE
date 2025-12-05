import { Toaster } from "react-hot-toast";

const ToastPortal = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: "#0F172A",
          color: "#22D3EE",
          border: "1px solid #22D3EE",
        },
      }}
    />
  );
};

export default ToastPortal;
