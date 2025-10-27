import jwt from 'jsonwebtoken'

function handleLogin(req, res) {

  //console.log(req)
  const { username, password } = req.body;

  console.log("Login attempt: ", username, password);

  // Enkel verifiering - kolla matchning
  if (username === 'mattias' && password === 'lager') {

    // signera en json web token
    const token = jwt.sign({user: username, email: 'mattiaslager1@gmail.com'}, 'secret-1234', {expiresIn: 30})

    // Skicka token till frontend

    res.json({message: 'Användaren är autentiserad', token: token})

  } else {
    res.json({message: 'Det gick dåligt!'})
  }



}

function verifyToken(token) {

}

export {
  handleLogin,
  verifyToken
}