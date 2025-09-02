# Email Verification (OTP) Testing Guide

This document provides a comprehensive testing strategy for the email verification flow in the Buildi3 app.

## Testing Checklist

### 1. Pre-Testing Setup

#### Supabase Configuration
- [ ] Confirm email template is configured with `{{ .Token }}` variable
- [ ] Verify rate limiting settings are appropriate for testing
- [ ] Ensure authentication settings allow signup confirmations
- [ ] Test email delivery in Supabase dashboard

#### App Configuration  
- [ ] Supabase URL and keys are correctly configured
- [ ] AsyncStorage is working for token persistence
- [ ] Network connectivity is available
- [ ] Debug logging is enabled

### 2. Signup Flow Testing

#### Valid Email Signup
- [ ] Enter valid email address
- [ ] Verify button shows "Sending..." state
- [ ] Confirm navigation to verify-email screen
- [ ] Check email delivery (check spam folder too)
- [ ] Verify email contains 6-digit OTP code

#### Invalid Email Testing
- [ ] Test empty email field → Should show validation error
- [ ] Test invalid email formats → Should show validation error
- [ ] Test email with special characters → Should handle gracefully
- [ ] Test extremely long email → Should handle gracefully

#### Error Scenarios
- [ ] Test with no internet connection → Should show network error
- [ ] Test with existing email → Should show appropriate error
- [ ] Test rapid signup attempts → Should respect rate limiting

### 3. OTP Verification Testing

#### Valid OTP Flow
- [ ] Enter correct 6-digit OTP code
- [ ] Verify button shows "Verifying..." state  
- [ ] Confirm successful verification and navigation
- [ ] Check that user session is properly created
- [ ] Verify user data is stored in database

#### Invalid OTP Testing
- [ ] Test empty OTP field → Should disable continue button
- [ ] Test incomplete OTP (< 6 digits) → Should disable continue button
- [ ] Test invalid OTP codes → Should show error message
- [ ] Test expired OTP codes → Should show expiry error
- [ ] Test non-numeric characters → Should be filtered out

#### Resend OTP Testing
- [ ] Test resend functionality → Should send new code
- [ ] Verify cooldown timer works (60 seconds)
- [ ] Test resend during cooldown → Button should be disabled
- [ ] Test multiple resend attempts → Should respect rate limits
- [ ] Verify new code invalidates old code

### 4. UX and UI Testing

#### Loading States
- [ ] Signup button shows loading state during request
- [ ] Verification button shows loading state during verification
- [ ] Resend button shows loading state during resend
- [ ] All buttons are disabled during loading states

#### Error Display
- [ ] Error messages appear below relevant input fields
- [ ] Error messages are user-friendly and actionable
- [ ] Errors clear when user starts typing corrections
- [ ] Network errors show retry options

#### Navigation and Back Behavior
- [ ] Back button works from verify-email screen
- [ ] Navigation preserves email parameter correctly
- [ ] Deep links work if implemented
- [ ] App handles background/foreground transitions

### 5. Edge Cases and Error Handling

#### Network Issues
- [ ] Test with poor network connectivity
- [ ] Test with intermittent connection drops
- [ ] Test with complete network loss
- [ ] Verify proper error messaging for network issues

#### Rate Limiting
- [ ] Test rapid signup attempts → Should be throttled
- [ ] Test rapid OTP verification attempts → Should be throttled  
- [ ] Test rapid resend requests → Should show cooldown
- [ ] Verify rate limit error messages are user-friendly

#### Session Management
- [ ] Test app backgrounding during flow
- [ ] Test app termination and restart
- [ ] Verify token persistence across restarts
- [ ] Test session expiration scenarios

### 6. Security Testing

#### Input Validation
- [ ] Test SQL injection attempts in email field
- [ ] Test XSS attempts in input fields
- [ ] Verify input sanitization is working
- [ ] Test boundary value inputs

#### Token Security
- [ ] Verify OTP codes are not logged
- [ ] Confirm tokens are stored securely
- [ ] Test that old tokens are invalidated
- [ ] Verify session tokens are properly managed

## Test Data and Scenarios

### Valid Test Emails
```
test@example.com
user.name+tag@domain.co.uk  
firstname.lastname@company.org
```

