

export function register() {
    
    if (process.env.RESEND_API_KEY === '') console.warn('RESEND_API_KEY is not defiend, so no emails can be sendt for invite')
    
  }