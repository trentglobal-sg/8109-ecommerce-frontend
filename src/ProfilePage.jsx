import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useLocation } from 'wouter';
import { useFlashMessage } from './FlashMessageStore';
import axios from 'axios';
import { useJWT } from './UserStore';
import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

const validationSchema = Yup.object({
    name: Yup.string().required("Name is required").min(2, "The name must be at least 2 characters"),
    email: Yup.string().email("Invalid email address").required("Email is required"),

})

const marketingPreferences = [
    {
        "id": 1,
        "name": "Email Updates"
    },
    {
        "id": 2,
        "name": "SMS promotions"
    },
    {
        "id": 3,
        "name": "WhatsApp"
    }
]

export default function ProfilePage() {

    const [, setLocation] = useLocation();
    const { showMessage } = useFlashMessage();

    // get the JWT of the current logged in user
    const { jwt } = useJWT();

    // store the initial values of the form as a react state
    const [initialValues, setInitialValues] = useState({
        "name": "",
        "email": "",
        "salutation": "Mr",
        "marketingPreferences": [],
        "country": ""
    })

    // create an effect to load the user's details when the component renders for the first time
    useEffect(() => {
        const fetchUser = async () => {
            const response = await axios.get(API_URL + "/users/me", {
                headers: {
                    Authorization: 'Bearer ' + jwt
                }
            })
            setInitialValues(response.data);
        }
        fetchUser();
    }, [jwt]); // <-- whenever the JWT changes, run the effect again

    const handleSubmit = async (values, formikHelpers) => {
        try {
            await axios.put(API_URL + "/users/me", values, {
                headers: {
                    Authorization: 'Bearer ' + jwt
                }
            });
            showMessage("User updated successfully");
        } catch (e) {
            console.error(e);
            showMessage("Unable to update user details");
        }
    }

    return <>
        <div className="container">
            <h1>Profile</h1>
            <Formik initialValues={initialValues} 
                    onSubmit={handleSubmit} 
                    validationSchema={validationSchema}
                    enableReinitialize
            >
                {
                    formik => (
                        <Form>
                            {/* Name */}
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Name:</label>
                                <Field type="text"
                                    id="name"
                                    className="form-control"
                                    name="name"
                                />
                                <ErrorMessage name="name" component="div" className="text-danger" />
                            </div>

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

                            {/* Salutation */}
                            <div className="mb-3">
                                <label className="form-label">Salutation</label>
                                <div>
                                    <div className="form-check form-check-inline">
                                        <Field
                                            className="form-check-input"
                                            type="radio"
                                            name="salutation"
                                            id="mr"
                                            value="mr"
                                        />
                                        <label className="form-label"
                                            htmlFor="mr"
                                        >Mr.</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <Field
                                            className="form-check-input"
                                            type="radio"
                                            name="salutation"
                                            id="mrs"
                                            value="mrs"
                                        />
                                        <label className="form-label"
                                            htmlFor="mrs"
                                        >Mrs.</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <Field
                                            className="form-check-input"
                                            type="radio"
                                            name="salutation"
                                            id="ms"
                                            value="ms"
                                        />
                                        <label className="form-label"
                                            htmlFor="ms"
                                        >Ms.</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <Field
                                            className="form-check-input"
                                            type="radio"
                                            name="salutation"
                                            id="dr"
                                            value="dr"
                                        />
                                        <label className="form-label"
                                            htmlFor="dr"
                                        >Dr.</label>
                                    </div>
                                </div>
                            </div>

                            {/* Marketing Preferences */}
                            <div className="mb-3">
                                <label className="form-label">Marketing Preferences:</label>
                                {
                                    marketingPreferences.map(function (p) {
                                        return (<div className="form-check" key={p.id}>
                                            <Field type="checkbox"
                                                name="marketingPreferences"
                                                value={String(p.id)}
                                                className="form-check-input"
                                                id={`marketing-${p.id}`}
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor={`marketing-${p.id}}`}
                                            >{p.name}</label>
                                        </div>)
                                    })
                                }

                            </div>

                            {/* Country */}
                            <div className="mb-3">
                                <label htmlFor="country" className="form-label">Country</label>
                                <Field as="select"
                                    className="form-select"
                                    id="country"
                                    name="country"
                                >
                                    <option value="">Select Country</option>
                                    <option value="sg">Singapore</option>
                                    <option value="my">Malaysia</option>
                                    <option value="in">Indonesia</option>
                                    <option value="th">Thailand</option>
                                </Field>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary mb-3"
                                disabled={formik.isSubmitting}
                            >Submit</button>
                        </Form>
                    )
                }
            </Formik>
        </div>
    </>
}