import React, { useState } from 'react';
import Text from '../components/Text';
import Inputbox from '../components/InputBox';
import Button from '../components/Button';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-150 rounded-lg bg-white p-8 shadow-md">
        <Text text={'Forgot Password ?'} />

        <form>
          <Inputbox
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            // handleSubmit={handleSubmit}
            buttonText={'Send Code'}
            //  loading={isLoading} // Pass the API loading state here
            // disabled={isLoading}
          />
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
