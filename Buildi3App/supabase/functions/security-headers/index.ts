/**
 * EPIC 4 SECURITY ENHANCEMENT - Security Headers Edge Function
 * 
 * Production-ready security headers and CORS configuration.
 * Implements comprehensive security policy for Buildi3 construction app.
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts"

// Security configuration constants
const SECURITY_CONFIG = {
  // Allowed origins for CORS
  ALLOWED_ORIGINS: [
    'http://localhost:3000',
    'https://api.buildi3.app',
    'https://app.buildi3.app',
    'https://buildi3.app',
    // Add your production domain here
  ],

  // Content Security Policy directives
  CSP_DIRECTIVES: {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", "data:", "https:", "blob:"],
    'connect-src': ["'self'", "https://*.supabase.co", "https://api.buildi3.app"],
    'font-src': ["'self'", "data:", "https:"],
    'object-src': ["'none'"],
    'media-src': ["'self'", "https:", "blob:"],
    'frame-src': ["'none'"],
    'worker-src': ["'self'", "blob:"],
    'child-src': ["'none'"],
    'frame-ancestors': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'manifest-src': ["'self'"],
  },

  // Security headers configuration
  SECURITY_HEADERS: {
    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',
    
    // Prevent clickjacking
    'X-Frame-Options': 'DENY',
    
    // XSS protection
    'X-XSS-Protection': '1; mode=block',
    
    // Referrer policy
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    
    // Feature policy / Permissions policy
    'Permissions-Policy': [
      'accelerometer=()',
      'ambient-light-sensor=()',
      'autoplay=()',
      'battery=()',
      'camera=()',
      'display-capture=()',
      'document-domain=()',
      'encrypted-media=()',
      'execution-while-not-rendered=()',
      'execution-while-out-of-viewport=()',
      'fullscreen=(self)',
      'geolocation=()',
      'gyroscope=()',
      'magnetometer=()',
      'microphone=()',
      'midi=()',
      'navigation-override=()',
      'payment=()',
      'picture-in-picture=()',
      'publickey-credentials-get=()',
      'screen-wake-lock=()',
      'sync-xhr=()',
      'usb=()',
      'web-share=()',
      'xr-spatial-tracking=()',
    ].join(', '),
    
    // HSTS (Strict-Transport-Security)
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    
    // Expect-CT (Certificate Transparency)
    'Expect-CT': 'enforce, max-age=30',
    
    // Cross-Origin policies
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-origin',
  },

  // Rate limiting configuration
  RATE_LIMITS: {
    REQUESTS_PER_MINUTE: 100,
    REQUESTS_PER_HOUR: 1000,
    BURST_SIZE: 20,
  },
}

/**
 * Generate Content Security Policy header value
 */
function generateCSPHeader(): string {
  const directives = Object.entries(SECURITY_CONFIG.CSP_DIRECTIVES)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ')
  
  return directives + '; report-uri /api/csp-report'
}

/**
 * Check if origin is allowed for CORS
 */
function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false
  
  // Check exact matches
  if (SECURITY_CONFIG.ALLOWED_ORIGINS.includes(origin)) {
    return true
  }
  
  // Allow localhost for development (any port)
  if (origin.startsWith('http://localhost:') || origin.startsWith('https://localhost:')) {
    return true
  }
  
  // Allow app:// protocol for mobile apps
  if (origin.startsWith('app://') || origin.startsWith('capacitor://')) {
    return true
  }
  
  return false
}

/**
 * Apply security headers to response
 */
function applySecurityHeaders(headers: Headers): void {
  // Apply CSP
  headers.set('Content-Security-Policy', generateCSPHeader())
  
  // Apply all security headers
  Object.entries(SECURITY_CONFIG.SECURITY_HEADERS).forEach(([header, value]) => {
    headers.set(header, value)
  })
  
  // Cache control for security
  headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  headers.set('Pragma', 'no-cache')
  headers.set('Expires', '0')
  headers.set('Surrogate-Control', 'no-store')
}

/**
 * Apply CORS headers
 */
function applyCORSHeaders(headers: Headers, origin: string | null): void {
  if (isOriginAllowed(origin)) {
    headers.set('Access-Control-Allow-Origin', origin || '*')
    headers.set('Access-Control-Allow-Credentials', 'true')
  }
  
  headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
  headers.set('Access-Control-Allow-Headers', [
    'Authorization',
    'Content-Type',
    'X-Requested-With',
    'X-CSRF-Token',
    'X-Client-Version',
    'X-Platform',
    'Accept',
    'Origin',
  ].join(', '))
  
  headers.set('Access-Control-Max-Age', '86400') // 24 hours
  headers.set('Access-Control-Expose-Headers', [
    'X-RateLimit-Remaining',
    'X-RateLimit-Reset',
    'X-Request-ID',
  ].join(', '))
}

/**
 * Rate limiting check (simple in-memory implementation)
 * In production, you'd use Redis or similar
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(clientId: string): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const windowMs = 60 * 1000 // 1 minute
  const limit = SECURITY_CONFIG.RATE_LIMITS.REQUESTS_PER_MINUTE
  
  const key = `${clientId}:${Math.floor(now / windowMs)}`
  const current = rateLimitStore.get(key) || { count: 0, resetTime: now + windowMs }
  
  if (now > current.resetTime) {
    // Reset window
    current.count = 0
    current.resetTime = now + windowMs
  }
  
  current.count++
  rateLimitStore.set(key, current)
  
  // Clean old entries
  for (const [k, v] of rateLimitStore.entries()) {
    if (now > v.resetTime + windowMs) {
      rateLimitStore.delete(k)
    }
  }
  
  return {
    allowed: current.count <= limit,
    remaining: Math.max(0, limit - current.count),
    resetTime: current.resetTime,
  }
}

/**
 * Get client identifier for rate limiting
 */
