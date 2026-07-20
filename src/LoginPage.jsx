import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useLocation } from 'wouter';
import { useFlashMessage } from './FlashMessageStore';
import axios from 'axios';
import { useJWT } from './UserStore';

const API_URL = import.meta.env.VITE_API_URL;

const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string().required("Password is required").min(6, "Must be at least 6 characters long")
})

export default function LoginPage() {

    const [, setLocation] = useLocation();
    const { showMessage } = useFlashMessage();
    const { setJWT } = useJWT();

    const initalValues = {
        "email": "",
        "password": ""
    }

    const handleSubmit = async (values, formikHelpers) => {
        try {
            formikHelpers.setSubmitting(true);
            const response = await axios.post(API_URL + "/users/login", values);
            const token = response.data.token;
            showMessage("Signed in successfully");
            setLocation("/");
            setJWT(token);
        } catch (e) {
            showMessage("Unable to login. Error: " + e);
            console.error(e);
        } finally {
            formikHelpers.setSubmitting(false);
        }
    

    }

    return <>
        <div className="container">
            <h1>Login</h1>
            <Formik
                initialValues={initalValues}
                onSubmit={handleSubmit}
                validationSchema={validationSchema}>
                {
                    formik => (<Form>
                        {/* Email */}
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email:</label>
                            <Field type="text"
                                id="email"
                                className="form-control"
                                name="email"
                            />
                            <ErrorMessage name="email" component="div" className="text-danger" />
                        </div>

                        {/* Password */}
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password:</label>
                            <Field type="password"
                                id="password"
                                className="form-control"
                                name="password"
                            />
                            <ErrorMessage name="password" component="div" className="text-danger" />
                        </div>
                        <div>
                            <button 
                                type="submit"
                                class="btn btn-primary mt-1 mb-1"
                                disabled={formik.isSubmitting}
                            >Login</button>
                        </div>
                    </Form>)
                }
            </Formik>
        </div>
    </>
}