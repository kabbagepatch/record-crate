<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { currentUser, userLoaded } from '../firebaseApp';
import { resetPassword, signIn, signUp, verifyEmail } from '../services/users';
import { FirebaseError } from 'firebase/app';

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

const router = useRouter();

if (userLoaded.value && currentUser.value && currentUser.value.emailVerified) {
  router.replace('/');
} else if (userLoaded.value && currentUser.value && !currentUser.value.emailVerified) {
  router.replace('/verify-email');
}

const state = ref<'Log in' | 'Sign up' | 'Verify email' | 'Reset password'>(currentUser.value ? 'Verify email' : 'Log in');
const name = ref('');
const email = ref(currentUser.value?.email ||'');
const password = ref('');
const password2 = ref('');
const status = ref('');
const error = ref('');

const buttonText = computed(() => {
  if (state.value === 'Log in') return 'Log in';
  if (state.value === 'Sign up') return 'Sign up';
  if (state.value === 'Verify email') return 'Resend Verification';
  if (state.value === 'Reset password') return 'Send Reset Email';
  return '';
});

const toggleState = (destination: 'Log in' | 'Sign up' | 'Verify email' | 'Reset password') => {
  state.value = destination;
  error.value = '';
}

const submitForm = async (e: SubmitEvent) => {
  e.preventDefault();
  status.value = '';
  error.value = '';
  if (!email.value.match(EMAIL_REGEX)) {
    error.value = 'Please enter a valid email';
    return;
  }
  if (state.value === 'Sign up' && password.value !== password2.value) {
    error.value = 'Passwords do not match';
    return;
  }

  try {
    if (state.value === 'Log in') {
      await signIn(email.value, password.value);
      router.replace('/');
    } else if (state.value === 'Sign up') {
      await signUp(email.value, password.value, name.value);
      state.value = 'Verify email';
      await verifyEmail();
      status.value = 'Verification email sent. Please check your inbox. Refresh the page after verifying your email.';
    } else if (state.value === 'Verify email') {
      await verifyEmail();
      status.value = 'Verification email sent. Please check your inbox. Refresh the page after verifying your email.';
    } else if (state.value === 'Reset password') {
      await resetPassword(email.value);
      status.value = 'Password reset email sent. Please check your inbox.';
    }
  } catch (e) {
    if (e && e instanceof FirebaseError) {
      if (e.code === 'auth/email-already-in-use') {
        error.value = 'User already exists';
      } else if (e.code === 'auth/invalid-credential' || e.code === 'auth/user-not-found') {
        error.value = 'Email or password is incorrect';
      } else if (e.code === 'auth/weak-password') {
        error.value = 'Password should be at least 6 characters';
      } else if (e.code === 'auth/too-many-requests') {
        error.value = 'Too many requests. Please try again later.';
      } else {
        error.value = e.message;
      }
    } else {
      error.value = 'There was an error logging in';
    }
  }
}

const fieldUpdate = () => {
  error.value = '';
}

</script>

<template>
  <div class="container">
    <h2>{{ state }}</h2>
    <p v-if="state === 'Verify email'">Please verify your email address to continue.</p>
    <form @submit="submitForm">
      <input v-if="state === 'Sign up'" v-model="name" @focus="fieldUpdate" class="field" type="text" id="name" name="name" required placeholder="Name" />
      <input v-model="email" :disabled="state === 'Verify email'" @focus="fieldUpdate" class="field" type="text" id="email" name="email" required placeholder="Email" />
      <input v-if="state === 'Log in' || state === 'Sign up'" v-model="password" @focus="fieldUpdate" class="field" type="password" id="password" name="password" required placeholder="Password" />
      <input v-if="state === 'Sign up'" v-model="password2" @focus="fieldUpdate" class="field" type="password" id="password" name="password" required placeholder="Repeat Password" />
      <button class="submit" type="submit">{{ buttonText }}</button>
    </form>
    <p v-if="status" class="status">{{ status }}</p>
    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="state === 'Sign up'">Have an account already? <a href="#" @click="toggleState('Log in')">Log in</a></p>
    <p v-if="state === 'Log in'">Don't Have an Account? <a href="#" @click="toggleState('Sign up')">Sign Up</a></p>
    <p v-if="state === 'Log in'">Forgot your password? <a href="#" @click="toggleState('Reset password')">Reset it</a></p>
    <p v-if="state === 'Reset password'">Back to login? <a href="#" @click="toggleState('Log in')">Log in</a></p>
  </div>
</template>

<style scoped>
  a {
    color: var(--color-bg-deep);
    text-decoration: underline;
  }
  
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 40px;
  }

  h2 {
    text-transform: uppercase;
  }

  form {
    max-width: 500px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 15px;
    width: 80%;
  }

  .field {
    height: 50px;
    padding: 0 15px;
    font-size: 16px;
    border-radius: 8px;
    border: 1px solid var(--color-white);
    background-color: var(--color-bg-deeper);
  }

  button.submit {
    margin: 8px 0;
    font-size: 16px;
    text-transform: uppercase;
  }

  p {
    margin-top: 10px;
    margin-bottom: 0px;
    text-align: center;
    padding: 0 20px;
  }

  p.status {
    color: var(--color-bg-deep);
  }

  p.error {
    color: var(--color-error);
  }
</style>