function getClientId(request: Request): string {
  // Try to get client IP from headers
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const clientIp = forwarded?.split(',')[0].trim() || realIp || 'unknown'
  
  // Include user agent for more specific identification
  const userAgent = request.headers.get('user-agent') || 'unknown'
  const userAgentHash = btoa(userAgent).slice(0, 8)
  
  return `${clientIp}:${userAgentHash}`
}

/**
 * Log security event
 */
async function logSecurityEvent(
  event: string,
  details: Record<string, any>,
  request: Request,
  severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
): Promise<void> {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    severity,
    details,
    request: {
      method: request.method,
      url: request.url,
      headers: Object.fromEntries(request.headers.entries()),
      userAgent: request.headers.get('user-agent'),
      origin: request.headers.get('origin'),
      referer: request.headers.get('referer'),
    },
  }
  
  console.warn(`Security Event [${severity.toUpperCase()}]:`, JSON.stringify(logEntry, null, 2))
  
  // In production, you'd send this to a security monitoring service
  if (severity === 'critical') {
    console.error('CRITICAL SECURITY EVENT:', logEntry)
    // Send alert to security team
  }
}

/**
 * Main Edge Function handler
 */
Deno.serve(async (request: Request) => {
  const url = new URL(request.url)
  const origin = request.headers.get('origin')
  const method = request.method
  const clientId = getClientId(request)
  
  // Create response headers
  const responseHeaders = new Headers()
  
  // Apply security headers
  applySecurityHeaders(responseHeaders)
  
  // Apply CORS headers
  applyCORSHeaders(responseHeaders, origin)
  
  // Add request ID for tracing
  const requestId = crypto.randomUUID()
  responseHeaders.set('X-Request-ID', requestId)
  
  try {
    // Rate limiting check
    const rateLimit = checkRateLimit(clientId)
    responseHeaders.set('X-RateLimit-Remaining', rateLimit.remaining.toString())
    responseHeaders.set('X-RateLimit-Reset', rateLimit.resetTime.toString())
    
    if (!rateLimit.allowed) {
      await logSecurityEvent(
        'rate_limit_exceeded',
        { clientId, limit: SECURITY_CONFIG.RATE_LIMITS.REQUESTS_PER_MINUTE },
        request,
        'medium'
      )
      
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded',
          message: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000),
        }),
        {
          status: 429,
          headers: {
            ...Object.fromEntries(responseHeaders.entries()),
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString(),
          },
        }
      )
    }
    
    // Handle preflight OPTIONS requests
    if (method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: responseHeaders,
      })
    }
    
    // Security checks
    if (!isOriginAllowed(origin) && origin !== null) {
      await logSecurityEvent(
        'invalid_origin',
        { origin, clientId },
        request,
        'high'
      )
      
      return new Response(
        JSON.stringify({
          error: 'Origin not allowed',
          message: 'Request origin is not authorized.',
        }),
        {
          status: 403,
          headers: {
            ...Object.fromEntries(responseHeaders.entries()),
            'Content-Type': 'application/json',
          },
        }
      )
    }
    
    // Check for suspicious patterns in URL
    const suspiciousPatterns = [
      /\.\.\//,
      /<script/i,
      /javascript:/i,
      /on\w+=/i,
      /union\s+select/i,
      /drop\s+table/i,
    ]
    
    if (suspiciousPatterns.some(pattern => pattern.test(url.pathname + url.search))) {
      await logSecurityEvent(
        'suspicious_request',
        { path: url.pathname, search: url.search, clientId },
        request,
        'high'
      )
      
      return new Response(
        JSON.stringify({
          error: 'Invalid request',
          message: 'Request contains invalid patterns.',
        }),
        {
          status: 400,
          headers: {
            ...Object.fromEntries(responseHeaders.entries()),
            'Content-Type': 'application/json',
          },
        }
      )
    }
    
    // Handle different endpoints
    const path = url.pathname
    
    if (path === '/security-check') {
      // Security status endpoint
      return new Response(
        JSON.stringify({
          status: 'secure',
          timestamp: new Date().toISOString(),
          requestId,
          security: {
            cors: isOriginAllowed(origin),
            rateLimit: {
              remaining: rateLimit.remaining,
              resetTime: new Date(rateLimit.resetTime).toISOString(),
            },
            headers: 'applied',
          },
        }),
        {
          status: 200,
          headers: {
            ...Object.fromEntries(responseHeaders.entries()),
            'Content-Type': 'application/json',
          },
        }
      )
    }
    
    if (path === '/csp-report' && method === 'POST') {
      // CSP violation reporting endpoint
      try {
        const report = await request.json()
        await logSecurityEvent(
          'csp_violation',
          { report, clientId },
          request,
          'medium'
        )
        
        return new Response(null, { status: 204, headers: responseHeaders })
      } catch (error) {
        console.error('CSP report parsing error:', error)
        return new Response(null, { status: 400, headers: responseHeaders })
      }
    }
    
    // Default response for unknown paths
    return new Response(
      JSON.stringify({
        message: 'Security headers applied',
        timestamp: new Date().toISOString(),
        requestId,
      }),
      {
        status: 200,
        headers: {
          ...Object.fromEntries(responseHeaders.entries()),
          'Content-Type': 'application/json',
        },
      }
    )
    
  } catch (error) {
    console.error('Security headers function error:', error)
    
    await logSecurityEvent(
      'function_error',
      { error: error.message, clientId },
      request,
      'high'
    )
    
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: 'An unexpected error occurred.',
        requestId,
      }),
      {
        status: 500,
        headers: {
          ...Object.fromEntries(responseHeaders.entries()),
          'Content-Type': 'application/json',
        },
      }
    )
  }
})