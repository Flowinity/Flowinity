function getWellKnownOidc() {
  return {
    issuer: `${global.config.hostnameWithProtocol}`,
    authorization_endpoint: `http://localhost:3000/oauth`,
    token_endpoint: `${config.hostnameWithProtocol}/api/v3/oidc/token`,
    userinfo_endpoint: `${config.hostnameWithProtocol}/api/v3/oidc/userinfo`,
    jwks_uri: `${config.hostnameWithProtocol}/api/v3/oidc/jwks.json`,
    scopes_supported: ["openid", "profile", "email", "offline_access"],
    response_types_supported: ["code", "id_token", "token id_token"],
    token_endpoint_auth_methods_supported: ["client_secret_basic"]
  }
}

export default getWellKnownOidc
