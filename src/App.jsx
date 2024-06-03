import { useState, useEffect } from 'react'
import './App.css'
import Valid from 'card-validator'
import Head from './Head'
import Form from './Form'
import FormThankYou from './FormThankYou'
function App() {
  const [formData, setFormData] = useState({
    cardNumber: '',
    month: '',
    year:'',
    cvc: '',
    amount: 0,
    name: ''
  })

  const [formErrors, setFormErrors] = useState({
    cardNumber: '',
    month: '',
    year:'',
    cvc: '',
    amount: '',
    name: ''
})
  const [formattedCardNumber, setFormattedCardNumber] = useState('')
  const [formSubmitted, setFormSubmitted] = useState(false)
// code I'm proud of *** thank you stack overflow!! ***
  useEffect(() => {
    setFormattedCardNumber(prevFormat => {
         prevFormat = formData.cardNumber.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim()
        return prevFormat
    })
  },[formData.cardNumber])

  function containsOnlyNumbers(str) {
    const removedSpaces = str.replace(/\s/g, '')
    return /^\d+$/.test(removedSpaces);
}
  const validate = (values) => {
    const errors = {};
    const regexCardNumber = containsOnlyNumbers(values.cardNumber)
    const regexMonth = containsOnlyNumbers(values.month)
    const regexYear = containsOnlyNumbers(values.year)
    const regexCvc = containsOnlyNumbers(values.cvc)
    const IsNumberLargeThanZero = values.amount > 0
    const currentYear = new Date().getFullYear();
    const lastTwoDigitsOfYear = currentYear.toString().slice(-2);
    if (!values.name) {
      errors.name = "Name can't be blank";
    }
    if (!values.cardNumber) {
      errors.cardNumber = "Card number can't be blank";
    } else if (!regexCardNumber) {
      errors.cardNumber = "Wrong format, numbers only";
    } else if (values.cardNumber.length !== 19){
      errors.cardNumber = "Card number length must be 16"
    }

    if (!values.month) {
      errors.month = "Can't be blank";
    } else if(!regexMonth) {
      errors.month = "Wrong format, numbers only"
    } else if(values.month > 12) {
      errors.month = "Must be less then 12"
    }
    if (!values.year) {
      errors.password = "Can't be blank";
    } else if(!regexYear) {
      errors.year = "Wrong format, numbers only"
    } else if (values.year < lastTwoDigitsOfYear) {
      errors.year = "year can't be less then current year"
    }
    if (!values.cvc) {
      errors.cvc = "Can't be blank"
    } else if(!regexCvc) {
      errors.cvc = "Wrong format, numbers only"
    }

    if (!IsNumberLargeThanZero) {
      errors.amount = "Không được thanh toán với 0"
    }

    if (Valid.number(values.cardNumber).isValid === false && Valid.number(values.cardNumber).isPotentiallyValid === false){
        errors.cardNumber = "Card number is invalid"
    }
    return errors;
  };
  
  const noErrors = Object.keys(formErrors).length === 0

  const handleInput = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = (name === 'amount' && (value === undefined || value === null || value === '')) ? 0 : value;

    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: sanitizedValue
    }));

    setFormErrors({
      cardNumber: '',
      month: '',
      year:'',
      cvc: '',
      amount: '',
      name: ''
    });
  }


  const handleSubmit = (e) => {
    e.preventDefault()
    setFormErrors(validate(formData))
    setFormSubmitted(true)
  }
  return (
    <div className="App h-full w-full flex flex-col items-center lg:flex-row ">
      <Head 
      formattedCardNumber={formattedCardNumber}
      formData={formData}
      />
      { !noErrors || !formSubmitted ?
      <Form
        formSubmitted={formSubmitted}
        handleSubmit={handleSubmit}
        formattedCardNumber={formattedCardNumber}
        formData={formData}
        handleInput={handleInput}
        formErrors={formErrors}
      />
     :
     
      <FormThankYou />
     
     }
    </div>
)
}

export default App
