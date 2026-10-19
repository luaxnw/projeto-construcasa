import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function Input({ dado, setDado }) {
    return (
        <div>
            <Box
                component="form"
                sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
                noValidate
                autoComplete="off"
            >
                <TextField id="outlined-basic"
                    label="Outlined" variant="outlined"
                    value={dado}
                    onChange={(event) => { setDado(event.target.value) }}></TextField>
            </Box>
        </div>
    );
}