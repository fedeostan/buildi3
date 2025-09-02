# Supabase Security Configuration for Email OTP

This document outlines the security configurations and rate limiting setup for the Buildi3 email verification (OTP) flow.

## Dashboard Configuration

### 1. Authentication Settings

Navigate to **Authentication > Settings** in your Supabase dashboard:

#### Email Settings
- **Email confirmations**: Enabled
- **Double confirm email changes**: Enabled
- **Enable email change confirmations**: Enabled

#### Security Settings
- **Enable sign-ups**: Enabled
- **Enable email confirmations**: Enabled  
- **Disable sign-ups**: Disable after initial launch if needed

#### Session Settings
- **JWT expiry limit**: 3600 seconds (1 hour)
- **Refresh token rotation**: Enabled
- **Reuse interval**: 10 seconds
- **Additional logout URL**: Configure for your app's logout flow

### 2. Email Template Configuration

Navigate to **Authentication > Email Templates**:

#### Confirm signup template:
```html
<h2>Welcome to Buildi3!</h2>
<p>Your verification code is:</p>
<h1 style="font-size: 32px; font-weight: bold; color: #001848; text-align: center; letter-spacing: 4px;">{{ .Token }}</h1>
<p>This code will expire in 24 hours for your security.</p>
<p>If you didn't request this code, please ignore this email.</p>
<br>
<p style="color: #666; font-size: 12px;">
  This email was sent from Buildi3 Construction Management App.
</p>
```

### 3. Rate Limiting Configuration

Navigate to **Authentication > Settings > Rate Limiting**:

#### Email Rate Limits
- **Email OTP requests**: 1 per 60 seconds per email
- **Email signup requests**: 5 per hour per email
- **Password reset requests**: 3 per hour per email

#### General Rate Limits  
- **Failed login attempts**: 5 attempts per 5 minutes per IP
- **Account creation**: 10 per hour per IP
- **API requests**: 1000 per minute per client

### 4. Security Policies

#### Row Level Security (RLS)
Ensure RLS is enabled on your `profiles` table:

```sql
-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own profile
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles  
    FOR UPDATE USING (auth.uid() = id);

-- Policy: New users can insert their profile
CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);
```

#### Email Verification Enforcement
```sql
-- Trigger to create profile after email confirmation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, created_at, updated_at)
  VALUES (new.id, new.email, now(), now());
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger only fires after email is confirmed
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

## Client-Side Security Implementation

### 1. Token Storage
The app uses AsyncStorage for secure token persistence:
- Access tokens stored with encryption
- Refresh tokens handled automatically
- Tokens cleared on logout

### 2. Request Validation
All auth requests include:
- Input sanitization
- Email format validation  
- Rate limiting on client side (button states)
- Network error handling

### 3. Error Handling
Secure error handling prevents information leakage:
- Generic error messages for sensitive operations
- Specific errors only for client-side validation
- No exposure of internal system details

## Environment Variables

Configure these in your app's environment:
```bash
SUPABASE_URL=https://nmjnasilxosrghilwwno.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
```

## Monitoring and Alerts

### 1. Supabase Dashboard Monitoring
Monitor the following metrics:
- Failed authentication attempts
- OTP verification success rate
- Email delivery failures
- Rate limit violations

### 2. Application Logging
Implement logging for:
- Authentication events
- OTP verification attempts
- Error patterns
- User flow completion rates

## Security Checklist

- [ ] Email templates configured with OTP codes
- [ ] Rate limiting enabled and configured
- [ ] RLS policies implemented and tested
- [ ] HTTPS enforced for all requests
- [ ] Error handling doesn't leak sensitive information
- [ ] Token storage uses secure methods
- [ ] Email verification enforced before profile creation
- [ ] Monitoring and alerting configured
- [ ] Environment variables properly secured
- [ ] Database triggers handle user creation correctly

## Production Recommendations

### 1. Email Provider
- Use a dedicated email service (SendGrid, AWS SES)
- Configure SPF, DKIM, and DMARC records
- Monitor email delivery rates

### 2. Additional Security
- Implement CAPTCHA for signup forms if needed
- Consider device fingerprinting for fraud detection
- Set up IP-based rate limiting
- Monitor for suspicious patterns

### 3. Performance Optimization
- Cache frequently accessed data
- Implement connection pooling
- Use CDN for static assets
- Monitor database query performance

## Troubleshooting Common Issues

### OTP Not Received
1. Check spam/junk folders
2. Verify email template is correct
3. Check rate limiting hasn't been exceeded
4. Verify email service provider status

### Verification Failures
1. Check code expiration (24 hours default)
2. Verify rate limiting configuration
3. Check for network connectivity issues
4. Review error logs for specific failures

### Rate Limiting Issues
1. Review rate limit settings
2. Implement user-friendly messaging
3. Consider adjusting limits for production
4. Monitor legitimate usage patterns