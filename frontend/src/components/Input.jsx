
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

export default function Input({ dado, setDado }) {
    return (
        <Box className="input-container">
            <TextField
                fullWidth
                variant="outlined"
                value={dado}
                onChange={(event) => setDado(event.target.value)}
                sx={{
                    "& .MuiOutlinedInput-root": {
                        color: "#ffffff",
                        backgroundColor: "#292929",
                        borderRadius: "8px",

                        "& fieldset": {
                            borderColor: "#555555",
                        },

                        "&:hover fieldset": {
                            borderColor: "#aaaaaa",
                        },

                        "&.Mui-focused fieldset": {
                            borderColor: "#e53935",
                        },
                    },

                    "& .MuiInputBase-input": {
                        color: "#ffffff",
                    },

                    "& .MuiInputLabel-root": {
                        color: "#bbbbbb",
                    },

                    "& .MuiInputLabel-root.Mui-focused": {
                        color: "#e53935",
                    },
                }}
            />
        </Box>
    );
}
