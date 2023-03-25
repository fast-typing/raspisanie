import React from "react"
import Button from '@mui/material/Button';
import LoginIcon from '@mui/icons-material/Login';

export default function Header() {

    return (
        <header>
            <img src="img/logo.png" alt="" className="logo"/>

            <Button variant="contained" endIcon={<LoginIcon />}>Войти</Button>
        </header>
    )
}
