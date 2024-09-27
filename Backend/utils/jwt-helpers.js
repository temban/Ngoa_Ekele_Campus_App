import jwt from 'jsonwebtoken';

// Generate an access token and a refresh token for this database user
function jwtTokens({ userid, name, email, phone, country, town, street, role, subscriptionstatus, level, departmentid, registrationdate, isactive }) {
  const user = {
    userid,
    name,
    email,
    phone,
    country,
    town,
    street,
    role,
    subscriptionstatus,
    level,
    departmentid,
    registrationdate,
    isactive
  }; 

  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2000s' });
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '5m' });
  
  return { accessToken, refreshToken };
}

export { jwtTokens };
