import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faGithub, faGoogle, faTwitter } from '@fortawesome/free-brands-svg-icons'
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}



function App() {
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    name: '',
    email: '',
    photo: '',
    password: '',
    error: '',
    success: false,
    isLoggedIn: false


  })
  // sign in provider
  const googleProvider = new firebase.auth.GoogleAuthProvider();
  const facebookProvider = new firebase.auth.FacebookAuthProvider();
  const githubProvider = new firebase.auth.GithubAuthProvider();



  // sign up using email password start
  const handleOnBlur = e => {
    let isValid = true;
    if (e.target.name === 'email') {
      isValid = /\S+@\S+\.\S+/.test(e.target.value);
    }
    if (e.target.name === 'password') {
      isValid = /\d/.test(e.target.value) && e.target.value.length > 6;
    }
    if (isValid) {
      const userInfo = { ...user };
      userInfo[e.target.name] = e.target.value;
      setUser(userInfo);
    }

  }
  const handleSubmit = e => {
    if (newUser && user.name && user.password && user.email) {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then(res => {
          // console.log(res.user);
          const userInfo = { ...user }
          userInfo.success = true;
          userInfo.isLoggedIn = true;
          userInfo.photo = res.user.photoURL;
          userInfo.email = res.user.email;
          setUser(userInfo);
        })
        .catch(error => {
          // console.log(error.message);
          const userInfo = { ...user };
          userInfo.success = false;
          userInfo.isLoggedIn = false;
          userInfo.error = error.message;
          setUser(userInfo);
        });
    }
    if (!newUser) {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then((res) => {
          // console.log(res.user);
          const userInfo = { ...user }
          userInfo.success = true;
          userInfo.isLoggedIn = true;
          userInfo.email = res.user.email;
          setUser(userInfo);
        })
        .catch((error) => {
          // console.log(error.message);
          const userInfo = { ...user };
          userInfo.success = false;
          userInfo.isLoggedIn = false;
          userInfo.error = error.message;
          setUser(userInfo);
        });
    }
    e.preventDefault();
  }
  const handleSignOut = () => {
    firebase.auth().signOut().then((res) => {
      // Sign-out successful.
      const userInfo = { ...user }
      userInfo.isLoggedIn = false;
      userInfo.success = false;
      userInfo.error = '';
      userInfo.email = '';
      userInfo.password = '';
      setUser(userInfo);
      // console.log(res);
    }).catch((error) => {
      // An error happened.
      // console.log(error);
    });
  }
  // sign up using email password end


  // google sing in start
  const handleGoogleSignIn = () => {
    firebase.auth()
      .signInWithPopup(googleProvider)
      .then((result) => {
        const user = result.user;
        const userInfo = { ...user };
        userInfo.name = user.displayName;
        userInfo.email = user.email;
        userInfo.photo = user.photoURL;
        userInfo.success = true;
        userInfo.isLoggedIn = true;
        setUser(userInfo);
      }).catch((error) => {
        const userInfo = { ...user };
        userInfo.error = error.message;
        setUser(userInfo);
      });
  }

  // google sing in end


  // facebook sign in start
  const handleFacebookSignIn = () => {
    firebase
      .auth()
      .signInWithPopup(facebookProvider)
      .then((result) => {
        const user = result.user;
        const userInfo = { ...user };
        userInfo.name = user.displayName;
        userInfo.email = user.email;
        userInfo.photo = user.photoURL;
        userInfo.success = true;
        userInfo.isLoggedIn = true;
        setUser(userInfo);
      })
      .catch((error) => {
        const userInfo = { ...user };
        userInfo.error = error.message;
        setUser(userInfo);
      });
  }
  // facebook sign in end

  // github sign in start
  const handleGithubSignIn = () => {
    firebase
      .auth()
      .signInWithPopup(githubProvider)
      .then((result) => {
        const user = result.user;
        const userInfo = { ...user };
        userInfo.name = user.displayName;
        userInfo.email = user.email;
        userInfo.photo = user.photoURL;
        userInfo.success = true;
        userInfo.isLoggedIn = true;
        setUser(userInfo);
      }).catch((error) => {
        const userInfo = { ...user };
        userInfo.error = error.message;
        setUser(userInfo);
      });
  }
  // github sign in end

  return (
    <div className="App">
      <div className="row container-fluid">
        <div className="col-md-4 offset-md-4 pt-3">
          <div className="bg-white rounded p-3">
            {
              user.success && user.isLoggedIn &&
              <div>
                {user.success && <div style={{ color: 'green' }}>{newUser ? 'Account created' : 'Logged in'} successfully</div>}
                {user.name && <h4>Username: {user.name}</h4>}
                {user.email && <h5>User email: {user.email}</h5>}
                {user.photo && <img src={user.photo} alt="user-pic" style={{ margin: '.3rem 0rem', maxWidth: '100px' }} />}

                <button onClick={handleSignOut} className="btn btn-secondary w-100 form-btn fw-bold">SIGN OUT</button>
              </div>
            }
            {!user.isLoggedIn &&
              <div>
                <form action="" onSubmit={handleSubmit}>
                  <h1 className="text-center">{newUser ? 'Sign Up' : 'Log In'}</h1>
                  {user.success || <div style={{ color: 'red' }}>{user.error}</div>}
                  {
                    newUser &&
                    <div className="mb-3">
                      <label htmlFor="exampleFormControlInput1" className="form-label">Username</label>
                      <input type="text" onBlur={handleOnBlur} className="form-control" id="exampleFormControlInput1" placeholder="Your name" name="name" required />
                    </div>
                  }
                  <div className="mb-3">
                    <label htmlFor="exampleFormControlInput1" className="form-label">Email address</label>
                    <input type="email" onBlur={handleOnBlur} className="form-control" id="exampleFormControlInput1" placeholder="Your email address" name="email" required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="exampleFormControlInput1" className="form-label">Password</label>
                    <input type="password" onBlur={handleOnBlur} className="form-control" id="exampleFormControlInput1" placeholder="Your password" name="password" required />
                    <a href="/" className="text-decoration-none text-center d-block">forgot password?</a>
                  </div>
                  <input type="submit" value={newUser ? 'SUBMIT' : 'LOGIN'} className="btn btn-secondary w-100 form-btn" />
                </form>
                <div className="text-center pt-5">
                  <h5 className="text-muted pb-4">Or Sign Up Using</h5>
                  <div>
                    <FontAwesomeIcon onClick={handleFacebookSignIn} className="icon fb-icon" icon={faFacebook} />
                    <FontAwesomeIcon onClick={handleGoogleSignIn} className="icon google-icon" icon={faGoogle} />
                    <FontAwesomeIcon onClick={handleGithubSignIn} className="icon github-icon" icon={faGithub} />
                  </div>
                </div>
                <div className="text-center pt-5">
                  <h5 className="text-muted pb-4">{!newUser ? 'Are you new here? First SIGN UP' : 'Have an account already? Please, LOGIN'}</h5>
                  <span className="toggle-signUp-logIn fw-bold" href="/" onClick={() => setNewUser(!newUser)}>{!newUser ? 'SIGN UP' : 'LOGIN'}</span>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