### Invalid Test Emails
```
invalid-email
@domain.com
user@
user@domain
user..double.dot@domain.com
```

### Test OTP Codes
Use the codes from actual emails for positive testing.

For negative testing:
```
123456 (if different from actual)
000000
999999
abcdef (should be filtered out)
```

## Automated Testing Scripts

### Jest Test Example
```typescript
// __tests__/auth.test.ts
import { AuthService, validateEmail, validateOTPCode } from '../lib/auth'

describe('Email Validation', () => {
  test('validates correct email format', () => {
    expect(validateEmail('test@example.com')).toBe(true)
  })
  
  test('rejects invalid email format', () => {
    expect(validateEmail('invalid-email')).toBe(false)
  })
})

describe('OTP Validation', () => {
  test('validates 6-digit code', () => {
    expect(validateOTPCode('123456')).toBe(true)
  })
  
  test('rejects invalid code format', () => {
    expect(validateOTPCode('12345')).toBe(false)
  })
})
```

### End-to-End Test Example
```typescript
// e2e/signup-flow.test.ts
describe('Signup and Email Verification Flow', () => {
  test('complete signup flow', async () => {
    // Navigate to signup
    await device.launchApp()
    await element(by.id('signup-button')).tap()
    
    // Enter email
    await element(by.id('email-input')).typeText('test@example.com')
    await element(by.id('continue-button')).tap()
    
    // Verify navigation
    await expect(element(by.id('verify-email-screen'))).toBeVisible()
    
    // Enter OTP (would need to retrieve from test email)
    await element(by.id('otp-input')).typeText('123456')
    await element(by.id('continue-button')).tap()
    
    // Verify success
    await expect(element(by.id('create-password-screen'))).toBeVisible()
  })
})
```

## Performance Testing

### Load Testing
- Test with multiple concurrent signups
- Monitor email delivery times
- Check database performance under load
- Verify rate limiting effectiveness

### Memory Testing
- Monitor memory usage during flows
- Check for memory leaks in auth context
- Verify proper cleanup of event listeners

## Production Testing

### Smoke Tests
- [ ] Test signup with real email addresses
- [ ] Verify production email delivery
- [ ] Test rate limiting in production environment
- [ ] Confirm monitoring and alerting work

### User Acceptance Testing
- [ ] Test with different email providers (Gmail, Outlook, etc.)
- [ ] Test on different devices and screen sizes
- [ ] Verify accessibility features work
- [ ] Test with real users for usability feedback

## Troubleshooting Common Test Issues

### OTP Not Received During Testing
1. Check Supabase email logs in dashboard
2. Verify email template configuration
3. Check rate limiting hasn't been exceeded
4. Test with different email providers

### Network Error Simulation
```typescript
// Mock network errors for testing
jest.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      signUp: jest.fn().mockRejectedValue(new Error('Network error')),
      verifyOtp: jest.fn().mockRejectedValue(new Error('Network error')),
    }
  }
}))
```

### Rate Limit Testing
```typescript
// Test rate limiting behavior
test('handles rate limiting gracefully', async () => {
  // Trigger multiple rapid requests
  const promises = Array(10).fill(null).map(() => 
    AuthService.signUpWithEmail('test@example.com')
  )
  
  const results = await Promise.all(promises)
  
  // Expect some to fail with rate limit error
  expect(results.some(r => r.error?.type === 'RATE_LIMIT')).toBe(true)
})
```

## Deployment Testing

### Staging Environment
- [ ] Test complete flow in staging
- [ ] Verify environment variables are correct
- [ ] Test with staging database
- [ ] Confirm email delivery from staging

### Production Deployment
- [ ] Run smoke tests after deployment
- [ ] Monitor error rates and success rates
- [ ] Verify monitoring dashboards show data
- [ ] Test rollback procedures if needed

## Success Metrics

Track these metrics to ensure the flow is working correctly:

### Technical Metrics
- Email delivery rate > 98%
- OTP verification success rate > 95%
- Average verification time < 2 minutes
- Error rate < 2%

### User Experience Metrics  
- Signup completion rate > 85%
- User satisfaction scores
- Support ticket volume related to verification
- Time to complete signup flow