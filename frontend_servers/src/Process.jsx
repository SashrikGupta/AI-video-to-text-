import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Check from "@mui/icons-material/Check";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import HttpIcon from "@mui/icons-material/Http";
import TransformIcon from "@mui/icons-material/Transform";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import MicIcon from "@mui/icons-material/Mic";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import DoneIcon from "@mui/icons-material/Done";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#784af4",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#784af4",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

const QontoStepIconRoot = styled("div")(({ theme }) => ({
  color: theme.palette.mode === "dark" ? theme.palette.grey[700] : "aqua",
  display: "flex",
  backgroundColor: "violet",
  width: "2rem",
  justifyContent: "center",
  borderRadius: "1rem",
  height: 22,
  alignItems: "center",
}));

function QontoStepIcon({ active, completed, className }) {
  return (
    <QontoStepIconRoot className={className}>
      {completed ? (
        <Check style={{ fontSize: 18 }} />
      ) : (
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: "currentColor",
          }}
        />
      )}
    </QontoStepIconRoot>
  );
}

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled("div")(({ theme, active }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
  color: "#fff",
  background: active
    ? "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)"
    : "#ccc",
  width: 50,
  zIndex: 10,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
}));

function ColorlibStepIcon({ active, completed, className, icon }) {
  const icons = {
    1: <CloudUploadIcon />,
    2: <HttpIcon />,
    3: <TransformIcon />,
    4: <AudiotrackIcon />,
    5: <MicIcon />,
    6: <TextFieldsIcon />,
    7: <DoneIcon />,
  };

  return (
    <ColorlibStepIconRoot className={className} active={active}>
      {icons[icon]}
    </ColorlibStepIconRoot>
  );
}

const steps = [
  "Video requested to JS server",
  "Communicating with servers",
  "Video to audio conversion",
  "Audio received at server",
  "Transcripting audio",
  "Decoding transcript",
  "Summary done!",
];

export default function CSR(props) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    setActiveStep(props.temprature);
  }, [props.temprature]);

  return (
    <Stack sx={{ width: "96vw" }} spacing={4}>
      <Stepper
        alternativeLabel
        activeStep={activeStep}
        connector={<ColorlibConnector />}
      >
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel
              StepIconComponent={(props) => (
                <ColorlibStepIcon
                  {...props}
                  icon={index + 1}
                  active={index <= activeStep}
                />
              )}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Stack>
  );
}
