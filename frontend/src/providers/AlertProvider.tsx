import { createContext, Dispatch, SetStateAction, useState } from "react";
import { Snackbar, Alert } from "@mui/material";

interface AlertProps {
  openAlert: boolean;
  setOpenAlert: Dispatch<SetStateAction<boolean>>;
  setAlertMessage: Dispatch<
    SetStateAction<{
      message: string;
      type: "success" | "error" | "warning";
    }>
  >;
  alertMessage: {
    message: string;
    type: "success" | "error" | "warning";
  };
}

export const AlertContext = createContext<AlertProps>({
  openAlert: false,
  setOpenAlert: () => false,
  setAlertMessage: () => ({ message: "", type: "warning" }),
  alertMessage: { message: "", type: "warning" },
});

export const AlertProvider = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<{
    message: string;
    type: "success" | "error" | "warning";
  }>({ message: "", type: "warning" });

  return (
    <>
      <AlertContext.Provider
        value={{ openAlert, setOpenAlert, alertMessage, setAlertMessage }}
      >
        <Snackbar
          open={openAlert}
          autoHideDuration={6000}
          onClose={() => setOpenAlert(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setOpenAlert(false)}
            severity={alertMessage.type}
            sx={{ width: "100%" }}
          >
            {alertMessage.message}
          </Alert>
        </Snackbar>
        {children}
      </AlertContext.Provider>
    </>
  );
};
