'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthErrorListener() {
    const router = useRouter();

    useEffect(() => {
        // Check for fragments from Supabase OAuth or Magic/Reset Links
        if (typeof window !== 'undefined' && window.location.hash) {
            const hash = window.location.hash.substring(1);
            const params = new URLSearchParams(hash);
            
            if (params.get('error') === 'access_denied' && params.get('error_code') === 'otp_expired') {
                // Clear the hash so it doesn't loop
                window.history.replaceState(null, '', window.location.pathname);
                // Redirect to login or forgot-password with a clear, readable error
                router.push('/forgot-password?error=otp_expired');
            } else if (params.get('type') === 'recovery' && params.has('access_token')) {
                // If Supabase dropped the `/reset-password` path due to URL whitelist issues, we catch it here
                // We must navigate to /reset-password WITH the hash so Supabase library can read it
                router.push(`/reset-password#${hash}`);
            }
        }
    }, [router]);

    return null;
}
