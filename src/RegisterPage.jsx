import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useLocation } from 'wouter';
import { useFlashMessage } from './FlashMessageStore';

const validationSchema = Yup.object({
    name: Yup.string().required("Name is required").min(2, "The name must be at least 2 characters"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string().required("Password is required").min(6, "Must be at least 6 characters long"),
    confirmPassword: Yup.string().oneOf([
        Yup.ref("password"),
        null
    ], "The passowrd must match").required("Please confirm your password")
})

export default function RegisterPage() {

    const [, setLocation] = useLocation();
    const { showMessage} = useFlashMessage();

    // API endpoint that returns all the possible marketing preferences
    // Important: Make sure the ID numbers match the database
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

    // the initialValues array is to provide the default values for the form
    const initalValues = {
        "name": "",
        "email": "",
        "password": "",
        "confirmPassword": "",
        "salutation": "Mr",
        "marketingPreferences": [],
        "country": ""
    }

    // handle submit is called when the user submits the form
    // it takes two arguments
    // arugment 1 - the values of the form fields
    // arugment 2 - helper object that let us manipulate the form
    const handleSubmit = (values, formikHelpers) => {
        // indicate that the form is in process of being submitted
        formikHelpers.setSubmitting(true);
        console.log(values)
        // have to process the register form by sending to the backend
        // axios.post(....)
        setTimeout(function () {
            console.log("The form has finished processing");
            formikHelpers.setSubmitting(false);
            // TODO: have an if statement to see if the form has been submitted properly
            
            // show the flash message
            showMessage("You have signed up successfully", "success")
            setLocation("/");
        }, 3000)

    }

    return <>
        <div className="container">
            <h1>Register</h1>
            <Formik initialValues={initalValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
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

                            {/* Confirm Password */}
                            <div className="mb-3">
                                <label htmlFor="confirmPassword" className="form-label">Confirm Password:</label>
                                <Field type="password"
                                    id="password"
                                    className="form-control"
                                    name="confirmPassword"
                                />
                                <ErrorMessage name="confirmPassword" component="div" className="text-danger" />
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
                                            value="Mr"
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
                                            value="Mrs"
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
                                            value="Ms"
                                        />
                                        <label className="form-label"
                                            htmlFor="ms"
                                        >Ms.</label>
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