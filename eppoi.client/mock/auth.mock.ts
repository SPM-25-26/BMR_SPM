// To fetch from a server with self-signed certificate
//process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import { defineMock, RequestOptions } from 'vite-plugin-mock-dev-server';

const useMock = import.meta.env.VITE_USE_MOCK_API === 'true';

// Storage in-memory (viene perso al riavvio del server)
const mockStorage = new Map<string, any>();

export default defineMock({
  url: '/api/Authentication/GoogleLogin',
  method: 'POST',
  status: 200,
  enabled: useMock,  
  body: (request: RequestOptions) => {
    console.error('Mocked GoogleLogin API called'); console.log(request.body);
    
    let userPreferences = null;
    const userPreferencesString = mockStorage.get('mockUserPreferences');
    if (userPreferencesString) {
      userPreferences = JSON.parse(userPreferencesString);
    }

    const data = {
      success: true,
      userPreferences: userPreferences,
      result: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJOYW1lIjoiUlVUIEJBU1RPTkkiLCJVc2VyTmFtZSI6InJ1dC5iYXN0b25pIiwiZXhwIjoxNzY3MTM5ODk3LCJpc3MiOiJodHRwczovL2VwcG9pLnVuaWNhbS5pdCJ9.LOoQQ7tdKbGqPQQ0lC4ELJ__sjnilZ5_27AEBzECyao'
    };
    
    return data;
  },
});