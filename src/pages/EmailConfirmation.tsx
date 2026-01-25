import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authApi, AuthUser } from "@/services/AuthService";
import { toast } from 'sonner';


const EmailConfirmation = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'

    useEffect(() => {
        const verifyEmail = async () => {
            const token = searchParams.get('token');
             const userId = searchParams.get('userId');

            if (!token || !userId) {
                setStatus('error');
                return;
            }

            try {
                // Adjust this URL to your Spring Boot endpoint
                const resp = await authApi.ConfirmEmail(userId, token); 
                if(resp.error || !resp.data) {
                    console.error("Verification failed", resp.error.message);
                    setStatus('error');
                    return;
                }            
                setStatus('success'); 
                 toast.success('Email verified successfully!');            
                // Redirect to login after 3 seconds
                setTimeout(() => {
                    navigate('/auth');
                }, 9000);
            } catch (error) {
                console.error("Verification failed", error);
                setStatus('error');
            }
        };

        verifyEmail();
    }, [searchParams, navigate]);

    return (
        <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'Arial' }}>
            {status === 'verifying' && <h2>Verifying your email...</h2>}
            
            {status === 'success' && (
                <div style={{ color: 'green' }}>
                    <h2>Email Verified Successfully!</h2>
                    <p>Redirecting you to the login page...</p>
                </div>
            )}

            {status === 'error' && (
                <div style={{ color: 'red' }}>
                    <h2>Verification Failed</h2>
                    <p>The link may be expired or invalid.</p>
                    <button onClick={() => navigate('/register')}>Back to Sign Up</button>
                </div>
            )}
        </div>
    );
};

export default EmailConfirmation;