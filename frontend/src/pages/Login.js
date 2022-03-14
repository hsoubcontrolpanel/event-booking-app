import { useMutation } from '@apollo/client';
import React, { useContext, useEffect, useState} from 'react';
import { LOGIN } from '../queries'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../context/auth-context';
export default function LoginPage() {
    const value = useContext(AuthContext)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    function Login(){
        const [login, { loading, error, data }] = useMutation(LOGIN, {
            onCompleted: () => console.log("تم تسجيل الدخول بنجاج")
        })
        useEffect( () => {
            if(!loading && data){
                const token = data.login.token
                const userId = data.login.userId
                const username = data.login.username
                value.login(token, userId, username)
            }
        }, [data, loading])
        if (loading) return <p>Loading...</p>
        if (error) return error.message
        if(data){
            console.log(data.login.token)
        }
        return (
            <form className='auth-form' onSubmit={(event) => {
                event.preventDefault()
                login({
                    variables: { email: email.trim(), password: password.trim() }
                })
            }}>
                <div className="mb-3 mt-2">
                    <label className="form-label" htmlFor='email'>البريد الالكتروني</label>
                    <input
                        className="form-control"
                        id="email"
                        type="email"
                        value={email}
                        onChange={({ target }) => setEmail(target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label" htmlFor='password'>كلمة المرور</label>
                    <input
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={({ target }) => setPassword(target.value)}
                        type="password"
                        required
                        minLength="6"
                    />
                </div>
                <div className='forma-action'>
                    <button className='btn m-2' type='submit'>إرسال</button>
                    <button className='btn' onClick={() => navigate('/signUp')}> انتقل الى انشاء الحساب </button>
                </div>
            </form>
        )
    }
    return (
        <Login />
    )
}
