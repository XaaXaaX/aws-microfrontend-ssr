import { useState } from 'react'

interface FormElements extends HTMLFormControlsCollection {
  emailInput: HTMLInputElement;
  passwordInput: HTMLInputElement;
}
interface LoginFormElement extends HTMLFormElement {
  readonly elements: FormElements
}

const SignInForm: React.FC<{ authInfo: { 
    Email: string, 
    Password: string, 
    onSubmitForm: ((email: string, password: string) => boolean)
} }> = ({ ...params }) => {

    const onSubmitForm = params.authInfo.onSubmitForm
    const [email, setEmail] = useState(params.authInfo.Email)
    const [password, setPassword] = useState(params.authInfo.Password)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const handleSubmit = (event: React.FormEvent<LoginFormElement>) => {
        event.preventDefault();
        console.log('sublmitted for email : ', event.currentTarget.elements.emailInput.value)
        const authenticated = onSubmitForm(
            event.currentTarget.elements.emailInput.value,
            event.currentTarget.elements.passwordInput.value);
        
        setIsAuthenticated(authenticated);
    }

    if (isAuthenticated) {
        return (
            <div>
                <h2>Logged In!</h2>
            </div>
        )
    }
    else return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            <div style={{"display": "grid"}} >
                <label htmlFor="emailInput">Email address :</label>
                <input onChange={e => { setEmail(e.target.value)}} type="email" id="emailInput" placeholder='Email adress' value={email}/>
                <label htmlFor="passwordInput">Password :</label>
                <input onChange={e => { setPassword(e.target.value)}} type="password" className="form-control" id="passwordInput" placeholder='Password' value={password}/>
            </div>
            <button 
                    type="submit" 
                    className="btn btn-primary"
                >Login</button>
        </form>
    )
}

export default SignInForm;
