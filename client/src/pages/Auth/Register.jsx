import { useState } from 'react'
import { useRegister } from "../../hooks/auth"

function Register() {
    const [form, setForm] = useState({
        email: "",
        password: "",
        role: "DRIVER",
        username: "user"
    })
    const { mutate } = useRegister();
    function handleRegister(e) {
        e.preventDefault()
        mutate(form)
    }
    return (
        <div>
            <form action="" method="post" onSubmit={handleRegister}>
                <input type="email" placeholder="Email" onChange={(e) => setForm((prev) => ({
                    ...prev,
                    email: e.target.value
                }))} />
                <input type="password" placeholder="Password" onChange={(e) => setForm((prev) => ({
                    ...prev,
                    password: e.target.value
                }))} />
                <select name="role" id="role" onChange={(e) => setForm((prev) => ({
                    ...prev,
                    role: e.target.value
                }))}>
                    <option value="DRIVER">DRIVER</option>
                    <option value="RIDER">RIDER</option>
                </select>
                <button type='submit'>Register</button>
            </form>
        </div>
    )
}

export default Register