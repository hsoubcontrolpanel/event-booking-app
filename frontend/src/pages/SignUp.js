import React, { useContext, useState, useEffect } from 'react';
import { useMutation } from '@apollo/client'
import { CREATE_USER } from '../queries'
import Error from '../components/Error';
import AuthContext from '../context/auth-context';
export default function SignUpPage() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const value = useContext(AuthContext)
    const [alert, setAlert] = useState("")
    function SignUp(){
        const [signup, { loading, data }] = useMutation(CREATE_USER, {
            onError: (error) => setAlert(error.message),
            onCompleted: () => setAlert("تم انشاء الحساب بنجاج")
        })
        useEffect( () => {
            if(!loading && data){
                const token = data.createUser.token
                const userId = data.createUser.userId
                const username = data.createUser.username
                value.login(token, userId, username)
            }
        }, [data, loading])
        if (loading) return <p>Loading...</p>
       
        return (
            <form className='auth-form' onSubmit={() => {
                if (username.trim().length < 3 || password.trim().length < 6) {
                    setAlert("يجب ملئ جميع الحقول بالشكل الصحيح!")
                    return
                }
                signup({
                    variables: { username: username.trim(), email: email.trim(), password: password.trim() }
                })
            }}>
                <Error error={alert} />
                <div className="mb-3 mt-2">
                    <label className="form-label" htmlFor='usename'>اسم المستخدم  </label>
                    <input
                        className="form-control"
                        id="username"
                        type="text"
                        value={username}
                        onChange={({ target }) => setUsername(target.value)}
                        required
                    />
                </div>
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
                </div>
            </form>
        )
    }
    return (
        <SignUp />
    )
}
