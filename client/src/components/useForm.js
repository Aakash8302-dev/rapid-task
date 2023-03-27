import React, { useState } from 'react'

const useForm = (initialValues) => {

    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setValues({
            ...values,
            [name]: value
        })
    }

    return {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange
    }
}

const Form = (props) => {

    const { children, ...other } = props

    return (
        <form autoComplete="off" {...other}>
            {props.children}
        </form>
    )
}

export { useForm, Form }