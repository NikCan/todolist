import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {useFormik} from "formik";
import {useAppDispatch, useAppSelector} from "hooks";
import {loginTC} from "./auth-reducer";
import {Navigate} from "react-router-dom";
import {selectIsLoggedIn} from "./selectors";


type FormikErrorType = {
  email?: string
  password?: string
}

export const Login = () => {
  const dispatch = useAppDispatch()
  const isLoggedIn = useAppSelector(selectIsLoggedIn)
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false
    } as const,
    validate: (values) => {
      const errors: FormikErrorType = {}
      if (!values.email) {
        errors.email = 'Required'
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address'
      }

      if (values.password.length < 3) {
        errors.password = 'Invalid length'
      }
      return errors
    },
    onSubmit: async (values, formikHelpers) => {
      // formik.resetForm()
      const res = await dispatch(loginTC(values))
      if (loginTC.rejected.match(res)) {
        if (res.payload?.fieldsErrors?.length) {
          const error = res.payload?.fieldsErrors[0]
          formikHelpers.setFieldError(error?.field, error?.error)
        }
      }
    },
  })

  return isLoggedIn ? <Navigate to={'/'}/> : <Grid container justifyContent={'center'}>
    <Grid item justifyContent={'center'}>
      <FormControl>
        <FormLabel>
          <p>To log in get registered
            <a href={'https://social-network.samuraijs.com/'}
               target={'_blank'}> here
            </a>
          </p>
          <p>or use common test account credentials:</p>
          <p>Email: free@samuraijs.com</p>
          <p>Password: free</p>
        </FormLabel>
        <form onSubmit={formik.handleSubmit}>
          <FormGroup>
            <TextField label="Email" margin="normal"    {...formik.getFieldProps('email')}/>
            {formik.touched.email && formik.errors.email &&
                <div style={{color: 'red'}}>{formik.errors.email}</div>}

            <TextField type="password" label="Password" margin="normal"
                       {...formik.getFieldProps('password')}/>
            {formik.touched.password && formik.errors.password &&
                <div style={{color: 'red'}}>{formik.errors.password}</div>}

            <FormControlLabel label={'Remember me'} control={<Checkbox/>} checked={formik.values.rememberMe}
                              {...formik.getFieldProps('rememberMe')}/>

            <Button type={'submit'} variant={'contained'} color={'primary'}> Login </Button>
          </FormGroup>
        </form>
      </FormControl>
    </Grid>
  </Grid>
}