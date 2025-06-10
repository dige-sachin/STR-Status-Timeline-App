import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';

function Loader() {
  return (
    <div style={containerStyle}>
      <div style={rippleWrapperStyle}>
        <span className="ripple" />
        <ViewQuiltIcon
          sx={{
            color: "#3b82f6",
            fontSize: "40px",
            animation: "spinAndScale 1.5s ease-in-out infinite",
            position: "relative",
            zIndex: 1,
          }}
        />
      </div>

      <style>
        {`
          @keyframes spinAndScale {
            0% {
              transform: rotate(0deg) scale(1);
            }
            50% {
              transform: rotate(180deg) scale(1.2);
            }
            100% {
              transform: rotate(360deg) scale(1);
            }
          }

          @keyframes ripple {
            0% {
              transform: scale(1);
              opacity: 0.4;
            }
            100% {
              transform: scale(2.5);
              opacity: 0;
            }
          }

          .ripple {
            position: absolute;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background-color: rgba(59, 130, 246, 0.3); /* blue-500 w/ alpha */
            animation: ripple 1.5s ease-out infinite;
            z-index: 0;
          }
        `}
      </style>
    </div>
  );
}

// Styles
const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  height: "100%",
};

const rippleWrapperStyle = {
  position: "relative",
  width: "80px",
  height: "80px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

export default Loader;
